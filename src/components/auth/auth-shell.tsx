import type { ReactNode } from "react";
import { BookOpen, Library, Sparkles } from "lucide-react";

import { BookNookLogo } from "@/components/brand/booknook-logo";

const highlights = [
  {
    icon: BookOpen,
    title: "Borrow in two clicks",
    description: "Every loan is two weeks, with the due date in plain sight.",
  },
  {
    icon: Library,
    title: "Your own shelf",
    description: "Share books you love and manage them from My Books.",
  },
  {
    icon: Sparkles,
    title: "No clutter",
    description: "A calm reading room, not another social feed.",
  },
];

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8 lg:py-16">
      <aside className="relative hidden overflow-hidden rounded-[2rem] bg-brand-forest p-10 text-brand-cream shadow-[0_30px_80px_-40px_rgba(36,77,62,0.8)] lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-20 size-64 rounded-full bg-brand-sage/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-28 -left-16 size-72 rounded-full bg-brand-terracotta/20 blur-3xl"
        />

        <div className="relative">
          <BookNookLogo
            showTagline
            className="[&>span>span]:text-brand-cream [&>span>span+span]:text-brand-cream/60"
          />
        </div>

        <div className="relative mt-16">
          <p className="text-[0.65rem] font-semibold tracking-[0.24em] text-brand-sage uppercase">
            Your reading room
          </p>
          <h2 className="mt-4 max-w-md font-display text-4xl leading-[1.05] font-semibold tracking-[-0.03em]">
            A quiet corner for every story you love.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-cream/75">
            Borrow from the shelf, share the books that stayed with you, and
            keep every due date in one place.
          </p>

          <div className="mt-8 grid gap-4">
            {highlights.map((highlight) => {
              const Icon = highlight.icon;

              return (
                <div key={highlight.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-cream/10 text-brand-sage">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{highlight.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-brand-cream/65">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="relative mt-16 text-xs text-brand-cream/55">
          BookNook · A little space for big stories
        </p>
      </aside>

      <div className="w-full">{children}</div>
    </div>
  );
}
