import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { principles, principlesSection } from "@/lib/content";

export function Principles() {
  return (
    <section id="principles" className="section scroll-mt-20">
      <div className="container-x">
        <SectionHeading
          title={principlesSection.title}
          subtitle={principlesSection.subtitle}
        />

        <div className="mt-14 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {principles.map((principle, index) => (
            <Reveal key={principle.attribution} delay={(index % 3) * 80}>
              <figure className="card card-hover p-7">
                <QuoteIcon />
                <blockquote className="mt-5 text-[0.95rem] leading-8 text-fg/85">
                  {principle.quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  {principle.attribution}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuoteIcon() {
  return (
    <svg viewBox="0 0 24 16" className="h-4 w-6 text-accent/60" fill="currentColor" aria-hidden="true">
      <path d="M0 16V9.2C0 4.3 2.8 1 7.4 0l.9 2.2C5.7 3.2 4.3 5 4.2 7.4H7.7V16H0Zm13.3 0V9.2c0-4.9 2.8-8.2 7.4-9.2l.9 2.2C19 3.2 17.6 5 17.5 7.4H21V16h-7.7Z" />
    </svg>
  );
}
