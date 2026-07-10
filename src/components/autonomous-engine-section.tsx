"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { BevelButton } from "@/components/bevel-button";
import { Reveal } from "@/components/reveal";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";

type AutonomousEngineSectionProps = {
  title: string;
  cta: string;
};

export function AutonomousEngineSection({ title, cta }: AutonomousEngineSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            void video.play().catch(() => undefined);
          } else {
            video.pause();
            video.currentTime = 0;
          }
        });
      },
      { threshold: 0.35 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="brand-font relative flex min-h-screen snap-start items-center overflow-hidden bg-black text-white"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/autonomous-engine.mp4" type="video/mp4" />
      </video>
      <div
        className="pointer-events-none absolute bottom-5 right-5 z-[5] flex items-center gap-2.5 rounded-md bg-black/95 px-3 py-2.5 shadow-lg ring-1 ring-white/10 sm:bottom-8 sm:right-8"
        aria-hidden="true"
      >
        <Image
          src="/spectr-logo.png"
          alt=""
          width={28}
          height={28}
          className="h-7 w-auto invert"
        />
        <span className="brand-font text-xs font-semibold uppercase tracking-[0.34em] text-white">Spectr</span>
      </div>
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
          <BevelButton href="/contact" variant="inverse-primary" className="mt-10 tracking-[0.18em]">
            {cta}
            <span aria-hidden="true">→</span>
          </BevelButton>
        </Reveal>
      </div>
    </section>
  );
}
