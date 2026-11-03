import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth-server";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  initials: string;
  location: string;
  favoriteCategory: string;
  bio: string;
  joinedAt: string;
};

type BetterAuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt?: Date | string;
  location?: string | null;
  favoriteCategory?: string | null;
  bio?: string | null;
};

export function initialsFromName(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "BN"
  );
}

function toIsoDate(value: Date | string | undefined) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string") {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date.toISOString();
    }
  }

  return new Date().toISOString();
}

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession();
  const user = session?.user as BetterAuthUser | undefined;

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image ?? null,
    initials: initialsFromName(user.name),
    location: user.location ?? "",
    favoriteCategory: user.favoriteCategory ?? "Fiction",
    bio: user.bio ?? "",
    joinedAt: toIsoDate(user.createdAt),
  };
}

/**
 * Server-side guard for private routes. Sends the reader to Login and asks
 * BetterAuth to bring them back to `path` after a successful sign-in.
 */
export async function requireUser(path: string): Promise<SessionUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(path)}`);
  }

  return user;
}
