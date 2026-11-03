"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { LogIn, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { useDemoSession } from "@/components/providers/demo-session-provider";
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
import { demoUser } from "@/lib/demo/user";

type FormErrors = Partial<Record<"name" | "email", string>>;

export function SignInDialog({ className }: { className?: string }) {
  const { signIn } = useDemoSession();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(demoUser.name);
  const [email, setEmail] = useState(demoUser.email);
  const [errors, setErrors] = useState<FormErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};

    if (name.trim().length < 2) {
      nextErrors.name = "Add a name with at least 2 characters.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    signIn({ name, email });
    toast.success(`Welcome back, ${name.trim().split(/\s+/)[0]}`, {
      description: "You are browsing with the demo reader. No password needed.",
    });
    setOpen(false);
  }

  function handleDemoSignIn() {
    signIn();
    toast.success("Signed in as the demo reader", {
      description: "You can sign out again from the account menu.",
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button className={className ?? "rounded-full"} />}
      >
        <LogIn className="size-4" aria-hidden="true" />
        Sign in
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Welcome back to BookNook
          </DialogTitle>
          <DialogDescription>
            This is a demo sign-in. No password is checked and no route is
            protected yet.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="signin-name">Name</Label>
            <Input
              id="signin-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setErrors((current) => ({ ...current, name: undefined }));
              }}
              placeholder="Your name"
              className="h-10"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="signin-email">Email</Label>
            <Input
              id="signin-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrors((current) => ({ ...current, email: undefined }));
              }}
              placeholder="you@example.com"
              className="h-10"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          <DialogFooter className="mt-1">
            <Button
              type="button"
              variant="ghost"
              className="rounded-full"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-full px-5">
              <LogIn className="size-4" aria-hidden="true" />
              Sign in
            </Button>
          </DialogFooter>
        </form>

        <button
          type="button"
          onClick={handleDemoSignIn}
          className="mx-auto inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Sparkles className="size-3.5" aria-hidden="true" />
          Continue as the demo reader
        </button>
      </DialogContent>
    </Dialog>
  );
}
