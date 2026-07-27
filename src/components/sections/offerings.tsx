"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { offerings } from "@/lib/content";

export function Offerings() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = offerings[activeIndex] ?? offerings[0];

  useEffect(() => {
    if (paused || offerings.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % offerings.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [paused]);

  function goTo(id: string) {
    const index = offerings.findIndex((item) => item.id === id);
    if (index >= 0) setActiveIndex(index);
  }

  function step(direction: -1 | 1) {
    setActiveIndex((index) => (index + direction + offerings.length) % offerings.length);
  }

  if (!active) return null;

  return (
    <section
      id="offerings"
      className="scroll-mt-24 border-t border-border py-10 sm:py-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="container-x">
        <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
          {offerings.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(item.id)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                active.id === item.id
                  ? "border-white bg-white text-black"
                  : "border-border bg-transparent text-muted hover:border-border-strong hover:text-fg"
              }`}
            >
              {item.label}
            </button>
          ))}
          <Link
            href="/#features"
            className="ml-auto font-mono text-[11px] uppercase tracking-[0.14em] text-muted hover:text-fg"
          >
            See All
          </Link>
        </div>

        <div className="relative mt-6" aria-label="Offerings slideshow" aria-live="polite">
          <Link href={active.href} className="group block">
            <div className="relative aspect-[16/9] overflow-hidden border border-border bg-surface sm:aspect-[21/9]">
              <Image
                key={active.id}
                src={active.image}
                alt={active.imageAlt}
                fill
                sizes="(max-width: 1280px) 100vw, 80rem"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/70">
                  {active.label}
                </p>
                <h3 className="brand-font mt-3 max-w-2xl text-2xl leading-snug tracking-tight text-white sm:text-3xl lg:text-4xl">
                  {active.title}
                </h3>
                <span className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/80">
                  Learn more
                  <span aria-hidden="true">→</span>
                </span>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            {String(activeIndex + 1).padStart(2, "0")} / {String(offerings.length).padStart(2, "0")}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous offering"
              className="inline-flex h-10 w-10 items-center justify-center border border-border text-fg hover:bg-white/5"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next offering"
              className="inline-flex h-10 w-10 items-center justify-center border border-border text-fg hover:bg-white/5"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
