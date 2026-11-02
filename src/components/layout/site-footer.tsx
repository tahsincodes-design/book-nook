import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { BookNookLogo } from "@/components/brand/booknook-logo";
import { primaryNav } from "@/lib/constants/navigation";

const socials = [
  {
    label: "BookNook on X",
    href: "https://x.com",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "BookNook on Facebook",
    href: "https://facebook.com",
    path: "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z",
  },
  {
    label: "BookNook on Instagram",
    href: "https://instagram.com",
    path: "M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm0 7.4a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8Zm5.8-7.6a1.05 1.05 0 1 1-2.1 0 1.05 1.05 0 0 1 2.1 0ZM7.4 3.2h9.2a4.2 4.2 0 0 1 4.2 4.2v9.2a4.2 4.2 0 0 1-4.2 4.2H7.4a4.2 4.2 0 0 1-4.2-4.2V7.4a4.2 4.2 0 0 1 4.2-4.2Zm0 1.7a2.5 2.5 0 0 0-2.5 2.5v9.2a2.5 2.5 0 0 0 2.5 2.5h9.2a2.5 2.5 0 0 0 2.5-2.5V7.4a2.5 2.5 0 0 0-2.5-2.5H7.4Z",
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/70 bg-card/50">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              aria-label="BookNook home"
              className="w-fit rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <BookNookLogo />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A small online library for discovering, borrowing, and sharing
              books. Add a book, borrow a book, return a book — and leave a
              little room for stories.
            </p>

            <div className="mt-5 flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="size-4 fill-current"
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[0.62rem] font-semibold tracking-[0.22em] text-brand-terracotta uppercase dark:text-[#e0a48a]">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[0.62rem] font-semibold tracking-[0.22em] text-brand-terracotta uppercase dark:text-[#e0a48a]">
              Contact
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <a
                  href="mailto:hello@booknook.app"
                  className="transition-colors hover:text-foreground"
                >
                  hello@booknook.app
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <a
                  href="tel:+8801700000000"
                  className="transition-colors hover:text-foreground"
                >
                  +880 1700 000000
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border/70 pt-6 text-[0.7rem] tracking-wide text-muted-foreground sm:flex-row">
          <p className="font-semibold tracking-[0.16em] uppercase">
            BookNook &copy; 2026. All rights reserved.
          </p>
          <p>Made for the love of reading.</p>
        </div>
      </div>
    </footer>
  );
}
