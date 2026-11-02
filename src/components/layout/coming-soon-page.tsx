import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ComingSoonPage({
  eyebrow,
  title,
  description,
  note,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  note: string;
  icon: LucideIcon;
}) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      <Card className="mt-8 flex flex-col items-center justify-center rounded-3xl border-0 bg-card px-6 py-16 text-center ring-1 ring-foreground/10">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-sage/20 text-brand-forest dark:bg-brand-sage/10 dark:text-brand-sage">
          <Icon className="size-6" aria-hidden="true" />
        </div>
        <h2 className="mt-5 font-display text-2xl font-semibold text-foreground">
          This room is being prepared
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {note}
        </p>
        <Button
          render={<Link href="/" />}
          nativeButton={false}
          variant="outline"
          className="mt-6 rounded-full"
        >
          <ArrowLeft className="size-4" />
          Back to overview
        </Button>
      </Card>
    </div>
  );
}
