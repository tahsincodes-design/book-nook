"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BookOpen,
  Check,
  Layers,
  Library,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { cn } from "cn";

import { MyBookCard } from "@/components/books/my-book-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Book } from "@/lib/types/book";

type AvailabilityFilter = "all" | "available" | "borrowed";

export function MyBooksView({ books }: { books: Book[] }) {
  const myBooks = books;
  const categories = new Set(myBooks.map((book) => book.category));
  const copies = myBooks.reduce((total, book) => total + book.totalCopies, 0);
  const onShelf = myBooks.filter((book) => book.totalCopies > 0).length;
  const borrowedOut = myBooks.length - onShelf;

  const [query, setQuery] = useState("");
  const [availability, setAvailability] =
    useState<AvailabilityFilter>("all");
  const [category, setCategory] = useState<string>("all");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredBooks = myBooks.filter((book) => {
    const matchesAvailability =
      availability === "all" ||
      (availability === "available" && book.totalCopies > 0) ||
      (availability === "borrowed" && book.totalCopies === 0);
    const matchesCategory = category === "all" || book.category === category;
    const searchableText = [
      book.title,
      book.author,
      book.category,
      book.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      matchesAvailability &&
      matchesCategory &&
      searchableText.includes(normalizedQuery)
    );
  });

  const categoryCounts = Array.from(
    myBooks.reduce((counts, book) => {
      counts.set(book.category, (counts.get(book.category) ?? 0) + 1);
      return counts;
    }, new Map<string, number>()),
  ).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  const availabilityFilters: {
    key: AvailabilityFilter;
    label: string;
    count: number;
  }[] = [
    { key: "all", label: "All books", count: myBooks.length },
    { key: "available", label: "On the shelf", count: onShelf },
    { key: "borrowed", label: "Borrowed out", count: borrowedOut },
  ];

  const hasFilters =
    normalizedQuery.length > 0 ||
    availability !== "all" ||
    category !== "all";

  function clearFilters() {
    setQuery("");
    setAvailability("all");
    setCategory("all");
  }

  return (
    <div className="mt-7 grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)] xl:gap-8">
      <aside
        aria-label="Collection search and filters"
        className="rounded-3xl bg-brand-forest p-5 text-brand-cream shadow-[0_20px_50px_-30px_rgba(31,68,52,0.8)] sm:p-6 lg:sticky lg:top-24"
      >
        <div>
          <p className="text-[0.62rem] font-semibold tracking-[0.2em] text-brand-sage uppercase">
            Your shelf
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold">
            My collection
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-brand-cream/70">
            Find a book you shared, or filter by category and availability.
          </p>
        </div>

        <label
          htmlFor="my-books-search"
          className="mt-6 block text-xs font-medium text-brand-cream/80"
        >
          Search your books
        </label>
        <div className="relative mt-2">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-cream/55"
            aria-hidden="true"
          />
          <Input
            id="my-books-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Title, author, category"
            disabled={myBooks.length === 0}
            className="h-11 rounded-xl border-white/15 bg-white/10 pr-3 pl-9 text-sm text-brand-cream placeholder:text-brand-cream/45 focus-visible:border-brand-sage focus-visible:ring-brand-sage/30 disabled:opacity-60"
          />
        </div>

        <div className="mt-6">
          <p className="mb-2 text-[0.62rem] font-semibold tracking-[0.16em] text-brand-cream/55 uppercase">
            Availability
          </p>
          <div className="grid gap-1">
            {availabilityFilters.map((option) => {
              const isSelected = availability === option.key;

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setAvailability(option.key)}
                  disabled={myBooks.length === 0}
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

        {categoryCounts.length > 0 ? (
          <div className="mt-6 border-t border-white/15 pt-5">
            <p className="mb-2 text-[0.62rem] font-semibold tracking-[0.16em] text-brand-cream/55 uppercase">
              Categories
            </p>
            <div className="grid gap-1">
              <CategoryButton
                label="Every category"
                count={myBooks.length}
                selected={category === "all"}
                onClick={() => setCategory("all")}
              />
              {categoryCounts.map(([name, count]) => (
                <CategoryButton
                  key={name}
                  label={name}
                  count={count}
                  selected={category === name}
                  onClick={() => setCategory(name)}
                />
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-6 border-t border-white/15 pt-5">
          <p className="text-xs leading-relaxed text-brand-cream/70">
            {myBooks.length > 0
              ? `${myBooks.length} ${
                  myBooks.length === 1 ? "book" : "books"
                } shared across ${categories.size} ${
                  categories.size === 1 ? "category" : "categories"
                }.`
              : "Your shelf is ready for its first story."}
          </p>
          <Button
            render={<Link href="/add-book" />}
            nativeButton={false}
            size="sm"
            className="mt-4 h-9 rounded-full bg-brand-cream px-4 text-brand-forest hover:bg-brand-sage"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            Add a book
          </Button>
        </div>
      </aside>

      <div className="min-w-0">
        {myBooks.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-sage/20 text-brand-forest dark:bg-brand-sage/10 dark:text-brand-sage">
              <Library className="size-6" aria-hidden="true" />
            </div>
            <h2 className="mt-5 font-display text-2xl font-semibold">
              Your shelf is still empty
            </h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Add a book you love and it will show up here with update and
              delete controls.
            </p>
            <Button
              render={<Link href="/add-book" />}
              nativeButton={false}
              className="mt-6 rounded-full"
            >
              <Plus className="size-4" />
              Add your first book
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="rounded-2xl border-0 bg-card p-5 ring-1 ring-foreground/10">
                <span className="flex size-9 items-center justify-center rounded-xl bg-brand-sage/20 text-brand-forest dark:bg-brand-sage/10 dark:text-brand-sage">
                  <Library className="size-4" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[0.62rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  Books shared
                </p>
                <p className="mt-1 font-display text-3xl font-semibold">
                  {myBooks.length}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Stories waiting for another reader
                </p>
              </Card>

              <Card className="rounded-2xl border-0 bg-card p-5 ring-1 ring-foreground/10">
                <span className="flex size-9 items-center justify-center rounded-xl bg-brand-ochre/20 text-[#7a6428] dark:bg-brand-ochre/10 dark:text-brand-ochre">
                  <BookOpen className="size-4" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[0.62rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  Categories
                </p>
                <p className="mt-1 font-display text-3xl font-semibold">
                  {categories.size}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Different corners of the shelf
                </p>
              </Card>

              <Card className="rounded-2xl border-0 bg-card p-5 ring-1 ring-foreground/10">
                <span className="flex size-9 items-center justify-center rounded-xl bg-brand-terracotta/15 text-brand-terracotta dark:bg-brand-terracotta/10 dark:text-[#e0a48a]">
                  <Layers className="size-4" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[0.62rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  Copies on the shelf
                </p>
                <p className="mt-1 font-display text-3xl font-semibold">
                  {copies}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {borrowedOut > 0
                    ? `${borrowedOut} ${
                        borrowedOut === 1 ? "title is" : "titles are"
                      } borrowed out`
                    : "Ready to be borrowed"}
                </p>
              </Card>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filteredBooks.length}
                </span>{" "}
                of {myBooks.length}{" "}
                {myBooks.length === 1 ? "book" : "books"}
              </p>
              {hasFilters ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-full text-xs text-muted-foreground"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              ) : null}
            </div>

            {filteredBooks.length > 0 ? (
              <div className="mt-4 grid gap-5 lg:grid-cols-2">
                {filteredBooks.map((book) => (
                  <MyBookCard key={book._id} book={book} />
                ))}
              </div>
            ) : (
              <div className="mt-4 flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-sage/20 text-brand-forest dark:bg-brand-sage/10 dark:text-brand-sage">
                  <Search className="size-5" aria-hidden="true" />
                </div>
                <h2 className="mt-4 font-display text-xl font-semibold">
                  No matching books
                </h2>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Try another title, author, or category, or clear the current
                  search and filters.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-5 rounded-full"
                  onClick={clearFilters}
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
                Updates save through{" "}
                <code className="rounded bg-background/70 px-1 py-0.5 text-[0.68rem]">
                  PATCH /books/:id
                </code>{" "}
                and deletes through{" "}
                <code className="rounded bg-background/70 px-1 py-0.5 text-[0.68rem]">
                  DELETE /books/:id
                </code>
                .
              </p>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function CategoryButton({
  label,
  count,
  selected,
  onClick,
}: {
  label: string;
  count: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex min-h-9 items-center justify-between gap-3 rounded-xl px-3 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:ring-brand-sage focus-visible:outline-none",
        selected
          ? "bg-white/15 font-semibold text-brand-cream"
          : "text-brand-cream/75 hover:bg-white/10 hover:text-brand-cream",
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        {selected ? (
          <Check className="size-3.5 shrink-0" aria-hidden="true" />
        ) : (
          <span className="size-3.5 shrink-0" aria-hidden="true" />
        )}
        <span className="truncate">{label}</span>
      </span>
      <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs tabular-nums text-brand-cream/70">
        {count}
      </span>
    </button>
  );
}
