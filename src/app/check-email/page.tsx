import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = {
  title: "Check your email",
};

export default function CheckEmailPage() {
  return (
    <AuthShell
      title="Confirm your work email"
      subtitle="We sent a confirmation link to your business inbox. Open it to finish creating your account and set up 2FA."
      footer={
        <Link href="/login" className="font-medium text-[#635bff] hover:text-[#5851ea]">
          Back to sign in
        </Link>
      }
    >
      <p className="mt-8 text-center text-[14px] text-muted">
        After you confirm, you will be asked to enable an authenticator app.
      </p>
    </AuthShell>
  );
}
