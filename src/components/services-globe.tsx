"use client";

import { useEffect, useRef } from "react";
import { play } from "ascii-magic-art/runtime/player.js";
import * as wireframeGlobe from "ascii-magic-art/pieces/wireframe-globe.js";

type PreWithCanvas = HTMLPreElement & { _canvas?: HTMLCanvasElement | null };

/** Wireframe globe ASCII piece for the services page. */
export function ServicesGlobe() {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pre = preRef.current as PreWithCanvas | null;
    if (!pre) return;

    if (pre._canvas && !pre.parentElement?.contains(pre._canvas)) {
      pre._canvas = null;
    }

    const stop = play(pre, wireframeGlobe, { speed: 1 });

    return () => {
      stop();
      if (pre._canvas) {
        pre._canvas.remove();
        pre._canvas = null;
      }
    };
  }, []);

  return (
    <div className="services-page__globe" aria-hidden="true">
      <div className="services-page__globe-stage">
        <pre ref={preRef} className="services-page__globe-pre" />
      </div>
    </div>
  );
}
