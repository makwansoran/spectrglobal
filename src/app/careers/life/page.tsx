import type { Metadata } from "next";
import Image from "next/image";
import { CareersApplyButton } from "@/components/careers/careers-apply-button";
import { JoinTeamImage } from "@/components/careers/join-team-image";
import { lifeFacts, whoWeAre } from "@/lib/careers";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Life at Spectr",
  description: "A small Norwegian team building Spectr OS, close to the operators who use it.",
  path: "/careers/life",
});

const scenes = [
  {
    src: "/images/industries/warehousing.jpg",
    alt: "Warehouse operations",
    label: "The floor",
  },
  {
    src: "/images/industries/logistics.jpg",
    alt: "Logistics site",
    label: "The network",
  },
  {
    src: "/images/industries/manufacturing.jpg",
    alt: "Manufacturing floor",
    label: "The line",
  },
] as const;

export default function LifePage() {
  return (
    <main id="main-content" className="flex-1">
      <section className="px-6 py-14 lg:py-20">
        <div className="mx-auto grid w-full max-w-[1100px] gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <h1 className="m-0 text-[clamp(42px,6vw,64px)] font-semibold tracking-[-0.04em] text-[#0A0A0A]">
            Life at Spectr
          </h1>
          <p className="max-w-md text-[15px] leading-7 text-[#6B6B72]">
            Where you take the next step matters. We are a small team in Norway, deliberately close
            to the operators we build for.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6">
        <JoinTeamImage href="/careers/apply" minHeightClassName="min-h-[22rem] sm:min-h-[28rem]">
          <p className="text-sm font-medium text-white/80">Join the team, we are growing fast.</p>
          <h2 className="mt-3 max-w-2xl text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-[-0.03em] text-white">
            There is so much left to build.
          </h2>
        </JoinTeamImage>
      </section>

      <section className="px-6 py-16 sm:py-24">
        <dl className="mx-auto grid w-full max-w-[1100px] gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {lifeFacts.map((fact) => (
            <div key={fact.label} className="border-t border-[#D2D2CE] pt-5">
              <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#8A8A8F]">{fact.label}</dt>
              <dd className="mt-3 text-3xl font-medium tracking-[-0.03em] text-[#0A0A0A]">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-t border-[#D2D2CE] px-6 py-16 sm:py-24">
        <div className="mx-auto w-full max-w-[1100px]">
          <h2 className="m-0 text-[clamp(30px,4vw,46px)] font-semibold tracking-[-0.015em] text-[#0A0A0A]">
            Who we are.
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {whoWeAre.map((item) => (
              <article key={item.id}>
                <h3 className="text-[1.85rem] font-medium tracking-[-0.02em] text-[#0A0A0A]">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-[#6B6B72]">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1100px] gap-3 px-6 pb-16 sm:grid-cols-3 sm:pb-24">
        {scenes.map((scene) => (
          <figure key={scene.src} className="relative aspect-[4/5] overflow-hidden bg-[#EEE]">
            <Image src={scene.src} alt={scene.alt} fill className="object-cover" sizes="33vw" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-sm text-white">
              {scene.label}
            </figcaption>
          </figure>
        ))}
      </section>

      <section className="border-t border-[#D2D2CE] px-6 py-16">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-lg text-[15px] leading-7 text-[#6B6B72]">
            If that sounds like the kind of problem you want to spend a decade on, write to us.
          </p>
          <CareersApplyButton href="/careers/apply">Apply Now →</CareersApplyButton>
        </div>
      </section>
    </main>
  );
}
