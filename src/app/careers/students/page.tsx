import type { Metadata } from "next";
import { CareersApplyButton } from "@/components/careers/careers-apply-button";
import { studentTracks } from "@/lib/careers";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Students and Early Talent",
  description:
    "Internships, new graduates, and early-career engineering at Spectr. Impact from day one on Spectr OS.",
  path: "/careers/students",
});

export default function StudentsPage() {
  return (
    <main id="main-content" className="flex-1">
      <section className="px-6 py-14 lg:py-20">
        <div className="mx-auto grid w-full max-w-[1100px] gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <h1 className="m-0 text-[clamp(36px,5.5vw,58px)] font-semibold tracking-[-0.04em] text-[#0A0A0A]">
            Students and Early Talent
          </h1>
          <p className="max-w-md text-[15px] leading-7 text-[#6B6B72]">
            We trust early talent to ship into production. Create real-world value on Spectr OS —
            internships and new-graduate applications are read even when the board is empty.
          </p>
        </div>
      </section>

      <section className="border-t border-[#D2D2CE]">
        <div className="mx-auto grid w-full max-w-[1100px] gap-0 px-6 md:grid-cols-3">
          {studentTracks.map((track, index) => (
            <article
              key={track.title}
              className={`py-14 md:px-8 md:py-16 ${index > 0 ? "md:border-l md:border-[#D2D2CE]" : ""} ${index === 0 ? "md:pl-0" : ""}`}
            >
              <h2 className="text-[1.9rem] font-medium tracking-[-0.02em] text-[#0A0A0A]">{track.title}</h2>
              <p className="mt-4 text-[15px] leading-7 text-[#6B6B72]">{track.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-[#D2D2CE] px-6 py-16">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-lg text-[15px] leading-7 text-[#6B6B72]">
            Apply with a letter about something you have built. A thesis, a system, a warehouse
            tool, a side project that got too real — we want the hard part.
          </p>
          <CareersApplyButton href="/careers/apply?area=students">Apply Now →</CareersApplyButton>
        </div>
      </section>
    </main>
  );
}
