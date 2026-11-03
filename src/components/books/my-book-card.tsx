import Link from "next/link";
import { ArrowUpRight, CalendarDays, Layers } from "lucide-react";

import { DeleteBookDialog } from "@/components/books/delete-book-dialog";
import { UpdateBookDialog } from "@/components/books/update-book-dialog";
import { BookCover } from "@/components/home/book-cover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { Book } from "@/lib/types/book";

export function MyBookCard({ book }: { book: Book }) {
  return (
    <Card className="gap-0 rounded-3xl border-0 bg-card p-0 ring-1 ring-foreground/10 transition-shadow hover:shadow-[0_22px_45px_-30px_rgba(29,42,35,0.4)]">
      <div className="flex gap-4 p-4">
        <Link
          href={`/books/${book._id}`}
          aria-label={`View details for ${book.title}`}
          className="shrink-0 rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <BookCover
            src={book.image}
            title={book.title}
            author={book.author}
            className="aspect-[2/3] w-24 rounded-xl ring-1 ring-foreground/10 sm:w-28"
            sizes="112px"
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-0 bg-brand-sage/20 text-brand-forest dark:bg-brand-sage/10 dark:text-brand-sage">
              {book.category}
            </Badge>
            <span className="inline-flex items-center gap-1 text-[0.68rem] text-muted-foreground">
              <CalendarDays className="size-3" aria-hidden="true" />
              {formatDate(book.createdAt)}
            </span>
          </div>

          <h3 className="mt-2 font-display text-lg leading-tight font-semibold tracking-[-0.02em]">
            <Link
              href={`/books/${book._id}`}
              className="transition-colors hover:text-brand-terracotta dark:hover:text-[#e0a48a]"
            >
              {book.title}
            </Link>
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            by {book.author}
          </p>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {book.description}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
            <Button
              render={<Link href={`/books/${book._id}`} />}
              nativeButton={false}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              View
              <ArrowUpRight className="size-3.5" />
            </Button>
            <UpdateBookDialog book={book} />
            <DeleteBookDialog book={book} redirectTo="/my-books" />
          </div>

          <p className="mt-3 inline-flex items-center gap-1 text-[0.68rem] text-muted-foreground">
            <Layers className="size-3" aria-hidden="true" />
            {book.totalCopies} {book.totalCopies === 1 ? "copy" : "copies"} on
            the shelf
          </p>
        </div>
      </div>
    </Card>
  );
}
