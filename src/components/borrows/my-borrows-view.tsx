"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  CalendarClock,
  CalendarDays,
  Check,
  Clock3,
  Search,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { cn } from "cn";

import { ReturnBorrowButton } from "@/components/borrows/return-borrow-button";
import { BookCover } from "@/components/home/book-cover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Borrow } from "@/lib/api/borrows";
import { formatDate } from "@/lib/format";
import type { Book } from "@/lib/types/book";

type BorrowStatus = "reading" | "due-soon" | "due-today" | "overdue";
type BorrowFilter = "all" | "due-soon" | "overdue" | "reading";

type BorrowCardItem = {
  borrow: Borrow;
  book: Book | null;
  status: BorrowStatus;
  daysLeft: number | null;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const accentStyles: Record<BorrowStatus, string> = {
  reading: "bg-brand-sage",
  "due-soon": "bg-brand-ochre",
  "due-today": "bg-brand-ochre",
  overdue: "bg-destructive",
};

const badgeStyles: Record<BorrowStatus, string> = {
  reading:
    "border-0 bg-brand-sage/20 text-brand-forest dark:bg-brand-sage/10 dark:text-brand-sage",
  "due-soon":
    "border-0 bg-brand-ochre/20 text-[#7a6428] dark:bg-brand-ochre/10 dark:text-brand-ochre",
  "due-today":
    "border-0 bg-brand-ochre/20 text-[#7a6428] dark:bg-brand-ochre/10 dark:text-brand-ochre",
  overdue:
    "border-0 bg-destructive/10 text-destructive dark:bg-destructive/20",
};

function toStatus(daysLeft: number | null): BorrowStatus {
  if (daysLeft === null) {
    return "reading";
  }

  if (daysLeft < 0) {
    return "overdue";
  }

  if (daysLeft === 0) {
    return "due-today";
  }

  if (daysLeft <= 3) {
    return "due-soon";
  }

  return "reading";
}

function statusLabel(item: BorrowCardItem) {
  if (item.status === "overdue") {
    const overdueDays = item.daysLeft === null ? 0 : Math.abs(item.daysLeft);

    return overdueDays > 0
      ? `${overdueDays} ${overdueDays === 1 ? "day" : "days"} overdue`
      : "Overdue";
  }

  if (item.status === "due-today") {
    return "Due today";
  }

  if (item.status === "due-soon") {
    return `${item.daysLeft} ${item.daysLeft === 1 ? "day" : "days"} left`;
  }

  return "Reading now";
}

function StatusIcon({ status }: { status: BorrowStatus }) {
  if (status === "overdue") {
    return <TriangleAlert className="size-3" aria-hidden="true" />;
  }

  if (status === "due-soon" || status === "due-today") {
    return <Clock3 className="size-3" aria-hidden="true" />;
  }

  return <BookOpen className="size-3" aria-hidden="true" />;
}

function BorrowCard({ item }: { item: BorrowCardItem }) {
  const { borrow, book, status } = item;

  return (
    <Card className="animate-rise-in group/card relative gap-0 overflow-hidden rounded-3xl border-0 bg-card p-0 ring-1 ring-foreground/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-32px_rgba(29,42,35,0.45)]">
      <span
        aria-hidden="true"
        className={cn("block h-1 w-full", accentStyles[status])}
      />

      <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
        <div className="shrink-0">
          {book ? (
            <Link
              href={`/books/${book._id}`}
              aria-label={`View details for ${book.title}`}
              className="block rounded-2xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <BookCover
                src={book.image}
                title={book.title}
                author={book.author}
                className="aspect-[2/3] w-24 rounded-2xl ring-1 ring-foreground/10 sm:w-32"
                sizes="128px"
              />
            </Link>
          ) : (
            <BookCover
              title="Removed book"
              author="BookNook"
              className="aspect-[2/3] w-24 rounded-2xl opacity-60 ring-1 ring-foreground/10 sm:w-32"
              sizes="128px"
            />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            {book && (
              <Badge className="border-0 bg-brand-sage/20 text-brand-forest dark:bg-brand-sage/10 dark:text-brand-sage">
                {book.category}
              </Badge>
            )}
            <Badge variant="outline" className={badgeStyles[status]}>
              <StatusIcon status={status} />
              {statusLabel(item)}
            </Badge>
          </div>

          <h3 className="mt-2 font-display text-lg leading-tight font-semibold tracking-[-0.02em]">
            {book ? (
              <Link
                href={`/books/${book._id}`}
                className="transition-colors hover:text-brand-terracotta dark:hover:text-[#e0a48a]"
              >
                {book.title}
              </Link>
            ) : (
              "Book no longer in the library"
            )}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {book ? `by ${book.author}` : "The catalogue entry was removed."}
          </p>

          <div className="mt-3 grid gap-1.5 text-xs text-muted-foreground sm:grid-cols-2">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              Borrowed {formatDate(borrow.borrowedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-3.5" aria-hidden="true" />
              Due {formatDate(borrow.dueAt)}
            </span>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
            {book ? (
              <Button
                render={<Link href={`/books/${book._id}`} />}
                nativeButton={false}
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                View book
                <ArrowUpRight className="size-3.5" />
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground">
                The loan can still be returned.
              </span>
            )}

            <ReturnBorrowButton
              borrowId={borrow._id}
              title={book?.title ?? "this book"}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function MyBorrowsView({
  borrows,
  books,
  now,
}: {
  borrows: Borrow[];
  books: Book[];
  now: number;
}) {
  const items: BorrowCardItem[] = borrows.map((borrow) => {
    const book =
      books.find((candidate) => candidate._id === borrow.bookId) ?? null;
    const due = Date.parse(borrow.dueAt);
    const daysLeft = Number.isNaN(due)
      ? null
      : Math.ceil((due - now) / DAY_MS);

    return {
      borrow,
      book,
      status: toStatus(daysLeft),
      daysLeft,
    };
  });

  const dueSoon = items.filter(
    (item) => item.status === "due-soon" || item.status === "due-today",
  ).length;
  const overdue = items.filter((item) => item.status === "overdue").length;
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<BorrowFilter>("all");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = items.filter((item) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "due-soon" &&
        (item.status === "due-soon" || item.status === "due-today")) ||
      item.status === filter;
    const searchableText = [
      item.book?.title,
      item.book?.author,
      item.book?.category,
      statusLabel(item),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesFilter && searchableText.includes(normalizedQuery);
  });
  const filters: { key: BorrowFilter; label: string; count: number }[] = [
    { key: "all", label: "All borrowed", count: items.length },
    { key: "reading", label: "On track", count: items.length - dueSoon - overdue },
    { key: "due-soon", label: "Due soon", count: dueSoon },
    { key: "overdue", label: "Overdue", count: overdue },
  ];

  return (
    <div className="mt-7 grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)] xl:gap-8">
      <aside
        aria-label="Borrow search and filters"
        className="rounded-3xl bg-brand-forest p-5 text-brand-cream shadow-[0_20px_50px_-30px_rgba(31,68,52,0.8)] sm:p-6 lg:sticky lg:top-24"
      >
        <div>
          <p className="text-[0.62rem] font-semibold tracking-[0.2em] text-brand-sage uppercase">
            Your reading
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold">
            Loan shelf
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-brand-cream/70">
            Find a borrowed book or check what needs to be returned.
          </p>
        </div>

        <label
          htmlFor="borrow-search"
          className="mt-6 block text-xs font-medium text-brand-cream/80"
        >
          Search your loans
        </label>
        <div className="relative mt-2">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-cream/55"
            aria-hidden="true"
          />
          <Input
            id="borrow-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Title, author, category"
            disabled={items.length === 0}
            className="h-11 rounded-xl border-white/15 bg-white/10 pr-3 pl-9 text-sm text-brand-cream placeholder:text-brand-cream/45 focus-visible:border-brand-sage focus-visible:ring-brand-sage/30 disabled:opacity-60"
          />
        </div>

        <div className="mt-6">
          <p className="mb-2 text-[0.62rem] font-semibold tracking-[0.16em] text-brand-cream/55 uppercase">
            Filter by status
          </p>
          <div className="grid gap-1">
            {filters.map((option) => {
              const isSelected = filter === option.key;

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setFilter(option.key)}
                  disabled={items.length === 0}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex min-h-10 items-center justify-between gap-3 rounded-xl px-3 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:ring-brand-sage focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                    isSelected
                      ? "bg-brand-cream font-semibold text-brand-forest"
                      : "text-brand-cream/80 hover:bg-white/10 hover:text-brand-cream",
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {isSelected ? (
                      <Check className="size-3.5 shrink-0" aria-hidden="true" />
                    ) : null}
                    <span>{option.label}</span>
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs tabular-nums",
                      isSelected
                        ? "bg-brand-forest/10"
                        : "bg-white/10 text-brand-cream/70",
                    )}
                  >
                    {option.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 border-t border-white/15 pt-5">
          <p className="text-xs leading-relaxed text-brand-cream/70">
            {items.length > 0
              ? `${items.length} ${
                  items.length === 1 ? "book is" : "books are"
                } on your shelf. Need another story?`
              : "Your loan shelf is ready for its first story."}
          </p>
          <Button
            render={<Link href="/books" />}
            nativeButton={false}
            size="sm"
            className="mt-4 h-9 rounded-full bg-brand-cream px-4 text-brand-forest hover:bg-brand-sage"
          >
            Browse books
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      </aside>

      <div className="min-w-0">
        {items.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-sage/20 text-brand-forest dark:bg-brand-sage/10 dark:text-brand-sage">
              <BookOpen className="size-6" aria-hidden="true" />
            </div>
            <h2 className="mt-5 font-display text-2xl font-semibold">
              No borrowed books yet
            </h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Find a story on the shelf and borrow it. Your active loans, due
              dates, and return button will live here.
            </p>
            <Button
              render={<Link href="/books" />}
              nativeButton={false}
              className="mt-6 rounded-full"
            >
              <BookOpen className="size-4" />
              Browse the library
            </Button>
          </div>
        ) : (
          <div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="rounded-2xl border-0 bg-card p-5 ring-1 ring-foreground/10">
                <span className="flex size-9 items-center justify-center rounded-xl bg-brand-sage/20 text-brand-forest dark:bg-brand-sage/10 dark:text-brand-sage">
                  <BookOpen className="size-4" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[0.62rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  On loan
                </p>
                <p className="mt-1 font-display text-3xl font-semibold">
                  {items.length}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Stories in your hands right now
                </p>
              </Card>

              <Card className="rounded-2xl border-0 bg-card p-5 ring-1 ring-foreground/10">
                <span className="flex size-9 items-center justify-center rounded-xl bg-brand-ochre/20 text-[#7a6428] dark:bg-brand-ochre/10 dark:text-brand-ochre">
                  <CalendarClock className="size-4" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[0.62rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  Due soon
                </p>
                <p className="mt-1 font-display text-3xl font-semibold">
                  {dueSoon}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Wrap these up within three days
                </p>
              </Card>

              <Card className="rounded-2xl border-0 bg-card p-5 ring-1 ring-foreground/10">
                <span className="flex size-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive dark:bg-destructive/20">
                  <TriangleAlert className="size-4" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[0.62rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  Overdue
                </p>
                <p className="mt-1 font-display text-3xl font-semibold">
                  {overdue}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Return these to free a copy
                </p>
              </Card>
            </div>

            {filteredItems.length > 0 ? (
              <div className="mt-7 grid gap-5 lg:grid-cols-2">
                {filteredItems.map((item) => (
                  <BorrowCard key={item.borrow._id} item={item} />
                ))}
              </div>
            ) : (
              <div className="mt-7 flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-sage/20 text-brand-forest dark:bg-brand-sage/10 dark:text-brand-sage">
                  <Search className="size-5" aria-hidden="true" />
                </div>
                <h2 className="mt-4 font-display text-xl font-semibold">
                  No matching loans
                </h2>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Try another title or author, or clear the current search and
                  filter.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-5 rounded-full"
                  onClick={() => {
                    setQuery("");
                    setFilter("all");
                  }}
                >
                  Clear search and filters
                </Button>
              </div>
            )}

            <Card className="mt-6 flex-row items-center gap-3 rounded-2xl border-0 bg-muted/40 p-4 ring-1 ring-foreground/5">
              <Sparkles
                className="size-4 shrink-0 text-brand-terracotta dark:text-[#e0a48a]"
                aria-hidden="true"
              />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Loans are two weeks long. Returning a book puts the copy back on
                the shelf immediately so another reader can borrow it.
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
