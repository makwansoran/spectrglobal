import { BevelButton } from "@/components/bevel-button";
import { LazyBackgroundVideo } from "@/components/lazy-background-video";
import { Reveal } from "@/components/reveal";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { VideoBrandBadge } from "@/components/video-brand-badge";

type AutonomousEngineSectionProps = {
  title: string;
  cta: string;
};

export function AutonomousEngineSection({ title, cta }: AutonomousEngineSectionProps) {
  return (
    <section className="brand-font relative flex min-h-screen snap-start items-center overflow-hidden bg-black text-white">
      <LazyBackgroundVideo src="/autonomous-engine.mp4" />
      <VideoBrandBadge />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/25" />
      <div className="relative z-10 mx-auto w-full max-w-[88rem] px-5 py-28 sm:px-8 lg:px-16">
        <ScrollRevealHeading
          as="h2"
          className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl"
        >
          {title}
        </ScrollRevealHeading>
        <Reveal delay={220}>
          <BevelButton href="/autonomous-engine" variant="inverse-primary" className="mt-10 tracking-[0.18em]">
            {cta}
            <span aria-hidden="true">→</span>
          </BevelButton>
        </Reveal>
      </div>
    </section>
  );
}
