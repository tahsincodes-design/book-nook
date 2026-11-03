"use server";

import { updateTag } from "next/cache";

import { API_URL } from "@/lib/api/config";
import { normalizeBook } from "@/lib/api/books";
import { getApiAccessToken, getCurrentUser } from "@/lib/auth";
import {
  bookCategories,
  MAX_COPIES,
  MAX_DESCRIPTION_LENGTH,
} from "@/lib/constants/books";
import { isBookOwner } from "@/lib/owned-books";

export type CreateBookInput = {
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
};

export type UpdateBookInput = CreateBookInput & {
  id: string;
};

export type CreateBookResult =
  | { ok: true; id: string | null }
  | { ok: false; message: string };

export type MutationResult =
  | { ok: true }
  | { ok: false; message: string };

type BookFields = {
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
};

type ValidationResult =
  | { ok: true; fields: BookFields }
  | { ok: false; message: string };

type ApiResponse = {
  message?: string;
  id?: string | number;
};

function validateBookInput(input: CreateBookInput): ValidationResult {
  const title = input.title?.trim() ?? "";
  const author = input.author?.trim() ?? "";
  const category = input.category?.trim() ?? "";
  const image = input.image?.trim() ?? "";
  const description = input.description?.trim() ?? "";
  const totalCopies = Number(input.totalCopies);

  if (title.length < 2) {
    return { ok: false, message: "Add a book title with at least 2 characters." };
  }

  if (author.length < 2) {
    return { ok: false, message: "Add the author's name." };
  }

  if (!(bookCategories as readonly string[]).includes(category)) {
    return { ok: false, message: "Choose one of the listed categories." };
  }

  if (!/^https?:\/\/\S+$/i.test(image)) {
    return {
      ok: false,
      message: "Upload a cover image or paste a valid image URL.",
    };
  }

  if (description.length < 10) {
    return {
      ok: false,
      message: "Add a short description with at least 10 characters.",
    };
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return {
      ok: false,
      message: `Keep the description under ${MAX_DESCRIPTION_LENGTH} characters.`,
    };
  }

  if (
    !Number.isInteger(totalCopies) ||
    totalCopies < 0 ||
    totalCopies > MAX_COPIES
  ) {
    return {
      ok: false,
      message: `Choose a whole number of copies between 0 and ${MAX_COPIES}.`,
    };
  }

  return {
    ok: true,
    fields: { title, author, category, image, description, totalCopies },
  };
}

async function readApiMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  const payload = (await response.json().catch(() => null)) as
    | ApiResponse
    | null;

  return payload?.message ?? fallback;
}

/**
 * Reads the stored book and confirms the current reader added it. The UI hides
 * the controls, but the check has to happen here too so a crafted request
 * cannot update or delete someone else's book.
 */
async function ensureBookOwnership(id: string): Promise<MutationResult | null> {
  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, message: "Please sign in to manage this book." };
  }

  try {
    const token = await getApiAccessToken();
    const response = await fetch(
      `${API_URL}/books/${encodeURIComponent(id)}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return {
        ok: false,
        message: "This book could not be found in the library.",
      };
    }

    const book = normalizeBook(await response.json().catch(() => null));

    if (!book) {
      return {
        ok: false,
        message: "This book could not be found in the library.",
      };
    }

    if (!isBookOwner(book, user)) {
      return {
        ok: false,
        message: "Only the reader who added this book can edit or delete it.",
      };
    }

    return null;
  } catch {
    return {
      ok: false,
      message: `Could not reach the books API at ${API_URL}. Make sure the server is running.`,
    };
  }
}

export async function createBook(
  input: CreateBookInput,
): Promise<CreateBookResult> {
  // Never trust the browser for ownership details.
  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, message: "Please sign in to add a book." };
  }

  const validation = validateBookInput(input);

  if (!validation.ok) {
    return validation;
  }

  try {
    const token = await getApiAccessToken();
    const response = await fetch(`${API_URL}/add-books`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...validation.fields,
        createdAt: new Date().toISOString(),
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        ok: false,
        message: await readApiMessage(
          response,
          `The books API responded with status ${response.status}.`,
        ),
      };
    }

    const payload = (await response.json().catch(() => null)) as
      | ApiResponse
      | null;

    // Refresh the cached catalogue so the new book appears immediately.
    updateTag("books");

    return {
      ok: true,
      id: payload?.id !== undefined ? String(payload.id) : null,
    };
  } catch {
    return {
      ok: false,
      message: `Could not reach the books API at ${API_URL}. Make sure the server is running.`,
    };
  }
}

export async function updateBook(
  input: UpdateBookInput,
): Promise<MutationResult> {
  const id = input.id?.trim() ?? "";

  if (!id) {
    return { ok: false, message: "This book is missing its identifier." };
  }

  const validation = validateBookInput(input);

  if (!validation.ok) {
    return validation;
  }

  const ownershipError = await ensureBookOwnership(id);

  if (ownershipError) {
    return ownershipError;
  }

  try {
    const token = await getApiAccessToken();
    const response = await fetch(
      `${API_URL}/books/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(validation.fields),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return {
        ok: false,
        message: await readApiMessage(
          response,
          `The books API responded with status ${response.status}.`,
        ),
      };
    }

    updateTag("books");

    return { ok: true };
  } catch {
    return {
      ok: false,
      message: `Could not reach the books API at ${API_URL}. Make sure the server is running.`,
    };
  }
}

export async function deleteBook(id: string): Promise<MutationResult> {
  const bookId = id?.trim() ?? "";

  if (!bookId) {
    return { ok: false, message: "This book is missing its identifier." };
  }

  const ownershipError = await ensureBookOwnership(bookId);

  if (ownershipError) {
    return ownershipError;
  }

  try {
    const token = await getApiAccessToken();
    const response = await fetch(
      `${API_URL}/books/${encodeURIComponent(bookId)}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return {
        ok: false,
        message: await readApiMessage(
          response,
          `The books API responded with status ${response.status}.`,
        ),
      };
    }

    updateTag("books");

    return { ok: true };
  } catch {
    return {
      ok: false,
      message: `Could not reach the books API at ${API_URL}. Make sure the server is running.`,
    };
  }
}
