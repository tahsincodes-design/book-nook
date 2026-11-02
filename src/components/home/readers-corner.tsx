import { Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const notes = [
  {
    quote:
      "I found books here that I would never have picked up on my own. It feels like discovering a little hidden library.",
    name: "Nadia Rahman",
    role: "Curious reader",
    initials: "NR",
  },
  {
    quote:
      "The borrowing experience is refreshingly simple. I love that sharing a book is just as easy as finding one.",
    name: "Arif Hasan",
    role: "Community member",
    initials: "AH",
  },
  {
    quote:
      "A calm, welcoming corner of the internet. My reading list has grown, and so has my love for reading.",
    name: "Samira M.",
    role: "Book lover",
    initials: "SM",
  },
];

export function ReadersCorner() {
  return (
    <section className="mt-12" aria-labelledby="readers-corner-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id="readers-corner-title"
            className="font-display text-3xl leading-tight font-semibold tracking-[-0.025em] text-foreground sm:text-[2.1rem]"
          >
            Readers&apos; corner
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A few kind words from our reading community.
          </p>
        </div>

        <Badge
          variant="outline"
          className="border-0 bg-brand-sage/20 px-3 py-1 text-[0.62rem] font-semibold tracking-[0.16em] text-brand-forest uppercase dark:bg-brand-sage/10 dark:text-brand-sage"
        >
          Community notes
        </Badge>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {notes.map((note) => (
          <Card
            key={note.name}
            className="flex h-full flex-col justify-between rounded-2xl border-0 bg-card p-5 ring-1 ring-foreground/10"
          >
            <div>
              <div
                className="flex gap-0.5 text-brand-terracotta dark:text-[#e0a48a]"
                aria-label="5 out of 5 stars"
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="size-3.5 fill-current"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="mt-4 font-display text-[1.08rem] leading-snug text-foreground">
                &ldquo;{note.quote}&rdquo;
              </blockquote>
            </div>

            <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
              <Avatar size="sm">
                <AvatarFallback className="bg-[#e4d8c8] text-[0.62rem] font-semibold text-[#5a4939] dark:bg-[#3a2d25] dark:text-[#e8d6c4]">
                  {note.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {note.name}
                </p>
                <p className="text-[0.7rem] text-muted-foreground">
                  {note.role}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
