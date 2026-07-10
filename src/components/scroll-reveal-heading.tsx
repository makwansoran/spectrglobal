"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { observeIntersection } from "@/lib/intersection-observer";

type ScrollRevealHeadingProps = {
  as?: "h1" | "h2" | "h3";
  className?: string;
  children: ReactNode;
  delay?: number;
  revealOnMount?: boolean;
};

export function ScrollRevealHeading({
  as: Tag = "h2",
  className = "",
  children,
  delay = 0,
  revealOnMount = false,
}: ScrollRevealHeadingProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (revealOnMount) {
      const timer = window.setTimeout(() => setVisible(true), delay);
      return () => window.clearTimeout(timer);
    }

    const element = ref.current;
    if (!element) return;

    return observeIntersection(
      element,
      (entry) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => setVisible(true), delay);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
      true,
    );
  }, [delay, revealOnMount]);

  const Component = Tag as ElementType;

  return (
    <Component
      ref={ref}
      className={`scroll-reveal ${visible ? "is-visible" : ""} ${
        Tag === "h3" ? "block" : "inline-block"
      } ${className}`}
    >
      {children}
    </Component>
  );
}
