"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TypeIn } from "@/components/type-in";
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

  return <Image src={feature.image} alt={label ?? ""} fill sizes={sizes} />;
}

function CapabilityRow({
  feature,
  index,
}: {
  feature: SpectrOsFeature;
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  const mediaLeft = index % 2 === 0;
  const rowRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);
  const [typing, setTyping] = useState(false);
  const [titleDone, setTitleDone] = useState(false);

  useEffect(() => {
    const node = rowRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setActive(visible);
        if (visible) setTyping(true);
      },
      { threshold: 0.28, rootMargin: "-12% 0px -18% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const mediaFrom = mediaLeft ? -56 : 56;
  const copyFrom = mediaLeft ? 48 : -48;
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <article
      ref={rowRef}
      className={`sos-cap-row${mediaLeft ? "" : " sos-cap-row--flip"}${active ? " is-active" : ""}`}
    >
      <motion.div
        className="sos-cap-row__media"
        initial={reduceMotion ? false : { opacity: 0, x: mediaFrom, scale: 0.94 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.85, ease }}
      >
        <div className="sos-cap-row__frame">
          <CapabilityMedia
            feature={feature}
            active={active}
            sizes="(max-width: 960px) 100vw, 52vw"
            label={feature.imageAlt}
          />
        </div>
      </motion.div>

      <motion.div
        className="sos-cap-row__copy"
        initial={reduceMotion ? false : { opacity: 0, x: copyFrom, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.8, delay: 0.1, ease }}
      >
        <TypeIn
          as="h3"
          text={feature.title}
          className="sos-cap-row__title"
          start={typing}
          charMs={14}
          showCaret={!titleDone}
          onDone={() => setTitleDone(true)}
        />
        <TypeIn
          as="p"
          text={feature.body}
          className="sos-cap-row__body"
          start={typing && titleDone}
          charMs={8}
          delayMs={30}
          showCaret
        />
      </motion.div>
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
      <div className="container-x">
        <h2 id="sos-caps-heading" className="sos-caps__title display text-[clamp(2.2rem,5.4vw,4.6rem)] text-fg">
          {title}
        </h2>

        <div className="sos-caps__rows">
          {features.map((feature, index) => (
            <CapabilityRow key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
