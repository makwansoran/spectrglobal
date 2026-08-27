import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/login-form";
import { safeNextPath } from "@/lib/auth/next-path";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Sign in",
    description: "Sign in to your Spectr account.",
    path: "/login",
  }),
  title: "Sign in",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const afterLogin = safeNextPath(next);

  return (
    <AuthShell
      title="Sign in to your account"
      subtitle="Enter your work email and password, then the code we email you."
    >
      <LoginForm next={afterLogin} kind="product" />
    </AuthShell>
  );
}
