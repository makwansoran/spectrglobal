import type { Metadata } from "next";
import Link from "next/link";
import { BrandLink } from "@/components/logo";
import { SignOutButton } from "@/components/sign-out-button";
import { requireCareersUser } from "@/lib/auth/guards";
import { openRoles } from "@/lib/careers";

export const metadata: Metadata = {
  title: "Careers dashboard",
};

export default async function CareersDashboardPage() {
  const { user } = await requireCareersUser();

  return (
    <div className="ops min-h-screen bg-white">
      <header className="ops-bar">
        <BrandLink href="/careers" />
        <SignOutButton dark href="/careers/login" />
      </header>

      <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        <p className="ops-kicker">Careers</p>
        <h1 className="ops-title">Dashboard</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6b6b6b]">
          Signed in as {user.email}. Open a position to read the role, then apply.
        </p>

        <section className="mt-10">
          <p className="ops-kicker">Open positions</p>
          {openRoles.length === 0 ? (
            <p className="mt-4 text-sm text-[#6b6b6b]">No listings are open right now.</p>
          ) : (
            <ul className="mt-4 divide-y divide-black/10 border-y border-black/10">
              {openRoles.map((role) => (
                <li key={role.id}>
                  <Link
                    href={role.href}
                    className="grid gap-1 py-5 transition-colors hover:bg-[#fafafa] sm:grid-cols-[1.4fr_0.8fr_0.8fr_auto] sm:items-center sm:gap-6 sm:px-2"
                  >
                    <span className="font-medium text-[#0a0a0a]">{role.title}</span>
                    <span className="text-sm text-[#6b6b6b]">{role.team}</span>
                    <span className="text-sm text-[#6b6b6b]">{role.location}</span>
                    <span className="text-sm text-[#0a0a0a]">View →</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
