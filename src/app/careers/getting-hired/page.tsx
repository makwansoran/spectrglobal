import type { Metadata } from "next";
import { CareersApplyButton } from "@/components/careers/careers-apply-button";
import { hiringSteps } from "@/lib/careers";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Getting Hired",
  description:
    "How Spectr hires: speculative applications, a real conversation, a working session, and time on site.",
  path: "/careers/getting-hired",
});

export default function GettingHiredPage() {
  return (
    <main id="main-content" className="flex-1">
      <section className="px-6 py-14 lg:py-20">
        <div className="mx-auto grid w-full max-w-[1100px] gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <h1 className="m-0 text-[clamp(42px,6vw,64px)] font-semibold tracking-[-0.04em] text-[#0A0A0A]">
            Getting Hired
          </h1>
          <p className="max-w-md text-[15px] leading-7 text-[#6B6B72]">
            If you want to stare at a hard floor problem for years and have the freedom to solve it,
            we want to work with you. This is how the process actually runs.
          </p>
        </div>
      </section>

      <section className="border-t border-[#D2D2CE]">
        <div className="mx-auto w-full max-w-[1100px] divide-y divide-[#D2D2CE] px-6">
          {hiringSteps.map((step) => (
            <article key={step.index} className="grid gap-4 py-12 lg:grid-cols-[8rem_1fr_1.2fr] lg:gap-12">
              <p className="font-mono text-[13px] tracking-[0.08em] text-[#8A8A8F]">{step.index}</p>
              <h2 className="text-[1.9rem] font-medium tracking-[-0.02em] text-[#0A0A0A]">{step.title}</h2>
              <p className="text-[15px] leading-7 text-[#6B6B72]">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-[#D2D2CE] px-6 py-16">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h2 className="m-0 text-[clamp(28px,3.5vw,40px)] font-semibold tracking-[-0.015em] text-[#0A0A0A]">
              You belong here if the work is a match.
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-[#6B6B72]">
              Spectr hires for output and judgement, not pedigree. We are an equal opportunity
              employer. If you need an adjustment to the process, say so in your application.
            </p>
          </div>
          <CareersApplyButton href="/careers/apply">Apply Now →</CareersApplyButton>
        </div>
      </section>
    </main>
  );
}
