"use client";

import { useEffect, useRef } from "react";
import { play } from "ascii-magic-art/runtime/player.js";
import * as northernLights from "ascii-magic-art/pieces/northern-lights.js";

type PreWithCanvas = HTMLPreElement & { _canvas?: HTMLCanvasElement | null };

/**
 * Northern Lights ASCII Magic piece as a clipped hero background.
 * Bundled via ascii-magic-art so it does not depend on an external CDN.
 */
export function HeroNorthernLights() {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pre = preRef.current as PreWithCanvas | null;
    if (!pre) return;

    if (pre._canvas && !pre.parentElement?.contains(pre._canvas)) {
      pre._canvas = null;
    }

    const stop = play(pre, northernLights, { speed: 1 });

    return () => {
      stop();
      if (pre._canvas) {
        pre._canvas.remove();
        pre._canvas = null;
      }
    };
  }, []);

  return (
    <div className="vision-hero__ascii" aria-hidden="true">
      <div className="vision-hero__ascii-stage">
        <pre ref={preRef} className="vision-hero__ascii-pre" />
      </div>
      <div className="vision-hero__ascii-scrim" />
    </div>
  );
}
