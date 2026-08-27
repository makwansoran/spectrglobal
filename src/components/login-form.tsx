"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { prepareAdminLogin, resolveLoginNext } from "@/app/actions/auth-login";
import { sendAuthOtp, verifyAuthOtp } from "@/app/actions/auth-otp";
import type { AccountKind } from "@/lib/auth/account";
import { defaultNextForKind } from "@/lib/auth/account";
import { isAdminIdentifier, normalizeAdminEmail } from "@/lib/auth/admin";
import { emailErrorForKind, normalizeEmail } from "@/lib/email";
import { safeNextPath } from "@/lib/auth/next-path";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({
  next,
  kind = "product",
}: {
  next?: string;
  kind?: AccountKind;
}) {
  const router = useRouter();
  const afterLogin = safeNextPath(next, defaultNextForKind(kind));
  const [step, setStep] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function sendCode(address: string) {
    const result = await sendAuthOtp({ email: address, kind, purpose: "login" });
    return result.error ?? null;
  }

  function loginAddress() {
    return isAdminIdentifier(email) ? normalizeAdminEmail(email) : normalizeEmail(email);
  }

  async function onPassword(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const emailError = emailErrorForKind(email, kind);
    if (emailError) {
      setError(emailError);
      return;
    }
    if (!password.trim()) {
      setError("Enter your password.");
      return;
    }

    const supabaseReady = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    );
    if (!supabaseReady) {
      setError("Supabase is not configured. Add the project URL and publishable key, then restart the app.");
      return;
    }

    setPending(true);
    const loginEmail = loginAddress();

    if (isAdminIdentifier(email)) {
      const prepared = await prepareAdminLogin({ identifier: email, password });
      if (!prepared.ok || !prepared.email) {
        setPending(false);
        setError(prepared.error && prepared.error !== "not-admin" ? prepared.error : "Incorrect email or password.");
        return;
      }
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    if (signInError) {
      setPending(false);
      setError(signInError.message);
      return;
    }

    await supabase.auth.signOut();
    const sendError = await sendCode(loginEmail);
    setPending(false);
    if (sendError) {
      setError(sendError);
      return;
    }
    setStep("otp");
  }

  async function onOtp(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const verified = await verifyAuthOtp({
      email: loginAddress(),
      code: otp,
      kind,
      purpose: "login",
    });
    if (!verified.ok || !verified.tokenHash) {
      setPending(false);
      setError(verified.error ?? "Could not verify that code.");
      return;
    }

    const supabase = createClient();
    const { error: sessionError } = await supabase.auth.verifyOtp({
      type: "magiclink",
      token_hash: verified.tokenHash,
    });
    if (sessionError) {
      setPending(false);
      setError(sessionError.message);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("product_access, careers_access")
      .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "")
      .maybeSingle();

    const dest = await resolveLoginNext({
      email: loginAddress(),
      kind,
      fallback: afterLogin,
    });

    if (kind === "product" && dest !== "/admin" && !profile?.product_access) {
      await supabase.auth.signOut();
      setPending(false);
      setError("This email is not a Spectr account. Use Careers login if you have a careers account.");
      setStep("password");
      return;
    }
    if (kind === "careers" && !profile?.careers_access) {
      await supabase.auth.signOut();
      setPending(false);
      setError("This email is not a careers account.");
      setStep("password");
      return;
    }

    router.replace(dest);
    router.refresh();
  }

  if (step === "otp") {
    return (
      <form onSubmit={onOtp} className="mt-6 space-y-5" noValidate>
        <div>
          <label htmlFor="login-otp" className="mb-2 block text-[13px] font-medium text-fg">
            Authentication code
          </label>
          <input
            id="login-otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
            className="field otp-input"
            placeholder="000000"
          />
        </div>
        {error ? <p role="alert" className="alert-error">{error}</p> : null}
        <button type="submit" disabled={pending} className="auth-submit">
          {pending ? "Verifying…" : "Verify and sign in"}
        </button>
        <button
          type="button"
          className="auth-submit auth-submit-secondary"
          disabled={pending}
          onClick={async () => {
            setError(null);
            setPending(true);
            const sendError = await sendCode(loginAddress());
            setPending(false);
            if (sendError) setError(sendError);
          }}
        >
          Resend code
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={onPassword} className="mt-6 space-y-5" noValidate>
      <div>
        <label htmlFor="login-email" className="mb-2 block text-[13px] font-medium text-fg">
          {kind === "careers" ? "Email" : "Work email"}
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="field"
          placeholder={kind === "careers" ? "you@email.com" : "you@company.com"}
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
        {pending ? "Sending code…" : "Continue"}
      </button>
    </form>
  );
}
