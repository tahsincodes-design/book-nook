"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  Check,
  Library,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import type { SessionUser } from "@/lib/auth";
import { bookCategories } from "@/lib/constants/books";
import { formatDate } from "@/lib/format";
import { filterOwnedBooks } from "@/lib/owned-books";
import type { Book } from "@/lib/types/book";

const MAX_BIO_LENGTH = 240;

type FormErrors = Partial<Record<"name" | "bio", string>>;

export function ProfileView({
  books,
  user,
}: {
  books: Book[];
  user: SessionUser;
}) {
  return <SignedInProfile key={user.id} books={books} user={user} />;
}

function SignedInProfile({
  books,
  user,
}: {
  books: Book[];
  user: SessionUser;
}) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [location, setLocation] = useState(user.location);
  const [favoriteCategory, setFavoriteCategory] = useState(
    user.favoriteCategory,
  );
  const [bio, setBio] = useState(user.bio);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const myBooks = filterOwnedBooks(books, user);
  const categories = new Set(myBooks.map((book) => book.category));
  const copies = myBooks.reduce((total, book) => total + book.totalCopies, 0);
  const isDirty =
    name !== user.name ||
    location !== user.location ||
    favoriteCategory !== user.favoriteCategory ||
    bio !== user.bio;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};

    if (name.trim().length < 2) {
      nextErrors.name = "Add a name with at least 2 characters.";
    }

    if (bio.length > MAX_BIO_LENGTH) {
      nextErrors.bio = `Keep the bio under ${MAX_BIO_LENGTH} characters.`;
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Check the highlighted fields", {
        description: "A couple of profile details need attention.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const next = {
        name: name.trim(),
        location: location.trim(),
        favoriteCategory,
        bio: bio.trim(),
      };

      const { error } = await authClient.updateUser(next);

      if (error) {
        toast.error("Could not update your profile", {
          description: error.message ?? "Please try again.",
        });
        return;
      }

      setName(next.name);
      setLocation(next.location);
      setBio(next.bio);
      toast.success("Profile updated", {
        description: "Your changes have been saved to your account.",
      });
      router.refresh();
    } catch (error) {
      toast.error("Could not update your profile", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  function handleReset() {
    setName(user.name);
    setLocation(user.location);
    setFavoriteCategory(user.favoriteCategory);
    setBio(user.bio);
    setErrors({});
  }

  async function handleSignOut() {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error("Could not sign out", {
          description: error.message ?? "Please try again.",
        });
        return;
      }

      toast.success("Signed out");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Could not sign out", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  return (
    <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.35fr)]">
      <aside className="grid gap-5">
        <Card className="rounded-3xl border-0 bg-card ring-1 ring-foreground/10">
          <div className="flex flex-col items-center px-5 pt-6 text-center">
            <Avatar className="size-20">
              <AvatarFallback className="bg-[#d9c6b5] text-xl font-semibold text-[#4b3a2c] dark:bg-[#3a2d25] dark:text-[#e8d6c4]">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <h2 className="mt-4 font-display text-2xl font-semibold tracking-[-0.02em]">
              {user.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {user.email}
            </p>
            <Badge className="mt-3 border-0 bg-brand-sage/20 text-brand-forest dark:bg-brand-sage/10 dark:text-brand-sage">
              BookNook reader
            </Badge>
          </div>

          <div className="mt-5 grid gap-3 border-t border-border/60 px-5 py-5">
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <MapPin
                className="size-4 shrink-0 text-brand-terracotta dark:text-[#e0a48a]"
                aria-hidden="true"
              />
              <span className="truncate">
                {user.location || "No location"}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <BookOpen
                className="size-4 shrink-0 text-brand-terracotta dark:text-[#e0a48a]"
                aria-hidden="true"
              />
              <span>Favourite shelf: {user.favoriteCategory}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <CalendarDays
                className="size-4 shrink-0 text-brand-terracotta dark:text-[#e0a48a]"
                aria-hidden="true"
              />
              <span>Joined {formatDate(user.joinedAt)}</span>
            </div>
          </div>

          <p className="border-t border-border/60 px-5 py-4 text-xs leading-relaxed text-muted-foreground">
            {user.bio || "No bio yet. Add a few lines about your reading."}
          </p>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          <Card className="rounded-2xl border-0 bg-card p-4 text-center ring-1 ring-foreground/10">
            <p className="font-display text-2xl font-semibold">
              {myBooks.length}
            </p>
            <p className="mt-1 text-[0.62rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              Books
            </p>
          </Card>
          <Card className="rounded-2xl border-0 bg-card p-4 text-center ring-1 ring-foreground/10">
            <p className="font-display text-2xl font-semibold">{copies}</p>
            <p className="mt-1 text-[0.62rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              Copies
            </p>
          </Card>
          <Card className="rounded-2xl border-0 bg-card p-4 text-center ring-1 ring-foreground/10">
            <p className="font-display text-2xl font-semibold">
              {categories.size}
            </p>
            <p className="mt-1 text-[0.62rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              Shelves
            </p>
          </Card>
        </div>
      </aside>

      <Card className="gap-0 rounded-3xl border-0 bg-card p-0 ring-1 ring-foreground/10">
        <Tabs defaultValue="details" className="gap-0">
          <div className="border-b border-border/60 px-5 py-4">
            <TabsList variant="line" className="w-full justify-start">
              <TabsTrigger value="details">
                <UserRound className="size-4" aria-hidden="true" />
                Profile details
              </TabsTrigger>
              <TabsTrigger value="account">
                <ShieldCheck className="size-4" aria-hidden="true" />
                Account
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="details" className="px-5 py-5">
            <form onSubmit={handleSubmit} noValidate className="grid gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold">
                    Update your details
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Changes stay in this browser. There is no profile API yet.
                  </p>
                </div>
                {isDirty && (
                  <Badge
                    variant="outline"
                    className="border-brand-terracotta/40 text-brand-terracotta dark:text-[#e0a48a]"
                  >
                    Unsaved changes
                  </Badge>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="profile-name">Name</Label>
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setErrors((current) => ({
                        ...current,
                        name: undefined,
                      }));
                    }}
                    className="h-10"
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="profile-email">Email</Label>
                  <Input
                    id="profile-email"
                    value={user.email}
                    className="h-10"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Your account email is used to sign in.
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="profile-location">Location</Label>
                  <Input
                    id="profile-location"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="City, country"
                    className="h-10"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="profile-category">Favourite category</Label>
                  <Select
                    value={favoriteCategory}
                    onValueChange={(value) =>
                      setFavoriteCategory(value ?? "Fiction")
                    }
                  >
                    <SelectTrigger
                      id="profile-category"
                      className="h-10 w-full"
                    >
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {bookCategories.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="profile-bio">Bio</Label>
                  <span className="text-[0.68rem] text-muted-foreground">
                    {bio.length}/{MAX_BIO_LENGTH}
                  </span>
                </div>
                <Textarea
                  id="profile-bio"
                  value={bio}
                  onChange={(event) => {
                    setBio(event.target.value);
                    setErrors((current) => ({ ...current, bio: undefined }));
                  }}
                  rows={4}
                  maxLength={MAX_BIO_LENGTH}
                  placeholder="A few lines about the books you love."
                  aria-invalid={Boolean(errors.bio)}
                />
                {errors.bio && (
                  <p className="text-xs text-destructive">{errors.bio}</p>
                )}
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full text-muted-foreground"
                  disabled={!isDirty || isSaving}
                  onClick={handleReset}
                >
                  <RotateCcw className="size-4" />
                  Reset changes
                </Button>

                <Button
                  type="submit"
                  className="rounded-full px-5"
                  disabled={!isDirty || isSaving}
                >
                  {isSaving ? (
                    <Loader2
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Save className="size-4" aria-hidden="true" />
                  )}
                  {isSaving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="account" className="px-5 py-5">
            <div className="grid gap-5">
              <div>
                <h2 className="font-display text-xl font-semibold">
                  Account
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your profile and sign-in details are linked to your BookNook
                  account.
                </p>
              </div>

              <div className="grid gap-3 rounded-2xl bg-muted/50 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-brand-sage/20 text-brand-forest dark:bg-brand-sage/10 dark:text-brand-sage">
                    <Check className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Signed in</p>
                    <p className="text-xs text-muted-foreground">
                      {user.name} · {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-brand-terracotta/15 text-brand-terracotta dark:bg-brand-terracotta/10 dark:text-[#e0a48a]">
                    <Mail className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Account email</p>
                    <p className="text-xs text-muted-foreground">
                      Used for sign-in and borrowing books.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-brand-ochre/20 text-[#7a6428] dark:bg-brand-ochre/10 dark:text-brand-ochre">
                    <Library className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">
                      {myBooks.length}{" "}
                      {myBooks.length === 1 ? "book" : "books"} on your shelf
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Manage them from My Books.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
                <Button
                  render={<Link href="/my-books" />}
                  nativeButton={false}
                  variant="outline"
                  className="rounded-full"
                >
                  <Library className="size-4" />
                  My Books
                </Button>
                <Button
                  variant="destructive"
                  className="rounded-full"
                  onClick={handleSignOut}
                >
                  <LogOut className="size-4" />
                  Sign out
                </Button>
              </div>

              <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <Sparkles
                  className="mt-0.5 size-3.5 shrink-0 text-brand-terracotta dark:text-[#e0a48a]"
                  aria-hidden="true"
                />
                Signing out ends your authenticated session. You can sign back
                in anytime.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
