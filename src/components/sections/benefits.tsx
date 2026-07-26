import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { benefits, benefitsSection } from "@/lib/content";

export function Benefits() {
  return (
    <section id="benefits" className="section scroll-mt-20">
      <div className="container-x">
        <SectionHeading
          eyebrow={benefitsSection.eyebrow}
          title={benefitsSection.title}
          subtitle={benefitsSection.subtitle}
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-[22px] border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <Reveal key={benefit.title} delay={(index % 3) * 80}>
              <div className="h-full bg-bg p-8 transition-colors hover:bg-surface">
                <h3 className="brand-font text-lg font-semibold tracking-tight text-fg">
                  {benefit.title}
                </h3>
                <p className="mt-3.5 text-sm leading-7 text-muted">{benefit.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
