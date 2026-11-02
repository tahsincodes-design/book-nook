import { Suspense } from "react";

import { CuratedShelves } from "@/components/home/curated-shelves";
import { FreshShelves } from "@/components/home/fresh-shelves";
import { HeroSlider } from "@/components/home/hero-slider";
import { ReadersCorner } from "@/components/home/readers-corner";
import { ReadingJourney } from "@/components/home/reading-journey";
import { StatsRow } from "@/components/home/stats-row";
import { TodayLabel } from "@/components/home/today-label";
import { getBooks, getLatestBooks } from "@/lib/api/books";
import { demoUser } from "@/lib/demo/user";

export default async function HomePage() {
  const books = await getBooks();
  const latestBooks = getLatestBooks(books, 6);
  const featuredBooks = latestBooks.slice(0, 3);

  const stats = {
    booksInLibrary: books.length,
    currentlyBorrowed: demoUser.borrowedCount,
    booksContributed: books.filter(
      (book) => book.addedBy.email === demoUser.email,
    ).length,
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <h1 className="sr-only">BookNook library overview</h1>

      <div className="flex items-center justify-between gap-4 py-6">
        <Suspense
          fallback={
            <p className="text-[0.65rem] font-semibold tracking-[0.24em] text-brand-terracotta dark:text-[#e0a48a]">
              Today
            </p>
          }
        >
          <TodayLabel />
        </Suspense>
        <p className="hidden text-xs text-muted-foreground sm:block">
          Welcome back, {demoUser.name.split(" ")[0]}.
        </p>
      </div>

      <HeroSlider books={featuredBooks} />

      <div className="mt-5">
        <StatsRow stats={stats} />
      </div>

      <FreshShelves books={latestBooks} />
      <CuratedShelves />
      <ReadersCorner />
      <ReadingJourney />
    </div>
  );
}
