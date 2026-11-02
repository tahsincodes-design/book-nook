import type { Metadata } from "next";
import { Library } from "lucide-react";

import { ComingSoonPage } from "@/components/layout/coming-soon-page";

export const metadata: Metadata = {
  title: "My collection",
};

export default function MyBooksPage() {
  return (
    <ComingSoonPage
      eyebrow="My reading"
      title="My collection"
      description="The books you have added to the BookNook shelves."
      note="Editing and deleting your books will be connected to the authenticated API in the next build."
      icon={Library}
    />
  );
}
