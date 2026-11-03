import "server-only";

/**
 * Base URL for the Express API. Set `API_URL` in the frontend `.env`;
 * Next.js loads it before evaluating the app and config.
 */
export const API_URL = (
  process.env.API_URL ??
  "http://localhost:5000"
).replace(/\/$/, "");
