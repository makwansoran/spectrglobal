"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { offerings } from "@/lib/content";

export function Offerings() {
  const railRef = useRef<HTMLDivElement>(null);
  const activeIdRef = useRef(offerings[0]?.id ?? "");
  const [activeId, setActiveId] = useState(offerings[0]?.id ?? "");
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const cards = Array.from(rail.querySelectorAll<HTMLElement>("[data-offering-id]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = visible?.target.getAttribute("data-offering-id");
        if (id) setActiveId(id);
      },
      { root: rail, threshold: [0.55, 0.75] },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      const index = Math.max(
        0,
        offerings.findIndex((item) => item.id === activeIdRef.current),
      );
      const next = offerings[(index + 1) % offerings.length];
      if (next) scrollToOffering(next.id);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [paused]);

  function scrollToOffering(id: string) {
    const rail = railRef.current;
    if (!rail) return;
    const target = rail.querySelector<HTMLElement>(`[data-offering-id="${id}"]`);
    if (!target) return;
    rail.scrollTo({ left: target.offsetLeft - 8, behavior: "smooth" });
    setActiveId(id);
  }

  function step(direction: -1 | 1) {
    const index = Math.max(
      0,
      offerings.findIndex((item) => item.id === activeIdRef.current),
    );
    const next = offerings[(index + direction + offerings.length) % offerings.length];
    if (next) scrollToOffering(next.id);
  }

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
              onClick={() => scrollToOffering(item.id)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                activeId === item.id
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
      </div>

      <div className="offerings-slideshow mt-6" aria-label="Offerings slideshow">
        <div ref={railRef} className="offerings-slideshow__track">
          {offerings.map((item, index) => (
            <article key={item.id} data-offering-id={item.id} className="offering-slide">
              <Link href={item.href} className="group block h-full">
                <div className="relative aspect-[16/10] overflow-hidden border border-border bg-surface">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 768px) 88vw, 34rem"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    priority={index < 2}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/70">
                      {item.label}
                    </p>
                    <h3 className="brand-font mt-3 max-w-md text-xl leading-snug tracking-tight text-white sm:text-2xl">
                      {item.title}
                    </h3>
                    <span className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/80">
                      Learn more
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      <div className="container-x mt-5 flex items-center justify-end gap-2">
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
    </section>
  );
}
