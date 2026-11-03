import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Compass } from "lucide-react";

import { MyBorrowsView } from "@/components/borrows/my-borrows-view";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { getBooks } from "@/lib/api/books";
import { getMyBorrows } from "@/lib/api/borrows";
import { getNow } from "@/lib/api/clock";
import { requireUser } from "@/lib/auth";

export const instant = false;

export const metadata: Metadata = {
  title: "Borrowed books",
  description: "The books you are reading right now, with due dates.",
};

export default async function MyBorrowsPage() {
  const user = await requireUser("/my-borrows");
  const [borrows, books, now] = await Promise.all([
    getMyBorrows(user.email),
    getBooks(),
    getNow(),
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-5 flex items-center gap-2 text-xs text-muted-foreground"
      >
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <span className="font-medium text-foreground" aria-current="page">
          My borrows
        </span>
      </nav>

      <PageHeader
        eyebrow="My reading"
        title="Borrowed books"
        description="Everything you are reading right now, with due dates and a one-click return."
        action={
          <Button
            render={<Link href="/books" />}
            nativeButton={false}
            variant="outline"
            className="rounded-full"
          >
            <Compass className="size-4" />
            Browse library
          </Button>
        }
      />

      <MyBorrowsView borrows={borrows} books={books} now={now} />
    </div>
  );
}
