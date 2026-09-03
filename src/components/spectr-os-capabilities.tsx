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
  sizes,
  label,
}: {
  feature: SpectrOsFeature;
  active: boolean;
  sizes: string;
  label?: string;
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
    node.currentTime = 0;
  }, [active, video]);

  if (video) {
    return (
      <video
        ref={videoRef}
        className="sos-caps__video"
        src={video}
        aria-label={label}
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
      alt={label ?? ""}
      fill
      sizes={sizes}
    />
  );
}

export function SpectrOsCapabilities({
  title,
  features,
}: {
  title: string;
  features: readonly SpectrOsFeature[];
}) {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const nodes = itemRefs.current.filter((node): node is HTMLElement => Boolean(node));
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = nodes.indexOf(visible.target as HTMLElement);
        if (index >= 0) setActive(index);
      },
      { rootMargin: "-28% 0px -42% 0px", threshold: [0.15, 0.35, 0.55] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [features.length]);

  const current = features[active] ?? features[0];

  return (
    <section className="sos-caps" aria-labelledby="sos-caps-heading">
      <div className="container-x">
        <h2 id="sos-caps-heading" className="sos-caps__title display text-[clamp(2.2rem,5.4vw,4.6rem)] text-fg">
          {title}
        </h2>

        <div className="sos-caps__layout">
          <div className="sos-caps__stage" aria-hidden="true">
            <div className="sos-caps__frame">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className={`sos-caps__shot${index === active ? " is-active" : ""}`}
                >
                  <CapabilityMedia
                    feature={feature}
                    active={index === active}
                    sizes="(max-width: 1024px) 0vw, 50vw"
                  />
                </div>
              ))}
              <p className="sos-caps__badge">
                {String(active + 1).padStart(2, "0")} / {String(features.length).padStart(2, "0")}
                <span aria-hidden="true">·</span>
                {current.title}
              </p>
            </div>
          </div>

          <ol className="sos-caps__list">
            {features.map((feature, index) => (
              <li
                key={feature.id}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                className={`sos-cap${index === active ? " is-active" : ""}`}
                aria-current={index === active ? "step" : undefined}
              >
                <p className="sos-cap__index">{String(index + 1).padStart(2, "0")}</p>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
                <div className="sos-cap__mobile-media">
                  <CapabilityMedia
                    feature={feature}
                    active={index === active}
                    sizes="(min-width: 1024px) 0px, 100vw"
                    label={feature.imageAlt}
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
