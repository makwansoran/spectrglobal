import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/login-form";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Sign in",
    description: "Sign in to your Spectr account.",
    path: "/login",
  }),
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign in to your account"
      subtitle="Enter your work email to continue to Spectr."
      footer={
        <>
          New to Spectr?{" "}
          <Link href="/signup" className="font-medium text-[#635bff] hover:text-[#5851ea]">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
