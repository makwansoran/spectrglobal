"use client";

import { useEffect, useRef } from "react";

type LineBand = {
  offset: number;
  speed: number;
  amplitude: number;
  thickness: number;
  colorA: string;
  colorB: string;
};

const bands: LineBand[] = [
  { offset: -120, speed: 0.42, amplitude: 46, thickness: 18, colorA: "#67e8f9", colorB: "#a78bfa" },
  { offset: -58, speed: 0.36, amplitude: 38, thickness: 14, colorA: "#22d3ee", colorB: "#60a5fa" },
  { offset: 0, speed: 0.5, amplitude: 58, thickness: 20, colorA: "#818cf8", colorB: "#f0abfc" },
  { offset: 66, speed: 0.31, amplitude: 42, thickness: 16, colorA: "#38bdf8", colorB: "#c084fc" },
  { offset: 138, speed: 0.45, amplitude: 52, thickness: 18, colorA: "#93c5fd", colorB: "#f9a8d4" },
];

export function LinesGradientShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let running = true;
    let animationFrame = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawBand = (band: LineBand, time: number) => {
      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, band.colorA);
      gradient.addColorStop(0.5, "rgba(255,255,255,0.34)");
      gradient.addColorStop(1, band.colorB);

      context.beginPath();
      context.lineWidth = band.thickness;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = gradient;

      const baseY = height * 0.5 + band.offset;
      const segments = 92;

      for (let i = 0; i <= segments; i += 1) {
        const progress = i / segments;
        const x = progress * width;
        const waveA = Math.sin(progress * Math.PI * 2.15 + time * band.speed);
        const waveB = Math.sin(progress * Math.PI * 4.2 - time * band.speed * 0.72);
        const y = baseY + waveA * band.amplitude + waveB * band.amplitude * 0.32;

        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.stroke();
    };

    const draw = () => {
      if (!running) return;

      frame += 1;
      const time = frame * 0.018;

      context.clearRect(0, 0, width, height);
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);

      context.globalAlpha = 0.72;
      context.filter = "blur(0.15px)";
      bands.forEach((band) => drawBand(band, time));
      context.filter = "none";

      context.globalAlpha = 0.22;
      bands.forEach((band) =>
        drawBand(
          {
            ...band,
            offset: band.offset + 18,
            thickness: Math.max(4, band.thickness * 0.38),
          },
          time + 1.6,
        ),
      );
      context.globalAlpha = 1;

      animationFrame = window.requestAnimationFrame(draw);
    };

    const handleVisibilityChange = () => {
      running = document.visibilityState === "visible";
      if (running) {
        animationFrame = window.requestAnimationFrame(draw);
      } else {
        window.cancelAnimationFrame(animationFrame);
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    draw();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      running = false;
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
