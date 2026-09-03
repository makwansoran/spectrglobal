"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TypeIn } from "@/components/type-in";
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
  const [typing, setTyping] = useState(false);
  const [titleDone, setTitleDone] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let wasVisible = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio > 0.4;
        setActive(visible);

        if (visible && !wasVisible) {
          wasVisible = true;
          setTitleDone(false);
          setTyping(true);
        } else if (!visible && wasVisible) {
          wasVisible = false;
          setTyping(false);
          setTitleDone(false);
        }
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
          <TypeIn
            as="h3"
            text={feature.title}
            className="sos-cap-reveal__title"
            start={typing}
            charMs={16}
            showCaret={!titleDone}
            onDone={() => setTitleDone(true)}
          />
          <TypeIn
            as="p"
            text={feature.body}
            className="sos-cap-reveal__body"
            start={typing && titleDone}
            charMs={10}
            delayMs={40}
            showCaret
          />
        </div>
      </div>
    </article>
  );
}

export function SpectrOsCapabilities({
  title,
  features,
}: {
  title: string;
  features: readonly SpectrOsFeature[];
}) {
  return (
    <section className="sos-caps" aria-labelledby="sos-caps-heading">
      <div className="sos-caps__intro container-x">
        <h2 id="sos-caps-heading" className="sos-caps__title display">
          {title}
        </h2>
      </div>

      <div className="sos-caps__reveals">
        {features.map((feature) => (
          <CapabilityReveal key={feature.id} feature={feature} />
        ))}
      </div>
    </section>
  );
}
