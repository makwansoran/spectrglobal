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

function CapabilityReveal({
  feature,
  panelRef,
}: {
  feature: SpectrOsFeature;
  panelRef: (node: HTMLElement | null) => void;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);

  const setRefs = (node: HTMLElement | null) => {
    ref.current = node;
    panelRef(node);
  };

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(0% 46% 0% 46%)", "inset(0% 0% 0% 0%)"],
  );
  const scale = useTransform(scrollYProgress, [0, 1], [1.14, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.35, 0.9], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.35, 0.9], [28, 0]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting && entry.intersectionRatio > 0.35),
      { threshold: [0.2, 0.4, 0.6, 0.8] },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (reduceMotion) {
    return (
      <article ref={setRefs} className="sos-cap-reveal sos-cap-reveal--static">
        <div className="sos-cap-reveal__stage">
          <div className="sos-cap-reveal__media">
            <CapabilityMedia feature={feature} active={active} scale={1} />
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
    <article ref={setRefs} className="sos-cap-reveal">
      <div className="sos-cap-reveal__stage">
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
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const panelNodes = useRef<Array<HTMLElement | null>>([]);
  const indexRef = useRef(0);
  const lockedRef = useRef(false);

  useEffect(() => {
    document.documentElement.classList.add("sos-snap");
    return () => document.documentElement.classList.remove("sos-snap");
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const syncIndex = () => {
      const panels = panelNodes.current.filter(Boolean) as HTMLElement[];
      if (panels.length === 0) return;

      const mid = window.innerHeight * 0.45;
      let best = 0;
      let bestDist = Number.POSITIVE_INFINITY;
      panels.forEach((panel, i) => {
        const rect = panel.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height * 0.35 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      indexRef.current = best;
    };

    const goTo = (next: number) => {
      const panels = panelNodes.current.filter(Boolean) as HTMLElement[];
      if (panels.length === 0) return;
      const clamped = Math.max(0, Math.min(panels.length - 1, next));
      if (clamped === indexRef.current && lockedRef.current) return;

      indexRef.current = clamped;
      lockedRef.current = true;
      panels[clamped].scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        lockedRef.current = false;
        syncIndex();
      }, 780);
    };

    const onWheel = (event: WheelEvent) => {
      const section = sectionRef.current;
      if (!section) return;

      const panels = panelNodes.current.filter(Boolean) as HTMLElement[];
      if (panels.length === 0) return;

      const first = panels[0].getBoundingClientRect();
      const last = panels[panels.length - 1].getBoundingClientRect();
      const inBand = first.top <= window.innerHeight * 0.55 && last.bottom >= window.innerHeight * 0.45;
      if (!inBand) return;

      syncIndex();
      const atFirst = indexRef.current <= 0;
      const atLast = indexRef.current >= panels.length - 1;

      if (event.deltaY > 10 && atLast && last.bottom <= window.innerHeight + 2) return;
      if (event.deltaY < -10 && atFirst && first.top >= -2) return;

      if (Math.abs(event.deltaY) < 8) return;
      if (lockedRef.current) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      goTo(indexRef.current + (event.deltaY > 0 ? 1 : -1));
    };

    window.addEventListener("scroll", syncIndex, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    syncIndex();

    return () => {
      window.removeEventListener("scroll", syncIndex);
      window.removeEventListener("wheel", onWheel);
    };
  }, [reduceMotion, features.length]);

  return (
    <section ref={sectionRef} className="sos-caps" aria-labelledby="sos-caps-heading">
      <div className="sos-caps__intro container-x">
        <h2 id="sos-caps-heading" className="sos-caps__title display">
          {title}
        </h2>
      </div>

      <div className="sos-caps__reveals">
        {features.map((feature, index) => (
          <CapabilityReveal
            key={feature.id}
            feature={feature}
            panelRef={(node) => {
              panelNodes.current[index] = node;
            }}
          />
        ))}
      </div>
    </section>
  );
}
