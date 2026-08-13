import { ContactUsExpandButton } from "@/components/sections/contact-us-expand-button";
import { LogoMark, Wordmark } from "@/components/logo";
import { SpectrOsExpandButton } from "@/components/sections/spectr-os-expand-button";
import { hero } from "@/lib/content";

export function Hero() {
  return (
    <section className="theme-light relative flex min-h-[100svh] flex-col overflow-hidden bg-bg text-fg">
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-5 py-16 sm:gap-10 sm:px-8 sm:py-20">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-8 w-8" />
          <Wordmark className="text-fg" />
        </div>

        <h1 className="brand-font max-w-3xl text-center text-[clamp(1.15rem,2.8vw,1.75rem)] font-semibold leading-snug tracking-[-0.02em] text-fg">
          {hero.title}
        </h1>

        <div className="relative z-10 flex flex-wrap items-start justify-center gap-3">
          <ContactUsExpandButton />
          <SpectrOsExpandButton />
        </div>
      </div>
    </section>
  );
}
