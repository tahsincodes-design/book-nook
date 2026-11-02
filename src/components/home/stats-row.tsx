import { BookOpen, Library, Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";

type Stats = {
  booksInLibrary: number;
  currentlyBorrowed: number;
  booksContributed: number;
};

const items = [
  {
    key: "booksInLibrary" as const,
    label: "Books in library",
    icon: Library,
  },
  {
    key: "currentlyBorrowed" as const,
    label: "Currently borrowed",
    icon: BookOpen,
  },
  {
    key: "booksContributed" as const,
    label: "Books contributed",
    icon: Sparkles,
  },
];

export function StatsRow({ stats }: { stats: Stats }) {
  return (
    <section
      aria-label="Library statistics"
      className="grid gap-4 sm:grid-cols-3"
    >
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.key}
            className="flex-row items-center gap-4 rounded-2xl border-0 bg-card p-4 ring-1 ring-foreground/10"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-sage/20 text-brand-forest dark:bg-brand-sage/10 dark:text-brand-sage">
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-display text-3xl leading-none font-semibold tracking-tight text-foreground">
                {stats[item.key]}
              </p>
              <p className="mt-1.5 text-xs leading-snug text-muted-foreground">
                {item.label}
              </p>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
