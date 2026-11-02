import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  UserRound,
} from "lucide-react";

import { BorrowButton } from "@/components/books/borrow-button";
import { BookCover } from "@/components/home/book-cover";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { findBook, getBooks } from "@/lib/api/books";
import { formatDate } from "@/lib/format";

type BookDetailsPageProps = {
  params: Promise<{ id: string }>;
};

// The detail screen reads route params, so let this route block on the server
// until the catalogue is split behind its own Suspense boundary.
export const instant = false;

export async function generateMetadata({
  params,
}: BookDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const book = findBook(await getBooks(), id);

  return {
    title: book ? book.title : "Book not found",
    description: book?.description,
  };
}

export default async function BookDetailsPage({
  params,
}: BookDetailsPageProps) {
  const { id } = await params;
  const book = findBook(await getBooks(), id);

  if (!book) {
    notFound();
  }

  const available = book.totalCopies > 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-6 pb-10 sm:px-6 lg:px-8">
      <Link
        href="/books"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to books
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[320px_1fr] lg:gap-12">
        <div className="mx-auto w-full max-w-[280px] lg:sticky lg:top-24 lg:mx-0 lg:max-w-none">
          <BookCover
            src={book.image}
            title={book.title}
            author={book.author}
            priority
            className="aspect-[2/3] w-full rounded-2xl shadow-[0_24px_50px_-24px_rgba(29,42,35,0.45)]"
            sizes="(max-width: 1024px) 280px, 320px"
          />
        </div>

        <div>
          <Badge className="border-0 bg-brand-sage/20 text-brand-forest dark:bg-brand-sage/10 dark:text-brand-sage">
            {book.category}
          </Badge>

          <h1 className="mt-4 font-display text-4xl leading-[1.02] font-semibold tracking-[-0.035em] text-foreground sm:text-5xl">
            {book.title}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">by {book.author}</p>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {book.description}
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <Card className="flex-row items-center gap-3 rounded-2xl border-0 bg-card p-4 ring-1 ring-foreground/10">
              <BookOpen className="size-4 text-brand-terracotta dark:text-[#e0a48a]" />
              <div>
                <p className="text-sm font-semibold">
                  {book.totalCopies}{" "}
                  {book.totalCopies === 1 ? "copy" : "copies"}
                </p>
                <p className="text-[0.7rem] text-muted-foreground">
                  {available ? "Available" : "Not available"}
                </p>
              </div>
            </Card>

            <Card className="flex-row items-center gap-3 rounded-2xl border-0 bg-card p-4 ring-1 ring-foreground/10">
              <UserRound className="size-4 text-brand-terracotta dark:text-[#e0a48a]" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {book.addedBy.name}
                </p>
                <p className="text-[0.7rem] text-muted-foreground">
                  Contributed by
                </p>
              </div>
            </Card>

            <Card className="flex-row items-center gap-3 rounded-2xl border-0 bg-card p-4 ring-1 ring-foreground/10">
              <CalendarDays className="size-4 text-brand-terracotta dark:text-[#e0a48a]" />
              <div>
                <p className="text-sm font-semibold">
                  {formatDate(book.createdAt)}
                </p>
                <p className="text-[0.7rem] text-muted-foreground">Added</p>
              </div>
            </Card>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <BorrowButton available={available} />
            <span className="text-xs font-medium text-muted-foreground">
              {available
                ? `${book.totalCopies} ${
                    book.totalCopies === 1 ? "copy" : "copies"
                  } on the shelf`
                : "All copies are currently borrowed"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
