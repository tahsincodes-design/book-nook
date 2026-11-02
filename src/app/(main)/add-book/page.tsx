import type { Metadata } from "next";
import { Plus } from "lucide-react";

import { ComingSoonPage } from "@/components/layout/coming-soon-page";

export const metadata: Metadata = {
  title: "Add a book",
};

export default function AddBookPage() {
  return (
    <ComingSoonPage
      eyebrow="Share a story"
      title="Add a book"
      description="Put a favourite book on the shelf for another reader to find."
      note="The add-book form, image upload, and authenticated submission will be connected to the API in the next build."
      icon={Plus}
    />
  );
}
