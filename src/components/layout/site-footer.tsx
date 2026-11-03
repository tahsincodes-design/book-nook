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
    <footer className="relative mt-20 border-t border-border/80 bg-gradient-to-b from-card/30 to-card/80 backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">

          {/* Brand & Bio Column */}
          <div className="space-y-4">
            <Link
              href="/"
              aria-label="BookNook home"
              className="inline-block rounded-xl transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <BookNookLogo />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              A small online library for discovering, borrowing, and sharing
              books. Add a book, borrow a book, return a book — and leave a
              little room for stories.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="flex size-10 items-center justify-center rounded-full bg-muted/80 text-foreground transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none shadow-sm"
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

          {/* Explore Links Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-brand-terracotta dark:text-[#e0a48a]">
              Explore
            </h3>
            <ul className="mt-4 space-y-3">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground inline-block hover:translate-x-1 duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-brand-terracotta dark:text-[#e0a48a]">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-3 group">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:text-primary transition-colors">
                  <Mail className="size-4" aria-hidden="true" />
                </span>
                <a
                  href="mailto:hello@booknook.app"
                  className="transition-colors hover:text-foreground font-medium"
                >
                  hello@booknook.app
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:text-primary transition-colors">
                  <Phone className="size-4" aria-hidden="true" />
                </span>
                <a
                  href="tel:+8801700000000"
                  className="transition-colors hover:text-foreground font-medium"
                >
                  +880 1700 000000
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:text-primary transition-colors">
                  <MapPin className="size-4" aria-hidden="true" />
                </span>
                <span className="font-medium text-muted-foreground">Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p className="font-semibold tracking-[0.18em] uppercase">
            BookNook &copy; 2026. All rights reserved.
          </p>
          <p className="font-medium text-muted-foreground/80">Made with passion for the love of reading.</p>
        </div>
      </div>
    </footer>
  );
}