"use client";

import { useEffect, useRef } from "react";

type HalftoneBackgroundProps = {
  className?: string;
  /** Dot fill color */
  color?: string;
  /** Canvas clear / page color behind dots */
  background?: string;
  /** Grid spacing in CSS pixels */
  spacing?: number;
};

/**
 * Editorial CMYK-style halftone: cyan dots whose radii pulse from a drifting
 * brightness field (two sine waves + a radial pulse from a wandering center).
 * Inspired by https://www.shadcn.io/background/halftone
 */
export function HalftoneBackground({
  className = "",
  color = "#22d3ee",
  background = "#07080c",
  spacing = 14,
}: HalftoneBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const brightness = (x: number, y: number, t: number) => {
      const nx = x / Math.max(w, 1);
      const ny = y / Math.max(h, 1);

      const waveA = Math.sin(nx * 4.2 + t * 0.55) * Math.cos(ny * 3.1 - t * 0.35);
      const waveB = Math.sin((nx + ny) * 5.5 - t * 0.45) * 0.7;

      const cx = 0.5 + Math.sin(t * 0.22) * 0.28;
      const cy = 0.45 + Math.cos(t * 0.18) * 0.24;
      const dist = Math.hypot(nx - cx, ny - cy);
      const pulse = Math.sin(dist * 14 - t * 1.6) * Math.exp(-dist * 2.4);

      return (waveA + waveB + pulse * 1.4 + 2.2) / 4.4;
    };

    const drawFrame = (t: number) => {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = color;

      const step = spacing;
      const maxR = step * 0.42;

      for (let y = step * 0.5; y < h; y += step) {
        for (let x = step * 0.5; x < w; x += step) {
          const b = brightness(x, y, t);
          const r = Math.max(0.35, b * maxR);
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    resize();
    drawFrame(0);

    if (!reduced) {
      const start = performance.now();
      const tick = (now: number) => {
        if (!running) return;
        drawFrame((now - start) / 1000);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    const onResize = () => {
      resize();
      if (reduced) drawFrame(0);
    };

    window.addEventListener("resize", onResize);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [background, color, spacing]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
