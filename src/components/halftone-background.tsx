"use client";

import { useEffect, useRef } from "react";

export function HalftoneBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const currentCanvas = canvasRef.current;
    if (!currentCanvas) return;
    const canvasElement: HTMLCanvasElement = currentCanvas;

    const context = canvasElement.getContext("2d");
    if (!context) return;
    const drawingContext: CanvasRenderingContext2D = context;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;

    function resize() {
      const rect = canvasElement.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvasElement.width = Math.max(1, Math.floor(width * pixelRatio));
      canvasElement.height = Math.max(1, Math.floor(height * pixelRatio));
      drawingContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    function draw(time: number) {
      drawingContext.clearRect(0, 0, width, height);

      const cell = 10;
      const drift = reducedMotion ? 0 : time;
      const centerX = width * (0.5 + 0.28 * Math.sin(drift * 0.00012));
      const centerY = height * (0.5 + 0.24 * Math.cos(drift * 0.00014));

      for (let y = -cell; y < height + cell; y += cell) {
        for (let x = -cell; x < width + cell; x += cell) {
          const wave =
            Math.sin(x * 0.013 + drift * 0.00055) +
            Math.sin(y * 0.017 - drift * 0.00042);
          const distance = Math.hypot(x - centerX, y - centerY);
          const pulse = Math.cos(distance * 0.018 - drift * 0.0015);
          const brightness = Math.max(0, Math.min(1, 0.5 + wave * 0.18 + pulse * 0.32));
          const radius = 0.6 + brightness * 2.8;

          drawingContext.beginPath();
          drawingContext.fillStyle = `rgba(0, 38, 145, ${0.26 + brightness * 0.52})`;
          drawingContext.arc(x, y, radius, 0, Math.PI * 2);
          drawingContext.fill();
        }
      }

      if (!reducedMotion) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    }

    resize();
    draw(0);

    window.addEventListener("resize", resize);
    if (!reducedMotion) {
      animationFrame = window.requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
