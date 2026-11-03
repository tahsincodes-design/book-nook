"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  Check,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleButton } from "@/components/auth/google-button";
import { BookNookLogo } from "@/components/brand/booknook-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authClient, googleAuthEnabled } from "@/lib/auth-client";

type FormErrors = Partial<
  Record<"name" | "email" | "image" | "password" | "form", string>
>;

const passwordRules = [
  {
    label: "At least 6 characters",
    test: (value: string) => value.length >= 6,
  },
  {
    label: "One uppercase letter",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: "One lowercase letter",
    test: (value: string) => /[a-z]/.test(value),
  },
];

export function RegisterForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const loginHref =
    redirectTo === "/"
      ? "/login"
      : `/login?redirect=${encodeURIComponent(redirectTo)}`;

  function validatePassword(value: string) {
    if (value.length < 6) {
      return "Password must be at least 6 characters long.";
    }

    if (!/[A-Z]/.test(value)) {
      return "Password must include at least one uppercase letter.";
    }

    if (!/[a-z]/.test(value)) {
      return "Password must include at least one lowercase letter.";
    }

    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedImage = image.trim();

    if (trimmedName.length < 2) {
      nextErrors.name = "Add a name with at least 2 characters.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (trimmedImage && !/^https?:\/\/\S+$/i.test(trimmedImage)) {
      nextErrors.image = "Use a full image URL that starts with http:// or https://.";
    }

    const passwordError = validatePassword(password);

    if (passwordError) {
      nextErrors.password = passwordError;
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Check the highlighted fields", {
        description: "A few details need attention before you can register.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await authClient.signUp.email({
        name: trimmedName,
        email: trimmedEmail,
        password,
        image: trimmedImage || undefined,
      });

      if (error) {
        const message =
          error.message ?? "Could not create your account. Please try again.";

        setErrors({ form: message });
        toast.error("Could not register", { description: message });
        return;
      }

      toast.success("Account created", {
        description: "Sign in with your new email and password.",
      });

      const params = new URLSearchParams({
        email: trimmedEmail,
        registered: "1",
      });

      if (redirectTo !== "/") {
        params.set("redirect", redirectTo);
      }

      router.push(`/login?${params.toString()}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not create your account. Please try again.";
      setErrors({ form: message });
      toast.error("Could not register", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleRegister() {
    if (!googleAuthEnabled) {
      toast.error("Google sign-in is not configured", {
        description:
          "Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, then set NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true.",
      });
      return;
    }

    setIsGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        // Registering with Google drops the reader on the home page.
        callbackURL: `${window.location.origin}/`,
      });

      if (error) {
        toast.error("Could not continue with Google", {
          description: error.message ?? "Please try again.",
        });
        setIsGoogleLoading(false);
      }
    } catch (error) {
      toast.error("Could not continue with Google", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
      setIsGoogleLoading(false);
    }
  }

  return (
    <AuthShell>
      <Card className="rounded-[2rem] border-0 bg-card p-6 shadow-[0_24px_60px_-40px_rgba(29,42,35,0.45)] ring-1 ring-foreground/10 sm:p-8">
        <div className="lg:hidden">
          <BookNookLogo showTagline />
        </div>

        <div className="mt-6 lg:mt-0">
          <p className="text-[0.62rem] font-semibold tracking-[0.22em] text-brand-terracotta uppercase dark:text-[#e0a48a]">
            Join the library
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em]">
            Create an account
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Make a reader profile so your shelf and loans stay with you.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="register-name">Name</Label>
            <Input
              id="register-name"
              autoComplete="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setErrors((current) => ({
                  ...current,
                  name: undefined,
                  form: undefined,
                }));
              }}
              placeholder="Your full name"
              className="h-11"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={
                errors.name ? "register-name-error" : undefined
              }
            />
            {errors.name && (
              <p id="register-name-error" className="text-xs text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="register-email">Email</Label>
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrors((current) => ({
                  ...current,
                  email: undefined,
                  form: undefined,
                }));
              }}
              placeholder="you@example.com"
              className="h-11"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? "register-email-error" : undefined
              }
            />
            {errors.email && (
              <p id="register-email-error" className="text-xs text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="register-image">
              Photo URL{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Input
              id="register-image"
              type="url"
              autoComplete="photo"
              value={image}
              onChange={(event) => {
                setImage(event.target.value);
                setErrors((current) => ({
                  ...current,
                  image: undefined,
                  form: undefined,
                }));
              }}
              placeholder="https://example.com/photo.jpg"
              className="h-11"
              aria-invalid={Boolean(errors.image)}
              aria-describedby={
                errors.image ? "register-image-error" : undefined
              }
            />
            {errors.image && (
              <p id="register-image-error" className="text-xs text-destructive">
                {errors.image}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="register-password">Password</Label>
            <div className="relative">
              <Input
                id="register-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrors((current) => ({
                    ...current,
                    password: undefined,
                    form: undefined,
                  }));
                }}
                placeholder="Create a password"
                className="h-11 pr-11"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "register-password-error" : undefined
                }
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>

            <ul className="grid gap-1.5 pt-1">
              {passwordRules.map((rule) => {
                const met = rule.test(password);

                return (
                  <li
                    key={rule.label}
                    className={
                      met
                        ? "flex items-center gap-1.5 text-[0.7rem] text-brand-forest dark:text-brand-sage"
                        : "flex items-center gap-1.5 text-[0.7rem] text-muted-foreground"
                    }
                  >
                    <span
                      className={
                        met
                          ? "flex size-4 items-center justify-center rounded-full bg-brand-sage/25 dark:bg-brand-sage/15"
                          : "flex size-4 items-center justify-center rounded-full bg-muted"
                      }
                    >
                      {met ? (
                        <Check className="size-2.5" aria-hidden="true" />
                      ) : (
                        <X className="size-2.5" aria-hidden="true" />
                      )}
                    </span>
                    {rule.label}
                  </li>
                );
              })}
            </ul>

            {errors.password && (
              <p
                id="register-password-error"
                className="text-xs text-destructive"
              >
                {errors.password}
              </p>
            )}
          </div>

          {errors.form && (
            <p
              role="alert"
              className="rounded-xl bg-destructive/10 px-3 py-2 text-xs leading-relaxed text-destructive"
            >
              {errors.form}
            </p>
          )}

          <Button
            type="submit"
            className="h-11 w-full rounded-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <UserPlus className="size-4" aria-hidden="true" />
            )}
            {isSubmitting ? "Creating account..." : "Register"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-[0.62rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            or
          </span>
          <Separator className="flex-1" />
        </div>

        <GoogleButton
          label="Continue with Google"
          onClick={handleGoogleRegister}
          loading={isGoogleLoading}
          disabled={isSubmitting}
        />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={loginHref}
            className="font-semibold text-brand-terracotta underline-offset-4 hover:underline dark:text-[#e0a48a]"
          >
            Login
          </Link>
        </p>
      </Card>
    </AuthShell>
  );
}
