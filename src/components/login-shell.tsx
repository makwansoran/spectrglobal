"use client";

import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { LogoMark, Wordmark } from "@/components/logo";

const LiquidShaderTwist = dynamic(
  () => import("@/components/liquid-shader-twist").then((m) => m.LiquidShaderTwist),
  { ssr: false },
);

export function LoginShell({ form }: { form: ReactNode }) {
  return (
    <main id="main-content" className="relative min-h-screen overflow-hidden bg-[#e8f4fc] text-[#30313d]">
      <LiquidShaderTwist />

      <div
        className="pointer-events-none absolute inset-x-0 top-[28%] z-[1] h-[18%] bg-gradient-to-b from-transparent to-white/35"
        aria-hidden
      />

      {/* Tilted bottom plane — higher cut so more form sits up the page */}
      <div
        className="absolute bottom-[-8%] left-[-8%] right-[-8%] z-[2] h-[68%] origin-center bg-white shadow-[0_-24px_80px_rgba(10,37,64,0.12)]"
        style={{ transform: "rotate(-3.5deg)" }}
        aria-hidden
      />

      <Link
        href="/"
        className="absolute left-5 top-5 z-[4] flex items-center gap-2.5 hover:opacity-80 sm:left-8 sm:top-7"
      >
        <LogoMark invert className="h-8 w-8" />
        <Wordmark className="text-white" />
      </Link>

      <div className="relative z-[3] flex min-h-screen flex-col">
        <div className="flex flex-1 items-start justify-center px-5 pb-6 pt-[30vh] sm:pb-10 sm:pt-[28vh]">
          <div className="w-full max-w-[400px]">
            <div className="rounded-xl border border-[#e3e8ee]/80 bg-white/95 p-8 shadow-[0_12px_40px_rgba(18,38,63,0.08)] backdrop-blur-sm">
              <h1 className="text-center text-[22px] font-semibold tracking-[-0.01em] text-[#0a2540]">
                Sign in to your account
              </h1>
              <p className="mt-2 text-center text-[14px] leading-6 text-[#697386]">
                Enter your email and password to continue.
              </p>

              <Suspense fallback={<div className="mt-8 h-40 animate-pulse rounded-md bg-[#f6f9fc]" />}>
                {form}
              </Suspense>
            </div>

            <p className="mt-6 text-center text-[13px] leading-6 text-[#697386]">
              New to Spectr?{" "}
              <Link href="/contact" className="font-medium text-[#2563eb] hover:text-[#1d4ed8]">
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
      </div>
    </main>
  );
}
