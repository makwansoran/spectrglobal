"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

type ScrubPhraseProps = {
  text: string;
};

function ScrubWord({
  children,
  progress,
  range,
  reducedMotion,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  reducedMotion: boolean;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);

  return (
    <motion.span
      style={reducedMotion ? undefined : { opacity }}
      className="mr-[0.28em] inline-block last:mr-0"
    >
      {children}
    </motion.span>
  );
}

export function ScrubPhrase({ text }: ScrubPhraseProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.5"],
  });

  const words = text.trim().split(/\s+/).filter(Boolean);

  return (
    <section
      ref={ref}
      className="brand-font bg-bg px-5 py-28 sm:px-8 lg:px-16 lg:py-40"
    >
      <div className="mx-auto flex min-h-[42vh] w-full max-w-5xl items-center justify-center">
        <h2 className="text-balance text-center text-3xl font-semibold leading-[1.2] tracking-[-0.045em] text-fg sm:text-4xl lg:text-[2.75rem] lg:leading-[1.2]">
          {words.map((word, index) => {
            const start = index / words.length;
            const end = start + 1 / words.length;
            return (
              <ScrubWord
                key={`${word}-${index}`}
                progress={scrollYProgress}
                range={[start, end]}
                reducedMotion={reducedMotion}
              >
                {word}
              </ScrubWord>
            );
          })}
        </h2>
      </div>
    </section>
  );
}
