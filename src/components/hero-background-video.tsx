"use client";

import { LazyBackgroundVideo } from "@/components/lazy-background-video";

export function HeroBackgroundVideo() {
  return (
    <LazyBackgroundVideo
      src="/landing-hero-video.mp4"
      eager
    />
  );
}
