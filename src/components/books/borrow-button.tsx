"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function BorrowButton({ available }: { available: boolean }) {
  return (
    <Button
      disabled={!available}
      onClick={() =>
        toast.info("Borrowing will be connected to the API next.", {
          description:
            "The catalogue is live from http://localhost:5000. Borrowing is the next step.",
        })
      }
      className="h-10 rounded-full px-5"
    >
      {available ? "Borrow This Book" : "Not Available"}
    </Button>
  );
}
