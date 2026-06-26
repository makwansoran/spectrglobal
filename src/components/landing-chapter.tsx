"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { BevelButton } from "@/components/bevel-button";
import { scrollAllRootsToTop } from "@/components/scroll-to-top";

type LandingChapterProps = {
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
  alt: string;
  priority?: boolean;
  quality?: number;
};

export function LandingChapter({
  index,
  eyebrow,
  title,
  description,
  cta,
  href,
  image,
  alt,
  priority = false,
  quality = 92,
}: LandingChapterProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const blockClass = `reveal-block ${visible ? "is-visible" : ""}`.trim();

  return (
    <section
      ref={ref}
      className={`chapter relative flex min-h-screen snap-start items-end overflow-hidden bg-black text-white ${
        visible ? "is-visible" : ""
      }`}
    >
      <Image
        src={image}
        alt={alt}
        fill
        priority={priority}
        quality={quality}
        className="chapter-media object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

      <div className="relative z-10 w-full px-5 pb-16 sm:px-8 lg:px-16 lg:pb-24">
        <div className="mx-auto max-w-[88rem]">
          <div
            className="flex items-center gap-4 reveal-block"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" } as CSSProperties}
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/55">{index}</span>
            <span className="chapter-rule h-px w-12 bg-white/40" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/55">{eyebrow}</span>
          </div>

          <h2
            className={`${blockClass} mt-6 max-w-4xl text-5xl font-semibold leading-[0.9] tracking-[-0.05em] sm:text-7xl lg:text-8xl`}
            style={{ "--reveal-delay": "120ms" } as CSSProperties}
          >
            {title}
          </h2>

          <p
            className={`${blockClass} mt-7 max-w-xl text-base leading-8 text-white/72 sm:text-lg`}
            style={{ "--reveal-delay": "220ms" } as CSSProperties}
          >
            {description}
          </p>

          <div
            className={blockClass}
            style={{ "--reveal-delay": "320ms" } as CSSProperties}
          >
            <BevelButton
              href={href}
              variant="inverse-secondary"
              className="mt-9 tracking-[0.18em]"
              onClick={() => {
                scrollAllRootsToTop();
                window.setTimeout(scrollAllRootsToTop, 0);
              }}
            >
              {cta}
              <span aria-hidden="true">→</span>
            </BevelButton>
          </div>
        </div>
      </div>
    </section>
  );
}
