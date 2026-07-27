"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowIcon, Button } from "@/components/button";
import { GetStartedButton } from "@/components/get-started-button";
import { Reveal } from "@/components/reveal";
import type { Platform } from "@/lib/platforms";
import { site } from "@/lib/site";

export function PlatformPageView({ platform }: { platform: Platform }) {
  const [activeCapability, setActiveCapability] = useState(platform.capabilities[0]?.id ?? "");
  const [activeFeature, setActiveFeature] = useState(0);
  const capability =
    platform.capabilities.find((item) => item.id === activeCapability) ?? platform.capabilities[0];
  const feature = platform.features[activeFeature] ?? platform.features[0];

  return (
    <main id="main-content" className="flex-1">
      <section className="relative min-h-[100svh] overflow-hidden bg-black">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={platform.heroImage}
            alt=""
            fill
            priority
            className="object-cover opacity-40"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        </div>

        <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-5 pb-10 pt-28 sm:px-8 lg:px-12 lg:pb-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                {platform.index}
              </p>
              <h1 className="brand-font mt-2 text-[clamp(2.75rem,10vw,6.5rem)] font-normal leading-[0.88] tracking-[-0.05em] text-white">
                {platform.name}
              </h1>
              <p className="mt-4 max-w-sm text-[13px] leading-6 text-white/60">{platform.heroTagline}</p>
            </div>

            <aside className="max-w-[14rem] space-y-2.5 text-left lg:pb-1 lg:text-right">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/55">
                {platform.exploreLabel}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/55">
                {platform.timeLabel}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/55">
                Scroll to explore
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/80">
                {platform.valueProp}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">
                © {new Date().getFullYear()} {site.legalName}
              </p>
            </aside>
          </div>
        </div>
      </section>

      <div className="theme-light">
        <section className="flex min-h-[100svh] flex-col justify-center py-16 sm:py-20">
          <div className="container-x flex flex-col items-center text-center">
            <Reveal>
              <h2 className="brand-font mx-auto max-w-3xl text-[clamp(1.4rem,3vw,2.25rem)] leading-[1.2] tracking-tight text-fg">
                {platform.statementTitle}{" "}
                <span className="text-muted">{platform.statementHighlight}</span>
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-[13px] leading-6 text-muted">
                {platform.statementBody}
              </p>
            </Reveal>

            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {platform.capabilities.map((item) => {
                const active = activeCapability === item.id;
                return (
                  <Button
                    key={item.id}
                    type="button"
                    size="sm"
                    onClick={() => setActiveCapability(item.id)}
                    className={active ? "" : "bevel-button-muted"}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </div>

            {capability ? (
              <div className="mt-8 grid w-full gap-3 md:grid-cols-3">
                {capability.steps.map((step, index) => (
                  <Reveal key={step.title} delay={index * 50}>
                    <article className="bevel-panel bevel-panel-muted h-full p-5 text-left sm:p-6">
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                        {String.fromCharCode(65 + index)}
                      </p>
                      <h3 className="brand-font mt-2 text-[15px] tracking-tight text-fg">{step.title}</h3>
                      <p className="mt-1.5 text-[12px] leading-5 text-muted">{step.body}</p>
                    </article>
                  </Reveal>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section>
          <div className="relative min-h-[80svh] overflow-hidden bg-black">
            {feature ? (
              <>
                <Image
                  key={feature.title}
                  src={feature.image}
                  alt={feature.imageAlt}
                  fill
                  className="object-cover opacity-65"
                  sizes="100vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/25" />
                <div className="relative z-10 flex min-h-[80svh] flex-col justify-end px-5 pb-8 pt-24 sm:px-8 lg:px-12">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/50">
                    {String(activeFeature + 1).padStart(2, "0")} /{" "}
                    {String(platform.features.length).padStart(2, "0")}
                  </p>
                  <h3 className="brand-font mt-2 text-[clamp(1.75rem,4vw,3rem)] leading-none tracking-tight text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-[13px] text-white/70">{feature.description}</p>
                </div>
              </>
            ) : null}
          </div>

          <div className="container-x grid gap-3 py-6 sm:grid-cols-2 lg:grid-cols-4">
            {platform.features.map((item, index) => {
              const active = activeFeature === index;
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActiveFeature(index)}
                  className={`bevel-panel-image group relative aspect-[5/4] text-left ${
                    active ? "ring-2 ring-fg ring-offset-2 ring-offset-[var(--bg)]" : ""
                  }`}
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className={`object-cover transition-opacity duration-300 ${
                      active ? "opacity-80" : "opacity-50 group-hover:opacity-70"
                    }`}
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="brand-font mt-0.5 text-[15px] tracking-tight text-white">{item.title}</p>
                    <p className="mt-0.5 text-[11px] leading-4 text-white/60">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container-x">
            <Reveal>
              <p className="brand-font max-w-3xl text-[clamp(1.5rem,4vw,2.75rem)] leading-[1.15] tracking-tight text-fg">
                {platform.industriesIntro}
              </p>
            </Reveal>
            <ul className="mt-8 space-y-2">
              {platform.industries.map((industry, index) => (
                <li key={industry.name}>
                  <Reveal delay={index * 40}>
                    <article className="industry-row bevel-panel bevel-panel-muted group px-5 sm:px-6">
                      <div className="flex items-baseline justify-between gap-4 py-4 transition-[padding] duration-300 ease-out group-hover:py-5 group-focus-within:py-5 sm:py-5 sm:group-hover:py-6">
                        <h3 className="brand-font text-[clamp(1.35rem,3.5vw,2.25rem)] leading-none tracking-tight text-fg transition-transform duration-300 group-hover:translate-x-1">
                          {industry.name}
                        </h3>
                        <span className="shrink-0 font-mono text-[10px] tracking-[0.12em] text-muted">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="industry-row__detail grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
                        <div className="overflow-hidden">
                          <div className="grid gap-5 pb-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 sm:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] sm:gap-8 sm:pb-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
                            <div className="bevel-panel-image relative aspect-[16/10] bg-surface">
                              <Image
                                src={industry.image}
                                alt={industry.imageAlt}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 100vw, 22rem"
                              />
                            </div>
                            <div className="flex max-w-2xl flex-col justify-end gap-2 sm:pb-1">
                              <p className="brand-font text-[clamp(1.1rem,2.2vw,1.5rem)] leading-snug tracking-tight text-fg">
                                {industry.imageAlt}
                              </p>
                              <p className="text-[15px] leading-7 text-muted sm:text-base sm:leading-8">
                                {industry.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container-x">
            <Reveal>
              <h2 className="brand-font text-[clamp(1.35rem,3vw,2rem)] tracking-tight text-fg">
                {platform.ctaTitle}
              </h2>
            </Reveal>
            <div className="mt-7 grid gap-3 lg:grid-cols-2">
              <Reveal>
                <article className="bevel-panel bevel-panel-muted flex h-full flex-col p-5 sm:p-6">
                  <h3 className="brand-font text-base tracking-tight text-fg">
                    Build with {platform.name}
                  </h3>
                  <p className="mt-2 flex-1 text-[12px] leading-5 text-muted">{platform.ctaBody}</p>
                  <div className="mt-5">
                    <GetStartedButton>
                      Get Started
                      <ArrowIcon />
                    </GetStartedButton>
                  </div>
                </article>
              </Reveal>
              <Reveal delay={50}>
                <article className="bevel-panel bevel-panel-muted flex h-full flex-col p-5 sm:p-6">
                  <h3 className="brand-font text-base tracking-tight text-fg">Talk to Spectr</h3>
                  <p className="mt-2 flex-1 text-[12px] leading-5 text-muted">
                    Map where {platform.name} fits — in days, not quarters.
                  </p>
                  <div className="mt-5">
                    <GetStartedButton>
                      Request a demo
                      <ArrowIcon />
                    </GetStartedButton>
                  </div>
                </article>
              </Reveal>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
