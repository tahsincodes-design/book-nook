"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Save, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";

import { BookCover } from "@/components/home/book-cover";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { updateBook } from "@/lib/actions/books";
import {
  bookCategories,
  MAX_COPIES,
  MAX_COVER_BYTES,
  MAX_DESCRIPTION_LENGTH,
} from "@/lib/constants/books";
import type { Book } from "@/lib/types/book";
import { uploadCover } from "@/lib/upload-cover";

type FormErrors = Partial<
  Record<
    "title" | "author" | "category" | "copies" | "image" | "description",
    string
  >
>;

export function UpdateBookDialog({
  book,
  triggerClassName = "rounded-full",
}: {
  book: Book;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="outline" className={triggerClassName} />}
      >
        <Pencil className="size-4" aria-hidden="true" />
        Update details
      </DialogTrigger>

      {open && (
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
          <UpdateBookForm book={book} onClose={() => setOpen(false)} />
        </DialogContent>
      )}
    </Dialog>
  );
}

function UpdateBookForm({
  book,
  onClose,
}: {
  book: Book;
  onClose: () => void;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [category, setCategory] = useState<string>(book.category);
  const [copies, setCopies] = useState(String(book.totalCopies));
  const [description, setDescription] = useState(book.description);
  const [imageUrl, setImageUrl] = useState(book.image);
  const [file, setFile] = useState<File | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Check the highlighted fields", {
        description: "A few details need attention before saving.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let cover = imageUrl.trim();

      if (file) {
        const upload = await uploadCover(file);

        if (!upload.ok) {
          toast.error("Cover upload failed", {
            description: upload.message,
          });
          return;
        }

        cover = upload.url;
      }

      const result = await updateBook({
        id: book._id,
        title,
        author,
        category,
        image: cover,
        description,
        totalCopies: Number(copies),
      });

      if (!result.ok) {
        toast.error("Could not update the book", {
          description: result.message,
        });
        return;
      }

      toast.success("Book updated", {
        description: `"${title.trim()}" now has the latest details.`,
      });
      onClose();
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-display text-xl">
          Update this book
        </DialogTitle>
        <DialogDescription>
          Changes are saved to the library through{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-[0.7rem]">
            PATCH /books/:id
          </code>
          .
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} noValidate className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="update-title">Book Title</Label>
            <Input
              id="update-title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                clearError("title");
              }}
              className="h-10"
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="update-author">Author Name</Label>
            <Input
              id="update-author"
              value={author}
              onChange={(event) => {
                setAuthor(event.target.value);
                clearError("author");
              }}
              className="h-10"
              aria-invalid={Boolean(errors.author)}
            />
            {errors.author && (
              <p className="text-xs text-destructive">{errors.author}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_140px]">
          <div className="grid gap-2">
            <Label htmlFor="update-category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => {
                setCategory(value ?? "");
                clearError("category");
              }}
            >
              <SelectTrigger
                id="update-category"
                className="h-10 w-full"
                aria-invalid={Boolean(errors.category)}
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
              <p className="text-xs text-destructive">{errors.category}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="update-copies">Copies</Label>
            <Input
              id="update-copies"
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
                errors.copies ? "update-copies-error" : "update-copies-hint"
              }
            />
            {errors.copies ? (
              <p id="update-copies-error" className="text-xs text-destructive">
                {errors.copies}
              </p>
            ) : (
              <p
                id="update-copies-hint"
                className="text-xs text-muted-foreground"
              >
                Available to borrow.
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="update-description">Short Description</Label>
            <span className="text-[0.68rem] text-muted-foreground">
              {description.length}/{MAX_DESCRIPTION_LENGTH}
            </span>
          </div>
          <Textarea
            id="update-description"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              clearError("description");
            }}
            rows={4}
            maxLength={MAX_DESCRIPTION_LENGTH}
            aria-invalid={Boolean(errors.description)}
          />
          {errors.description && (
            <p className="text-xs text-destructive">{errors.description}</p>
          )}
        </div>

        <div className="grid gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label htmlFor="update-cover">Book Image</Label>
            <span className="text-[0.68rem] text-muted-foreground">
              JPG, PNG, WEBP or GIF · 5MB max
            </span>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-border bg-muted/30 p-4 sm:flex-row sm:items-center">
            <BookCover
              src={preview || undefined}
              title={title.trim() || book.title}
              author={author.trim() || book.author}
              className="mx-auto aspect-[2/3] w-24 shrink-0 rounded-xl ring-1 ring-foreground/10 sm:mx-0"
              sizes="96px"
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2">
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
                id="update-cover"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) =>
                  acceptFile(event.target.files?.[0] ?? null)
                }
              />

              <div className="mt-3 grid gap-1.5">
                <Label
                  htmlFor="update-image-url"
                  className="text-xs font-normal text-muted-foreground"
                >
                  Or paste an image URL
                </Label>
                <Input
                  id="update-image-url"
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

        <DialogFooter className="mt-2">
          <Button
            type="button"
            variant="ghost"
            className="rounded-full"
            disabled={isSubmitting}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="rounded-full px-5"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="size-4" aria-hidden="true" />
            )}
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
