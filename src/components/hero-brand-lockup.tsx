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
  brand: string;
  revealDelay?: number;
  className?: string;
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

const logoPowerOnTransition = {
  duration: 2.05,
  times: [0, 0.07, 0.15, 0.31, 0.4, 0.56, 0.65, 1],
  ease: "linear" as const,
  delay: 0,
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
      animate={active ? logoPowerOnAnimation : { opacity: 0 }}
      transition={active ? logoPowerOnTransition : { duration: 0 }}
    >
      {children}
    </motion.span>
  );
}

export function HeroBrandLockup({
  brand,
  revealDelay = 0,
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

  return (
    <div
      className={`hero-brand-lockup scroll-reveal flex items-center justify-center gap-3 ${
        className || "mx-auto mt-10"
      } ${visible ? "is-visible" : ""}`}
    >
      <PowerOnMark active={visible} reduceMotion={reduceMotion}>
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
