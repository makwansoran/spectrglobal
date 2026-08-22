import type { Metadata } from "next";
import Link from "next/link";
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
      subtitle="This login is only for the careers dashboard. Spectr OS uses a separate account."
      footer={
        <>
          Need a careers account?{" "}
          <Link href="/careers/signup" className="font-medium text-[#635bff] hover:text-[#5851ea]">
            Create one
          </Link>
        </>
      }
    >
      <LoginForm next={afterLogin} kind="careers" />
    </AuthShell>
  );
}
