import type { Metadata } from "next";
import Link from "next/link";
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
  const forBootcamp = afterLogin === "/bootcamp";

  return (
    <AuthShell
      title="Sign in to your account"
      subtitle={
        forBootcamp
          ? "Every Spectr account includes SPECTR BOOTCAMP. Enter your work email to continue."
          : "Enter your work email and password, then the code we email you."
      }
      footer={
        <>
          New to Spectr?{" "}
          <Link
            href={forBootcamp ? "/signup?next=%2Fbootcamp" : "/signup"}
            className="font-medium text-[#635bff] hover:text-[#5851ea]"
          >
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm next={afterLogin} kind="product" />
    </AuthShell>
  );
}
