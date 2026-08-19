import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { MfaVerifyForm } from "@/components/mfa-verify-form";
import { requireUser } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "Verify 2FA",
};

export default async function MfaVerifyPage() {
  const { supabase } = await requireUser();
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.currentLevel === "aal2") redirect("/dashboard");

  const { data: factors } = await supabase.auth.mfa.listFactors();
  const hasVerifiedTotp = Boolean(factors?.totp.some((factor) => factor.status === "verified"));
  if (!hasVerifiedTotp) redirect("/mfa/enroll");

  return (
    <AuthShell
      title="Two-factor authentication"
      subtitle="Enter the 6-digit code from your authenticator app to continue."
    >
      <MfaVerifyForm />
    </AuthShell>
  );
}
