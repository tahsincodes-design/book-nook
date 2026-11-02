"use server";

import { updateTag } from "next/cache";

import { API_URL } from "@/lib/api/config";
import { getCurrentUser } from "@/lib/auth";
import {
  bookCategories,
  MAX_DESCRIPTION_LENGTH,
} from "@/lib/constants/books";

export type CreateBookInput = {
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
};

export type CreateBookResult =
  | { ok: true; id: string | null }
  | { ok: false; message: string };

type CreateBookResponse = {
  message?: string;
  id?: string | number;
};

export async function createBook(
  input: CreateBookInput,
): Promise<CreateBookResult> {
  // Never trust the browser for ownership details.
  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, message: "Please sign in to add a book." };
  }

  const title = input.title?.trim() ?? "";
  const author = input.author?.trim() ?? "";
  const category = input.category?.trim() ?? "";
  const image = input.image?.trim() ?? "";
  const description = input.description?.trim() ?? "";

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

  try {
    const response = await fetch(`${API_URL}/add-books`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        author,
        category,
        image,
        description,
        totalCopies: 1,
        addedBy: { name: user.name, email: user.email },
        createdAt: new Date().toISOString(),
      }),
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as
      | CreateBookResponse
      | null;

    if (!response.ok) {
      return {
        ok: false,
        message:
          payload?.message ??
          `The books API responded with status ${response.status}.`,
      };
    }

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
