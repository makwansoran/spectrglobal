import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import { LoginShell } from "@/components/login-shell";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Sign in",
  description: "Sign in to your Spectr account.",
  path: "/login",
});

export default function LoginPage() {
  return <LoginShell form={<LoginForm />} />;
}
