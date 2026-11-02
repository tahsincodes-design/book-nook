import { cn } from "cn";

type BookNookLogoProps = {
  className?: string;
  compact?: boolean;
  showTagline?: boolean;
};

export function BookNookLogo({
  className,
  compact = false,
  showTagline = false,
}: BookNookLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <svg
        viewBox="0 0 96 96"
        aria-hidden="true"
        className="size-10 shrink-0 drop-shadow-[0_2px_5px_rgba(36,77,62,0.18)]"
      >
        <rect width="96" height="96" rx="25" fill="#244D3E" />
        <path
          d="M18 29.5c13-5.4 24.9-3.9 30 2.6v40.8c-7.2-6.7-18.8-8.5-30-3.2V29.5Z"
          fill="#F7F6F1"
        />
        <path
          d="M78 29.5c-13-5.4-24.9-3.9-30 2.6v40.8c7.2-6.7 18.8-8.5 30-3.2V29.5Z"
          fill="#E8EEE8"
        />
        <path
          d="M48 32v42.5"
          fill="none"
          stroke="#244D3E"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M66 14h13v25l-6.5-5.2L66 39V14Z"
          fill="#BD7357"
        />
        <path
          d="M25 42c7-2.1 13.1-1.4 17 1.2M25 51c7-2.1 13.1-1.4 17 1.2M71 42c-7-2.1-13.1-1.4-17 1.2M71 51c-7-2.1-13.1-1.4-17 1.2"
          fill="none"
          stroke="#A6B7A9"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {!compact && (
        <span className="flex min-w-0 flex-col">
          <span className="font-sans text-[1.35rem] leading-none font-bold tracking-[-0.045em] text-foreground">
            Book<span className="text-brand-terracotta">Nook</span>
            <span>.</span>
          </span>
          {showTagline && (
            <span className="mt-1.5 text-[0.52rem] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
              A little space for big stories
            </span>
          )}
        </span>
      )}

      {compact && <span className="sr-only">BookNook</span>}
    </span>
  );
}
