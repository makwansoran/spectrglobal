"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { safeNextPath } from "@/lib/auth/next-path";

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const afterLogin = safeNextPath(next, "/dashboard");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }

    setPending(true);
    const response = await fetch("/api/auth/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    setPending(false);

    if (!response.ok) {
      setError(payload?.error ?? "Could not sign in.");
      return;
    }

    router.replace(afterLogin);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
      <div>
        <label htmlFor="login-username" className="mb-2 block text-[13px] font-medium text-fg">
          Username
        </label>
        <input
          id="login-username"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="field"
          placeholder="Username"
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
          placeholder="Password"
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
