"use client";

import {
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

function getScrollRoot(): HTMLElement | Window {
  const main = document.querySelector("main");
  if (!main) return window;

  const style = window.getComputedStyle(main);
  const scrollable =
    main.scrollHeight > main.clientHeight &&
    (style.overflowY === "auto" || style.overflowY === "scroll");

  return scrollable ? main : window;
}

export function ScrollRevealHeading({
  as: Tag = "h2",
  className = "",
  children,
  delay = 0,
  revealOnMount = false,
}: ScrollRevealHeadingProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(revealOnMount);
  const visibleRef = useRef(revealOnMount);

  useEffect(() => {
    if (revealOnMount) {
      visibleRef.current = true;
      setVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const scrollRoot = getScrollRoot();
    let revealTimer: number | undefined;
    let settleTimers: number[] = [];
    let hasUserScrolled = false;

    const reveal = () => {
      if (visibleRef.current) return;
      visibleRef.current = true;
      setVisible(true);
    };

    const revealIfInView = () => {
      if (!hasUserScrolled || visibleRef.current) return;

      const elementRect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const inView = elementRect.top <= viewportHeight * 0.92 && elementRect.bottom >= viewportHeight * 0.08;

      if (inView) {
        revealTimer = window.setTimeout(reveal, delay);
        cleanupListeners();
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

    const cleanupListeners = () => {
      if (scrollRoot instanceof Window) {
        window.removeEventListener("scroll", onScroll);
      } else {
        scrollRoot.removeEventListener("scroll", onScroll);
      }
      window.removeEventListener("wheel", onUserIntent);
      window.removeEventListener("touchmove", onUserIntent);
      window.removeEventListener("keydown", onUserIntent);
    };

    if (scrollRoot instanceof Window) {
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      scrollRoot.addEventListener("scroll", onScroll, { passive: true });
    }
    window.addEventListener("wheel", onUserIntent, { passive: true });
    window.addEventListener("touchmove", onUserIntent, { passive: true });
    window.addEventListener("keydown", onUserIntent);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          hasUserScrolled = true;
          revealTimer = window.setTimeout(reveal, delay);
          observer.disconnect();
          cleanupListeners();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(element);

    return () => {
      window.clearTimeout(revealTimer);
      settleTimers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
      cleanupListeners();
    };
  }, [delay, revealOnMount]);

  const Component = Tag as ElementType;
  const charIndex = { current: 0 };

  return (
    <Component
      ref={ref}
      className={`scroll-reveal ${visible ? "is-visible" : ""} ${
        Tag === "h3" ? "block" : "inline-block"
      } ${className}`}
    >
      {renderLetterReveal(children, charIndex)}
    </Component>
  );
}

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
