import Link from "next/link";
import { HalftoneBackground } from "@/components/halftone-background";
import { ContactUsExpandButton } from "@/components/sections/contact-us-expand-button";
import { IndustriesExpandButton } from "@/components/sections/industries-expand-button";
import { LogoMark, Wordmark } from "@/components/logo";
import { SpectrOsExpandButton } from "@/components/sections/spectr-os-expand-button";
import { hero } from "@/lib/content";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="theme-light relative flex min-h-[100svh] flex-col overflow-hidden bg-bg text-fg">
      {/* Top band — tilted left→right, with halftone */}
      <div className="hero-split-top absolute inset-x-0 top-0 z-0 h-[28%] min-h-[7.5rem] max-h-[12rem] sm:h-[26%]">
        <HalftoneBackground />
      </div>

      {/* Slightly tilted divider line (left high → right low) */}
      <svg
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[28%] min-h-[7.5rem] max-h-[12rem] w-full sm:h-[26%]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line
          x1="0"
          y1="100"
          x2="100"
          y2="72"
          stroke="rgba(10,10,11,0.55)"
          strokeWidth="0.35"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <Link
        href="/"
        className="absolute left-5 top-5 z-20 flex items-center gap-2.5 text-white hover:opacity-70 sm:left-8 sm:top-6"
        aria-label={site.name}
      >
        <LogoMark invert className="h-8 w-8" />
        <Wordmark className="text-white" />
      </Link>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-5 pb-16 pt-28 sm:gap-10 sm:px-8 sm:pb-20 sm:pt-32">
        <h1 className="brand-font max-w-3xl text-center text-[clamp(1.15rem,2.8vw,1.75rem)] font-semibold leading-snug tracking-[-0.02em] text-fg">
          {hero.title}
        </h1>

        <div className="relative z-10 flex flex-wrap items-start justify-center gap-3">
          <ContactUsExpandButton />
          <SpectrOsExpandButton />
          <IndustriesExpandButton />
        </div>
      </div>
    </section>
  );
}
