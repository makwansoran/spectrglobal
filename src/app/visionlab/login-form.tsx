"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function VisionLabLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    setPending(true);
    const response = await fetch("/api/auth/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email.trim(), password }),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string; next?: string } | null;
    setPending(false);

    if (!response.ok) {
      setError(payload?.error ?? "Could not sign in.");
      return;
    }

    router.replace(payload?.next || "/dashboard");
    router.refresh();
  }

  async function signInWith(provider: "github" | "google") {
    setError(null);
    if (!isSupabaseConfigured()) {
      setError("Sign-in is not available.");
      return;
    }

    const { error: oauthError } = await createClient().auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthError) setError(oauthError.message);
  }

  return (
    <form className="visionlab-login" onSubmit={onSubmit} noValidate>
      <h1>Sign in</h1>
      <label className="sr-only" htmlFor="visionlab-email">
        Email
      </label>
      <input
        id="visionlab-email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <label className="sr-only" htmlFor="visionlab-password">
        Password
      </label>
      <input
        id="visionlab-password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      {error ? (
        <p className="visionlab-login__error" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={pending}>
        {pending ? "Signing in" : "Sign in"}
      </button>
      <button type="button" className="visionlab-login__provider" onClick={() => signInWith("github")}>
        Sign in with GitHub
      </button>
      <button type="button" className="visionlab-login__provider" onClick={() => signInWith("google")}>
        Sign in with Google
      </button>
    </form>
  );
}
