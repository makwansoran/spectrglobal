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

    const scrollRoot = document.querySelector("main");

    let timer: number | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        timer = window.setTimeout(() => {
          setVisible(true);
        }, delay);

        observer.disconnect();
      },
      {
        root: scrollRoot,
        threshold: 0.4,
        rootMargin: "-8% 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timer) window.clearTimeout(timer);
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
