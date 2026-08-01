"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "password">("email");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function onContinue(event: FormEvent) {
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
    window.setTimeout(() => {
      setPending(false);
      setError("Incorrect email or password.");
    }, 700);
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
          className="w-full rounded-md border border-[#e3e8ee] bg-white px-3.5 py-2.5 text-[15px] text-[#30313d] outline-none transition-[border-color,box-shadow] placeholder:text-[#a3acb9] focus:border-[#16a34a] focus:shadow-[0_0_0_1px_#16a34a] disabled:bg-[#f6f9fc] disabled:text-[#697386]"
          placeholder="you@company.com"
        />
        {step === "password" ? (
          <button
            type="button"
            className="mt-2 text-[13px] font-medium text-[#16a34a] hover:text-[#15803d]"
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
            <Link href="/contact" className="text-[13px] font-medium text-[#16a34a] hover:text-[#15803d]">
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
            className="w-full rounded-md border border-[#e3e8ee] bg-white px-3.5 py-2.5 text-[15px] text-[#30313d] outline-none transition-[border-color,box-shadow] placeholder:text-[#a3acb9] focus:border-[#16a34a] focus:shadow-[0_0_0_1px_#16a34a]"
            placeholder="Enter your password"
          />
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="rounded-md border border-[#f5c2c7] bg-[#fff5f5] px-3.5 py-2.5 text-[13px] text-[#b42318]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-md bg-[#16a34a] px-4 py-2.5 text-[15px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in…" : step === "email" ? "Continue" : "Sign in"}
      </button>
    </form>
  );
}
