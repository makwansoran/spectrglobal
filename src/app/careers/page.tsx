import type { Metadata } from "next";
import { CareersApplyButton } from "@/components/careers/careers-apply-button";
import { CareersTracks } from "@/components/careers/careers-tracks";
import { EmptyListingsPanel } from "@/components/careers/empty-listings-panel";
import { careersIntro, whoWeAre } from "@/lib/careers";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Careers",
  description: careersIntro,
  path: "/careers",
});

export default function CareersPage() {
  return (
    <main id="main-content" className="flex-1">
      <section className="px-6 pb-10 pt-[100px] lg:pt-[128px]">
        <div className="mx-auto w-full max-w-[1100px]">
          <h1 className="m-0 max-w-[920px] text-[clamp(42px,7vw,72px)] font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-[#0A0A0A]">
            The world&apos;s
            <br />
            hardest work
            <br />
            is still
            <br />
            physical.
          </h1>
        </div>
      </section>

      <section className="px-6">
        <div className="mx-auto grid w-full max-w-[1100px] items-end gap-10 border-t border-[#D2D2CE] py-12 lg:grid-cols-[1fr_auto] lg:py-16">
          <div>
            <h2 className="m-0 text-[clamp(30px,4.4vw,46px)] font-semibold leading-[1.12] tracking-[-0.015em] text-[#0A0A0A]">
              Open Roles
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-[#6B6B72]">{careersIntro}</p>
          </div>
          <CareersApplyButton href="/careers/apply">Apply Now →</CareersApplyButton>
        </div>
      </section>

      <section className="border-t border-[#D2D2CE] px-6 py-16 sm:py-24">
        <div className="mx-auto w-full max-w-[1100px]">
          <h2 className="m-0 text-[clamp(30px,4.4vw,46px)] font-semibold leading-[1.12] tracking-[-0.015em] text-[#0A0A0A]">
            Who we are.
          </h2>
          <div className="mt-12 grid border-t border-[#D2D2CE] md:grid-cols-3">
            {whoWeAre.map((item, index) => (
              <article
                key={item.id}
                className={[
                  "border-b border-[#D2D2CE] py-8 md:border-b-0 md:py-10",
                  index > 0 ? "md:border-l md:pl-8" : "md:pr-8",
                  index === 1 ? "md:px-8" : "",
                  index === 2 ? "md:pl-8" : "",
                ].join(" ")}
              >
                <span className="font-mono text-[11px] tracking-[0.08em] text-[#8A8A8F]">
                  0{index + 1}
                </span>
                <h3 className="mt-5 text-2xl font-medium tracking-[-0.02em] text-[#0A0A0A]">{item.title}</h3>
                <p className="mt-3.5 max-w-[320px] text-sm leading-7 text-[#6B6B72]">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CareersTracks />

      <section className="px-4 pb-[140px] sm:px-6">
        <EmptyListingsPanel />
      </section>
    </main>
  );
}
