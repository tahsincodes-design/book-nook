import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Discover",
    description: "Explore the library collection.",
  },
  {
    number: "02",
    title: "Borrow",
    description: "Borrow an available copy.",
  },
  {
    number: "03",
    title: "Return",
    description: "Bring it back for another reader.",
  },
];

export function ReadingJourney() {
  return (
    <section
      className="mt-12 grid gap-4 lg:grid-cols-[1.35fr_1fr]"
      aria-label="How BookNook works"
    >
      <Card className="rounded-3xl border-0 bg-[#e9e4d8] p-6 ring-0 sm:p-8 dark:bg-[#1e2c24]">
        <p className="text-[0.62rem] font-semibold tracking-[0.22em] text-brand-terracotta uppercase dark:text-[#e0a48a]">
          Simple as it should be
        </p>
        <h2 className="mt-3 font-display text-3xl leading-tight font-semibold tracking-[-0.025em] text-foreground sm:text-[2.1rem]">
          Good books. Better habits.
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Your next great read is just a few steps away. Find a book, borrow it,
          and enjoy the journey.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl bg-card p-4 ring-1 ring-foreground/5"
            >
              <span className="font-display text-2xl leading-none font-semibold text-brand-terracotta dark:text-[#e0a48a]">
                {step.number}
              </span>
              <h3 className="mt-3 text-sm font-bold text-foreground">
                {step.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex flex-col justify-between rounded-3xl border-0 bg-[#dde7df] p-6 ring-0 sm:p-8 dark:bg-[#1b3026]">
        <div>
          <p className="text-[0.62rem] font-semibold tracking-[0.22em] text-brand-forest/70 uppercase dark:text-brand-sage">
            Your next chapter
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight font-semibold tracking-[-0.025em] text-foreground sm:text-[2.1rem]">
            Make room for a new story.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Have a book worth sharing? Add it to the library and let another
            reader discover something wonderful.
          </p>
        </div>

        <Button
          render={<Link href="/add-book" />}
          nativeButton={false}
          className="mt-7 h-10 w-fit rounded-full bg-brand-forest px-5 text-brand-cream hover:bg-brand-forest/90 dark:bg-brand-sage dark:text-[#122018] dark:hover:bg-brand-sage/90"
        >
          Contribute a book
          <ArrowUpRight className="size-4" />
        </Button>
      </Card>
    </section>
  );
}
