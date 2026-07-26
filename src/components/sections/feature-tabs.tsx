"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { features, featuresSection } from "@/lib/content";

export function FeatureTabs() {
  const [active, setActive] = useState(features[0].id);
  const current = features.find((feature) => feature.id === active) ?? features[0];

  return (
    <section id="features" className="section scroll-mt-20">
      <div className="container-x">
        <SectionHeading
          title={featuresSection.title}
          subtitle={featuresSection.subtitle}
        />

        <Reveal className="mt-12">
          <div
            role="tablist"
            aria-label="Platform capabilities"
            className="mx-auto flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-full border border-border bg-surface p-1.5 shadow-sm"
          >
            {features.map((feature) => {
              const selected = feature.id === active;
              return (
                <button
                  key={feature.id}
                  type="button"
                  role="tab"
                  id={`tab-${feature.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${feature.id}`}
                  onClick={() => setActive(feature.id)}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                    selected ? "bg-fg text-white" : "text-muted hover:text-fg"
                  }`}
                >
                  {feature.tab}
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal className="mt-10">
          <div
            role="tabpanel"
            id={`panel-${current.id}`}
            aria-labelledby={`tab-${current.id}`}
            className="card p-8 sm:p-12 lg:p-14"
          >
            <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
              <div>
                <span className="label">{current.kicker}</span>
                <h3 className="display mt-4 text-2xl text-fg sm:text-3xl lg:text-[2.1rem]">
                  {current.title}
                </h3>
                <p className="mt-6 text-base leading-8 text-muted">{current.description}</p>
              </div>

              <ul className="flex flex-col justify-center gap-4 lg:border-l lg:border-border lg:pl-14">
                {current.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3.5 text-sm leading-7 text-fg/80">
                    <CheckIcon />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="mt-1.5 h-4 w-4 shrink-0 text-accent"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeOpacity="0.35" />
      <path
        d="m6.5 10.2 2.4 2.3 4.6-4.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
