import Link from "next/link";
import { ArrowRight, Library } from "lucide-react";

import { BookCard } from "@/components/home/book-card";
import { Button } from "@/components/ui/button";
import type { Book } from "@/lib/types/book";

export function FreshShelves({ books }: { books: Book[] }) {
  return (
    <section className="mt-12" aria-labelledby="fresh-shelves-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.62rem] font-semibold tracking-[0.22em] text-brand-terracotta uppercase dark:text-[#e0a48a]">
            Straight from the shelves
          </p>
          <h2
            id="fresh-shelves-title"
            className="mt-2 font-display text-3xl leading-tight font-semibold tracking-[-0.025em] text-foreground sm:text-[2.1rem]"
          >
            New Arrivals
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The latest six books added to the BookNook library.
          </p>
        </div>
      </div>

      {books.length > 0 ? (
        <>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book, index) => (
              <BookCard
                key={book._id}
                book={book}
                priority={index < 3}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              render={<Link href="/books" />}
              nativeButton={false}
              variant="outline"
              className="h-10 rounded-full px-6"
            >
              See All Books
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Library className="size-5" aria-hidden="true" />
          </div>
          <h3 className="mt-4 font-display text-2xl font-semibold">
            The shelves are waiting
          </h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Add the first book to the library and give another reader something
            wonderful to discover.
          </p>
          <Button
            render={<Link href="/add-book" />}
            nativeButton={false}
            className="mt-5 rounded-full"
          >
            Add a book
          </Button>
        </div>
      )}
    </section>
  );
}
