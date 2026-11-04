import { Suspense } from "react";
import { CuratedShelves } from "@/components/home/curated-shelves";
import { FreshShelves } from "@/components/home/fresh-shelves";
import { HeroSlider } from "@/components/home/hero-slider";
import { ReadersCorner } from "@/components/home/readers-corner";
import { ReadingJourney } from "@/components/home/reading-journey";
import { StatsRow } from "@/components/home/stats-row";
import { TodayLabel } from "@/components/home/today-label";
import { WelcomeMessage } from "@/components/home/welcome-message";
import { getBooks, getLatestBooks } from "@/lib/api/books";
import { getMyBorrows } from "@/lib/api/borrows";
import { getCurrentUser } from "@/lib/auth";
import {
  FeaturedBooksLoading,
  FreshBooksLoading,
  HomeStatsLoading,
  ReadersCornerLoading,
} from "@/components/loading/route-skeletons";

async function FeaturedBooks() {
  const books = await getBooks();
  const featuredBooks = getLatestBooks(books, 6).slice(0, 3);

  return <HeroSlider books={featuredBooks} />;
}

async function LatestArrivals() {
  const books = await getBooks();
  return <FreshShelves books={getLatestBooks(books, 6)} />;
}

async function PersonalizedStats() {
  const [books, user] = await Promise.all([getBooks(), getCurrentUser()]);
  const myBorrows = user ? await getMyBorrows(user.email) : [];

  const stats = {
    booksInLibrary: books.length,
    currentlyBorrowed: myBorrows.length,
    booksContributed: user
      ? books.filter(
          (book) =>
            book.addedBy?.email.trim().toLowerCase() ===
            user.email.trim().toLowerCase(),
        ).length
      : 0,
  };

  return <StatsRow stats={stats} />;
}

export default function HomePage() {
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
        <Suspense
          fallback={
            <span className="hidden h-4 w-40 animate-pulse rounded bg-muted sm:block" />
          }
        >
          <WelcomeMessage />
        </Suspense>
      </div>

      <Suspense fallback={<FeaturedBooksLoading />}>
        <FeaturedBooks />
      </Suspense>

      <div className="mt-5">
        <Suspense fallback={<HomeStatsLoading />}>
          <PersonalizedStats />
        </Suspense>
      </div>

      <Suspense fallback={<FreshBooksLoading />}>
        <LatestArrivals />
      </Suspense>
      <CuratedShelves />
      <Suspense fallback={<ReadersCornerLoading />}>
        <ReadersCorner />
      </Suspense>
      <ReadingJourney />
    </div>
  );
}