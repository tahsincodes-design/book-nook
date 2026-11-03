import "server-only";

/**
 * Base URL for the Express API. Local development defaults to localhost;
 * production builds require the deployed API URL in `API_URL`.
 */
const configuredApiUrl = process.env.API_URL?.trim();

if (process.env.NODE_ENV === "production" && !configuredApiUrl) {
  throw new Error("API_URL must be set to the deployed Express API URL.");
}

export const API_URL = (configuredApiUrl ?? "http://localhost:5000").replace(
  /\/$/,
  "",
);
