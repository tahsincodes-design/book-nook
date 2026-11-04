import { getCurrentUser } from "@/lib/auth";

/**
 * Rendered on the server so the home page does not fire an extra
 * `/api/auth/get-session` request just to greet the reader. The session read
 * is deduped with the navbar through React `cache`.
 */
export async function WelcomeMessage() {
  const user = await getCurrentUser();
  const firstName = user?.name.split(/\s+/).filter(Boolean)[0];

  return (
    <p className="hidden text-xs text-muted-foreground sm:block">
      {firstName ? `Welcome back, ${firstName}.` : "Welcome to BookNook."}
    </p>
  );
}
