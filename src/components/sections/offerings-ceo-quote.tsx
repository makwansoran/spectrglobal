import { Reveal } from "@/components/reveal";
import { offeringsCeoQuote } from "@/lib/content";

export function OfferingsCeoQuote() {
  return (
    <section className="border-t border-border py-20 sm:py-28" aria-label="Spectr Philosophy">
      <div className="container-x">
        <Reveal>
          <blockquote className="mx-auto max-w-4xl text-center">
            <p className="label">{offeringsCeoQuote.eyebrow}</p>
            <p className="brand-font mt-8 text-[1.35rem] leading-snug tracking-tight text-fg sm:text-3xl sm:leading-[1.25] lg:text-[2.35rem]">
              {offeringsCeoQuote.quote}
            </p>
            <footer className="mt-10">
              <p className="text-sm font-medium text-fg">{offeringsCeoQuote.attribution}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                {offeringsCeoQuote.role}
              </p>
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
