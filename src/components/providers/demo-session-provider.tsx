"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  demoUser,
  initialsFromName,
  type DemoUser,
} from "@/lib/demo/user";

const PROFILE_KEY = "booknook.demo-profile";
const SESSION_KEY = "booknook.demo-signed-in";

export type DemoProfile = DemoUser;

type SignInDetails = {
  name?: string;
  email?: string;
};

type DemoSessionValue = {
  user: DemoProfile | null;
  profile: DemoProfile;
  isSignedIn: boolean;
  signIn: (details?: SignInDetails) => void;
  signOut: () => void;
  updateProfile: (
    patch: Partial<
      Pick<
        DemoProfile,
        "name" | "email" | "bio" | "location" | "favoriteCategory"
      >
    >,
  ) => void;
};

const DemoSessionContext = createContext<DemoSessionValue | null>(null);

const defaultProfile: DemoProfile = { ...demoUser };

// The demo session is a tiny external store backed by localStorage so the
// navbar and profile screen stay in sync without effects that cascade renders.
const listeners = new Set<() => void>();
let fallbackProfileJson = "";
let fallbackSession = "true";

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }

  return () => {
    listeners.delete(listener);

    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}

function emit() {
  listeners.forEach((listener) => listener());
}

function getProfileSnapshot() {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    return window.localStorage.getItem(PROFILE_KEY) ?? fallbackProfileJson;
  } catch {
    return fallbackProfileJson;
  }
}

function getSessionSnapshot() {
  if (typeof window === "undefined") {
    return "true";
  }

  try {
    return window.localStorage.getItem(SESSION_KEY) ?? fallbackSession;
  } catch {
    return fallbackSession;
  }
}

function getServerProfileSnapshot() {
  return "";
}

function getServerSessionSnapshot() {
  return "true";
}

function parseProfile(raw: string): DemoProfile {
  if (!raw) {
    return defaultProfile;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<DemoProfile>;

    if (typeof parsed !== "object" || parsed === null) {
      return defaultProfile;
    }

    const name =
      typeof parsed.name === "string" && parsed.name.trim()
        ? parsed.name
        : defaultProfile.name;
    const email =
      typeof parsed.email === "string" && parsed.email.trim()
        ? parsed.email
        : defaultProfile.email;

    return {
      ...defaultProfile,
      name,
      email,
      initials: initialsFromName(name),
      bio: typeof parsed.bio === "string" ? parsed.bio : defaultProfile.bio,
      location:
        typeof parsed.location === "string"
          ? parsed.location
          : defaultProfile.location,
      favoriteCategory:
        typeof parsed.favoriteCategory === "string" &&
        parsed.favoriteCategory.trim()
          ? parsed.favoriteCategory
          : defaultProfile.favoriteCategory,
    };
  } catch {
    return defaultProfile;
  }
}

function writeProfile(profile: DemoProfile) {
  const raw = JSON.stringify(profile);
  fallbackProfileJson = raw;

  try {
    window.localStorage.setItem(PROFILE_KEY, raw);
  } catch {
    // Ignore storage write failures; the in-memory fallback still updates.
  }

  emit();
}

function writeSession(signedIn: boolean) {
  const value = String(signedIn);
  fallbackSession = value;

  try {
    window.localStorage.setItem(SESSION_KEY, value);
  } catch {
    // Ignore storage write failures; the in-memory fallback still updates.
  }

  emit();
}

export function DemoSessionProvider({ children }: { children: ReactNode }) {
  const rawProfile = useSyncExternalStore(
    subscribe,
    getProfileSnapshot,
    getServerProfileSnapshot,
  );
  const session = useSyncExternalStore(
    subscribe,
    getSessionSnapshot,
    getServerSessionSnapshot,
  );

  const profile = useMemo(() => parseProfile(rawProfile), [rawProfile]);
  const isSignedIn = session !== "false";

  const signIn = useCallback(
    (details?: SignInDetails) => {
      const current = parseProfile(getProfileSnapshot());
      const name = details?.name?.trim() || current.name || demoUser.name;
      const email = details?.email?.trim() || current.email || demoUser.email;

      writeProfile({
        ...current,
        name,
        email,
        initials: initialsFromName(name),
      });
      writeSession(true);
    },
    [],
  );

  const signOut = useCallback(() => {
    writeSession(false);
  }, []);

  const updateProfile = useCallback(
    (
      patch: Partial<
        Pick<
          DemoProfile,
          "name" | "email" | "bio" | "location" | "favoriteCategory"
        >
      >,
    ) => {
      const current = parseProfile(getProfileSnapshot());
      const next = { ...current, ...patch };

      writeProfile({
        ...next,
        initials: initialsFromName(next.name),
      });
    },
    [],
  );

  const value = useMemo<DemoSessionValue>(
    () => ({
      user: isSignedIn ? profile : null,
      profile,
      isSignedIn,
      signIn,
      signOut,
      updateProfile,
    }),
    [isSignedIn, profile, signIn, signOut, updateProfile],
  );

  return (
    <DemoSessionContext.Provider value={value}>
      {children}
    </DemoSessionContext.Provider>
  );
}

export function useDemoSession() {
  const context = useContext(DemoSessionContext);

  if (!context) {
    throw new Error("useDemoSession must be used inside DemoSessionProvider.");
  }

  return context;
}
