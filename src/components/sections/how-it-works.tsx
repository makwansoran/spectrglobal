import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { howItWorks, howItWorksSection } from "@/lib/content";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section scroll-mt-20">
      <div className="container-x">
        <SectionHeading eyebrow={howItWorksSection.eyebrow} title={howItWorksSection.title} />

        <div className="relative mt-16">
          <div
            className="absolute inset-x-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-border-strong to-transparent md:block"
            aria-hidden="true"
          />
          <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
            {howItWorks.map((item, index) => (
              <Reveal key={item.step} as="li" delay={index * 110} className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-bg font-mono text-xs tracking-[0.1em] text-accent">
                  {item.step}
                </div>
                <h3 className="brand-font mt-6 text-xl font-semibold tracking-tight text-fg">
                  {item.title}
                </h3>
                <p className="mt-3.5 max-w-sm text-sm leading-7 text-muted">{item.description}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
