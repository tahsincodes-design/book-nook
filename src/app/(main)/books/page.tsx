import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, SearchX } from "lucide-react";

import { BookCard } from "@/components/home/book-card";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { getBooks, sortByNewest } from "@/lib/api/books";

export const metadata: Metadata = {
  title: "Explore books",
  description: "Browse the full BookNook catalogue.",
};

export const instant = false;

type BooksPageProps = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const { q, category } = await searchParams;
  const books = sortByNewest(await getBooks());
  const query = q?.trim().toLowerCase();

  const filteredBooks = books.filter((book) => {
    const matchesQuery =
      !query ||
      `${book.title} ${book.author} ${book.category}`
        .toLowerCase()
        .includes(query);
    const matchesCategory = !category || book.category === category;

    return matchesQuery && matchesCategory;
  });

  const hasFilters = Boolean(query || category);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="The library"
        title={category ? `${category} books` : "Explore books"}
        description={
          hasFilters
            ? `${filteredBooks.length} ${
                filteredBooks.length === 1 ? "book" : "books"
              } found in the collection.`
            : "Every story on the shelves, ready to be discovered."
        }
        action={
          hasFilters ? (
            <Button
              render={<Link href="/books" />}
              nativeButton={false}
              variant="outline"
              className="rounded-full"
            >
              Clear filters
            </Button>
          ) : undefined
        }
      />

      {filteredBooks.length > 0 ? (
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book, index) => (
            <BookCard key={book._id} book={book} priority={index < 3} />
          ))}
        </div>
      ) : (
        <div className="mt-7 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <SearchX className="size-6" aria-hidden="true" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-semibold">
            No books match that search
          </h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Try a different title, author, or category. The shelves are always
            growing.
          </p>
          <Button
            render={<Link href="/books" />}
            nativeButton={false}
            variant="outline"
            className="mt-6 rounded-full"
          >
            <BookOpen className="size-4" />
            View all books
          </Button>
        </div>
      )}
    </div>
  );
}
