/**
 * Keeps post-login redirects on this site. Anything that is not a single-slash
 * path (including protocol-relative `//evil.example`) falls back to home.
 */
export function safeRedirectPath(
  value: string | null | undefined,
  fallback = "/",
) {
  if (!value) {
    return fallback;
  }

  const trimmed = value.trim();

  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }

  return trimmed;
}
