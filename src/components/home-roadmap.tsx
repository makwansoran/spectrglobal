"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BevelButton } from "@/components/bevel-button";

export type RoadmapMilestone = {
  year: string;
  scale: string;
  dots: number;
};

export type RoadmapService = {
  title: string;
  cells: {
    year: string;
    lines: string[];
  }[];
};

type HomeRoadmapProps = {
  title: string;
  note: string;
  learnMore: string;
  milestones: RoadmapMilestone[];
  services: RoadmapService[];
};

function ConstellationVisual({ count }: { count: number }) {
  const points = buildPoints(count);

  return (
    <svg viewBox="0 0 204 204" className="h-full w-full" aria-hidden="true">
      {points.map((point, index) => (
        <circle key={index} cx={point.x} cy={point.y} r={point.r} fill="#0b0c0d" />
      ))}
    </svg>
  );
}

function buildPoints(count: number) {
  const points: { x: number; y: number; r: number }[] = [];
  const clamped = Math.min(Math.max(count, 2), 120);
  for (let i = 0; i < clamped; i += 1) {
    const angle = (i * 2.399963) % (Math.PI * 2);
    const radius = 18 + Math.sqrt(i + 1) * (62 / Math.sqrt(clamped));
    const x = 102 + Math.cos(angle) * radius * 0.92;
    const y = 102 + Math.sin(angle) * radius * 0.92;
    const r = clamped < 10 ? 3.2 : clamped < 40 ? 2.4 : clamped < 80 ? 1.8 : 1.35;
    if (x > 8 && x < 196 && y > 8 && y < 196) {
      points.push({ x, y, r });
    }
  }
  return points;
}

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function HomeRoadmap({
  title,
  note,
  learnMore,
  milestones,
  services,
}: HomeRoadmapProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="brand-font bg-[#f8f8f8] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto w-full max-w-[90rem]">
        <FadeIn>
          <h2 className="mx-auto max-w-4xl text-center text-3xl font-semibold tracking-[-0.05em] text-fg sm:text-4xl lg:text-[2.25rem]">
            {title}
          </h2>
        </FadeIn>

        <FadeIn delay={0.12} className="mt-14">
          <div className="hidden justify-between gap-4 lg:flex">
            {milestones.map((milestone) => (
              <div key={milestone.year} className="flex w-full max-w-[204px] flex-col items-center">
                <div className="mb-8 flex h-[12.8rem] w-full items-center justify-center">
                  <ConstellationVisual count={milestone.dots} />
                </div>
                <p className="mb-2 text-center text-sm font-semibold text-[#f44200]">
                  {milestone.scale}
                </p>
                <p className="text-center text-4xl font-semibold tracking-[-0.05em] text-fg">
                  {milestone.year}
                </p>
              </div>
            ))}
          </div>

          <div className="-mx-5 flex gap-6 overflow-x-auto px-5 pb-2 lg:hidden">
            {milestones.map((milestone) => (
              <div key={milestone.year} className="w-[11rem] shrink-0 text-center">
                <div className="mx-auto mb-6 h-36 w-36">
                  <ConstellationVisual count={milestone.dots} />
                </div>
                <p className="mb-2 text-sm font-semibold text-[#f44200]">{milestone.scale}</p>
                <p className="text-3xl font-semibold tracking-[-0.05em] text-fg">{milestone.year}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.2} className="mt-16">
          <ul className="list-none p-0">
            {services.map((service, index) => {
              const open = openIndex === index;
              return (
                <li
                  key={service.title}
                  className={`border-t border-[#d4d4d4] ${
                    index === services.length - 1 ? "border-b border-[#d4d4d4]" : ""
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? -1 : index)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="text-2xl font-semibold tracking-[-0.05em] text-fg sm:text-[2.25rem]">
                      {service.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2"
                      style={{ borderColor: open ? "#0b0c0d" : "#f44200" }}
                    >
                      <span className="relative block h-0.5 w-3 bg-current" style={{ color: open ? "#0b0c0d" : "#f44200" }}>
                        {!open ? (
                          <span className="absolute left-1/2 top-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-current" />
                        ) : null}
                      </span>
                    </span>
                  </button>

                  {open ? (
                    <div className="pb-10">
                      <div className="hidden gap-4 lg:flex">
                        {service.cells.map((cell) => (
                          <div key={cell.year} className="min-w-0 flex-1">
                            <div className="mb-4">
                              <span className="inline-flex rounded-lg bg-[#f44200] px-3 py-1.5 text-xs font-semibold text-white">
                                {cell.year}
                              </span>
                            </div>
                            <div className="space-y-4">
                              {cell.lines.map((line) => (
                                <p
                                  key={line}
                                  className="border-b border-[#d4d4d4] pb-4 text-base leading-6 text-fg last:border-b-0 last:pb-0"
                                >
                                  {line}
                                </p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-8 lg:hidden">
                        {service.cells.map((cell) => (
                          <div key={cell.year}>
                            <span className="inline-flex rounded-lg bg-[#f44200] px-3 py-1.5 text-xs font-semibold text-white">
                              {cell.year}
                            </span>
                            <div className="mt-4 space-y-3">
                              {cell.lines.map((line) => (
                                <p key={line} className="text-base leading-6 text-fg">
                                  {line}
                                </p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </FadeIn>

        <FadeIn delay={0.28} className="mt-12">
          <div className="flex flex-col gap-6 rounded-2xl bg-black px-6 py-8 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <p className="max-w-2xl text-lg leading-7 sm:text-2xl sm:font-semibold sm:tracking-[-0.03em]">
              {note}
            </p>
            <BevelButton href="/security" variant="inverse-primary" className="w-fit shrink-0">
              {learnMore}
              <span aria-hidden="true">→</span>
            </BevelButton>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
