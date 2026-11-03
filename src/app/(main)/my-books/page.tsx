import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { MyBooksView } from "@/components/books/my-books-view";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { getBooks } from "@/lib/api/books";

export const metadata: Metadata = {
  title: "My collection",
  description: "The books you have added to the BookNook shelves.",
};

export default async function MyBooksPage() {
  const books = await getBooks();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="My reading"
        title="My collection"
        description="The books you have shared with the BookNook library. Update a detail or take a book off the shelf whenever you like."
        action={
          <Button
            render={<Link href="/add-book" />}
            nativeButton={false}
            className="rounded-full"
          >
            <Plus className="size-4" />
            Add a book
          </Button>
        }
      />

      <MyBooksView books={books} />
    </div>
  );
}
