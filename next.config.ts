import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

loadEnvConfig(process.cwd());

const configuredApiUrl = process.env.API_URL?.trim();

if (process.env.NODE_ENV === "production" && !configuredApiUrl) {
  throw new Error(
    "API_URL must be set to the deployed Express API URL for production builds.",
  );
}

const apiUrl = configuredApiUrl ?? "http://localhost:5000";

let parsedApiUrl: URL;

try {
  parsedApiUrl = new URL(apiUrl);
} catch {
  throw new Error("API_URL must be a valid absolute URL.");
}

if (
  process.env.NODE_ENV === "production" &&
  ["localhost", "127.0.0.1", "::1"].includes(parsedApiUrl.hostname)
) {
  throw new Error(
    "API_URL cannot point to localhost in production. Set it to the deployed Express API URL.",
  );
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      }
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
