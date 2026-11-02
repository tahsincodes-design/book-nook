"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function BorrowButton({ available }: { available: boolean }) {
  return (
    <Button
      disabled={!available}
      onClick={() =>
        toast.info("Borrowing is coming soon.", {
          description:
            "The catalogue is connected to the BookNook API. Borrowing is the next step.",
        })
      }
      className="h-10 rounded-full px-5"
    >
      {available ? "Borrow This Book" : "Not Available"}
    </Button>
  );
}
