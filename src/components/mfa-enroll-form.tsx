"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type EnrollState = {
  factorId: string;
  qr: string;
  secret: string;
};

export function MfaEnrollForm() {
  const router = useRouter();
  const [enroll, setEnroll] = useState<EnrollState | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function startEnroll() {
      const supabase = createClient();
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const verified = factors?.totp.find((factor) => factor.status === "verified");
      if (verified) {
        router.replace("/mfa/verify");
        return;
      }

      const unverified = (factors?.all ?? []).filter((factor) => factor.status !== "verified");
      for (const factor of unverified) {
        await supabase.auth.mfa.unenroll({ factorId: factor.id });
      }

      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Spectr authenticator",
      });

      if (cancelled) return;

      if (enrollError || !data?.totp) {
        setError(enrollError?.message ?? "Could not start two-factor setup.");
        setLoading(false);
        return;
      }

      setEnroll({
        factorId: data.id,
        qr: data.totp.qr_code,
        secret: data.totp.secret,
      });
      setLoading(false);
    }

    startEnroll();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!enroll) return;
    if (!/^\d{6}$/.test(code.trim())) {
      setError("Enter the 6-digit code from your authenticator app.");
      return;
    }

    setPending(true);
    setError(null);
    const supabase = createClient();
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId: enroll.factorId,
    });
    if (challengeError) {
      setPending(false);
      setError(challengeError.message);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: enroll.factorId,
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

  if (loading) {
    return <p className="mt-8 text-center text-[14px] text-muted">Preparing authenticator setup…</p>;
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      {enroll ? (
        <div className="rounded-md border border-border bg-surface-2 p-4 text-center">
          {/* supabase returns a data-URI SVG */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={enroll.qr} alt="Authenticator QR code" className="mx-auto h-44 w-44 bg-white p-2" />
          <p className="mt-3 text-[12px] text-muted">
            Can&apos;t scan? Enter this key manually:
          </p>
          <p className="mt-1 break-all font-mono text-[12px] text-[#0a2540]">{enroll.secret}</p>
        </div>
      ) : null}

      <div>
        <label htmlFor="enroll-otp" className="mb-2 block text-[13px] font-medium text-fg">
          Confirmation code
        </label>
        <input
          id="enroll-otp"
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

      <button type="submit" disabled={pending || !enroll} className="auth-submit">
        {pending ? "Enabling…" : "Enable two-factor authentication"}
      </button>
    </form>
  );
}
