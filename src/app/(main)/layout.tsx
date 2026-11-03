import { Suspense, type ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { getCurrentUser } from "@/lib/auth";
import { getNavCounts } from "@/lib/nav-counts";

// The navbar reads the current pathname for active links. Until the auth and
// URL-dependent screens are split behind their own Suspense boundaries, let
// these routes block on the server instead of prerendering an empty shell.
export const instant = false;

async function NavbarWithSession() {
  const user = await getCurrentUser();
  const counts = await getNavCounts(user);

  return <SiteNavbar user={user} counts={counts} />;
}

function NavbarFallback() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-36 animate-pulse rounded-lg bg-muted" />
      </div>
    </header>
  );
}

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <Suspense fallback={<NavbarFallback />}>
        <NavbarWithSession />
      </Suspense>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
