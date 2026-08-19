import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BrandLink } from "@/components/logo";
import { InstallerPanel } from "@/components/installer-panel";
import { SignOutButton } from "@/components/sign-out-button";
import { getAuthUser } from "@/lib/auth/guards";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Install desktop app",
};

export default async function DashboardPage() {
  const { user } = await getAuthUser();
  if (!user && process.env.NODE_ENV !== "development") redirect("/login");

  return (
    <div className="ops">
      <header className="ops-bar">
        <BrandLink href="/" />
        {user ? <SignOutButton dark /> : null}
      </header>

      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <h1 className="ops-title">{site.product}</h1>
        <div className="mt-10">
          <InstallerPanel />
        </div>
      </main>
    </div>
  );
}
