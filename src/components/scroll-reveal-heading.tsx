"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

type ScrollRevealHeadingProps = {
  as?: "h1" | "h2" | "h3";
  className?: string;
  children: string;
  delay?: number;
};

export function ScrollRevealHeading({
  as: Tag = "h2",
  className = "",
  children,
  delay = 0,
}: ScrollRevealHeadingProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let revealTimer: number | undefined;
    let setupTimer: number | undefined;

    // Defer observer setup by two frames so the snap-scroll layout
    // is fully settled before we start observing — prevents all
    // headings from firing at once during hydration.
    setupTimer = window.setTimeout(() => {
      const scrollRoot = document.querySelector("main") as HTMLElement | null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          revealTimer = window.setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        },
        {
          root: scrollRoot,
          // Only trigger once the element is at least 20 % inside the
          // scroll viewport and not within the top 15 % guard band.
          threshold: 0.2,
          rootMargin: "-15% 0px -5% 0px",
        },
      );

      observer.observe(element);

      // Store disconnect on element for cleanup
      (element as HTMLElement & { _observer?: IntersectionObserver })._observer = observer;
    }, 120);

    return () => {
      window.clearTimeout(setupTimer);
      window.clearTimeout(revealTimer);
      const obs = (element as HTMLElement & { _observer?: IntersectionObserver })._observer;
      if (obs) obs.disconnect();
    };
  }, [delay]);

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
