"use client";

import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";

export function GlobeVisual({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;

    if (!canvas || !container) {
      return;
    }

    const updateSize = () => {
      setSize(Math.floor(container.getBoundingClientRect().width));
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || size <= 0) {
      return;
    }

    let phi = 0;
    let animationFrame = 0;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const globe = createGlobe(canvas, {
      devicePixelRatio: pixelRatio,
      width: size * pixelRatio,
      height: size * pixelRatio,
      phi,
      theta: 0.28,
      dark: 1,
      diffuse: 1.6,
      mapSamples: 18000,
      mapBrightness: 9,
      baseColor: [1, 1, 1],
      glowColor: [0.88, 0.9, 0.95],
      markerColor: [0.08, 0.08, 0.08],
      markers: [
        { location: [59.9139, 10.7522], size: 0.09 },
        { location: [40.7128, -74.006], size: 0.06 },
        { location: [51.5072, -0.1276], size: 0.06 },
      ],
      scale: 1.08,
    });

    const animate = () => {
      phi += 0.0025;
      globe.update({ phi });
      animationFrame = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      globe.destroy();
    };
  }, [size]);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        className="h-full w-full opacity-95"
        style={{ contain: "layout paint size" }}
        aria-hidden="true"
      />
    </div>
  );
}
