"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function MfaVerifyForm() {
  const router = useRouter();
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    async function loadFactor() {
      const supabase = createClient();
      const { data } = await supabase.auth.mfa.listFactors();
      const totp = data?.totp.find((factor) => factor.status === "verified");
      if (!totp) {
        router.replace("/mfa/enroll");
        return;
      }
      setFactorId(totp.id);
    }
    loadFactor();
  }, [router]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!factorId) return;
    if (!/^\d{6}$/.test(code.trim())) {
      setError("Enter the 6-digit code from your authenticator app.");
      return;
    }

    setPending(true);
    setError(null);
    const supabase = createClient();
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId,
    });
    if (challengeError) {
      setPending(false);
      setError(challengeError.message);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code: code.trim(),
    });

    if (verifyError) {
      setPending(false);
      setError(verifyError.message);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      <div>
        <label htmlFor="verify-otp" className="mb-2 block text-[13px] font-medium text-fg">
          Authenticator code
        </label>
        <input
          id="verify-otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
          className="field otp-input"
          placeholder="000000"
        />
      </div>

      {error ? (
        <p role="alert" className="alert-error">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={pending || !factorId} className="auth-submit">
        {pending ? "Verifying…" : "Verify and continue"}
      </button>
    </form>
  );
}
