import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { MfaEnrollForm } from "@/components/mfa-enroll-form";
import { requireUser } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "Set up 2FA",
};

export default async function MfaEnrollPage() {
  const { supabase } = await requireUser();
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.currentLevel === "aal2") redirect("/dashboard");

  return (
    <AuthShell
      title="Turn on two-factor authentication"
      subtitle="Scan the QR code with an authenticator app such as Google Authenticator, 1Password, or Authy."
    >
      <MfaEnrollForm />
    </AuthShell>
  );
}
