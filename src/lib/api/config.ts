/**
 * Base URL for the Express API. Set `API_URL` (server-side) or
 * `NEXT_PUBLIC_API_URL` (shared) in `.env`; defaults to localhost:5000.
 */
export const API_URL = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000"
).replace(/\/$/, "");
