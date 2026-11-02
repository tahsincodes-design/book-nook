"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";

import { BookCover } from "@/components/home/book-cover";
import { Button } from "@/components/ui/button";
import type { Book } from "@/lib/types/book";

const slides = [
  {
    eyebrow: "A world of stories awaits",
    title: "A little space for big stories.",
    description:
      "Discover your next favourite book, build a collection, and let every page take you somewhere new.",
    cta: "Browse Books",
    href: "/books",
    theme: {
      background:
        "linear-gradient(135deg, #1f4434 0%, #17372a 55%, #122a20 100%)",
      accent: "#b6c8b8",
      glow: "radial-gradient(circle at 82% 18%, rgba(189,115,87,0.28), transparent 44%), radial-gradient(circle at 10% 92%, rgba(166,183,169,0.22), transparent 46%)",
    },
  },
  {
    eyebrow: "Curated for curious minds",
    title: "Find a shelf that feels like home.",
    description:
      "From timeless fiction to bold new ideas, there is always another world waiting to be opened.",
    cta: "Browse Books",
    href: "/books",
    theme: {
      background:
        "linear-gradient(135deg, #5e3527 0%, #4a2a1f 55%, #372018 100%)",
      accent: "#e7bda9",
      glow: "radial-gradient(circle at 80% 16%, rgba(227,180,156,0.26), transparent 46%), radial-gradient(circle at 8% 94%, rgba(189,115,87,0.3), transparent 48%)",
    },
  },
  {
    eyebrow: "Read. Borrow. Return.",
    title: "Your next chapter starts here.",
    description:
      "Borrow a book in seconds, keep track of your reading, and share the stories that stay with you.",
    cta: "Browse Books",
    href: "/books",
    theme: {
      background:
        "linear-gradient(135deg, #2c3c3e 0%, #223032 55%, #182325 100%)",
      accent: "#b6c8c4",
      glow: "radial-gradient(circle at 84% 20%, rgba(166,183,169,0.26), transparent 46%), radial-gradient(circle at 12% 90%, rgba(179,154,91,0.24), transparent 48%)",
    },
  },
];

export function HeroSlider({ books }: { books: Book[] }) {
  const swiperRef = useRef<SwiperClass | null>(null);
  const pausedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);

    query.addEventListener("change", update);
    const timer = window.setTimeout(update, 0);
    return () => {
      window.clearTimeout(timer);
      query.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      if (!pausedRef.current) {
        swiperRef.current?.slideNext();
      }
    }, 6500);

    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <section
      aria-label="Featured books"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      className="relative overflow-hidden rounded-[2rem] bg-hero text-hero-foreground shadow-[0_24px_70px_-38px_rgba(31,68,52,0.8)]"
    >
      <Swiper
        modules={[Keyboard]}
        slidesPerView={1}
        loop={slides.length > 1}
        speed={700}
        keyboard={{ enabled: true }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.title} className="h-auto">
            <div
              className="relative grid min-h-[470px] items-center gap-4 px-5 pt-8 pb-24 sm:min-h-[440px] sm:px-8 sm:pt-10 sm:pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-12 lg:pt-10 lg:pb-14"
              style={{ backgroundImage: slide.theme.background }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ backgroundImage: slide.theme.glow }}
              />

              <div className="relative z-10 max-w-xl">
                <p
                  className="text-[0.6rem] font-semibold tracking-[0.24em] uppercase"
                  style={{ color: slide.theme.accent }}
                >
                  {slide.eyebrow}
                </p>
                <h2 className="mt-3 font-display text-[2.55rem] leading-[0.98] font-semibold tracking-[-0.04em] text-balance sm:text-5xl lg:text-[3.65rem]">
                  {slide.title}
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-hero-foreground/75 sm:text-[0.95rem]">
                  {slide.description}
                </p>

                <Button
                  render={<Link href={slide.href} />}
                  nativeButton={false}
                  size="lg"
                  className="mt-6 h-10 rounded-full bg-brand-cream px-5 text-sm font-semibold text-brand-forest shadow-sm hover:bg-brand-cream/90"
                >
                  {slide.cta}
                  <ArrowUpRight className="size-4" />
                </Button>
              </div>

              <HeroCovers books={books} offset={index} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute right-5 bottom-5 z-20 flex items-center gap-2.5 rounded-full border border-white/10 bg-black/10 px-2.5 py-2 backdrop-blur-sm sm:right-7 sm:bottom-6">
        <button
          type="button"
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="Previous featured book"
          className="flex size-8 items-center justify-center rounded-full border border-white/15 text-hero-foreground transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-brand-cream focus-visible:outline-none"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div className="flex items-center gap-1.5 px-1">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => swiperRef.current?.slideToLoop(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={activeIndex === index ? "true" : undefined}
              className={`h-1.5 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-brand-cream focus-visible:outline-none ${
                activeIndex === index
                  ? "w-6 bg-brand-cream"
                  : "w-1.5 bg-brand-cream/35 hover:bg-brand-cream/65"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="Next featured book"
          className="flex size-8 items-center justify-center rounded-full border border-white/15 text-hero-foreground transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-brand-cream focus-visible:outline-none"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </section>
  );
}

function HeroCovers({ books, offset }: { books: Book[]; offset: number }) {
  if (books.length === 0) {
    return null;
  }

  const covers = Array.from(
    { length: Math.min(3, books.length) },
    (_, index) => books[(offset + index) % books.length],
  );

  const positions =
    covers.length === 1
      ? ["left-1/2 top-1/2 w-[52%] -translate-x-1/2 -translate-y-1/2"]
      : covers.length === 2
        ? [
            "left-[8%] top-[16%] w-[42%] -rotate-6",
            "right-[8%] top-[10%] w-[42%] rotate-6",
          ]
        : [
            "left-[0%] top-[14%] w-[37%] -rotate-6",
            "left-[32.5%] top-[1%] z-10 w-[35%] rotate-1",
            "right-[0%] top-[16%] w-[37%] rotate-6",
          ];

  return (
    <div className="relative mx-auto h-[230px] w-full max-w-[390px] sm:h-[270px] lg:h-[330px] lg:max-w-[430px]">
      <div className="pointer-events-none absolute inset-x-12 bottom-2 h-10 rounded-[50%] bg-black/25 blur-2xl" />

      {covers.map((book, index) => (
        <div
          key={`${book._id}-${index}`}
          className={`absolute overflow-hidden rounded-xl bg-white/5 shadow-[0_20px_35px_-16px_rgba(0,0,0,0.65)] ring-1 ring-white/15 transition-transform duration-500 ${positions[index]}`}
        >
          <BookCover
            src={book.image}
            title={book.title}
            author={book.author}
            className="aspect-[2/3] w-full"
            sizes="(max-width: 640px) 38vw, (max-width: 1024px) 30vw, 180px"
            priority={offset === 0}
          />
        </div>
      ))}
    </div>
  );
}
