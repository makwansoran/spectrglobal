import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { SignupWizard } from "@/components/signup-wizard";
import { safeNextPath } from "@/lib/auth/next-path";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Create careers account",
  description: "Create a Spectr careers account to apply for listings.",
  path: "/careers/signup",
});

export default async function CareersSignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <AuthShell wide hideIntro homeHref="/careers">
      <SignupWizard next={safeNextPath(next, "/careers/apply")} kind="careers" />
    </AuthShell>
  );
}
