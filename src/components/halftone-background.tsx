"use client";

import { useEffect, useRef } from "react";

type HalftoneBackgroundProps = {
  className?: string;
  /** Dot color — cyan CMYK feel by default */
  color?: string;
  /** Background fill behind dots */
  background?: string;
};

/**
 * Editorial halftone grid: cyan dots sized by a drifting brightness field
 * (two sine waves + a wandering radial pulse), drawn on a single canvas.
 */
export function HalftoneBackground({
  className = "",
  color = "#22d3ee",
  background = "#050505",
}: HalftoneBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let alive = true;
    let w = 0;
    let h = 0;
    let spacing = 14;

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas!.width = Math.max(1, Math.floor(w * dpr));
      canvas!.height = Math.max(1, Math.floor(h * dpr));
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      spacing = Math.max(10, Math.min(18, Math.floor(Math.min(w, h) / 55)));
    }

    function brightness(x: number, y: number, t: number) {
      const nx = x / Math.max(w, 1);
      const ny = y / Math.max(h, 1);
      const waveA = Math.sin(nx * 4.2 + t * 0.55) * 0.5 + 0.5;
      const waveB = Math.sin(ny * 5.1 - t * 0.4 + nx * 2.3) * 0.5 + 0.5;
      const cx = 0.5 + Math.sin(t * 0.22) * 0.28;
      const cy = 0.45 + Math.cos(t * 0.18) * 0.22;
      const dist = Math.hypot(nx - cx, ny - cy);
      const pulse = Math.sin(dist * 14 - t * 1.6) * 0.5 + 0.5;
      return Math.min(1, Math.max(0, waveA * 0.35 + waveB * 0.35 + pulse * 0.45));
    }

    function paint(t: number) {
      ctx!.fillStyle = background;
      ctx!.fillRect(0, 0, w, h);
      ctx!.fillStyle = color;
      const maxR = spacing * 0.42;
      for (let y = spacing * 0.5; y < h; y += spacing) {
        for (let x = spacing * 0.5; x < w; x += spacing) {
          const b = brightness(x, y, t);
          const r = Math.max(0.35, b * maxR);
          ctx!.beginPath();
          ctx!.arc(x, y, r, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
    }

    resize();
    const onResize = () => {
      resize();
      if (reduceMotion) paint(0);
    };
    window.addEventListener("resize", onResize);

    if (reduceMotion) {
      paint(0);
      return () => window.removeEventListener("resize", onResize);
    }

    const start = performance.now();
    function tick(now: number) {
      if (!alive) return;
      paint((now - start) / 1000);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [background, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
