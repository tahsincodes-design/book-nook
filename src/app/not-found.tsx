import type { Metadata } from "next";
import { Suspense } from "react";

import { NotFoundContent } from "@/components/layout/not-found-content";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { getCurrentUser } from "@/lib/auth";
import { getNavCounts } from "@/lib/nav-counts";

export const metadata: Metadata = {
  title: "Page not found",
};

async function NavbarWithSession() {
  const user = await getCurrentUser();
  const counts = await getNavCounts(user);

  return <SiteNavbar user={user} counts={counts} />;
}

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col">
      <Suspense
        fallback={
          <div className="h-16 animate-pulse border-b border-border/60" />
        }
      >
        <NavbarWithSession />
      </Suspense>
      <main className="flex flex-1">
        <NotFoundContent />
      </main>
      <SiteFooter />
    </div>
  );
}
