"use client";

import Image from "next/image";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { scrollAllRootsToTop, scheduleScrollResets } from "@/components/scroll-to-top";
import type { ProductLandingContent } from "@/lib/product-landing-content";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type ProductLandingProps = {
  content: ProductLandingContent;
};

export function ProductLanding({ content }: ProductLandingProps) {
  useIsomorphicLayoutEffect(() => {
    if (window.location.hash) return;
    return scheduleScrollResets();
  }, [content.slug]);

  return (
    <main id="main-content" className="product-landing bg-[#050505] text-white">
      <HeroSection content={content} />
      {content.slug !== "recon" ? <ProblemSection content={content} /> : null}
      <PlatformSection content={content} />
      <WorkflowSection content={content} />
      {content.slug !== "recon" ? <CommandCenterSection content={content} /> : null}
      {content.slug !== "recon" ? <AgentsSection content={content} /> : null}
      {content.slug !== "recon" ? <TrustSection content={content} /> : null}
      {content.slug !== "recon" ? <ApplicationsSection content={content} /> : null}
      <TechnologySection content={content} />
      <StatsSection content={content} />
      <CtaSection content={content} />
    </main>
  );
}

function SectionShell({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`relative px-5 py-28 sm:px-8 lg:py-36 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function HeroSection({ content }: ProductLandingProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-screen items-end overflow-hidden bg-[#050505] px-5 pt-28 sm:px-8">
      <div className="product-grid absolute inset-0 opacity-25" />
      <motion.div className="product-radar absolute inset-0" style={{ opacity }} />
      <div className="product-particles absolute inset-0 opacity-60" />

      <motion.div className="absolute inset-0" style={{ y }}>
        <Image
          src={content.heroImage}
          alt={content.name}
          fill
          priority
          className={`object-cover opacity-70 ${
            content.slug === "recon" ? "object-[72%_center]" : "object-[center_35%]"
          }`}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-[#050505]/35 to-[#050505]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 mx-auto w-full max-w-7xl pb-20 lg:pb-24">
        <div className="max-w-md sm:max-w-lg lg:max-w-xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/50">{content.name}</p>
          <ScrollRevealHeading
            as="h1"
            revealOnMount
            className="mt-4 block max-w-md text-3xl font-semibold leading-[1.05] tracking-[-0.04em] sm:mt-5 sm:text-4xl lg:text-5xl"
          >
            {content.hero.headline}
          </ScrollRevealHeading>
          <ScrollRevealHeading
            as="h2"
            revealOnMount
            delay={500}
            className="mt-4 block max-w-md text-sm font-normal leading-7 text-white/60 sm:mt-5 sm:text-base"
          >
            {content.hero.subheadline}
          </ScrollRevealHeading>
          <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-80"
          >
            {content.hero.ctaPrimary}
            <span aria-hidden="true">→</span>
          </Link>
          <a
            href="#platform"
            className="inline-flex items-center gap-3 border border-white/25 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-white/60"
          >
            {content.hero.ctaSecondary}
          </a>
        </div>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">Scroll</span>
        <span className="product-scroll-line" aria-hidden="true" />
      </motion.div>
    </section>
  );
}

function ProblemSection({ content }: ProductLandingProps) {
  return (
    <SectionShell className="border-t border-white/[0.06]">
      <FadeIn>
        <h2 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
          {content.problem.headline}
        </h2>
      </FadeIn>
      <div className="product-problem-grid mt-20">
        {content.problem.cards.map((card, index) => (
          <FadeIn key={card.title} delay={index * 0.12} className="relative">
            <article className="product-glass h-full p-8 sm:p-10">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
                0{index + 1}
              </span>
              <h3 className="mt-6 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{card.title}</h3>
              <p className="mt-5 text-base leading-7 text-white/50">{card.text}</p>
            </article>
            {index < content.problem.cards.length - 1 ? (
              <span className="product-flow-connector hidden lg:block" aria-hidden="true" />
            ) : null}
          </FadeIn>
        ))}
      </div>
    </SectionShell>
  );
}

function PlatformSection({ content }: ProductLandingProps) {
  const [active, setActive] = useState(0);
  const activeNode = content.platform.nodes[active] ?? content.platform.nodes[0];

  return (
    <SectionShell id="platform" className="border-t border-white/[0.06] bg-[#080808]">
      <FadeIn>
        <h2 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
          {content.platform.headline}
        </h2>
      </FadeIn>
      <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-stretch">
        <div className="space-y-2">
          {content.platform.nodes.map((node, index) => (
            <button
              key={node.label}
              type="button"
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              className={`product-flow-node w-full text-left ${active === index ? "is-active" : ""}`}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mt-2 block text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                {node.label}
              </span>
            </button>
          ))}
        </div>
        <div className="product-platform-panel relative min-h-[480px] overflow-hidden border border-white/10">
          <AnimatePresence mode="sync">
            <motion.div
              key={activeNode.image + activeNode.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={activeNode.image}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/15" />
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex min-h-[480px] flex-col justify-end p-8 sm:p-10"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">
                {activeNode.label}
              </p>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/80 sm:text-base sm:leading-8">
                {activeNode.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </SectionShell>
  );
}

function WorkflowSection({ content }: ProductLandingProps) {
  return (
    <SectionShell className="border-t border-white/[0.06]">
      <FadeIn>
        <h2 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
          {content.workflow.headline}
        </h2>
      </FadeIn>
      <div className="mt-20 space-y-0">
        {content.workflow.steps.map((step, index) => (
          <WorkflowStep key={step.title} step={step} index={index} />
        ))}
      </div>
    </SectionShell>
  );
}

function WorkflowStep({
  step,
  index,
}: {
  step: { title: string; text: string };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="grid gap-6 border-t border-white/[0.08] py-12 sm:grid-cols-[120px_1fr] sm:gap-12 lg:grid-cols-[200px_1fr]"
    >
      <span className="font-mono text-sm uppercase tracking-[0.3em] text-white/30">
        Step {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <h3 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl">{step.title}</h3>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/50 sm:text-lg">{step.text}</p>
      </div>
    </motion.div>
  );
}

function CommandCenterSection({ content }: ProductLandingProps) {
  return (
    <SectionShell className="border-t border-white/[0.06] bg-[#080808]">
      <FadeIn>
        <h2 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
          {content.commandCenter.headline}
        </h2>
      </FadeIn>
      <FadeIn delay={0.15} className="mt-16">
        <div className="product-command relative overflow-hidden rounded-sm border border-white/10">
          <div className="product-grid absolute inset-0 opacity-20" />
          <div className="relative grid gap-px bg-white/10 lg:grid-cols-3">
            <div className="col-span-2 min-h-[320px] bg-[#0a0a0a] p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400/80">
                {content.commandCenter.status}
              </p>
              <div className="product-map mt-8 h-48 sm:h-64" />
              <div className="mt-6 flex flex-wrap gap-3">
                {["ALPHA", "BRAVO", "CHARLIE"].map((unit) => (
                  <span key={unit} className="product-tag">
                    {unit}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-px bg-white/10">
              <div className="flex-1 bg-[#0a0a0a] p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">Telemetry</p>
                <ul className="mt-5 space-y-3">
                  {content.commandCenter.telemetry.map((item) => (
                    <li key={item} className="font-mono text-xs tracking-[0.12em] text-white/60">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 bg-[#0a0a0a] p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">Status</p>
                <ul className="mt-5 space-y-3">
                  {content.commandCenter.threats.map((item) => (
                    <li key={item} className="font-mono text-xs tracking-[0.12em] text-amber-300/70">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </SectionShell>
  );
}

function AgentsSection({ content }: ProductLandingProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <SectionShell className="border-t border-white/[0.06]">
      <FadeIn>
        <h2 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
          {content.agents.headline}
        </h2>
      </FadeIn>
      <div className="mt-16 grid gap-4 sm:grid-cols-2">
        {content.agents.items.map((agent, index) => {
          const isOpen = expanded === index;
          return (
            <motion.button
              key={agent.title}
              type="button"
              layout
              onClick={() => setExpanded(isOpen ? null : index)}
              className={`product-agent-card text-left ${isOpen ? "is-open" : ""}`}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
                Agent 0{index + 1}
              </span>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">{agent.title}</h3>
              <AnimatePresence>
                {isOpen ? (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 overflow-hidden text-sm leading-7 text-white/50"
                  >
                    {agent.text}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </SectionShell>
  );
}

function TrustSection({ content }: ProductLandingProps) {
  return (
    <SectionShell className="border-t border-white/[0.06] bg-[#080808]">
      <FadeIn>
        <h2 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
          {content.trust.headline}
        </h2>
      </FadeIn>
      <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {content.trust.items.map((item, index) => (
          <FadeIn key={item} delay={index * 0.08}>
            <div className="product-trust-item">
              <span className="product-trust-ring" aria-hidden="true" />
              <p className="text-lg font-medium tracking-[-0.02em] sm:text-xl">{item}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </SectionShell>
  );
}

function ApplicationsSection({ content }: ProductLandingProps) {
  return (
    <SectionShell className="border-t border-white/[0.06]">
      <FadeIn>
        <h2 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
          {content.applications.headline}
        </h2>
      </FadeIn>
      <div className="product-apps-scroll mt-16 flex gap-5 overflow-x-auto pb-4">
        {content.applications.items.map((app) => (
          <article key={app.title} className="product-app-card group relative shrink-0">
            <Image src={app.image} alt={app.title} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="360px" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <h3 className="absolute bottom-0 left-0 right-0 p-8 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
              {app.title}
            </h3>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

function TechnologySection({ content }: ProductLandingProps) {
  return (
    <SectionShell className="border-t border-white/[0.06] bg-[#080808]">
      <FadeIn>
        <h2 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
          {content.technology.headline}
        </h2>
      </FadeIn>
      <div className="mt-16 grid gap-4 lg:grid-cols-5">
        {content.technology.items.map((item, index) => (
          <FadeIn key={item.title} delay={index * 0.08}>
            <article className="product-tech-card h-full">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em] sm:text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/45">{item.text}</p>
            </article>
          </FadeIn>
        ))}
      </div>
    </SectionShell>
  );
}

function StatsSection({ content }: ProductLandingProps) {
  return (
    <SectionShell className="border-t border-white/[0.06]">
      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        {content.stats.items.map((stat, index) => (
          <FadeIn key={stat.label} delay={index * 0.1}>
            <StatCounter stat={stat} />
          </FadeIn>
        ))}
      </div>
    </SectionShell>
  );
}

function StatCounter({ stat }: { stat: { label: string; value: number; suffix: string } }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(stat.value * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, stat.value]);

  const formatted =
    stat.value % 1 !== 0 ? display.toFixed(2) : Math.round(display).toString();

  return (
    <div ref={ref} className="border-t border-white/15 pt-8">
      <p className="text-5xl font-semibold tracking-[-0.05em] sm:text-6xl lg:text-7xl">
        {formatted}
        <span className="text-white/40">{stat.suffix}</span>
      </p>
      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">{stat.label}</p>
    </div>
  );
}

function CtaSection({ content }: ProductLandingProps) {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.06] px-5 py-32 sm:px-8 lg:py-44">
      <div className="product-grid absolute inset-0 opacity-30" />
      <div className="product-particles absolute inset-0" />
      <FadeIn className="relative z-10 mx-auto max-w-7xl text-center">
        <h2 className="mx-auto max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
          {content.cta.headline}
        </h2>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-80"
          >
            {content.cta.primary}
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 border border-white/25 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-white/60"
          >
            {content.cta.secondary}
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}
