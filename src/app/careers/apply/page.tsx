import type { Metadata } from "next";
import Link from "next/link";
import { CareerApplyForm } from "@/components/careers/career-apply-form";
import { BrandLink } from "@/components/logo";
import { SignOutButton } from "@/components/sign-out-button";
import { requireCareersUser } from "@/lib/auth/guards";
import { getOpenRole } from "@/lib/careers";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Apply",
  description: "Apply for an open Spectr position.",
  path: "/careers/apply",
});

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; role?: string }>;
}) {
  await requireCareersUser();
  const { area = "", role: roleId = "" } = await searchParams;
  const role = roleId ? getOpenRole(roleId) : undefined;

  return (
    <div className="ops min-h-screen bg-white">
      <header className="ops-bar">
        <BrandLink href="/careers/dashboard" />
        <SignOutButton dark href="/careers/login" />
      </header>
      <main className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8">
        <Link href={role ? role.href : "/careers/dashboard"} className="text-sm text-[#6b6b6b] hover:text-[#0a0a0a]">
          ← {role ? role.title : "Dashboard"}
        </Link>
        <div className="mt-8 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h1 className="ops-title">Apply</h1>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-[#6B6B72]">
              {role
                ? `You are applying for ${role.title}. Tell us something you have built and why it was hard.`
                : "Choose an area and tell us something you have built and why it was hard."}
            </p>
          </div>
          <CareerApplyForm defaultArea={area} defaultRoleTitle={role?.title} />
        </div>
      </main>
    </div>
  );
}
