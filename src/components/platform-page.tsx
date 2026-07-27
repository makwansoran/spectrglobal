"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowIcon } from "@/components/button";
import { GetStartedButton } from "@/components/get-started-button";
import { Reveal } from "@/components/reveal";
import type { Platform, PlatformFeature } from "@/lib/platforms";
import { site } from "@/lib/site";

function spacedTitle(title: string) {
  return title.split("").join(" ").replace(/ {2,}/g, "  ");
}

function FeatureBlock({
  feature,
  index,
}: {
  feature: PlatformFeature;
  index: number;
}) {
  const [mode, setMode] = useState<"video" | "details">("video");
  const reverse = index % 2 === 1;

  return (
    <div className={`border-b border-border ${reverse ? "bg-surface/40" : ""}`}>
      <div className="container-x grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <Reveal>
          <div className={reverse ? "lg:order-2" : ""}>
            <div className="flex gap-2">
              {(["video", "details"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setMode(option)}
                  className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
                    mode === option
                      ? "border-white bg-white text-black"
                      : "border-border text-muted hover:text-fg"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <h3 className="brand-font mt-8 text-[clamp(1.5rem,3.5vw,2.75rem)] leading-[1.15] tracking-[0.08em] text-fg uppercase">
              {spacedTitle(feature.title)}
            </h3>
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted sm:text-base">
              {feature.description}
            </p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div
            className={`relative aspect-[16/10] overflow-hidden border border-border bg-surface ${
              reverse ? "lg:order-1" : ""
            }`}
          >
            {mode === "video" ? (
              <Image
                src={feature.image}
                alt={feature.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40rem"
              />
            ) : (
              <div className="absolute inset-0 flex items-end bg-black p-6 sm:p-8">
                <p className="max-w-md text-sm leading-7 text-white/75">{feature.description}</p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export function PlatformPageView({ platform }: { platform: Platform }) {
  const [activeCapability, setActiveCapability] = useState(platform.capabilities[0]?.id ?? "");
  const capability =
    platform.capabilities.find((item) => item.id === activeCapability) ?? platform.capabilities[0];

  return (
    <main id="main-content" className="flex-1">
      <section className="relative min-h-[100svh] overflow-hidden bg-black">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={platform.heroImage}
            alt=""
            fill
            priority
            className="object-cover opacity-25"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
        </div>

        <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-5 pb-10 pt-32 sm:px-8 lg:px-12 lg:pb-14">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">
                {platform.index}
              </p>
              <h1 className="brand-font mt-3 text-[clamp(4.5rem,18vw,12rem)] font-normal leading-[0.82] tracking-[-0.06em] text-white/90">
                {platform.name}
              </h1>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/55 sm:text-base">
                {platform.heroTagline}
              </p>
            </div>

            <aside className="max-w-xs space-y-3 text-left lg:pb-3 lg:text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                {platform.exploreLabel}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                {platform.timeLabel}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                Scroll to explore
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/75">
                {platform.valueProp}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
                © {new Date().getFullYear()} {site.legalName}
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20 sm:py-28">
        <div className="container-x">
          <Reveal>
            <h2 className="brand-font max-w-4xl text-[clamp(2rem,6vw,4.5rem)] leading-[1.05] tracking-tight text-fg">
              {platform.statementTitle}{" "}
              <span className="text-muted">{platform.statementHighlight}</span>
            </h2>
            <p className="mt-8 max-w-2xl text-base leading-8 text-muted sm:text-lg">
              {platform.statementBody}
            </p>
          </Reveal>

          <div className="mt-14 flex flex-wrap gap-2 border-b border-border pb-4">
            {platform.capabilities.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveCapability(item.id)}
                className={`border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                  activeCapability === item.id
                    ? "border-white bg-white text-black"
                    : "border-border text-muted hover:text-fg"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {capability ? (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {capability.steps.map((step, index) => (
                <Reveal key={step.title} delay={index * 80}>
                  <article className="border border-border p-6 sm:p-7">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                      {String.fromCharCode(65 + index)}
                    </p>
                    <h3 className="brand-font mt-4 text-xl tracking-tight text-fg">{step.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-muted">{step.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="border-t border-border">
        {platform.features.map((feature, index) => (
          <FeatureBlock key={feature.title} feature={feature} index={index} />
        ))}
      </section>

      <section className="border-t border-border py-20 sm:py-28">
        <div className="container-x">
          <Reveal>
            <p className="max-w-3xl text-base leading-8 text-muted sm:text-lg">
              Solving complex problems across warehouse and industrial floors in days, not years.
            </p>
          </Reveal>
          <ul className="mt-12 columns-1 gap-x-12 sm:columns-2 lg:columns-3">
            {platform.industries.map((industry) => (
              <li
                key={industry}
                className="mb-3 break-inside-avoid border-b border-border py-3 font-mono text-[12px] uppercase tracking-[0.12em] text-fg/80"
              >
                {industry}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border py-20 sm:py-28">
        <div className="container-x">
          <Reveal>
            <h2 className="brand-font text-[clamp(2rem,5vw,3.5rem)] tracking-tight text-fg">
              {platform.ctaTitle}
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <article className="flex h-full flex-col border border-border p-7 sm:p-9">
                <h3 className="brand-font text-2xl tracking-tight text-fg">
                  Build with {platform.name}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-7 text-muted">{platform.ctaBody}</p>
                <div className="mt-8">
                  <GetStartedButton size="lg">
                    Get Started
                    <ArrowIcon />
                  </GetStartedButton>
                </div>
              </article>
            </Reveal>
            <Reveal delay={80}>
              <article className="flex h-full flex-col border border-border p-7 sm:p-9">
                <h3 className="brand-font text-2xl tracking-tight text-fg">Talk to Spectr</h3>
                <p className="mt-4 flex-1 text-sm leading-7 text-muted">
                  Tell us about your floor, sites, and stack — we will map where {platform.name}{" "}
                  fits in days, not quarters.
                </p>
                <div className="mt-8">
                  <GetStartedButton size="lg" variant="ghost">
                    Request a demo
                    <ArrowIcon />
                  </GetStartedButton>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
