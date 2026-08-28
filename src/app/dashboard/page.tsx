import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandLink } from "@/components/logo";
import { InstallerPanel } from "@/components/installer-panel";
import { SignOutButton } from "@/components/sign-out-button";
import { getLocalSession } from "@/lib/auth/local-session";
import { spectrBootcamp } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getLocalSession();
  if (!session) redirect("/login");

  return (
    <div className="ops">
      <header className="ops-bar">
        <BrandLink href="/" />
        <div className="flex items-center gap-4">
          <SignOutButton dark href="/login" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <h1 className="ops-title">{site.product}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6b6b6b]">
          Signed in as {session.username}. SPECTR BOOTCAMP is included with this account.
        </p>

        <section className="mt-10 border border-black/10 p-6">
          <p className="ops-kicker">SPECTR BOOTCAMP</p>
          <h2 className="mt-2 text-xl font-medium tracking-[-0.03em]">{spectrBootcamp.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b6b6b]">{spectrBootcamp.body}</p>
          <Link href="/bootcamp" className="ops-get mt-6 inline-flex w-fit">
            Open bootcamp
          </Link>
        </section>

        <div className="mt-10">
          <InstallerPanel canDownload={false} />
        </div>
      </main>
    </div>
  );
}
