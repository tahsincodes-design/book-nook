import { DeleteBookDialog } from "@/components/books/delete-book-dialog";
import { UpdateBookDialog } from "@/components/books/update-book-dialog";
import type { Book } from "@/lib/types/book";

/**
 * Owner-only edit/delete controls. The server actions repeat this check, so a
 * hidden button is never the only protection.
 */
export function BookActions({
  book,
  canManage,
  triggerClassName = "h-10 rounded-full px-4",
}: {
  book: Book;
  canManage: boolean;
  triggerClassName?: string;
}) {
  if (!canManage) {
    return null;
  }

  return (
    <>
      <UpdateBookDialog book={book} triggerClassName={triggerClassName} />
      <DeleteBookDialog book={book} triggerClassName={triggerClassName} />
    </>
  );
}
