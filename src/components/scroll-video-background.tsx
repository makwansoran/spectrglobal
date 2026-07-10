"use client";

import { type ReactNode } from "react";
import { LazyBackgroundVideo } from "@/components/lazy-background-video";
import { VideoBrandBadge } from "@/components/video-brand-badge";

type ScrollVideoBackgroundProps = {
  src: string;
  children: ReactNode;
  className?: string;
  brandOverlay?: boolean;
};

export function ScrollVideoBackground({
  src,
  children,
  className = "",
  brandOverlay = false,
}: ScrollVideoBackgroundProps) {
  return (
    <section className={className}>
      <LazyBackgroundVideo src={src} />
      {brandOverlay ? <VideoBrandBadge /> : null}
      {children}
    </section>
  );
}
