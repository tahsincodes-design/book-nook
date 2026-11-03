"use client";

import { useDemoSession } from "@/components/providers/demo-session-provider";

export function WelcomeMessage() {
  const { isSignedIn, profile } = useDemoSession();

  return (
    <p className="hidden text-xs text-muted-foreground sm:block">
      {isSignedIn
        ? `Welcome back, ${profile.name.split(/\s+/)[0]}.`
        : "Welcome to BookNook."}
    </p>
  );
}
