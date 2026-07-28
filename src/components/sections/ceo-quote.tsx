import { DemoRequestBox } from "@/components/demo-request-box";
import { Reveal } from "@/components/reveal";
import { ceoQuote } from "@/lib/content";

export function CeoQuote() {
  return (
    <section id="ceo" className="section scroll-mt-24 bg-bg">
      <div className="container-x">
        <Reveal>
          <blockquote className="mx-auto max-w-4xl text-center">
            <p className="brand-font text-[1.65rem] leading-snug tracking-tight text-fg sm:text-4xl sm:leading-[1.15] lg:text-[2.75rem]">
              “{ceoQuote.quote}”
            </p>
            <footer className="mt-10">
              <p className="text-sm font-medium text-fg">{ceoQuote.attribution}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                {ceoQuote.role}
              </p>
            </footer>
          </blockquote>
        </Reveal>

        <Reveal delay={80}>
          <DemoRequestBox />
        </Reveal>
      </div>
    </section>
  );
}
