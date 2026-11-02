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

// Hosts configured in next.config.ts. Anything else is rendered with a plain
// img so readers can paste covers from other hosts without breaking the page.
const OPTIMIZED_HOSTS = new Set([
  "covers.openlibrary.org",
  "i.ibb.co",
  "i.postimg.cc",
  "images.unsplash.com",
]);

function canUseNextImage(src: string) {
  if (src.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(src);
    return url.protocol === "https:" && OPTIMIZED_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

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
  const useNextImage = showImage && canUseNextImage(src as string);
  // Open Library redirects to archive.org, which can time out inside the
  // server-side image optimizer. Load those directly; uploaded covers still
  // go through next/image for resizing.
  const unoptimized = src?.includes("covers.openlibrary.org") ?? false;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[#d9d0c0] dark:bg-[#26352d]",
        className,
      )}
    >
      {showImage ? (
        useNextImage ? (
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
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src as string}
            alt={`${title} cover`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover/card:scale-[1.035]"
            onError={() => setFailed(true)}
          />
        )
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
