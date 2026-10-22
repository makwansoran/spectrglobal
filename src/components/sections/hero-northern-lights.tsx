"use client";

import { useEffect, useState } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "ascii-art": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          piece?: string;
          size?: string;
          bg?: string;
        },
        HTMLElement
      >;
    }
  }
}

/**
 * Northern Lights ASCII Magic piece as a clipped hero background.
 * Mounted client-side so the web component does not hydrate-mismatch.
 */
export function HeroNorthernLights() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="vision-hero__ascii" aria-hidden="true">
      <div className="vision-hero__ascii-stage">
        {mounted ? <ascii-art piece="northern-lights" size="16" bg="#030614" /> : null}
      </div>
      <div className="vision-hero__ascii-scrim" />
    </div>
  );
}
