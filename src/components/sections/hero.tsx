"use client";

import { useEffect, useRef } from "react";
import { hero } from "@/lib/content";

const MOSAIC_PALETTE = [
  "#0a0a0b",
  "#141416",
  "#1c1c1f",
  "#2a2a2e",
  "#3a3a40",
  "#4a4a52",
  "#5c5c66",
  "#6e6e78",
  "#8a8a94",
  "#a8a8b0",
  "#c8c8ce",
  "#e4e4e8",
  "#f0f0f2",
  "#ffffff",
  "#252528",
];

function MosaicStrip() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let alive = true;
    let cols = 0;
    let rows = 0;
    let cells: Uint8Array = new Uint8Array(0);
    let cellW = 0;
    let cellH = 0;

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas!.width = Math.max(1, Math.floor(w * dpr));
      canvas!.height = Math.max(1, Math.floor(h * dpr));
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.max(24, Math.floor(w / 14));
      rows = Math.max(4, Math.floor(h / 14));
      cellW = w / cols;
      cellH = h / rows;
      cells = new Uint8Array(cols * rows);
      for (let i = 0; i < cells.length; i++) {
        cells[i] = (i * 17 + (i % cols) * 31) % MOSAIC_PALETTE.length;
      }
      paint();
    }

    function paint() {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x;
          ctx!.fillStyle = MOSAIC_PALETTE[cells[idx]!]!;
          ctx!.fillRect(x * cellW, y * cellH, cellW + 0.5, cellH + 0.5);
        }
      }
    }

    let last = 0;
    function tick(now: number) {
      if (!alive) return;
      if (now - last >= 90) {
        last = now;
        const flips = Math.max(4, Math.floor(cols * rows * 0.018));
        for (let n = 0; n < flips; n++) {
          const i = Math.floor(Math.random() * cells.length);
          cells[i] = Math.floor(Math.random() * MOSAIC_PALETTE.length);
        }
        paint();
      }
      raf = requestAnimationFrame(tick);
    }

    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    if (!reduceMotion) {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      alive = false;
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

export function Hero() {
  return (
    <section className="theme-light relative flex min-h-[100svh] flex-col overflow-hidden bg-bg text-fg">
      <div className="flex min-h-0 flex-1 flex-col pt-24 sm:pt-28 lg:grid lg:min-h-[calc(100svh-7.5rem)] lg:grid-cols-[minmax(0,1.55fr)_minmax(16rem,0.72fr)] lg:pt-28">
        <div className="flex flex-1 items-end border-b border-border px-5 pb-10 pt-16 sm:px-8 sm:pb-12 lg:border-b-0 lg:border-r lg:px-12 lg:pb-14 xl:px-16">
          <h1 className="brand-font fade-up max-w-[14ch] text-[clamp(2.75rem,8vw,6.75rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-fg">
            <span className="block">{hero.title}</span>
            <span className="mt-1 block sm:mt-2">{hero.titleLine2}</span>
          </h1>
        </div>

        <aside className="flex flex-col justify-end gap-10 border-b border-border bg-surface-2 px-5 py-10 sm:px-8 sm:py-12 lg:border-b-0 lg:px-10 lg:pb-14 lg:pt-28 xl:px-12">
          <p className="fade-up fade-up-2 max-w-sm text-[1.05rem] leading-8 text-fg/80 sm:text-[1.125rem] sm:leading-8">
            {hero.support}
          </p>
          <div className="hero-scroll-arrows fade-up fade-up-3 flex flex-col gap-0.5 text-fg/45" aria-hidden="true">
            <span className="hero-scroll-arrows__item text-sm leading-none">↓</span>
            <span className="hero-scroll-arrows__item text-sm leading-none">↓</span>
            <span className="hero-scroll-arrows__item text-sm leading-none">↓</span>
          </div>
        </aside>
      </div>

      <div className="hero-mosaic relative h-[5.5rem] shrink-0 overflow-hidden border-t border-border sm:h-28 lg:h-32">
        <MosaicStrip />
        <p className="pointer-events-none absolute inset-y-0 right-[8%] z-10 flex items-center font-mono text-[10px] uppercase tracking-[0.28em] text-white mix-blend-difference sm:right-[12%] sm:text-[11px]">
          {hero.mosaicLabel}
        </p>
      </div>
    </section>
  );
}
