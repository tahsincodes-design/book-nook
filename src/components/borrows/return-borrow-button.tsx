"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { returnBook } from "@/lib/actions/borrows";

export function ReturnBorrowButton({
  borrowId,
  title,
}: {
  borrowId: string;
  title: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  async function handleReturn() {
    setIsReturning(true);

    try {
      const result = await returnBook(borrowId);

      if (!result.ok) {
        toast.error("Could not return the book", {
          description: result.message,
        });
        return;
      }

      toast.success("Book returned", {
        description: result.message,
      });
      setOpen(false);
      router.refresh();
    } finally {
      setIsReturning(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button variant="outline" size="sm" className="rounded-full" />
        }
      >
        <RotateCcw className="size-3.5" aria-hidden="true" />
        Return
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-brand-sage/20 text-brand-forest dark:bg-brand-sage/10 dark:text-brand-sage">
            <RotateCcw aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle className="font-display text-lg">
            Return this book?
          </AlertDialogTitle>
          <AlertDialogDescription>
            &quot;{title}&quot; will go back on the shelf and another reader can
            borrow it.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isReturning}>
            Keep reading
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isReturning}
            onClick={handleReturn}
          >
            {isReturning ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <RotateCcw className="size-4" aria-hidden="true" />
            )}
            {isReturning ? "Returning..." : "Return book"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
