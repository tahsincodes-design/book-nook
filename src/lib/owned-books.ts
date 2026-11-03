import type { Book, BookOwner } from "@/lib/types/book";

function normalizeEmail(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

/**
 * True when the reader's email matches the book owner. Used by server actions
 * so edit/delete cannot be forged from the browser even if the controls are
 * hidden.
 */
export function isBookOwner(
  book: Pick<Book, "addedBy">,
  reader: { name: string; email: string } | null | undefined,
): boolean {
  if (!reader) {
    return false;
  }

  const owner: BookOwner = book.addedBy;
  const readerEmail = normalizeEmail(reader.email);
  const ownerEmail = normalizeEmail(owner.email);

  return Boolean(readerEmail && ownerEmail && readerEmail === ownerEmail);
}

export function filterOwnedBooks(
  books: Book[],
  reader: { name: string; email: string },
) {
  const email = normalizeEmail(reader.email);

  if (!email) {
    return [];
  }

  return books.filter(
    (book) => normalizeEmail(book.addedBy.email) === email,
  );
}
