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

async function PersonalizedStats({
  books,
}: {
  books: Awaited<ReturnType<typeof getBooks>>;
}) {
  const user = await getCurrentUser();
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

export default async function HomePage() {
  const books = await getBooks();
  const latestBooks = getLatestBooks(books, 6);
  const featuredBooks = latestBooks.slice(0, 3);

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
        <WelcomeMessage />
      </div>

      <HeroSlider books={featuredBooks} />

      <div className="mt-5">
        <Suspense
          fallback={
            <StatsRow
              stats={{
                booksInLibrary: books.length,
                currentlyBorrowed: 0,
                booksContributed: 0,
              }}
            />
          }
        >
          <PersonalizedStats books={books} />
        </Suspense>
      </div>

      <FreshShelves books={latestBooks} />
      <CuratedShelves />
      <Suspense
        fallback={
          <div
            className="mt-12 h-56 animate-pulse rounded-3xl bg-muted/50"
            aria-hidden="true"
          />
        }
      >
        <ReadersCorner />
      </Suspense>
      <ReadingJourney />
    </div>
  );
}