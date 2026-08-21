import type { Metadata } from "next";
import Image from "next/image";
import { CareersApplyButton } from "@/components/careers/careers-apply-button";
import { OpenRolesBoard } from "@/components/careers/open-roles-board";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Open Positions",
  description:
    "Posted Spectr roles, when we are ready to fill them. Speculative applications from strong engineers are read properly.",
  path: "/careers/open-positions",
});

export default function OpenPositionsPage() {
  return (
    <main id="main-content" className="flex-1">
      <section className="px-6 py-14 lg:py-20">
        <div className="mx-auto grid w-full max-w-[1100px] gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <h1 className="m-0 text-[clamp(42px,6vw,64px)] font-semibold tracking-[-0.04em] text-[#0A0A0A]">
            Open Positions
          </h1>
          <p className="max-w-md text-[15px] leading-7 text-[#6B6B72]">
            We deliver software for warehouses and industrial floors. We only post roles we are ready
            to fill — and we still read speculative applications.
          </p>
        </div>
      </section>

      <section className="border-t border-[#D2D2CE] px-6">
        <div className="mx-auto grid w-full max-w-[1100px] gap-10 py-14 lg:grid-cols-[1fr_1fr_0.9fr] lg:items-start lg:gap-12 lg:py-16">
          <h2 className="m-0 text-[clamp(28px,3.5vw,40px)] font-semibold leading-[1.12] tracking-[-0.015em] text-[#0A0A0A]">
            Build the future, while building your career.
          </h2>
          <p className="border-l border-[#D2D2CE] pl-6 text-[15px] leading-7 text-[#6B6B72] lg:pl-8">
            Spectr trusts engineers to make an impact from day one. Ship into a live runtime, stand
            on a real floor, and take responsibility for software operators depend on. Internship
            and early-talent applications are open even when listed roles are not.
          </p>
          <div className="relative aspect-[16/11] overflow-hidden bg-[#EEE]">
            <Image
              src="/images/products/spectr-os-ui.png"
              alt="Spectr OS interface"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 28vw"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-[#D2D2CE] px-6 pb-[80px] pt-10">
        <div className="mx-auto w-full max-w-[1100px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="m-0 text-[clamp(28px,3vw,40px)] font-semibold tracking-[-0.015em] text-[#0A0A0A]">
              Search roles
            </h2>
            <CareersApplyButton href="/careers/apply" variant="outline">
              Apply Now →
            </CareersApplyButton>
          </div>
          <OpenRolesBoard />
        </div>
      </section>
    </main>
  );
}
