import { Skeleton } from "@/components/ui/skeleton";

function LoadingFrame({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true">{children}</div>
    </div>
  );
}

function PageHeadingSkeleton({ action = false }: { action?: boolean }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-5">
      <div className="space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-56 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      {action ? <Skeleton className="h-10 w-36 rounded-full" /> : null}
    </div>
  );
}

function BookTileSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-card p-3 ring-1 ring-foreground/10">
      <Skeleton className="aspect-[2/3] rounded-xl" />
      <div className="space-y-2 px-1 pt-4 pb-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-4 h-9 w-full rounded-full" />
      </div>
    </div>
  );
}

export function HomeLoading() {
  return (
    <LoadingFrame label="Loading the library home page">
      <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="hidden h-4 w-40 sm:block" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Skeleton className="min-h-72 rounded-3xl" />
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[0, 1, 2].map((item) => (
              <Skeleton key={item} className="h-20 rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <BookTileSkeleton key={item} />
          ))}
        </div>
      </div>
    </LoadingFrame>
  );
}

export function FeaturedBooksLoading() {
  return (
    <LoadingFrame label="Loading featured books">
      <div className="grid min-h-[470px] gap-6 rounded-[2rem] bg-hero p-6 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-12">
        <div className="space-y-5">
          <Skeleton className="h-3 w-36 bg-white/15" />
          <Skeleton className="h-12 w-full max-w-md bg-white/15" />
          <Skeleton className="h-12 w-4/5 max-w-sm bg-white/15" />
          <Skeleton className="h-4 w-full max-w-md bg-white/15" />
          <Skeleton className="h-10 w-36 rounded-full bg-white/15" />
        </div>
        <div className="hidden items-end justify-center gap-3 lg:flex">
          <Skeleton className="h-64 w-40 rotate-[-8deg] rounded-2xl bg-white/15" />
          <Skeleton className="h-80 w-52 rounded-2xl bg-white/15" />
          <Skeleton className="h-64 w-40 rotate-[8deg] rounded-2xl bg-white/15" />
        </div>
      </div>
    </LoadingFrame>
  );
}

export function HomeStatsLoading() {
  return (
    <LoadingFrame label="Loading your library statistics">
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="flex items-center gap-4 rounded-2xl bg-card p-4 ring-1 ring-foreground/10"
          >
            <Skeleton className="size-12 shrink-0 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}
      </div>
    </LoadingFrame>
  );
}

export function FreshBooksLoading() {
  return (
    <LoadingFrame label="Loading new arrivals">
      <section className="mt-12">
        <div className="space-y-3">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <BookTileSkeleton key={item} />
          ))}
        </div>
      </section>
    </LoadingFrame>
  );
}

export function ReadersCornerLoading() {
  return (
    <LoadingFrame label="Loading reader comments">
      <section className="mt-12 rounded-3xl bg-card p-6 ring-1 ring-foreground/10 sm:p-8">
        <div className="space-y-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-9 w-64 max-w-full" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[0, 1].map((item) => (
            <div
              key={item}
              className="space-y-3 rounded-2xl bg-muted/40 p-5"
            >
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
      </section>
    </LoadingFrame>
  );
}

export function BooksLoading() {
  return (
    <LoadingFrame label="Loading books">
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8">
        <PageHeadingSkeleton />
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <BookTileSkeleton key={item} />
          ))}
        </div>
      </div>
    </LoadingFrame>
  );
}

export function BookDetailLoading() {
  return (
    <LoadingFrame label="Loading book details">
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-12 sm:px-6 lg:px-8">
        <Skeleton className="h-4 w-28 rounded-full" />
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-12">
          <Skeleton className="mx-auto aspect-[2/3] w-full max-w-[300px] rounded-3xl lg:max-w-none" />
          <div className="space-y-6 py-2">
            <div className="space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-10 w-3/4 max-w-full" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-11 w-44 rounded-full" />
            <div className="grid gap-5 border-t border-border/60 pt-6 sm:grid-cols-2">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="flex gap-3">
                  <Skeleton className="size-9 shrink-0 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LoadingFrame>
  );
}

