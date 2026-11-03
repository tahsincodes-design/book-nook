import { cacheLife } from "next/cache";

/**
 * Shared "now" for due-date calculations. The value is cached briefly so the
 * borrow page can stay cacheable while still refreshing day counts.
 */
export async function getNow(): Promise<number> {
  "use cache";
  cacheLife("minutes");

  return Date.now();
}
