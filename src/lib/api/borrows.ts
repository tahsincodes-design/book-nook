import { cache } from "react";

import { API_URL } from "@/lib/api/config";
import { getApiAccessToken } from "@/lib/auth";

export type Borrow = {
  _id: string;
  bookId: string;
  email: string;
  name: string;
  borrowedAt: string;
  dueAt: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toIsoDate(value: unknown, fallback: string): string {
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date.toISOString();
    }
  }

  return fallback;
}

function readBookId(value: Record<string, unknown>): string {
  const nestedBook = isRecord(value.book)
    ? (value.book._id ?? value.book.id)
    : undefined;
  const candidate = value.bookId ?? nestedBook;

  if (typeof candidate === "string" || typeof candidate === "number") {
    return String(candidate);
  }

  if (isRecord(candidate)) {
    const nested = candidate._id ?? candidate.id;

    if (typeof nested === "string" || typeof nested === "number") {
      return String(nested);
    }
  }

  return "";
}

function normalizeBorrow(value: unknown): Borrow | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = value._id ?? value.id;
  const bookId = readBookId(value);

  if (
    (typeof id !== "string" && typeof id !== "number") ||
    !bookId
  ) {
    return null;
  }

  const fallbackDate = new Date(0).toISOString();

  return {
    _id: String(id),
    bookId,
    email: typeof value.email === "string" ? value.email : "",
    name: typeof value.name === "string" ? value.name : "BookNook reader",
    borrowedAt: toIsoDate(value.borrowedAt, fallbackDate),
    dueAt: toIsoDate(value.dueAt, fallbackDate),
  };
}

/**
 * Reads the active loans for one reader from the authenticated API.
 *
 * Wrapped in `cache` so the layout's nav badge and a page that also needs the
 * loans share one API call (and one JWT mint) per request.
 */
export const getMyBorrows = cache(async (email: string): Promise<Borrow[]> => {
  const normalizedEmail = email?.trim().toLowerCase() ?? "";

  if (!normalizedEmail) {
    return [];
  }

  try {
    const token = await getApiAccessToken();
    const response = await fetch(
      `${API_URL}/my-borrows/${encodeURIComponent(normalizedEmail)}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.warn(
        `[booknook] GET ${API_URL}/my-borrows responded with ${response.status}. Rendering an empty borrow shelf.`,
      );
      return [];
    }

    const payload = await response.json().catch(() => null);

    if (!Array.isArray(payload)) {
      return [];
    }

    return payload
      .map(normalizeBorrow)
      .filter((borrow): borrow is Borrow => borrow !== null);
  } catch (error) {
    console.warn(
      `[booknook] Could not reach ${API_URL}/my-borrows. Rendering an empty borrow shelf.`,
      error,
    );
    return [];
  }
});
