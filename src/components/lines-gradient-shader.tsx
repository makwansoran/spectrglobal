"use client";

import { useEffect, useRef } from "react";

type LineBand = {
  offset: number;
  speed: number;
  amplitude: number;
  thickness: number;
  phase: number;
  colors: [string, string, string];
};

const palette: Array<[string, string, string]> = [
  ["#00f5ff", "#3b82f6", "#8b5cf6"],
  ["#06b6d4", "#7c3aed", "#ff2d95"],
  ["#22d3ee", "#2563eb", "#c026d3"],
  ["#60a5fa", "#a855f7", "#f97316"],
  ["#14f1d9", "#6366f1", "#ec4899"],
];

const bands: LineBand[] = Array.from({ length: 24 }, (_, index) => {
  const center = index - 11.5;

  return {
    offset: center * 10,
    speed: 0.42 + (index % 5) * 0.035,
    amplitude: 70 + (index % 6) * 8,
    thickness: 7 + (index % 4) * 2,
    phase: index * 0.42,
    colors: palette[index % palette.length],
  };
});

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
      const gradient = context.createLinearGradient(width * 0.08, height * 0.2, width * 0.92, height * 0.82);
      gradient.addColorStop(0, band.colors[0]);
      gradient.addColorStop(0.48, band.colors[1]);
      gradient.addColorStop(1, band.colors[2]);

      context.beginPath();
      context.lineWidth = band.thickness;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = gradient;

      const baseY = height * 0.52 + band.offset;
      const segments = 140;

      for (let i = 0; i <= segments; i += 1) {
        const progress = i / segments;
        const x = progress * width;
        const flow = time * band.speed + band.phase;
        const waveA = Math.sin(progress * Math.PI * 2.45 + flow);
        const waveB = Math.sin(progress * Math.PI * 5.8 - flow * 0.68);
        const pinch = Math.sin(progress * Math.PI);
        const y = baseY + waveA * band.amplitude * pinch + waveB * band.amplitude * 0.22;

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
      context.fillStyle = "#03040a";
      context.fillRect(0, 0, width, height);

      const glow = context.createRadialGradient(width * 0.5, height * 0.52, 0, width * 0.5, height * 0.52, width * 0.62);
      glow.addColorStop(0, "rgba(59,130,246,0.22)");
      glow.addColorStop(0.48, "rgba(168,85,247,0.13)");
      glow.addColorStop(1, "rgba(3,4,10,0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      context.globalCompositeOperation = "lighter";

      context.globalAlpha = 0.5;
      context.filter = "blur(14px)";
      bands.forEach((band) =>
        drawBand(
          {
            ...band,
            thickness: band.thickness * 2.8,
          },
          time,
        ),
      );

      context.globalAlpha = 0.95;
      context.filter = "none";
      bands.forEach((band) => drawBand(band, time));

      context.globalCompositeOperation = "source-over";
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
