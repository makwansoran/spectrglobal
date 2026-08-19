import { ContactUsExpandButton } from "@/components/sections/contact-us-expand-button";
import { IndustriesExpandButton } from "@/components/sections/industries-expand-button";
import { SpectrOsExpandButton } from "@/components/sections/spectr-os-expand-button";
import { hero } from "@/lib/content";

export function Hero() {
  return (
    <section className="theme-light premium-hero relative flex min-h-[100svh] flex-col overflow-hidden bg-transparent text-fg">
      <div className="premium-hero__glow" aria-hidden="true" />
      <div className="premium-hero__grid" aria-hidden="true" />

      <div className="premium-hero__signal" aria-hidden="true">
        <span>Operational intelligence</span>
        <span>Agentic workflows</span>
        <span>Context-aware execution</span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-5 py-24 sm:gap-10 sm:px-8 sm:py-28">
        <div className="max-w-5xl text-center">
          <p className="mb-5 inline-flex items-center rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted shadow-[0_8px_24px_rgba(17,17,17,0.05)] backdrop-blur-sm">
            AI operating system
          </p>
          <h1 className="brand-font mx-auto max-w-5xl text-balance text-[clamp(3.2rem,7vw,7.5rem)] font-medium leading-[0.9] tracking-[-0.065em] text-fg">
            {hero.title}
          </h1>
          <p className="premium-hero__subtitle mx-auto mt-6 max-w-2xl text-lg text-muted sm:text-xl">
            A unified platform for industrial intelligence, operational decisions, and AI-driven execution in the real world.
          </p>
        </div>

        <div className="relative z-10 grid w-full max-w-7xl gap-6 md:grid-cols-3">
          <ContactUsExpandButton />
          <SpectrOsExpandButton />
          <IndustriesExpandButton />
        </div>
      </div>
    </section>
  );
}
