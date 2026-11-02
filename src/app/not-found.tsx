import type { Metadata } from "next";
import { Suspense } from "react";

import { NotFoundContent } from "@/components/layout/not-found-content";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col">
      <Suspense fallback={<div className="h-16 border-b border-border/60" />}>
        <SiteNavbar />
      </Suspense>
      <main className="flex flex-1">
        <NotFoundContent />
      </main>
      <SiteFooter />
    </div>
  );
}
