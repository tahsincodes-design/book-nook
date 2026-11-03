import { Suspense } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth-server";
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

export default async function HomePage() {
  let userEmail: string | undefined = undefined;

  // 1. Safely attempt to retrieve the server session
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    userEmail = session?.user?.email;
  } catch (error) {
    console.warn("[homepage] Could not fetch session:", error);
  }

  // 2. Fetch books (always public)
  const books = await getBooks();

  // 3. Conditionally fetch user borrows if logged in, safely catching errors
  let myBorrows: Awaited<ReturnType<typeof getMyBorrows>> = [];
  if (userEmail) {
    try {
      myBorrows = await getMyBorrows(userEmail);
    } catch (error) {
      console.warn("[homepage] Could not fetch user borrows:", error);
    }
  }

  const latestBooks = getLatestBooks(books, 6);
  const featuredBooks = latestBooks.slice(0, 3);

  // 4. Compute stats safely with optional chaining
  const stats = {
    booksInLibrary: books.length,
    currentlyBorrowed: myBorrows.length,
    booksContributed: userEmail
      ? books.filter((book) => book.addedBy?.email === userEmail).length
      : 0,
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
        <WelcomeMessage />
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