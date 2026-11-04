import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { getCurrentUser, googleAuthConfigured } from "@/lib/auth";
import { safeRedirectPath } from "@/lib/redirect";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your BookNook reader account.",
};

type LoginPageProps = {
  searchParams: Promise<{
    redirect?: string | string[];
    registered?: string | string[];
    email?: string | string[];
  }>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = safeRedirectPath(firstValue(params.redirect));
  const user = await getCurrentUser();

  if (user) {
    redirect(redirectTo);
  }

  return (
    <LoginForm
      redirectTo={redirectTo}
      initialEmail={firstValue(params.email) ?? ""}
      registered={firstValue(params.registered) === "1"}
      googleAuthConfigured={googleAuthConfigured}
    />
  );
}
