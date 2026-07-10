"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ScrollVideoBackgroundProps = {
  src: string;
  children: ReactNode;
  className?: string;
};

export function ScrollVideoBackground({ src, children, className = "" }: ScrollVideoBackgroundProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            void video.play().catch(() => undefined);
          } else {
            video.pause();
            video.currentTime = 0;
          }
        });
      },
      { threshold: 0.35 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={className}>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src={src} type="video/mp4" />
      </video>
      {children}
    </section>
  );
}
