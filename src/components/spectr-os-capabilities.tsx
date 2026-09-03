"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { SpectrOsFeature } from "@/lib/spectr-os-page";

function featureVideo(feature: SpectrOsFeature): string | undefined {
  return "video" in feature ? feature.video : undefined;
}

function CapabilityMedia({
  feature,
  active,
}: {
  feature: SpectrOsFeature;
  active: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const video = featureVideo(feature);

  useEffect(() => {
    const node = videoRef.current;
    if (!node || !video) return;

    if (active) {
      node.loop = true;
      if (node.ended) node.currentTime = 0;
      void node.play().catch(() => {});
      return;
    }

    node.pause();
  }, [active, video]);

  if (video) {
    return (
      <video
        ref={videoRef}
        className="sos-caps__video"
        src={video}
        aria-label={feature.imageAlt}
        muted
        loop
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    <Image
      src={feature.image}
      alt={feature.imageAlt}
      fill
      sizes="100vw"
      priority={false}
    />
  );
}

function CapabilityReveal({ feature }: { feature: SpectrOsFeature }) {
  const ref = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting && entry.intersectionRatio > 0.4);
      },
      { threshold: [0.25, 0.4, 0.55, 0.7] },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <article ref={ref} className="sos-cap-reveal">
      <div className="sos-cap-reveal__stage">
        <div className="sos-cap-reveal__media">
          <CapabilityMedia feature={feature} active={active} />
        </div>
        <div className="sos-cap-reveal__scrim" />
        <div className="sos-cap-reveal__copy">
          <h3 className="sos-cap-reveal__title">{feature.title}</h3>
          <p className="sos-cap-reveal__body">{feature.body}</p>
        </div>
      </div>
    </article>
  );
}

export function SpectrOsCapabilities({
  title,
  features,
  showHeading = true,
}: {
  title: string;
  features: readonly SpectrOsFeature[];
  showHeading?: boolean;
}) {
  return (
    <section
      className={`sos-caps${showHeading ? "" : " sos-caps--continue"}`}
      aria-labelledby={showHeading ? "sos-caps-heading" : undefined}
    >
      {showHeading ? (
        <div className="sos-caps__intro container-x">
          <h2 id="sos-caps-heading" className="sos-caps__title display">
            {title}
          </h2>
        </div>
      ) : null}

      <div className="sos-caps__reveals">
        {features.map((feature) => (
          <CapabilityReveal key={feature.id} feature={feature} />
        ))}
      </div>
    </section>
  );
}
