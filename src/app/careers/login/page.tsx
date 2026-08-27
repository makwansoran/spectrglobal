import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/login-form";
import { safeNextPath } from "@/lib/auth/next-path";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Careers sign in",
  description: "Sign in to your Spectr careers account.",
  path: "/careers/login",
});

export default async function CareersLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const afterLogin = safeNextPath(next, "/careers/dashboard");

  return (
    <AuthShell
      homeHref="/careers"
      title="Careers sign in"
      subtitle="Enter your email and password, then the code we email you. Spectr OS uses a separate account."
    >
      <LoginForm next={afterLogin} kind="careers" />
    </AuthShell>
  );
}
