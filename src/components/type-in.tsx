"use client";

import { useEffect, useRef, useState } from "react";

type TypeInProps = {
  text: string;
  className?: string;
  as?: "h2" | "h3" | "p" | "span";
  delayMs?: number;
  charMs?: number;
  start?: boolean;
  showCaret?: boolean;
  onDone?: () => void;
};

export function TypeIn({
  text,
  className = "",
  as: Tag = "span",
  delayMs = 0,
  charMs = 42,
  start = true,
  showCaret = true,
  onDone,
}: TypeInProps) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!start) return;

    if (reduceMotion) {
      setCount(text.length);
      setDone(true);
      onDoneRef.current?.();
      return;
    }

    setCount(0);
    setDone(false);
    let index = 0;
    let intervalId = 0;

    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1;
        setCount(index);
        if (index >= text.length) {
          window.clearInterval(intervalId);
          setDone(true);
          onDoneRef.current?.();
        }
      }, charMs);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [text, start, delayMs, charMs, reduceMotion]);

  const visible = text.slice(0, count);

  return (
    <Tag className={className} aria-label={text}>
      <span aria-hidden="true">{visible}</span>
      {showCaret && start && !done ? (
        <span className="type-caret" aria-hidden="true">
          |
        </span>
      ) : null}
    </Tag>
  );
}

type TypeInOnViewProps = Omit<TypeInProps, "start"> & {
  rootMargin?: string;
};

export function TypeInOnView({
  rootMargin = "0px 0px -18% 0px",
  ...props
}: TypeInOnViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setStart(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className="min-h-[1em]">
      <TypeIn {...props} start={start} />
    </div>
  );
}
