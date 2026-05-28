"use client";

import { useEffect, useState } from "react";

type TypewriterProps = {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  as?: "h1" | "h2" | "p" | "span";
};

export function Typewriter({ text, speed = 28, delay = 100, className, as: Tag = "h1" }: TypewriterProps) {
  const [visible, setVisible] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    const start = setTimeout(() => {
      setVisible(0);
      setDone(false);

      interval = setInterval(() => {
        setVisible((n) => {
          if (n >= text.length) {
            clearInterval(interval);
            setDone(true);
            return n;
          }
          return n + 1;
        });
      }, speed);
    }, delay);

    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, delay]);

  return (
    <Tag aria-label={text} className={className}>
      {text.slice(0, visible)}
      {!done && <span className="typing-caret" aria-hidden="true">|</span>}
    </Tag>
  );
}
