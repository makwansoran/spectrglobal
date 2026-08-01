"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/app";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!password.trim()) {
      setError("Enter your password.");
      return;
    }

    setPending(true);
    try {
      let signedIn = false;

      // Dev / demo credentials first (simple single-user gate)
      const demoRes = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, password }),
      });
      if (demoRes.ok) {
        signedIn = true;
      }

      if (
        !signedIn &&
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        try {
          const supabase = createClient();
          const { error: signError } = await supabase.auth.signInWithPassword({
            email: trimmed,
            password,
          });
          if (!signError) signedIn = true;
        } catch {
          // ignore
        }
      }

      if (!signedIn) {
        setError("Incorrect email or password.");
        return;
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
    <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
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
          className="w-full rounded-md border border-[#e3e8ee] bg-white px-3.5 py-2.5 text-[15px] text-[#30313d] outline-none transition-[border-color,box-shadow] placeholder:text-[#a3acb9] focus:border-[#2563eb] focus:shadow-[0_0_0_1px_#2563eb]"
          placeholder="dev@spectr.no"
        />
      </div>

      <div>
        <label htmlFor="login-password" className="mb-2 block text-[13px] font-medium text-[#30313d]">
          Password
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-md border border-[#e3e8ee] bg-white px-3.5 py-2.5 text-[15px] text-[#30313d] outline-none transition-[border-color,box-shadow] placeholder:text-[#a3acb9] focus:border-[#2563eb] focus:shadow-[0_0_0_1px_#2563eb]"
          placeholder="••••••••"
        />
      </div>

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
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
