"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";

import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleButton } from "@/components/auth/google-button";
import { BookNookLogo } from "@/components/brand/booknook-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

type FormErrors = Partial<Record<"email" | "password" | "form", string>>;

export function LoginForm({
  redirectTo,
  initialEmail = "",
  registered = false,
  googleAuthConfigured,
}: {
  redirectTo: string;
  initialEmail?: string;
  registered?: boolean;
  googleAuthConfigured: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const registerHref =
    redirectTo === "/"
      ? "/register"
      : `/register?redirect=${encodeURIComponent(redirectTo)}`;

  function handleForgotPassword() {
    toast.info("Password reset is not available yet", {
      description:
        "Contact the library admin to reset your password.",
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    const trimmedEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Enter your password.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await authClient.signIn.email({
        email: trimmedEmail,
        password,
        rememberMe: true,
      });

      if (error) {
        const message =
          error.message ?? "Check your email and password and try again.";

        setErrors({ form: message });
        toast.error("Could not sign in", { description: message });
        return;
      }

      toast.success("Welcome back", {
        description: "You are signed in to BookNook.",
      });
      // Replace so the back button cannot return to the login form, then
      // refresh so the shared navbar picks up the new session.
      router.replace(redirectTo);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not sign in. Please try again.";
      setErrors({ form: message });
      toast.error("Could not sign in", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    if (!googleAuthConfigured) {
      toast.error("Google sign-in is not configured", {
        description:
          "Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to the Vercel Production environment, then redeploy.",
      });
      return;
    }

    setIsGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}${redirectTo}`,
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
            Welcome back
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em]">
            Login
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Sign in to borrow books, share your own, and keep track of every due
            date.
          </p>
        </div>

        {registered && (
          <p
            role="status"
            className="mt-5 rounded-xl border border-brand-sage/40 bg-brand-sage/15 px-3 py-2 text-xs leading-relaxed text-brand-forest dark:border-brand-sage/25 dark:bg-brand-sage/10 dark:text-brand-sage"
          >
            Account created. Sign in with your new email and password to
            continue.
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
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
              aria-describedby={errors.email ? "login-email-error" : undefined}
            />
            {errors.email && (
              <p id="login-email-error" className="text-xs text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="login-password">Password</Label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="rounded-sm text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                Forget password?
              </button>
            </div>

            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrors((current) => ({
                    ...current,
                    password: undefined,
                    form: undefined,
                  }));
                }}
                placeholder="Your password"
                className="h-11 pr-11"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "login-password-error" : undefined
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

            {errors.password && (
              <p id="login-password-error" className="text-xs text-destructive">
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
              <LogIn className="size-4" aria-hidden="true" />
            )}
            {isSubmitting ? "Signing in..." : "Login"}
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
          onClick={handleGoogleSignIn}
          loading={isGoogleLoading}
          disabled={isSubmitting}
        />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to BookNook?{" "}
          <Link
            href={registerHref}
            className="font-semibold text-brand-terracotta underline-offset-4 hover:underline dark:text-[#e0a48a]"
          >
            Create an account
          </Link>
        </p>
      </Card>
    </AuthShell>
  );
}
