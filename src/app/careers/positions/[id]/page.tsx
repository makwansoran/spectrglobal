import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BrandLink } from "@/components/logo";
import { SignOutButton } from "@/components/sign-out-button";
import { requireCareersUser } from "@/lib/auth/guards";
import { getOpenRole, openRoles } from "@/lib/careers";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return openRoles.map((role) => ({ id: role.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const role = getOpenRole(id);
  return { title: role ? role.title : "Position" };
}

export default async function CareerPositionPage({ params }: Props) {
  await requireCareersUser();
  const { id } = await params;
  const role = getOpenRole(id);
  if (!role) notFound();

  return (
    <div className="ops min-h-screen bg-white">
      <header className="ops-bar">
        <BrandLink href="/careers/dashboard" />
        <SignOutButton dark href="/careers/login" />
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <Link href="/careers/dashboard" className="text-sm text-[#6b6b6b] hover:text-[#0a0a0a]">
          ← Open positions
        </Link>
        <p className="ops-kicker mt-8">{role.team}</p>
        <h1 className="ops-title">{role.title}</h1>
        <p className="mt-3 text-sm text-[#6b6b6b]">
          {role.location} · {role.type}
        </p>
        <p className="mt-8 text-[15px] leading-7 text-[#3d3d3d]">{role.body}</p>
        <Link
          href={`/careers/apply?role=${role.id}`}
          className="ops-get mt-10 inline-flex w-fit"
        >
          Apply
        </Link>
      </main>
    </div>
  );
}
