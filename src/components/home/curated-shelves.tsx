import Link from "next/link";
import {
  ArrowUpRight,
  Brain,
  FlaskConical,
  Landmark,
  Sparkles,
} from "lucide-react";
import { cn } from "cn";

const shelves = [
  {
    title: "Fiction & Stories",
    description: "Worlds beyond your own",
    icon: Sparkles,
    href: "/books?category=Fiction",
    className: "bg-[#6f8f79] dark:bg-[#2f4a3a]",
  },
  {
    title: "Mind & Growth",
    description: "A better you, one page at a time",
    icon: Brain,
    href: "/books?category=Personal%20Growth",
    className: "bg-[#b77a5f] dark:bg-[#4a2e25]",
  },
  {
    title: "History & Culture",
    description: "The past, explored",
    icon: Landmark,
    href: "/books?category=History",
    className: "bg-[#7c8a8c] dark:bg-[#2c393b]",
  },
  {
    title: "Science & Ideas",
    description: "The unknown, explained",
    icon: FlaskConical,
    href: "/books?category=Science",
    className: "bg-[#b39a5b] dark:bg-[#4a3d22]",
  },
];

export function CuratedShelves() {
  return (
    <section className="mt-12" aria-labelledby="curated-shelves-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id="curated-shelves-title"
            className="font-display text-3xl leading-tight font-semibold tracking-[-0.025em] text-foreground sm:text-[2.1rem]"
          >
            Curated shelves
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A little something for every kind of reader.
          </p>
        </div>

        <Link
          href="/books"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-brand-terracotta dark:hover:text-[#e0a48a]"
        >
          View all categories
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {shelves.map((shelf) => {
          const Icon = shelf.icon;

          return (
            <Link
              key={shelf.title}
              href={shelf.href}
              className={cn(
                "group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl p-5 text-brand-cream shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                shelf.className,
              )}
            >
              <span className="pointer-events-none absolute -top-10 -right-8 size-36 rounded-full border border-white/15" />
              <span className="pointer-events-none absolute top-14 -right-3 size-24 rounded-full border border-white/10" />

              <span className="relative flex size-10 items-center justify-center rounded-full bg-white/10 text-brand-cream ring-1 ring-white/15 backdrop-blur-sm">
                <Icon className="size-4" aria-hidden="true" />
              </span>

              <span className="relative">
                <span className="block font-display text-[1.55rem] leading-tight font-semibold tracking-[-0.02em]">
                  {shelf.title}
                </span>
                <span className="mt-1.5 block text-xs text-brand-cream/75">
                  {shelf.description}
                </span>
                <span className="mt-4 inline-flex items-center gap-1 text-[0.7rem] font-semibold tracking-wide uppercase">
                  Explore
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
