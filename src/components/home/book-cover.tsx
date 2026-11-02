"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "cn";

type BookCoverProps = {
  src?: string;
  title: string;
  author?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function BookCover({
  src,
  title,
  author,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 320px",
  priority = false,
}: BookCoverProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;
  const unoptimized = src?.includes("covers.openlibrary.org") ?? false;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[#d9d0c0] dark:bg-[#26352d]",
        className,
      )}
    >
      {showImage ? (
        <Image
          src={src as string}
          alt={`${title} cover`}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={unoptimized}
          className="object-cover transition-transform duration-500 group-hover/card:scale-[1.035]"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex size-full flex-col justify-between bg-[linear-gradient(145deg,#2c5a47_0%,#1b3a2d_55%,#172f25_100%)] p-4 text-brand-cream">
          <span className="text-[0.48rem] font-semibold tracking-[0.22em] text-brand-sage uppercase">
            BookNook edition
          </span>
          <span className="font-display text-lg leading-[1.05] font-semibold tracking-tight">
            {title}
          </span>
          <span className="text-[0.58rem] tracking-wide text-brand-sage">
            {author ?? "A BookNook story"}
          </span>
        </div>
      )}
    </div>
  );
}
