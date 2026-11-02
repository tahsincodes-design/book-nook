import { cacheLife, cacheTag } from "next/cache";

import { API_URL } from "@/lib/api/config";
import type { Book, BookCategory } from "@/lib/types/book";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeCategory(value: unknown): BookCategory {
  const allowed: BookCategory[] = [
    "Fiction",
    "Science",
    "History",
    "Kids",
    "Personal Growth",
    "Others",
  ];

  return allowed.includes(value as BookCategory)
    ? (value as BookCategory)
    : "Others";
}

function normalizeBook(value: unknown): Book | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = value._id ?? value.id;
  const title = value.title;
  const author = value.author;

  if (
    (typeof id !== "string" && typeof id !== "number") ||
    typeof title !== "string" ||
    typeof author !== "string"
  ) {
    return null;
  }

  const owner = isRecord(value.addedBy) ? value.addedBy : {};
  const copies = Number(value.totalCopies);

  return {
    _id: String(id),
    title,
    author,
    category: normalizeCategory(value.category),
    image: typeof value.image === "string" ? value.image : "",
    description:
      typeof value.description === "string" ? value.description : "",
    totalCopies: Number.isFinite(copies) ? copies : 0,
    addedBy: {
      name:
        typeof owner.name === "string" ? owner.name : "BookNook reader",
      email: typeof owner.email === "string" ? owner.email : "",
    },
    createdAt:
      typeof value.createdAt === "string"
        ? value.createdAt
        : new Date(0).toISOString(),
  };
}

function extractBooks(payload: unknown): Book[] {
  const candidates = Array.isArray(payload)
    ? [payload]
    : isRecord(payload)
      ? [payload.books, payload.data, payload.results]
      : [];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate
        .map(normalizeBook)
        .filter((book): book is Book => book !== null);
    }
  }

  return [];
}

/**
 * Server-side book source. Always reads from the Express backend at
 * `NEXT_PUBLIC_API_URL` (defaults to http://localhost:5000).
 *
 * If the backend is unreachable or the route is not implemented yet, the
 * shelves render empty instead of taking the whole page down.
 */
export async function getBooks(): Promise<Book[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("books");

  try {
    const response = await fetch(`${API_URL}/books`, {
      headers: { Accept: "application/json" },
      next: { tags: ["books"] },
    });

    if (!response.ok) {
      console.warn(
        `[booknook] GET ${API_URL}/books responded with ${response.status}. Rendering an empty shelf.`,
      );
      return [];
    }

    return extractBooks(await response.json());
  } catch (error) {
    console.warn(
      `[booknook] Could not reach ${API_URL}/books. Rendering an empty shelf.`,
      error,
    );
    return [];
  }
}

export function sortByNewest(books: Book[]): Book[] {
  return [...books].sort((a, b) => {
    const aTime = Date.parse(a.createdAt) || 0;
    const bTime = Date.parse(b.createdAt) || 0;
    return bTime - aTime;
  });
}

export function getLatestBooks(books: Book[], limit = 6): Book[] {
  return sortByNewest(books).slice(0, limit);
}

export function findBook(books: Book[], id: string): Book | null {
  return books.find((book) => book._id === id) ?? null;
}