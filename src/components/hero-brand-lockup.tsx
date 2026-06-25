"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type HeroBrandLockupProps = {
  madeInNorway: string;
  brand: string;
  revealDelay?: number;
};

const powerOnAnimation = {
  opacity: [0, 1, 0.08, 1, 0.08, 1, 0.08, 1],
  filter: [
    "brightness(0.15)",
    "brightness(2)",
    "brightness(0.2)",
    "brightness(1.8)",
    "brightness(0.2)",
    "brightness(1.6)",
    "brightness(0.2)",
    "brightness(1)",
  ],
};

const powerOnTransition = {
  duration: 1.8,
  times: [0, 0.08, 0.16, 0.3, 0.38, 0.52, 0.6, 1],
  ease: "linear" as const,
};

function renderLetterReveal(
  node: ReactNode,
  indexRef: { current: number },
): ReactNode {
  if (typeof node === "string") {
    return node.split(/(\s+)/).map((token, tokenIndex) => {
      if (/^\s+$/.test(token)) {
        return <span key={`space-${tokenIndex}`}> </span>;
      }

      return (
        <span key={`word-${tokenIndex}`} className="reveal-word">
          {token.split("").map((char) => {
            const index = indexRef.current;
            indexRef.current += 1;

            return (
              <span
                key={`${char}-${index}`}
                className="reveal-char"
                style={{ "--char-index": index } as CSSProperties}
              >
                {char}
              </span>
            );
          })}
        </span>
      );
    });
  }

  return node;
}

function NorwegianFlag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 16" className={className} aria-hidden="true">
      <rect width="22" height="16" fill="#BA0C2F" />
      <rect x="6" width="4" height="16" fill="#FFFFFF" />
      <rect y="6" width="22" height="4" fill="#FFFFFF" />
      <rect x="7" width="2" height="16" fill="#00205B" />
      <rect y="7" width="22" height="2" fill="#00205B" />
    </svg>
  );
}

function PowerOnMark({
  active,
  reduceMotion,
  children,
}: {
  active: boolean;
  reduceMotion: boolean;
  children: ReactNode;
}) {
  if (reduceMotion) {
    return <span className="inline-flex shrink-0">{children}</span>;
  }

  return (
    <motion.span
      className="inline-flex shrink-0"
      initial={{ opacity: 0, filter: "brightness(0.15)" }}
      animate={active ? powerOnAnimation : { opacity: 0 }}
      transition={powerOnTransition}
    >
      {children}
    </motion.span>
  );
}

export function HeroBrandLockup({
  madeInNorway,
  brand,
  revealDelay = 0,
}: HeroBrandLockupProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [visible, setVisible] = useState(reduceMotion);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(true);
      return;
    }

    let revealTimer: number | undefined;
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        revealTimer = window.setTimeout(() => {
          setVisible(true);
        }, revealDelay);
      });
    });

    const fallbackTimer = window.setTimeout(() => {
      setVisible(true);
    }, revealDelay + 2500);

    return () => {
      window.cancelAnimationFrame(frame);
      if (revealTimer !== undefined) {
        window.clearTimeout(revealTimer);
      }
      window.clearTimeout(fallbackTimer);
    };
  }, [revealDelay, reduceMotion]);

  const charIndex = { current: 0 };

  return (
    <div
      className={`hero-brand-lockup scroll-reveal mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 ${
        visible ? "is-visible" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <PowerOnMark active={visible} reduceMotion={reduceMotion}>
          <NorwegianFlag className="h-5 w-7 rounded-[2px]" />
        </PowerOnMark>
        <span className="brand-font text-sm font-semibold uppercase tracking-[0.34em] text-white">
          {renderLetterReveal(madeInNorway, charIndex)}
        </span>
      </div>
      <span
        className="reveal-char text-sm text-white/35"
        style={
          {
            "--char-index": (() => {
              const index = charIndex.current;
              charIndex.current += 1;
              return index;
            })(),
          } as CSSProperties
        }
        aria-hidden="true"
      >
        |
      </span>
      <div className="flex items-center gap-3">
        <PowerOnMark active={visible} reduceMotion={reduceMotion}>
          <Image
            src="/spectr-logo.png"
            alt={brand}
            width={32}
            height={32}
            className="h-8 w-auto invert"
            priority
          />
        </PowerOnMark>
        <span className="brand-font text-sm font-semibold uppercase tracking-[0.34em] text-white">
          {renderLetterReveal(brand, charIndex)}
        </span>
      </div>
    </div>
  );
}
