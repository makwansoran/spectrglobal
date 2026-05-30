"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

type ScrollRevealHeadingProps = {
  as?: "h1" | "h2" | "h3";
  className?: string;
  children: string;
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
    const element = ref.current;
    if (!element) return;

    const scrollRoot = document.querySelector("main") as HTMLElement | null;
    if (!scrollRoot) return;

    let revealTimer: number | undefined;
    let hasUserScrolled = revealOnMount;

    const revealIfInView = () => {
      if (!hasUserScrolled || visible) return;

      const elementRect = element.getBoundingClientRect();
      const rootRect = scrollRoot.getBoundingClientRect();
      const triggerTop = rootRect.top + rootRect.height * 0.72;
      const triggerBottom = rootRect.top + rootRect.height * 0.12;

      if (elementRect.top <= triggerTop && elementRect.bottom >= triggerBottom) {
        revealTimer = window.setTimeout(() => setVisible(true), delay);
        scrollRoot.removeEventListener("scroll", onScroll);
      }
    };

    const onScroll = () => {
      hasUserScrolled = true;
      revealIfInView();
    };

    scrollRoot.addEventListener("scroll", onScroll, { passive: true });

    if (revealOnMount) {
      window.requestAnimationFrame(revealIfInView);
    }

    return () => {
      window.clearTimeout(revealTimer);
      scrollRoot.removeEventListener("scroll", onScroll);
    };
  }, [delay, revealOnMount, visible]);

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
