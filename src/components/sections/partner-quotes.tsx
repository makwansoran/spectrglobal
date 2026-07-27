import { Reveal } from "@/components/reveal";
import { partnerQuotes, partnersSection } from "@/lib/content";

export function PartnerQuotes() {
  const loop = [...partnerQuotes, ...partnerQuotes];

  return (
    <section id="partners" className="section scroll-mt-20 overflow-hidden">
      <div className="container-x">
        <Reveal>
          <h2 className="brand-font max-w-3xl text-[2rem] font-normal tracking-tight text-fg sm:text-[2.75rem] lg:text-[2.875rem]">
            {partnersSection.title}
          </h2>
        </Reveal>
      </div>

      <div className="partner-marquee mt-14" aria-label="Partner quotes">
        <div className="partner-marquee__track">
          {loop.map((item, index) => (
            <article
              key={`${item.company}-${index}`}
              className="partner-card group"
              aria-hidden={index >= partnerQuotes.length}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                {item.company}
              </p>
              <blockquote className="mt-6 flex-1 text-[1.05rem] leading-8 text-fg sm:text-[1.125rem] sm:leading-8">
                “{item.quote}”
              </blockquote>
              <div className="mt-8 border-t border-border pt-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-sm font-medium text-fg">{item.person}</p>
                <p className="mt-1 text-sm text-muted">{item.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
