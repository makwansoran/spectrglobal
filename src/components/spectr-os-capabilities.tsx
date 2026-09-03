"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { SpectrOsFeature } from "@/lib/spectr-os-page";

function featureVideo(feature: SpectrOsFeature): string | undefined {
  return "video" in feature ? feature.video : undefined;
}

function CapabilityMedia({
  feature,
  active,
  scale,
}: {
  feature: SpectrOsFeature;
  active: boolean;
  scale: MotionValue<number> | number;
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

  return (
    <motion.div className="sos-cap-reveal__media-inner" style={{ scale }}>
      {video ? (
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
      ) : (
        <Image
          src={feature.image}
          alt={feature.imageAlt}
          fill
          sizes="100vw"
          priority={false}
        />
      )}
    </motion.div>
  );
}

function CapabilityReveal({ feature }: { feature: SpectrOsFeature }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.55],
    ["inset(0% 48% 0% 48%)", "inset(0% 0% 0% 0%)"],
  );
  const scale = useTransform(scrollYProgress, [0, 0.55], [1.18, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.35, 0.62], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.35, 0.62], [36, 0]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting && entry.intersectionRatio > 0.2),
      { threshold: [0.15, 0.35, 0.55] },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (reduceMotion) {
    return (
      <article className="sos-cap-reveal sos-cap-reveal--static">
        <div className="sos-cap-reveal__sticky">
          <div className="sos-cap-reveal__media">
            <CapabilityMedia feature={feature} active scale={1} />
          </div>
          <div className="sos-cap-reveal__scrim" />
          <div className="sos-cap-reveal__copy">
            <h3>{feature.title}</h3>
            <p>{feature.body}</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article ref={ref} className="sos-cap-reveal">
      <div className="sos-cap-reveal__sticky">
        <motion.div className="sos-cap-reveal__media" style={{ clipPath }}>
          <CapabilityMedia feature={feature} active={active} scale={scale} />
        </motion.div>
        <div className="sos-cap-reveal__scrim" />
        <motion.div
          className="sos-cap-reveal__copy"
          style={{ opacity: textOpacity, y: textY }}
        >
          <h3>{feature.title}</h3>
          <p>{feature.body}</p>
        </motion.div>
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
