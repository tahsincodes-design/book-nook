import { demoUser } from "@/lib/demo/user";

export type SessionUser = {
  name: string;
  email: string;
  initials: string;
};

/**
 * Temporary auth bridge. BetterAuth is not wired up yet, so the demo reader is
 * returned for the private routes. Swap this for the real session lookup when
 * auth lands; every caller already handles a `null` user.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  return demoUser;
}
