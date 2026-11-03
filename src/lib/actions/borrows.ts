"use server";

import { revalidatePath, updateTag } from "next/cache";

import { API_URL } from "@/lib/api/config";
import { getMyBorrows } from "@/lib/api/borrows";
import { getApiAccessToken, getCurrentUser } from "@/lib/auth";

export type BorrowResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

type ApiResponse = {
  message?: string;
};

async function readApiMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  const payload = (await response.json().catch(() => null)) as
    | ApiResponse
    | null;

  return payload?.message ?? fallback;
}

function refreshBorrowData(bookId?: string) {
  // The catalogue copies changed, and the current page needs fresh loan data.
  updateTag("books");
  revalidatePath("/my-borrows");
  revalidatePath("/my-books");
  revalidatePath("/books");

  if (bookId) {
    revalidatePath(`/books/${bookId}`);
  }
}

export async function borrowBook(bookId: string): Promise<BorrowResult> {
  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, message: "Please sign in to borrow a book." };
  }

  const id = bookId?.trim() ?? "";

  if (!id) {
    return { ok: false, message: "This book is missing its identifier." };
  }

  try {
    const token = await getApiAccessToken();
    const response = await fetch(`${API_URL}/borrows`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bookId: id }),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        ok: false,
        message: await readApiMessage(
          response,
          `The borrow service responded with status ${response.status}.`,
        ),
      };
    }

    const payload = (await response.json().catch(() => null)) as
      | ApiResponse
      | null;

    refreshBorrowData(id);

    return {
      ok: true,
      message:
        payload?.message ??
        "The book is yours for the next two weeks. Enjoy the read.",
    };
  } catch {
    return {
      ok: false,
      message: `Could not reach the books API at ${API_URL}. Make sure the server is running.`,
    };
  }
}

export async function returnBook(borrowId: string): Promise<BorrowResult> {
  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, message: "Please sign in to return a book." };
  }

  const id = borrowId?.trim() ?? "";

  if (!id) {
    return { ok: false, message: "This loan is missing its identifier." };
  }

  const myBorrows = await getMyBorrows(user.email);
  const loan = myBorrows.find((borrow) => borrow._id === id);

  if (!loan) {
    return {
      ok: false,
      message: "That loan could not be found on your shelf.",
    };
  }

  try {
    const token = await getApiAccessToken();
    const response = await fetch(
      `${API_URL}/my-borrows/${encodeURIComponent(id)}`,
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
          `The return service responded with status ${response.status}.`,
        ),
      };
    }

    refreshBorrowData(loan.bookId);

    return {
      ok: true,
      message: "The copy is back on the shelf for the next reader.",
    };
  } catch {
    return {
      ok: false,
      message: `Could not reach the books API at ${API_URL}. Make sure the server is running.`,
    };
  }
}
