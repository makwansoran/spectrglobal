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
  madeInNorway?: string;
  brand: string;
  revealDelay?: number;
  variant?: "full" | "logo";
  className?: string;
};

const flagPowerOnAnimation = {
  opacity: [0, 1, 0.06, 1, 0.06, 1, 0.06, 1],
  filter: [
    "brightness(0.15)",
    "brightness(2.1)",
    "brightness(0.18)",
    "brightness(1.9)",
    "brightness(0.18)",
    "brightness(1.7)",
    "brightness(0.18)",
    "brightness(1)",
  ],
};

const logoPowerOnAnimation = {
  opacity: [0, 1, 0.1, 1, 0.1, 1, 0.1, 1],
  filter: [
    "brightness(0.12)",
    "brightness(1.9)",
    "brightness(0.22)",
    "brightness(1.7)",
    "brightness(0.22)",
    "brightness(1.5)",
    "brightness(0.22)",
    "brightness(1)",
  ],
};

const flagPowerOnTransition = {
  duration: 1.55,
  times: [0, 0.09, 0.18, 0.32, 0.41, 0.55, 0.64, 1],
  ease: "linear" as const,
  delay: 0,
};

const logoPowerOnTransition = {
  duration: 2.05,
  times: [0, 0.07, 0.15, 0.31, 0.4, 0.56, 0.65, 1],
  ease: "linear" as const,
  delay: 0.72,
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
  variant,
  immediate = false,
  children,
}: {
  active: boolean;
  reduceMotion: boolean;
  variant: "flag" | "logo";
  immediate?: boolean;
  children: ReactNode;
}) {
  if (reduceMotion) {
    return <span className="inline-flex shrink-0">{children}</span>;
  }

  const animation =
    variant === "flag" ? flagPowerOnAnimation : logoPowerOnAnimation;
  const baseTransition =
    variant === "flag" ? flagPowerOnTransition : logoPowerOnTransition;
  const transition = immediate
    ? { ...baseTransition, delay: 0 }
    : baseTransition;

  return (
    <motion.span
      className="inline-flex shrink-0"
      initial={{ opacity: 0, filter: "brightness(0.15)" }}
      animate={active ? animation : { opacity: 0 }}
      transition={active ? transition : { duration: 0 }}
    >
      {children}
    </motion.span>
  );
}

export function HeroBrandLockup({
  madeInNorway = "",
  brand,
  revealDelay = 0,
  variant = "full",
  className = "",
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

  if (variant === "logo") {
    return (
      <div
        className={`hero-brand-lockup scroll-reveal flex items-center justify-center gap-3 ${
          className || "mx-auto mt-10"
        } ${visible ? "is-visible" : ""}`}
      >
        <PowerOnMark
          active={visible}
          reduceMotion={reduceMotion}
          variant="logo"
          immediate
        >
          <Image
            src="/spectr-logo.png"
            alt={brand}
            width={40}
            height={40}
            className="h-8 w-auto shrink-0 invert"
            priority
          />
        </PowerOnMark>
        <span className="brand-font text-sm font-semibold uppercase tracking-[0.34em] text-white">
          {renderLetterReveal(brand, charIndex)}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`hero-brand-lockup scroll-reveal mx-auto mt-10 grid w-full max-w-3xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-3 sm:gap-x-5 ${
        visible ? "is-visible" : ""
      }`}
    >
      <div className="flex items-center justify-end gap-2.5 sm:gap-3">
        <PowerOnMark active={visible} reduceMotion={reduceMotion} variant="flag">
          <NorwegianFlag className="h-6 w-[1.65rem] shrink-0 rounded-[2px]" />
        </PowerOnMark>
        <span className="brand-font text-sm font-semibold uppercase tracking-[0.34em] text-white">
          {renderLetterReveal(madeInNorway, charIndex)}
        </span>
      </div>
      <div className="flex items-center justify-center self-stretch px-0.5 sm:px-1">
        <span
          className="reveal-char text-sm leading-none text-white/35"
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
      </div>
      <div className="flex items-center justify-start gap-2.5 sm:gap-3">
        <PowerOnMark active={visible} reduceMotion={reduceMotion} variant="logo">
          <Image
            src="/spectr-logo.png"
            alt={brand}
            width={32}
            height={32}
            className="h-6 w-auto shrink-0 invert"
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
