import { Button } from "@/components/button";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { plans, pricingSection } from "@/lib/content";

export function Pricing() {
  return (
    <section id="pricing" className="section scroll-mt-20">
      <div className="container-x">
        <SectionHeading
          title={pricingSection.title}
          subtitle={pricingSection.subtitle}
        />

        <div className="mt-14 grid items-start gap-5 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 90}>
              <article
                className={`card flex h-full flex-col p-8 ${
                  plan.featured ? "border-accent/35 shadow-[0_0_60px_-20px_rgba(109,124,255,0.5)]" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="brand-font text-base font-semibold tracking-tight text-fg">
                    {plan.name}
                  </h3>
                  {plan.badge ? (
                    <span className="rounded-full border border-accent/35 bg-accent/10 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-accent">
                      {plan.badge}
                    </span>
                  ) : null}
                </div>

                <div className="mt-7 flex items-baseline gap-2">
                  <span className="display text-4xl text-fg sm:text-5xl">{plan.price}</span>
                  {plan.period ? (
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                      {plan.period}
                    </span>
                  ) : null}
                </div>

                <p className="mt-5 text-sm leading-7 text-muted">{plan.description}</p>

                <Button href={plan.cta.href} className="mt-8 w-full">
                  {plan.cta.label}
                </Button>

                <div className="mt-8 border-t border-border pt-7">
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    {plan.featuresTitle}
                  </h4>
                  <ul className="mt-5 space-y-3.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-3 text-sm leading-6 text-fg/80">
                        <TickIcon />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TickIcon() {
  return (
    <svg viewBox="0 0 16 16" className="mt-1 h-3.5 w-3.5 shrink-0 text-accent" fill="none" aria-hidden="true">
      <path
        d="m3 8.4 3 3 7-7.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
