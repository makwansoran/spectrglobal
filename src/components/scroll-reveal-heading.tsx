"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react";

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
  const visibleRef = useRef(false);
  const charIndexRef = useRef(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const scrollRoot = document.querySelector("main") as HTMLElement | null;
    if (!scrollRoot) return;

    let revealTimer: number | undefined;
    let settleTimers: number[] = [];
    let hasUserScrolled = revealOnMount;

    const revealIfInView = () => {
      if (!hasUserScrolled || visibleRef.current) return;

      const elementRect = element.getBoundingClientRect();
      const rootRect = scrollRoot.getBoundingClientRect();
      const triggerTop = rootRect.bottom - 32;
      const triggerBottom = rootRect.top + 32;

      if (elementRect.top <= triggerTop && elementRect.bottom >= triggerBottom) {
        revealTimer = window.setTimeout(() => {
          visibleRef.current = true;
          setVisible(true);
        }, delay);
        scrollRoot.removeEventListener("scroll", onScroll);
        window.removeEventListener("wheel", onUserIntent);
        window.removeEventListener("touchmove", onUserIntent);
        window.removeEventListener("keydown", onUserIntent);
      }
    };

    const scheduleRevealChecks = () => {
      window.requestAnimationFrame(revealIfInView);
      settleTimers.forEach((timer) => window.clearTimeout(timer));
      settleTimers = [
        window.setTimeout(revealIfInView, 120),
        window.setTimeout(revealIfInView, 360),
        window.setTimeout(revealIfInView, 700),
      ];
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
      settleTimers.forEach((timer) => window.clearTimeout(timer));
      scrollRoot.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onUserIntent);
      window.removeEventListener("touchmove", onUserIntent);
      window.removeEventListener("keydown", onUserIntent);
    };
  }, [delay, revealOnMount]);

  const Component = Tag as ElementType;
  charIndexRef.current = 0;

  return (
    <Component
      ref={ref}
      className={`scroll-reveal ${visible ? "is-visible" : ""} ${
        Tag === "h3" ? "block" : "inline-block"
      } ${className}`}
    >
      {renderLetterReveal(children, charIndexRef)}
    </Component>
  );
}

function renderLetterReveal(
  node: ReactNode,
  indexRef: { current: number },
): ReactNode {
  if (typeof node === "string") {
    return node.split("").map((char) => {
      const index = indexRef.current;
      indexRef.current += 1;

      return (
        <span
          key={`${char}-${index}`}
          className="reveal-char"
          style={{ "--char-index": index } as CSSProperties}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      );
    });
  }

  if (Array.isArray(node)) {
    return node.map((child, index) => (
      <span key={index}>{renderLetterReveal(child, indexRef)}</span>
    ));
  }

  if (isValidElement(node)) {
    const element = node as ReactElement<{ children?: ReactNode }>;

    return cloneElement(element, {
      children: renderLetterReveal(element.props.children, indexRef),
    });
  }

  return node;
}
