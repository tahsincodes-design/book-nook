"use client";

import { authClient } from "@/lib/auth-client"; // Make sure this points to your actual BetterAuth client file

export function WelcomeMessage() {
  const { data: session } = authClient.useSession();
  const userName = session?.user?.name;

  return (
    <p className="hidden text-xs text-muted-foreground sm:block">
      {userName
        ? `Welcome back, ${userName.split(/\s+/)[0]}.`
        : "Welcome to BookNook."}
    </p>
  );
}