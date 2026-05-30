"use client";

import { useEffect, useState } from "react";

type PartnerQuote = {
  name: string;
  quote: string;
};

export function PartnerSlideshow({ quotes }: { quotes: PartnerQuote[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeQuote = quotes[activeIndex];

  useEffect(() => {
    if (quotes.length < 2) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % quotes.length);
    }, 7000);

    return () => window.clearInterval(intervalId);
  }, [quotes.length]);

  const goToPrevious = () => {
    setActiveIndex((index) => (index - 1 + quotes.length) % quotes.length);
  };

  const goToNext = () => {
    setActiveIndex((index) => (index + 1) % quotes.length);
  };

  if (!activeQuote) return null;

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_360px]">
      <article className="min-h-[420px] border border-border bg-fg p-6 text-bg sm:p-8 lg:p-10">
        <div className="flex h-full flex-col justify-between gap-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/45">
              {String(activeIndex + 1).padStart(2, "0")} / {String(quotes.length).padStart(2, "0")}
            </p>
            <blockquote className="mt-10 max-w-4xl text-3xl font-semibold leading-[1.12] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              &ldquo;{activeQuote.quote}&rdquo;
            </blockquote>
          </div>

          <div className="flex flex-col gap-6 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/65">
              {activeQuote.name}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goToPrevious}
                aria-label="Show previous partner quote"
                className="grid h-11 w-11 place-items-center border border-white/25 text-lg text-white/80 hover:bg-white hover:text-black"
              >
                &larr;
              </button>
              <button
                type="button"
                onClick={goToNext}
                aria-label="Show next partner quote"
                className="grid h-11 w-11 place-items-center border border-white/25 text-lg text-white/80 hover:bg-white hover:text-black"
              >
                &rarr;
              </button>
            </div>
          </div>
        </div>
      </article>

      <div className="grid gap-px border border-border bg-border">
        {quotes.map((quote, index) => {
          const selected = index === activeIndex;

          return (
            <button
              key={quote.name}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-current={selected ? "true" : undefined}
              className={`group bg-surface p-5 text-left transition-colors hover:bg-bg ${
                selected ? "bg-bg" : ""
              }`}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mt-4 block text-2xl font-semibold tracking-[-0.05em] text-fg transition-transform group-hover:translate-x-1">
                {quote.name}
              </span>
              <span className={`mt-5 block h-px bg-fg transition-transform ${selected ? "scale-x-100" : "scale-x-0"}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
