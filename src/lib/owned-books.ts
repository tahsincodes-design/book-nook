import { demoUser } from "@/lib/demo/user";
import type { Book, BookOwner } from "@/lib/types/book";

/**
 * True when the reader's email (or, as a demo fallback, their name) matches the
 * book owner. Used by server actions so edit/delete cannot be forged from the
 * browser even if the controls are hidden.
 */
export function isBookOwner(
  book: Pick<Book, "addedBy">,
  reader: { name: string; email: string } | null | undefined,
): boolean {
  if (!reader) {
    return false;
  }

  const owner: BookOwner = book.addedBy;
  const readerEmail = reader.email.trim().toLowerCase();
  const readerName = reader.name.trim().toLowerCase();
  const ownerEmail = owner.email.trim().toLowerCase();
  const ownerName = owner.name.trim().toLowerCase();

  return Boolean(
    (readerEmail && ownerEmail && readerEmail === ownerEmail) ||
      (readerName && ownerName && readerName === ownerName),
  );
}

/**
 * The demo reader can edit their local name and email, but the books in Mongo
 * were stamped with the seeded demo identity. Match either identity so the
 * collection does not disappear when the profile is edited.
 */
export function filterOwnedBooks(
  books: Book[],
  reader: { name: string; email: string },
) {
  const emails = new Set([
    reader.email.toLowerCase(),
    demoUser.email.toLowerCase(),
  ]);
  const names = new Set([
    reader.name.toLowerCase(),
    demoUser.name.toLowerCase(),
  ]);

  return books.filter(
    (book) =>
      emails.has(book.addedBy.email.toLowerCase()) ||
      names.has(book.addedBy.name.toLowerCase()),
  );
}
