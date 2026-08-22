import type { Metadata } from "next";
import Link from "next/link";
import { setOsDownloadGranted } from "@/app/actions/admin";
import { BrandLink } from "@/components/logo";
import { SignOutButton } from "@/components/sign-out-button";
import { requireAdminUser } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Admin",
};

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  product_access: boolean;
  os_download_granted: boolean;
};

export default async function AdminPage() {
  const { user } = await requireAdminUser();
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id, email, full_name, product_access, os_download_granted")
    .eq("product_access", true)
    .order("email");
  const profiles = (data ?? []) as ProfileRow[];

  return (
    <div className="ops min-h-screen bg-white">
      <header className="ops-bar">
        <BrandLink href="/dashboard" />
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-white/80 hover:text-white">
            User dashboard
          </Link>
          <SignOutButton dark href="/login" />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        <p className="ops-kicker">Admin</p>
        <h1 className="ops-title">Access</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6b6b6b]">
          Signed in as {user.email}. Spectr OS download stays locked until you grant it here.
        </p>

        <section className="mt-10">
          <p className="ops-kicker">Spectr accounts</p>
          {profiles.length === 0 ? (
            <p className="mt-4 text-sm text-[#6b6b6b]">No product accounts yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-black/10 border-y border-black/10">
              {profiles.map((profile) => (
                <li key={profile.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
                  <div>
                    <p className="font-medium text-[#0a0a0a]">{profile.email}</p>
                    {profile.full_name ? (
                      <p className="mt-1 text-sm text-[#6b6b6b]">{profile.full_name}</p>
                    ) : null}
                    <p className="mt-1 text-sm text-[#6b6b6b]">
                      {profile.os_download_granted ? "Spectr OS download granted" : "Download locked"}
                    </p>
                  </div>
                  <form action={setOsDownloadGranted}>
                    <input type="hidden" name="userId" value={profile.id} />
                    <input
                      type="hidden"
                      name="granted"
                      value={profile.os_download_granted ? "false" : "true"}
                    />
                    <button type="submit" className="ops-get">
                      {profile.os_download_granted ? "Revoke download" : "Grant download"}
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
