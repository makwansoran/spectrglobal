import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { LogoMark, Wordmark } from "@/components/logo";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Sign in",
  description: "Sign in to your Spectr account.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <main id="main-content" className="flex min-h-screen flex-col bg-[#f6f9fc] text-[#30313d]">
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-16">
        <div className="w-full max-w-[380px]">
          <Link href="/" className="mb-10 flex items-center justify-center gap-2.5 hover:opacity-80">
            <LogoMark className="h-8 w-8" />
            <Wordmark className="text-[#0a2540]" />
          </Link>

          <div className="rounded-lg border border-[#e3e8ee] bg-white p-8 shadow-[0_2px_5px_rgba(18,38,63,0.04)]">
            <h1 className="text-center text-[22px] font-semibold tracking-[-0.01em] text-[#0a2540]">
              Sign in to your account
            </h1>
            <p className="mt-2 text-center text-[14px] leading-6 text-[#697386]">
              Enter your work email to continue to Spectr.
            </p>

            <LoginForm />
          </div>

          <p className="mt-6 text-center text-[13px] leading-6 text-[#697386]">
            New to Spectr?{" "}
            <Link href="/contact" className="font-medium text-[#16a34a] hover:text-[#15803d]">
              Get started
            </Link>
          </p>
        </div>
      </div>

      <footer className="px-5 pb-8 text-center text-[12px] text-[#8792a2]">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link href="/privacy" className="hover:text-[#0a2540]">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-[#0a2540]">
            Terms
          </Link>
          <Link href="/" className="hover:text-[#0a2540]">
            Spectr home
          </Link>
        </div>
      </footer>
    </main>
  );
}
