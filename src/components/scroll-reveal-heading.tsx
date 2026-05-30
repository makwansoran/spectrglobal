"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

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
    const element = ref.current;
    if (!element) return;

    const scrollRoot = document.querySelector("main") as HTMLElement | null;
    if (!scrollRoot) return;

    let revealTimer: number | undefined;
    let settleTimer: number | undefined;
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
        window.removeEventListener("wheel", onUserIntent);
        window.removeEventListener("touchmove", onUserIntent);
        window.removeEventListener("keydown", onUserIntent);
      }
    };

    const scheduleRevealChecks = () => {
      window.requestAnimationFrame(revealIfInView);
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(revealIfInView, 180);
    };

    const onUserIntent = () => {
      hasUserScrolled = true;
      scheduleRevealChecks();
    };

    const onScroll = () => {
      hasUserScrolled = true;
      scheduleRevealChecks();
    };

    scrollRoot.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onUserIntent, { passive: true });
    window.addEventListener("touchmove", onUserIntent, { passive: true });
    window.addEventListener("keydown", onUserIntent);

    if (revealOnMount) {
      window.requestAnimationFrame(revealIfInView);
    }

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(settleTimer);
      scrollRoot.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onUserIntent);
      window.removeEventListener("touchmove", onUserIntent);
      window.removeEventListener("keydown", onUserIntent);
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
