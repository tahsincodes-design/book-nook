import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Hash,
  Layers,
  Mail,
  Sparkles,
  UserRound,
} from "lucide-react";

import { BookActions } from "@/components/books/book-actions";
import { BorrowButton } from "@/components/books/borrow-button";
import { BookCard } from "@/components/home/book-card";
import { BookCover } from "@/components/home/book-cover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getBook,
  getBooks,
  sortByNewest,
} from "@/lib/api/books";
import { getMyBorrows } from "@/lib/api/borrows";
import { requireUser } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { isBookOwner } from "@/lib/owned-books";
import type { Book } from "@/lib/types/book";

type BookDetailsPageProps = {
  params: Promise<{ id: string }>;
};

// The detail screen reads route params, so let this route block on the server
// until the catalogue is split behind its own Suspense boundary.
export async function generateMetadata({
  params,
}: BookDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  // Metadata does not need the session. The page itself still calls
  // requireUser, and skipping the extra auth read keeps the head fast.
  const book = await getBook(id);

  return {
    title: book ? book.title : "Book not found",
    description: book?.description,
  };
}

function initialsFor(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "BN"
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BookOpen;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-sage/20 text-brand-forest dark:bg-brand-sage/10 dark:text-brand-sage">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          {label}
        </p>
        <p className="mt-1 text-sm font-medium break-words text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

function pickRelated(books: Book[], current: Book, limit = 3) {
  const sameCategory = sortByNewest(
    books.filter(
      (book) => book._id !== current._id && book.category === current.category,
    ),
  );
  const rest = sortByNewest(
    books.filter(
      (book) => book._id !== current._id && book.category !== current.category,
    ),
  );

  return [...sameCategory, ...rest].slice(0, limit);
}

export default async function BookDetailsPage({
  params,
}: BookDetailsPageProps) {
  const { id } = await params;
  const user = await requireUser(`/books/${id}`);
  const [book, allBooks, myBorrows] = await Promise.all([
    getBook(id),
    getBooks(),
    getMyBorrows(user.email),
  ]);

  if (!book) {
    notFound();
  }

  const available = book.totalCopies > 0;
  const canManage = isBookOwner(book, user);
  const alreadyBorrowed = myBorrows.some(
    (borrow) => borrow.bookId === book._id,
  );
  const related = pickRelated(allBooks, book);

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(166,183,169,0.35),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(46,93,75,0.4),transparent_65%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-6 pb-12 sm:px-6 lg:px-8">
        <Link
          href="/books"
          className="inline-flex items-center gap-1.5 rounded-full text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" />
          Back to books
        </Link>

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-12">
          <div className="mx-auto w-full max-w-[300px] lg:sticky lg:top-24 lg:mx-0 lg:max-w-none">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-4 -z-10 rounded-[2rem] bg-brand-sage/20 blur-2xl dark:bg-brand-sage/5"
              />
              <BookCover
                src={book.image}
                title={book.title}
                author={book.author}
                priority
                className="aspect-[2/3] w-full rounded-3xl shadow-[0_30px_60px_-30px_rgba(29,42,35,0.55)] ring-1 ring-foreground/10"
                sizes="(max-width: 1024px) 300px, 340px"
              />
            </div>

            <Card className="mt-5 flex-row items-center gap-3 rounded-2xl border-0 bg-card p-4 ring-1 ring-foreground/10">
              <span
                className={
                  available
                    ? "flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-sage/25 text-brand-forest dark:bg-brand-sage/10 dark:text-brand-sage"
                    : "flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-terracotta/15 text-brand-terracotta dark:bg-brand-terracotta/10 dark:text-[#e0a48a]"
                }
              >
                <BookOpen className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  {available ? "On the shelf" : "Currently borrowed"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {book.totalCopies}{" "}
                  {book.totalCopies === 1 ? "copy" : "copies"} in the library
                </p>
              </div>
            </Card>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-0 bg-brand-sage/20 text-brand-forest dark:bg-brand-sage/10 dark:text-brand-sage">
                {book.category}
              </Badge>
              <Badge
                variant="outline"
                className={
                  available
                    ? "border-brand-sage/50 text-brand-forest dark:text-brand-sage"
                    : "border-brand-terracotta/40 text-brand-terracotta dark:text-[#e0a48a]"
                }
              >
                {available ? (
                  <CheckCircle2 className="size-3" aria-hidden="true" />
                ) : (
                  <BookOpen className="size-3" aria-hidden="true" />
                )}
                {available ? "Available" : "Unavailable"}
              </Badge>
            </div>

            <h1 className="mt-4 font-display text-4xl leading-[1.02] font-semibold tracking-[-0.035em] text-foreground sm:text-5xl lg:text-[3.4rem]">
              {book.title}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              by <span className="font-medium text-foreground">{book.author}</span>
            </p>

            <p className="mt-5 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
              {book.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <BorrowButton
                bookId={book._id}
                available={available}
                alreadyBorrowed={alreadyBorrowed}
              />
              <BookActions book={book} canManage={canManage} />
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Card className="gap-0 rounded-2xl border-0 bg-card p-4 ring-1 ring-foreground/10">
                <span className="flex size-8 items-center justify-center rounded-lg bg-brand-sage/20 text-brand-forest dark:bg-brand-sage/10 dark:text-brand-sage">
                  <Layers className="size-4" aria-hidden="true" />
                </span>
                <p className="mt-3 font-display text-xl font-semibold">
                  {book.totalCopies}
                </p>
                <p className="text-xs text-muted-foreground">
                  {book.totalCopies === 1 ? "Copy available" : "Copies available"}
                </p>
              </Card>

              <Card className="gap-0 rounded-2xl border-0 bg-card p-4 ring-1 ring-foreground/10">
                <span className="flex size-8 items-center justify-center rounded-lg bg-brand-terracotta/15 text-brand-terracotta dark:bg-brand-terracotta/10 dark:text-[#e0a48a]">
                  <CalendarDays className="size-4" aria-hidden="true" />
                </span>
                <p className="mt-3 font-display text-xl font-semibold">
                  {formatDate(book.createdAt)}
                </p>
                <p className="text-xs text-muted-foreground">Added to BookNook</p>
              </Card>

              <Card className="gap-0 rounded-2xl border-0 bg-card p-4 ring-1 ring-foreground/10">
                <span className="flex size-8 items-center justify-center rounded-lg bg-brand-ochre/20 text-[#7a6428] dark:bg-brand-ochre/10 dark:text-brand-ochre">
                  <UserRound className="size-4" aria-hidden="true" />
                </span>
                <p className="mt-3 truncate font-display text-xl font-semibold">
                  {book.addedBy.name}
                </p>
                <p className="text-xs text-muted-foreground">Shared by</p>
              </Card>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
              <Card className="rounded-3xl border-0 bg-card ring-1 ring-foreground/10">
                <div className="px-5 pt-5">
                  <div className="flex items-center gap-2">
                    <Sparkles
                      className="size-4 text-brand-terracotta dark:text-[#e0a48a]"
                      aria-hidden="true"
                    />
                    <h2 className="font-display text-xl font-semibold">
                      About this book
                    </h2>
                  </div>
                </div>

                <div className="grid gap-4 px-5 pb-5">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {book.description}
                  </p>
                  <Separator />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <DetailRow
                      icon={BookOpen}
                      label="Category"
                      value={book.category}
                    />
                    <DetailRow
                      icon={Hash}
                      label="Shelf ID"
                      value={book._id}
                    />
                  </div>
                </div>
              </Card>

              <Card className="rounded-3xl border-0 bg-card ring-1 ring-foreground/10">
                <div className="px-5 pt-5">
                  <h2 className="font-display text-xl font-semibold">
                    Shared by
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    The reader who put this story on the shelf.
                  </p>
                </div>

                <div className="grid gap-4 px-5 pb-5">
                  <div className="flex items-center gap-3 rounded-2xl bg-muted/50 p-3">
                    <Avatar size="lg">
                      <AvatarFallback className="bg-[#d9c6b5] text-xs font-semibold text-[#4b3a2c] dark:bg-[#3a2d25] dark:text-[#e8d6c4]">
                        {initialsFor(book.addedBy.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {book.addedBy.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        BookNook contributor
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <DetailRow
                      icon={Mail}
                      label="Contact"
                      value={book.addedBy.email || "Not shared"}
                    />
                    <DetailRow
                      icon={CalendarDays}
                      label="On the shelf since"
                      value={formatDate(book.createdAt)}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-14">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[0.62rem] font-semibold tracking-[0.22em] text-brand-terracotta uppercase dark:text-[#e0a48a]">
                  Keep exploring
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                  More from the shelf
                </h2>
              </div>
              <Button
                render={<Link href="/books" />}
                nativeButton={false}
                variant="outline"
                className="rounded-full"
              >
                All books
                <ArrowUpRight className="size-4" />
              </Button>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((relatedBook) => (
                <BookCard key={relatedBook._id} book={relatedBook} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
