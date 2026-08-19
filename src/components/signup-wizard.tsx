"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ProgressSteps } from "@/components/progress-steps";
import { countries } from "@/lib/countries";
import { businessEmailError, normalizeEmail } from "@/lib/email";
import { createClient } from "@/lib/supabase/client";

type Step = 0 | 1 | 2 | 3;

function isUsername(value: string) {
  return /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/.test(value);
}

export function SignupWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("Norway");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const titles = [
    ["Work email", "Use a business email. Personal inboxes are not accepted."],
    ["Two-factor authentication", `Enter the 6-digit code we sent to ${email || "your work email"}.`],
    ["Create a password", "Choose a password for your Spectr account."],
    ["Username and profile", "This is how you will appear in Spectr."],
  ] as const;

  async function sendCode(address: string) {
    const supabase = createClient();
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: address,
      options: { shouldCreateUser: true },
    });
    return otpError?.message ?? null;
  }

  async function onEmail(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const emailError = businessEmailError(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    setPending(true);
    const sendError = await sendCode(normalizeEmail(email));
    setPending(false);
    if (sendError) {
      setError(sendError);
      return;
    }
    setStep(1);
  }

  async function onOtp(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setPending(true);
    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: normalizeEmail(email),
      token: otp.trim(),
      type: "email",
    });
    setPending(false);
    if (verifyError) {
      setError(verifyError.message);
      return;
    }
    setStep(2);
  }

  async function onPassword(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (password.length < 10) {
      setError("Password must be at least 10 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setPending(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setPending(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setStep(3);
  }

  async function onProfile(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const name = fullName.trim();
    const handle = username.trim().toLowerCase();
    if (!isUsername(handle)) {
      setError("Username must start with a letter and be 3–20 characters (letters, numbers, _).");
      return;
    }
    if (name.length < 2) {
      setError("Enter your full name.");
      return;
    }
    if (!country) {
      setError("Select where you are from.");
      return;
    }

    setPending(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setPending(false);
      setError("Your session expired. Start again from your work email.");
      setStep(0);
      return;
    }

    const { error: metaError } = await supabase.auth.updateUser({
      data: { username: handle, full_name: name, country },
    });
    if (metaError) {
      setPending(false);
      setError(metaError.message);
      return;
    }

    const profile = {
      id: user.id,
      full_name: name,
      country,
      email: user.email ?? normalizeEmail(email),
      username: handle,
    };
    const { error: profileError } = await supabase.from("profiles").upsert(profile);
    if (profileError) {
      const { username: _username, ...withoutUsername } = profile;
      void _username;
      const { error: fallbackError } = await supabase.from("profiles").upsert(withoutUsername);
      if (fallbackError) {
        setPending(false);
        setError(fallbackError.message);
        return;
      }
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <div>
      <ProgressSteps current={step} />
      <h1 className="text-center text-[22px] font-semibold tracking-[-0.01em] text-[#0a2540]">
        {titles[step][0]}
      </h1>
      <p className="mt-2 text-center text-[14px] leading-6 text-[#697386]">{titles[step][1]}</p>

      {step === 0 ? (
        <form onSubmit={onEmail} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="signup-email" className="mb-2 block text-[13px] font-medium text-fg">
              Business email
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field"
              placeholder="you@company.com"
            />
          </div>
          {error ? <p role="alert" className="alert-error">{error}</p> : null}
          <button type="submit" disabled={pending} className="auth-submit">
            {pending ? "Sending code…" : "Continue"}
          </button>
          <p className="text-center text-[13px] text-[#425466]">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#635bff] hover:text-[#5851ea]">
              Sign in
            </Link>
          </p>
        </form>
      ) : null}

      {step === 1 ? (
        <form onSubmit={onOtp} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="signup-otp" className="mb-2 block text-[13px] font-medium text-fg">
              Authentication code
            </label>
            <input
              id="signup-otp"
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
            {pending ? "Verifying…" : "Verify and continue"}
          </button>
          <button
            type="button"
            className="auth-submit auth-submit-secondary"
            disabled={pending}
            onClick={async () => {
              setError(null);
              setPending(true);
              const sendError = await sendCode(normalizeEmail(email));
              setPending(false);
              if (sendError) setError(sendError);
            }}
          >
            Resend code
          </button>
          <button type="button" className="w-full text-[13px] font-medium text-[#635bff]" onClick={() => setStep(0)}>
            Use a different email
          </button>
        </form>
      ) : null}

      {step === 2 ? (
        <form onSubmit={onPassword} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="signup-password" className="mb-2 block text-[13px] font-medium text-fg">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="field"
              placeholder="At least 10 characters"
            />
          </div>
          <div>
            <label htmlFor="signup-confirm" className="mb-2 block text-[13px] font-medium text-fg">
              Confirm password
            </label>
            <input
              id="signup-confirm"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="field"
            />
          </div>
          {error ? <p role="alert" className="alert-error">{error}</p> : null}
          <button type="submit" disabled={pending} className="auth-submit">
            {pending ? "Saving…" : "Continue"}
          </button>
        </form>
      ) : null}

      {step === 3 ? (
        <form onSubmit={onProfile} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="signup-username" className="mb-2 block text-[13px] font-medium text-fg">
              Username
            </label>
            <input
              id="signup-username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="field"
              placeholder="ada_lovelace"
            />
          </div>
          <div>
            <label htmlFor="signup-name" className="mb-2 block text-[13px] font-medium text-fg">
              Full name
            </label>
            <input
              id="signup-name"
              autoComplete="name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="field"
              placeholder="Ada Lovelace"
            />
          </div>
          <div>
            <label htmlFor="signup-country" className="mb-2 block text-[13px] font-medium text-fg">
              Where are you from?
            </label>
            <select
              id="signup-country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="field"
            >
              {countries.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          {error ? <p role="alert" className="alert-error">{error}</p> : null}
          <button type="submit" disabled={pending} className="auth-submit">
            {pending ? "Finishing…" : "Go to dashboard"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
