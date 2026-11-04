import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ProfileView } from "@/components/profile/profile-view";
import { Button } from "@/components/ui/button";
import { getBooks } from "@/lib/api/books";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "My profile",
  description: "Update your BookNook reader profile and account details.",
};

export default async function ProfilePage() {
  const user = await requireUser("/profile");
  const books = await getBooks();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Your corner"
        title="My profile"
        description="The reader behind the shelf. Update your details and check your reading stats."
        action={
          <Button
            render={<Link href="/add-book" />}
            nativeButton={false}
            variant="outline"
            className="rounded-full"
          >
            <Plus className="size-4" />
            Add a book
          </Button>
        }
      />

      <ProfileView books={books} user={user} />
    </div>
  );
}
