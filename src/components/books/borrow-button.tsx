"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { borrowBook } from "@/lib/actions/borrows";

export function BorrowButton({
  bookId,
  available,
  alreadyBorrowed = false,
}: {
  bookId: string;
  available: boolean;
  alreadyBorrowed?: boolean;
}) {
  const router = useRouter();
  const [isBorrowing, setIsBorrowing] = useState(false);

  async function handleBorrow() {
    setIsBorrowing(true);

    try {
      const result = await borrowBook(bookId);

      if (!result.ok) {
        toast.error("Could not borrow this book", {
          description: result.message,
        });
        return;
      }

      toast.success("Borrowed successfully", {
        description: result.message,
      });
      router.refresh();
    } finally {
      setIsBorrowing(false);
    }
  }

  if (alreadyBorrowed) {
    return (
      <Button
        type="button"
        variant="outline"
        disabled
        className="h-10 rounded-full px-5"
      >
        <CheckCircle2 className="size-4" aria-hidden="true" />
        Already borrowed
      </Button>
    );
  }

  return (
    <Button
      type="button"
      disabled={!available || isBorrowing}
      onClick={handleBorrow}
      className="h-10 rounded-full px-5"
    >
      {isBorrowing ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <BookOpen className="size-4" aria-hidden="true" />
      )}
      {isBorrowing
        ? "Borrowing..."
        : available
          ? "Borrow This Book"
          : "Not Available"}
    </Button>
  );
}
