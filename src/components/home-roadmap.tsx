"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { bevelButtonClassName } from "@/components/bevel-button";

export type RoadmapMilestone = {
  year: string;
  scale: string;
  summary: string;
  autonomyTitle: string;
  autonomy: string[];
};

type HomeRoadmapProps = {
  title: string;
  milestones: RoadmapMilestone[];
};

export function HomeRoadmap({ title, milestones }: HomeRoadmapProps) {
  const [activeYear, setActiveYear] = useState(milestones[0]?.year ?? "");
  const reducedMotion = useReducedMotion();
  const active = milestones.find((item) => item.year === activeYear) ?? milestones[0];

  return (
    <section className="brand-font bg-[#f8f8f8] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto w-full max-w-[90rem]">
        <h2 className="mx-auto max-w-4xl text-center text-3xl font-semibold tracking-[-0.05em] text-fg sm:text-4xl lg:text-[2.25rem]">
          {title}
        </h2>

        <div className="mt-14 -mx-5 flex gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0">
          {milestones.map((milestone) => {
            const selected = milestone.year === active?.year;
            return (
              <button
                key={milestone.year}
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveYear(milestone.year)}
                className={bevelButtonClassName({
                  variant: selected ? "primary" : "secondary",
                  size: "lg",
                  className: "h-auto min-w-[9.5rem] shrink-0 flex-col gap-2 !whitespace-normal px-5 py-5 text-center",
                })}
              >
                <span className={`block text-xs font-semibold uppercase tracking-[0.16em] ${selected ? "text-white/70" : "text-muted"}`}>
                  {milestone.scale}
                </span>
                <span className="block text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                  {milestone.year}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-12 min-h-[12rem] border-t border-[#d4d4d4] pt-10">
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div
                key={active.year}
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto max-w-3xl"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f44200]">
                  {active.scale} · {active.year}
                </p>
                <p className="mt-4 text-xl leading-8 text-fg sm:text-2xl sm:leading-9">
                  {active.summary}
                </p>

                <div className="mt-10">
                  <h3 className="text-lg font-semibold tracking-[-0.03em] text-fg">
                    {active.autonomyTitle}
                  </h3>
                  <ul className="mt-4 list-none space-y-3 p-0 text-base leading-7 text-muted">
                    {active.autonomy.map((line) => (
                      <li key={line} className="border-b border-[#d4d4d4] pb-3 last:border-b-0">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
