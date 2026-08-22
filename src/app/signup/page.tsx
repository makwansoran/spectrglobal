import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { SignupWizard } from "@/components/signup-wizard";
import { safeNextPath } from "@/lib/auth/next-path";

export const metadata: Metadata = {
  title: "Create account",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <AuthShell wide hideIntro>
      <SignupWizard next={safeNextPath(next)} kind="product" />
    </AuthShell>
  );
}
