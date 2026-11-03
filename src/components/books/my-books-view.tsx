"use client";

import Link from "next/link";
import { Library, Plus, Sparkles } from "lucide-react";

import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { MyBookCard } from "@/components/books/my-book-card";
import { useDemoSession } from "@/components/providers/demo-session-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { demoUser } from "@/lib/demo/user";
import { filterOwnedBooks } from "@/lib/owned-books";
import type { Book } from "@/lib/types/book";

export function MyBooksView({ books }: { books: Book[] }) {
  const { user, isSignedIn } = useDemoSession();

  if (!isSignedIn) {
    return (
      <Card className="mt-7 flex flex-col items-center justify-center rounded-3xl border-0 bg-card px-6 py-14 text-center ring-1 ring-foreground/10">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-sage/20 text-brand-forest dark:bg-brand-sage/10 dark:text-brand-sage">
          <Library className="size-6" aria-hidden="true" />
        </div>
        <h2 className="mt-5 font-display text-2xl font-semibold">
          Sign in to see your collection
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          This is the demo session, so any name and email will open the shelf.
          No password is checked.
        </p>
        <SignInDialog className="mt-6 rounded-full" />
      </Card>
    );
  }

  const reader = user ?? demoUser;
  const myBooks = filterOwnedBooks(books, reader);
  const categories = new Set(myBooks.map((book) => book.category));
  const copies = myBooks.reduce((total, book) => total + book.totalCopies, 0);

  return (
    <>
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border-0 bg-card p-5 ring-1 ring-foreground/10">
          <p className="text-[0.62rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Books shared
          </p>
          <p className="mt-2 font-display text-3xl font-semibold">
            {myBooks.length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Stories waiting for another reader
          </p>
        </Card>

        <Card className="rounded-2xl border-0 bg-card p-5 ring-1 ring-foreground/10">
          <p className="text-[0.62rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Categories
          </p>
          <p className="mt-2 font-display text-3xl font-semibold">
            {categories.size}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Different corners of the shelf
          </p>
        </Card>

        <Card className="rounded-2xl border-0 bg-card p-5 ring-1 ring-foreground/10">
          <p className="text-[0.62rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Copies on the shelf
          </p>
          <p className="mt-2 font-display text-3xl font-semibold">{copies}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Ready to be borrowed
          </p>
        </Card>
      </div>

      {myBooks.length > 0 ? (
        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          {myBooks.map((book) => (
            <MyBookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="mt-7 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-sage/20 text-brand-forest dark:bg-brand-sage/10 dark:text-brand-sage">
            <Library className="size-6" aria-hidden="true" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-semibold">
            Your shelf is still empty
          </h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Add a book you love and it will show up here with update and delete
            controls.
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
      )}

      {myBooks.length > 0 && (
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
      )}
    </>
  );
}
