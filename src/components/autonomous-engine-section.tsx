import { LazyBackgroundVideo } from "@/components/lazy-background-video";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { VideoBrandBadge } from "@/components/video-brand-badge";

type AutonomousEngineSectionProps = {
  title: string;
  eager?: boolean;
};

export function AutonomousEngineSection({ title, eager = false }: AutonomousEngineSectionProps) {
  return (
    <section className="brand-font relative flex min-h-screen snap-start items-center overflow-hidden bg-black text-white">
      <LazyBackgroundVideo src="/autonomous-engine.mp4" eager={eager} />
      <VideoBrandBadge />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/25" />
      <div className="relative z-10 mx-auto flex w-full max-w-[88rem] flex-col items-center px-5 py-28 text-center sm:px-8 lg:px-16">
        <ScrollRevealHeading
          as="h2"
          className="max-w-4xl text-2xl font-semibold leading-[1.35] tracking-[-0.01em] sm:text-4xl sm:leading-[1.3] lg:text-5xl lg:leading-[1.25]"
        >
          {title}
        </ScrollRevealHeading>
      </div>
    </section>
  );
}
