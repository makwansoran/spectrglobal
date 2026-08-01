"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/app";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "password">("email");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onContinue(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (step === "email") {
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError("Enter a valid email address.");
        return;
      }
      setStep("password");
      return;
    }

    if (!password.trim()) {
      setError("Enter your password.");
      return;
    }

    setPending(true);
    try {
      const trimmed = email.trim();
      let signedIn = false;

      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        try {
          const supabase = createClient();
          const { error: signError } = await supabase.auth.signInWithPassword({
            email: trimmed,
            password,
          });
          if (!signError) signedIn = true;
        } catch {
          // fall through to demo auth
        }
      }

      if (!signedIn) {
        const demoRes = await fetch("/api/auth/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmed, password }),
        });
        if (!demoRes.ok) {
          const body = (await demoRes.json().catch(() => null)) as { error?: string } | null;
          setError(body?.error || "Incorrect email or password.");
          return;
        }
      }

      router.replace(next.startsWith("/") ? next : "/app");
      router.refresh();
    } catch {
      setError("Could not sign in. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onContinue} className="mt-8 space-y-5" noValidate>
      <div>
        <label htmlFor="login-email" className="mb-2 block text-[13px] font-medium text-[#30313d]">
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={step === "password"}
          className="w-full rounded-md border border-[#e3e8ee] bg-white px-3.5 py-2.5 text-[15px] text-[#30313d] outline-none transition-[border-color,box-shadow] placeholder:text-[#a3acb9] focus:border-[#2563eb] focus:shadow-[0_0_0_1px_#2563eb] disabled:bg-[#f6f9fc] disabled:text-[#697386]"
          placeholder="you@company.com"
        />
        {step === "password" ? (
          <button
            type="button"
            className="mt-2 text-[13px] font-medium text-[#2563eb] hover:text-[#1d4ed8]"
            onClick={() => {
              setStep("email");
              setPassword("");
              setError(null);
            }}
          >
            Use a different email
          </button>
        ) : null}
      </div>

      {step === "password" ? (
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="login-password" className="text-[13px] font-medium text-[#30313d]">
              Password
            </label>
            <Link href="/contact" className="text-[13px] font-medium text-[#2563eb] hover:text-[#1d4ed8]">
              Forgot password?
            </Link>
          </div>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoFocus
            className="w-full rounded-md border border-[#e3e8ee] bg-white px-3.5 py-2.5 text-[15px] text-[#30313d] outline-none transition-[border-color,box-shadow] placeholder:text-[#a3acb9] focus:border-[#2563eb] focus:shadow-[0_0_0_1px_#2563eb]"
            placeholder="Enter your password"
          />
        </div>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="rounded-md border border-[#f5c2c7] bg-[#fff5f5] px-3.5 py-2.5 text-[13px] text-[#b42318]"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-md bg-[#2563eb] px-4 py-2.5 text-[15px] font-medium text-white transition-opacity hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in…" : step === "email" ? "Continue" : "Sign in"}
      </button>
    </form>
  );
}
