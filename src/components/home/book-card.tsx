import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils"; // Fixed import path if cn is under @/lib/utils

import { BookCover } from "@/components/home/book-cover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Book } from "@/lib/types/book";

export function BookCard({
  book,
  priority = false,
}: {
  book: Book;
  priority?: boolean;
}) {
  const available = book.totalCopies > 0;
  const href = `/books/${book._id}`;

  return (
    <Card className="group/card h-full gap-0 overflow-hidden rounded-2xl border-0 bg-card p-0 shadow-[0_1px_0_rgba(29,42,35,0.03)] ring-1 ring-foreground/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_-28px_rgba(29,42,35,0.45)]">
      <div className="relative m-3 mb-0 aspect-[2/3] overflow-hidden rounded-xl bg-muted">
        <Link
          href={href}
          aria-label={`View details for ${book.title}`}
          className="absolute inset-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <BookCover
            src={book.image}
            title={book.title}
            author={book.author}
            className="absolute inset-0"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 45vw, 340px"
            priority={priority}
          />
        </Link>
        <Badge className="pointer-events-none absolute top-3 left-3 border-0 bg-white/90 text-[0.65rem] font-semibold tracking-wide text-brand-forest shadow-sm backdrop-blur-sm dark:bg-background/85 dark:text-foreground">
          {book.category}
        </Badge>
      </div>

      <CardContent className="flex flex-1 flex-col gap-1.5 px-4 pt-4">
        <h3 className="font-sans text-lg leading-tight font-bold tracking-[-0.02em] text-foreground">
          <Link
            href={href}
            className="transition-colors hover:text-brand-terracotta dark:hover:text-[#e0a48a]"
          >
            {book.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground">by {book.author}</p>
        <p
          className={cn(
            "mt-1 text-xs font-medium",
            available
              ? "text-muted-foreground"
              : "text-brand-terracotta dark:text-[#e0a48a]",
          )}
        >
          {available
            ? `${book.totalCopies} ${book.totalCopies === 1 ? "copy" : "copies"} available`
            : "Not available right now"}
        </p>
      </CardContent>

      <CardFooter className="mt-3 border-t border-border/60 bg-transparent px-4 py-3">
        <Button
          render={<Link href={href} />}
          nativeButton={false}
          variant="outline"
          className="w-full rounded-full group-hover/card:bg-primary group-hover/card:text-primary-foreground"
        >
          View Details
          <ArrowUpRight className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}