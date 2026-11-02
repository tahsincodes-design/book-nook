import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";

// The navbar reads the current pathname for active links. Until the auth and
// URL-dependent screens are split behind their own Suspense boundaries, let
// these routes block on the server instead of prerendering an empty shell.
export const instant = false;

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteNavbar />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
