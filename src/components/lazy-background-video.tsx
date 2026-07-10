"use client";

import { useEffect, useRef } from "react";

type LazyBackgroundVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  /** Load and play immediately (hero). */
  eager?: boolean;
};

export function LazyBackgroundVideo({
  src,
  poster,
  className = "absolute inset-0 h-full w-full object-cover",
  eager = false,
}: LazyBackgroundVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    let loaded = false;

    const loadVideo = () => {
      if (loaded) return;
      loaded = true;
      video.src = src;
      video.load();
    };

    const play = () => {
      void video.play().catch(() => undefined);
    };

    const pause = () => {
      video.pause();
    };

    if (eager) {
      loadVideo();
      play();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadVideo();
            play();
          } else {
            pause();
          }
        });
      },
      { threshold: 0.1, rootMargin: "150px 0px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [src, eager]);

  return (
    <div ref={containerRef} className="absolute inset-0" aria-hidden="true">
      <video
        ref={videoRef}
        className={className}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
      />
    </div>
  );
}
