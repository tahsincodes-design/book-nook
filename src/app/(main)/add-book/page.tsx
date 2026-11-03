import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AddBookForm } from "@/components/books/add-book-form";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Add a book",
  description: "Put a favourite book on the BookNook shelf for another reader.",
};

export default async function AddBookPage() {
  // Private route: the add form is only available to a signed-in reader.
  const user = await requireUser("/add-book");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Share a story"
        title="Add a book"
        description="Put a favourite book on the shelf for another reader to find. It takes less than a minute."
        action={
          <Button
            render={<Link href="/books" />}
            nativeButton={false}
            variant="outline"
            className="rounded-full"
          >
            <ArrowLeft className="size-4" />
            Back to library
          </Button>
        }
      />

      <AddBookForm user={user} />
    </div>
  );
}
