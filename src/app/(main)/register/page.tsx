import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/auth/register-form";
import { getCurrentUser, googleAuthConfigured } from "@/lib/auth";
import { safeRedirectPath } from "@/lib/redirect";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a BookNook reader account.",
};

type RegisterPageProps = {
  searchParams: Promise<{
    redirect?: string | string[];
  }>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;
  const redirectTo = safeRedirectPath(firstValue(params.redirect));
  const user = await getCurrentUser();

  if (user) {
    redirect(redirectTo);
  }

  return (
    <RegisterForm
      redirectTo={redirectTo}
      googleAuthConfigured={googleAuthConfigured}
    />
  );
}
