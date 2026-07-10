"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type HeroBrandLockupProps = {
  brand: string;
  revealDelay?: number;
  className?: string;
};

export function HeroBrandLockup({
  brand,
  revealDelay = 0,
  className = "",
}: HeroBrandLockupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    const timer = window.setTimeout(() => setVisible(true), revealDelay);
    return () => window.clearTimeout(timer);
  }, [revealDelay]);

  return (
    <div
      className={`hero-brand-lockup scroll-reveal flex items-center justify-center gap-3 ${
        className || "mx-auto mt-10"
      } ${visible ? "is-visible" : ""}`}
    >
      <span className={`hero-logo-power-on inline-flex shrink-0 ${visible ? "is-active" : ""}`}>
        <Image
          src="/spectr-logo.png"
          alt={brand}
          width={40}
          height={40}
          className="h-8 w-auto shrink-0 invert"
          priority
        />
      </span>
      <span className="brand-font text-sm font-semibold uppercase tracking-[0.34em] text-white">
        {brand}
      </span>
    </div>
  );
}
