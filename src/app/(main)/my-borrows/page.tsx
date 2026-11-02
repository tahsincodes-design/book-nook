import type { Metadata } from "next";
import { BookOpen } from "lucide-react";

import { ComingSoonPage } from "@/components/layout/coming-soon-page";

export const metadata: Metadata = {
  title: "Borrowed books",
};

export default function MyBorrowsPage() {
  return (
    <ComingSoonPage
      eyebrow="My reading"
      title="Borrowed books"
      description="Everything you are reading right now, in one quiet corner."
      note="Borrow and return actions will be connected to the authenticated API, including copy tracking and double-borrow checks."
      icon={BookOpen}
    />
  );
}
