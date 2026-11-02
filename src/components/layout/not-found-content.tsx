import Link from "next/link";
import { BookDashed } from "lucide-react";

import { Button } from "@/components/ui/button";

export function NotFoundContent() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-sage/20 text-brand-forest dark:bg-brand-sage/10 dark:text-brand-sage">
          <BookDashed className="size-6" aria-hidden="true" />
        </div>
        <p className="mt-6 font-display text-[5.5rem] leading-none font-semibold tracking-[-0.04em] text-brand-sage/70 dark:text-brand-sage/40">
          404
        </p>
        <h1 className="mt-2 font-display text-3xl leading-tight font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
          This page is off the shelf
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The page you are looking for may have been moved, borrowed, or never
          existed. Let&apos;s get you back to the library.
        </p>

        <Button
          render={<Link href="/" />}
          nativeButton={false}
          className="mt-6 h-10 rounded-full px-5"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
