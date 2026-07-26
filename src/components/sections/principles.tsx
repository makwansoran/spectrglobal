"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { principles, principlesSection } from "@/lib/content";

export function Principles() {
  const [index, setIndex] = useState(0);
  const total = principles.length;
  const current = principles[index];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % total);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [total]);

  function goTo(next: number) {
    setIndex((next + total) % total);
  }

  return (
    <section id="principles" className="section scroll-mt-20">
      <div className="container-x">
        <SectionHeading
          title={principlesSection.title}
          subtitle={principlesSection.subtitle}
        />

        <Reveal className="mx-auto mt-14 max-w-3xl">
          <div className="card relative overflow-hidden px-8 py-12 sm:px-12 sm:py-16">
            <figure className="mx-auto flex min-h-[220px] flex-col items-center text-center sm:min-h-[200px]">
              <QuoteIcon />
              <blockquote
                key={current.quote}
                className="fade-up mt-8 max-w-2xl text-lg leading-8 text-fg sm:text-xl sm:leading-9"
              >
                {current.quote}
              </blockquote>
              <figcaption
                key={current.attribution}
                className="fade-up fade-up-2 mt-8 font-mono text-[10px] uppercase tracking-[0.16em] text-muted"
              >
                {current.attribution}
              </figcaption>
            </figure>

            <div className="mt-10 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                aria-label="Previous principle"
                className="btn btn-icon"
              >
                <Chevron direction="left" />
              </button>

              <div className="flex items-center gap-2" role="tablist" aria-label="Principles">
                {principles.map((principle, i) => {
                  const selected = i === index;
                  return (
                    <button
                      key={principle.attribution}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-label={`Show principle ${i + 1}`}
                      onClick={() => goTo(i)}
                      className={`h-2 rounded-full transition-all ${
                        selected ? "w-7 bg-fg" : "w-2 bg-fg/20 hover:bg-fg/40"
                      }`}
                    />
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => goTo(index + 1)}
                aria-label="Next principle"
                className="btn btn-icon"
              >
                <Chevron direction="right" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function QuoteIcon() {
  return (
    <svg viewBox="0 0 24 16" className="h-5 w-7 text-accent/70" fill="currentColor" aria-hidden="true">
      <path d="M0 16V9.2C0 4.3 2.8 1 7.4 0l.9 2.2C5.7 3.2 4.3 5 4.2 7.4H7.7V16H0Zm13.3 0V9.2c0-4.9 2.8-8.2 7.4-9.2l.9 2.2C19 3.2 17.6 5 17.5 7.4H21V16h-7.7Z" />
    </svg>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d={direction === "left" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
