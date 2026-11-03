import "server-only";

import { getBooks } from "@/lib/api/books";
import { getMyBorrows } from "@/lib/api/borrows";
import type { NavCounts } from "@/lib/constants/navigation";

export async function getNavCounts(
  reader: { email: string } | null,
): Promise<NavCounts> {
  if (!reader) {
    return { myBooks: 0, myBorrows: 0 };
  }

  const email = reader.email.trim().toLowerCase();
  const [books, borrows] = await Promise.all([
    getBooks(),
    getMyBorrows(email),
  ]);

  return {
    myBooks: books.filter(
      (book) => book.addedBy.email.trim().toLowerCase() === email,
    ).length,
    myBorrows: borrows.length,
  };
}
