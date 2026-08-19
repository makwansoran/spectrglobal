"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { businessEmailError, normalizeEmail } from "@/lib/email";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const emailError = businessEmailError(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    if (!password.trim()) {
      setError("Enter your password.");
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizeEmail(email),
      password,
    });

    if (signInError) {
      setPending(false);
      setError(signInError.message);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
      <div>
        <label htmlFor="login-email" className="mb-2 block text-[13px] font-medium text-fg">
          Work email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="field"
          placeholder="you@company.com"
        />
      </div>
      <div>
        <label htmlFor="login-password" className="mb-2 block text-[13px] font-medium text-fg">
          Password
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="field"
          placeholder="Enter your password"
        />
      </div>

      {error ? (
        <p role="alert" className="alert-error">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="auth-submit">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
