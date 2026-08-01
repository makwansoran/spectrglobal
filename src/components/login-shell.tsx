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
        className="pointer-events-none absolute inset-x-0 top-[42%] z-[1] h-[18%] bg-gradient-to-b from-transparent to-white/40"
        aria-hidden
      />

      {/* Tilted bottom plane — cuts the shader at ~50% */}
      <div
        className="absolute bottom-[-12%] left-[-8%] right-[-8%] z-[2] h-[58%] origin-center bg-white shadow-[0_-24px_80px_rgba(10,37,64,0.12)]"
        style={{ transform: "rotate(-3.5deg)" }}
        aria-hidden
      />

      <div className="relative z-[3] flex min-h-screen flex-col">
        <div className="flex flex-[0.95] items-end justify-center px-5 pb-6 pt-[48vh] sm:pb-10 sm:pt-[46vh]">
          <div className="w-full max-w-[400px]">
            <Link href="/" className="mb-8 flex items-center justify-center gap-2.5 hover:opacity-80">
              <LogoMark className="h-8 w-8" />
              <Wordmark className="text-[#0a2540]" />
            </Link>

            <div className="rounded-xl border border-[#e3e8ee]/80 bg-white/95 p-8 shadow-[0_12px_40px_rgba(18,38,63,0.08)] backdrop-blur-sm">
              <h1 className="text-center text-[22px] font-semibold tracking-[-0.01em] text-[#0a2540]">
                Sign in to your account
              </h1>
              <p className="mt-2 text-center text-[14px] leading-6 text-[#697386]">
                Enter your work email to continue to Spectr.
              </p>

              <Suspense fallback={<div className="mt-8 h-40 animate-pulse rounded-md bg-[#f6f9fc]" />}>
                {form}
              </Suspense>
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
      </div>
    </main>
  );
}
