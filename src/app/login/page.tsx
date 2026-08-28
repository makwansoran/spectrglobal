import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import { LoginSplitShell } from "@/components/login-split-shell";
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
    <LoginSplitShell
      title="Sign in to your account"
      subtitle="Enter your username and password."
    >
      <LoginForm next={afterLogin} />
    </LoginSplitShell>
  );
}
