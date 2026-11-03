"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { DragEvent, FormEvent } from "react";
import {
  ImagePlus,
  Loader2,
  Lock,
  Plus,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";

import { BookCover } from "@/components/home/book-cover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createBook } from "@/lib/actions/books";
import type { SessionUser } from "@/lib/auth";
import {
  bookCategories,
  MAX_COPIES,
  MAX_COVER_BYTES,
  MAX_DESCRIPTION_LENGTH,
} from "@/lib/constants/books";

type FormErrors = Partial<
  Record<
    "title" | "author" | "category" | "copies" | "image" | "description",
    string
  >
>;

type UploadResponse = {
  url?: string;
  message?: string;
};

export function AddBookForm({ user }: { user: SessionUser }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [copies, setCopies] = useState("1");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const preview = objectUrl ?? imageUrl.trim();

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  function clearError(field: keyof FormErrors) {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function acceptFile(nextFile: File | null) {
    clearError("image");

    if (!nextFile) {
      return;
    }

    if (!nextFile.type.startsWith("image/")) {
      setErrors((current) => ({
        ...current,
        image: "Choose a JPG, PNG, WEBP, or GIF image.",
      }));
      return;
    }

    if (nextFile.size > MAX_COVER_BYTES) {
      setErrors((current) => ({
        ...current,
        image: "The cover must be 5MB or smaller.",
      }));
      return;
    }

    setFile(nextFile);
    setObjectUrl(URL.createObjectURL(nextFile));
  }

  function removeFile() {
    setFile(null);
    setObjectUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    acceptFile(event.dataTransfer.files?.[0] ?? null);
  }

  function validate(): FormErrors {
    const next: FormErrors = {};

    if (title.trim().length < 2) {
      next.title = "Add a title with at least 2 characters.";
    }

    if (author.trim().length < 2) {
      next.author = "Add the author's name.";
    }

    if (!category) {
      next.category = "Choose a category for the shelf.";
    }

    const copiesValue = Number(copies);

    if (
      copies.trim() === "" ||
      !Number.isInteger(copiesValue) ||
      copiesValue < 0 ||
      copiesValue > MAX_COPIES
    ) {
      next.copies = `Enter a whole number between 0 and ${MAX_COPIES}.`;
    }

    if (description.trim().length < 10) {
      next.description = "Write at least 10 characters about the book.";
    } else if (description.length > MAX_DESCRIPTION_LENGTH) {
      next.description = `Keep the description under ${MAX_DESCRIPTION_LENGTH} characters.`;
    }

    if (!file && !/^https?:\/\/\S+$/i.test(imageUrl.trim())) {
      next.image = "Upload a cover image or paste a valid image URL.";
    }

    return next;
  }

  async function uploadCover(selected: File): Promise<string | null> {
    const uploadBody = new FormData();
    uploadBody.append("file", selected);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadBody,
      });
      const payload = (await response.json().catch(() => null)) as
        | UploadResponse
        | null;

      if (!response.ok || !payload?.url) {
        toast.error("Cover upload failed", {
          description:
            payload?.message ?? "Try again or paste an image URL instead.",
        });
        return null;
      }

      return payload.url;
    } catch {
      toast.error("Cover upload failed", {
        description: "Could not reach the upload service. Try again.",
      });
      return null;
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Check the highlighted fields", {
        description: "A few details are missing before the book can go up.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let cover = imageUrl.trim();

      if (file) {
        const uploadedUrl = await uploadCover(file);

        if (!uploadedUrl) {
          return;
        }

        cover = uploadedUrl;
      }

      const result = await createBook({
        title,
        author,
        category,
        image: cover,
        description,
        totalCopies: Number(copies),
      });

      if (!result.ok) {
        toast.error("Could not add the book", { description: result.message });
        return;
      }

      toast.success("Book added to the shelf", {
        description: `"${title.trim()}" is now in the BookNook library.`,
      });

      setTitle("");
      setAuthor("");
      setCategory("");
      setCopies("1");
      setDescription("");
      setImageUrl("");
      removeFile();
      setErrors({});

      router.push(result.id ? `/books/${result.id}` : "/books");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]"
    >
      <Card className="rounded-3xl border-0 ring-1 ring-foreground/10">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Book details</CardTitle>
          <CardDescription>
            Tell readers what is waiting on the shelf.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="book-title">Book Title</Label>
              <Input
                id="book-title"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  clearError("title");
                }}
                placeholder="e.g. The Alchemist"
                className="h-10"
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "book-title-error" : undefined}
              />
              {errors.title && (
                <p id="book-title-error" className="text-xs text-destructive">
                  {errors.title}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="book-author">Author Name</Label>
              <Input
                id="book-author"
                value={author}
                onChange={(event) => {
                  setAuthor(event.target.value);
                  clearError("author");
                }}
                placeholder="e.g. Paulo Coelho"
                className="h-10"
                aria-invalid={Boolean(errors.author)}
                aria-describedby={
                  errors.author ? "book-author-error" : undefined
                }
              />
              {errors.author && (
                <p id="book-author-error" className="text-xs text-destructive">
                  {errors.author}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_150px]">
            <div className="grid gap-2">
              <Label htmlFor="book-category">Category</Label>
              <Select
                value={category}
                onValueChange={(value) => {
                  setCategory(value ?? "");
                  clearError("category");
                }}
              >
                <SelectTrigger
                  id="book-category"
                  className="h-10 w-full"
                  aria-invalid={Boolean(errors.category)}
                  aria-describedby={
                    errors.category ? "book-category-error" : undefined
                  }
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
              {errors.category && (
                <p
                  id="book-category-error"
                  className="text-xs text-destructive"
                >
                  {errors.category}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="book-copies">Copies</Label>
              <Input
                id="book-copies"
                type="number"
                inputMode="numeric"
                min={0}
                max={MAX_COPIES}
                step={1}
                value={copies}
                onChange={(event) => {
                  setCopies(event.target.value);
                  clearError("copies");
                }}
                className="h-10"
                aria-invalid={Boolean(errors.copies)}
                aria-describedby={
                  errors.copies ? "book-copies-error" : "book-copies-hint"
                }
              />
              {errors.copies ? (
                <p id="book-copies-error" className="text-xs text-destructive">
                  {errors.copies}
                </p>
              ) : (
                <p
                  id="book-copies-hint"
                  className="text-xs text-muted-foreground"
                >
                  How many readers can borrow it.
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="book-description">Short Description</Label>
              <span className="text-[0.68rem] text-muted-foreground">
                {description.length}/{MAX_DESCRIPTION_LENGTH}
              </span>
            </div>
            <Textarea
              id="book-description"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                clearError("description");
              }}
              rows={5}
              maxLength={MAX_DESCRIPTION_LENGTH}
              placeholder="A few lines about the story, the ideas, or why another reader should pick it up."
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description ? "book-description-error" : undefined
              }
            />
            {errors.description && (
              <p
                id="book-description-error"
                className="text-xs text-destructive"
              >
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label htmlFor="book-cover">Book Image</Label>
              <span className="text-[0.68rem] text-muted-foreground">
                JPG, PNG, WEBP or GIF · 5MB max
              </span>
            </div>

            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={cn(
                "flex flex-col gap-4 rounded-2xl border border-dashed p-4 transition-colors sm:flex-row sm:items-center",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted/30",
              )}
            >
              <div className="relative mx-auto aspect-[2/3] w-28 shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10 sm:mx-0">
                {preview ? (
                  // User-supplied preview: any host is allowed here, so a plain
                  // img is safer than next/image remote-pattern validation.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Selected cover preview"
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
                    <ImagePlus className="size-5" aria-hidden="true" />
                    <span className="text-[0.55rem] font-semibold tracking-[0.18em] uppercase">
                      No cover
                    </span>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Upload a cover image</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Drop an image here or choose a file. Uploads are hosted on
                  imgbb.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    disabled={isSubmitting}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud className="size-3.5" />
                    {file ? "Replace image" : "Choose image"}
                  </Button>

                  {file && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-muted-foreground"
                      disabled={isSubmitting}
                      onClick={removeFile}
                    >
                      <X className="size-3.5" />
                      Remove
                    </Button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  id="book-cover"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) =>
                    acceptFile(event.target.files?.[0] ?? null)
                  }
                />

                <div className="mt-3 grid gap-1.5">
                  <Label
                    htmlFor="book-image-url"
                    className="text-xs font-normal text-muted-foreground"
                  >
                    Or paste an image URL
                  </Label>
                  <Input
                    id="book-image-url"
                    value={imageUrl}
                    onChange={(event) => {
                      setImageUrl(event.target.value);
                      clearError("image");
                    }}
                    placeholder="https://i.ibb.co/..."
                    className="h-9"
                    disabled={Boolean(file) || isSubmitting}
                    aria-invalid={Boolean(errors.image)}
                  />
                </div>
              </div>
            </div>

            {errors.image && (
              <p className="text-xs text-destructive">{errors.image}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t bg-transparent sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Your name and email are attached automatically.
          </p>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Button
              type="button"
              variant="ghost"
              render={<Link href="/books" />}
              nativeButton={false}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-full px-6 sm:flex-none"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Plus className="size-4" aria-hidden="true" />
              )}
              {isSubmitting ? "Adding book..." : "Add Book"}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <aside className="flex flex-col gap-6">
        <Card className="rounded-3xl border-0 ring-1 ring-foreground/10">
          <CardHeader>
            <CardTitle className="font-display text-xl">Shelf preview</CardTitle>
            <CardDescription>
              How the card will look in the library.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mx-auto w-full max-w-[220px]">
              <BookCover
                src={preview || undefined}
                title={title.trim() || "Your book title"}
                author={author.trim() || "Author name"}
                className="aspect-[2/3] w-full rounded-2xl ring-1 ring-foreground/10"
                sizes="220px"
              />

              <h2 className="mt-4 font-display text-lg leading-tight font-semibold">
                {title.trim() || "Your book title"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                by {author.trim() || "Author name"}
              </p>
              <Badge className="mt-2 border-0 bg-brand-sage/20 text-brand-forest dark:bg-brand-sage/10 dark:text-brand-sage">
                {category || "Category"}
              </Badge>
              <p className="mt-2 text-xs text-muted-foreground">
                {Number(copies) || 0}{" "}
                {Number(copies) === 1 ? "copy" : "copies"} available
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 ring-1 ring-foreground/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-xl">
              <Lock
                className="size-4 text-brand-terracotta dark:text-[#e0a48a]"
                aria-hidden="true"
              />
              Added by
            </CardTitle>
            <CardDescription>
              These details come from your account and are read-only.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-3 rounded-2xl bg-muted/50 p-3">
              <Avatar>
                <AvatarFallback className="bg-[#d9c6b5] text-[0.65rem] font-semibold text-[#4b3a2c] dark:bg-[#3a2d25] dark:text-[#e8d6c4]">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="user-name">User Name</Label>
              <Input
                id="user-name"
                value={user.name}
                readOnly
                className="h-9 bg-muted/40"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                value={user.email}
                readOnly
                className="h-9 bg-muted/40"
              />
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              The date added is saved automatically when you submit the form.
            </p>
          </CardContent>
        </Card>
      </aside>
    </form>
  );
}