export function MyBooksLoading() {
  return (
    <LoadingFrame label="Loading your collection">
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8">
        <PageHeadingSkeleton action />
        <div className="mt-7 grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)] xl:gap-8">
          <div className="space-y-5 rounded-3xl bg-brand-forest p-5 sm:p-6">
            <Skeleton className="h-3 w-24 bg-white/15" />
            <Skeleton className="h-7 w-36 bg-white/15" />
            <Skeleton className="h-4 w-full bg-white/15" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3 w-28 bg-white/15" />
              <Skeleton className="h-11 w-full rounded-xl bg-white/15" />
            </div>
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3 w-24 bg-white/15" />
              {[0, 1, 2].map((item) => (
                <Skeleton
                  key={item}
                  className="h-10 w-full rounded-xl bg-white/15"
                />
              ))}
            </div>
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3 w-20 bg-white/15" />
              {[0, 1, 2].map((item) => (
                <Skeleton
                  key={item}
                  className="h-9 w-full rounded-xl bg-white/15"
                />
              ))}
            </div>
            <Skeleton className="h-9 w-28 rounded-full bg-white/15" />
          </div>
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <Skeleton key={item} className="h-32 rounded-2xl" />
              ))}
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {[0, 1].map((item) => (
                <Skeleton key={item} className="h-64 rounded-3xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </LoadingFrame>
  );
}

export function MyBorrowsLoading() {
  return (
    <LoadingFrame label="Loading your borrowed books">
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8">
        <PageHeadingSkeleton action />
        <div className="mt-7 grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)] xl:gap-8">
          <div className="space-y-5 rounded-3xl bg-brand-forest p-5 sm:p-6">
            <Skeleton className="h-3 w-24 bg-white/15" />
            <Skeleton className="h-7 w-32 bg-white/15" />
            <Skeleton className="h-4 w-full bg-white/15" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3 w-28 bg-white/15" />
              <Skeleton className="h-11 w-full rounded-xl bg-white/15" />
            </div>
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3 w-24 bg-white/15" />
              {[0, 1, 2, 3].map((item) => (
                <Skeleton
                  key={item}
                  className="h-10 w-full rounded-xl bg-white/15"
                />
              ))}
            </div>
            <Skeleton className="h-9 w-32 rounded-full bg-white/15" />
          </div>
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <Skeleton key={item} className="h-32 rounded-2xl" />
              ))}
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {[0, 1].map((item) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-3xl bg-card p-5 ring-1 ring-foreground/10"
                >
                  <Skeleton className="aspect-[2/3] w-24 shrink-0 rounded-xl" />
                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div className="space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <Skeleton className="h-9 w-28 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LoadingFrame>
  );
}

export function ProfileLoading() {
  return (
    <LoadingFrame label="Loading your profile">
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8">
        <PageHeadingSkeleton action />
        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(260px,0.7fr)_minmax(0,1.3fr)]">
          <div className="space-y-5 rounded-3xl bg-card p-6 ring-1 ring-foreground/10">
            <Skeleton className="size-20 rounded-full" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
          <div className="space-y-6 rounded-3xl bg-card p-6 ring-1 ring-foreground/10">
            <Skeleton className="h-10 w-56 rounded-full" />
            <div className="grid gap-5 sm:grid-cols-2">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>
      </div>
    </LoadingFrame>
  );
}

export function AddBookLoading() {
  return (
    <LoadingFrame label="Loading the add book form">
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8">
        <PageHeadingSkeleton action />
        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-6 rounded-3xl bg-card p-6 ring-1 ring-foreground/10 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              ))}
            </div>
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-11 w-36 rounded-full" />
          </div>
          <div className="space-y-4 rounded-3xl bg-card p-5 ring-1 ring-foreground/10">
            <Skeleton className="aspect-[2/3] rounded-2xl" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    </LoadingFrame>
  );
}

export function AuthLoading({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";

  return (
    <LoadingFrame
      label={isRegister ? "Loading account registration" : "Loading sign in"}
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8 lg:py-16">
        <Skeleton className="hidden min-h-[520px] rounded-[2rem] lg:block" />
        <div className="mx-auto w-full max-w-lg space-y-6 rounded-3xl bg-card p-6 ring-1 ring-foreground/10 sm:p-9">
          <Skeleton className="h-10 w-36" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </div>
          {isRegister ? <Skeleton className="h-11 w-full rounded-xl" /> : null}
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-full" />
          <Skeleton className="mx-auto h-4 w-2/3" />
        </div>
      </div>
    </LoadingFrame>
  );
}
