import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { SignupWizard } from "@/components/signup-wizard";

export const metadata: Metadata = {
  title: "Create account",
};

export default function SignupPage() {
  return (
    <AuthShell wide hideIntro>
      <SignupWizard />
    </AuthShell>
  );
}
