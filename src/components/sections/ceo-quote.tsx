import { ArrowIcon } from "@/components/button";
import { GetStartedButton } from "@/components/get-started-button";
import { Reveal } from "@/components/reveal";
import { ceoQuote, homeCta } from "@/lib/content";

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

        <div className="mt-16 sm:mt-20">
          <Reveal>
            <h2 className="brand-font text-[clamp(1.35rem,3vw,2rem)] tracking-tight text-fg">
              {homeCta.title}
            </h2>
          </Reveal>
          <div className="mt-7 grid gap-3 lg:grid-cols-2">
            <Reveal>
              <article className="bevel-panel bevel-panel-muted flex h-full flex-col p-5 sm:p-6">
                <h3 className="brand-font text-base tracking-tight text-fg">{homeCta.primaryTitle}</h3>
                <p className="mt-2 flex-1 text-[12px] leading-5 text-muted">{homeCta.primaryBody}</p>
                <div className="mt-5">
                  <GetStartedButton>
                    {homeCta.primaryCta}
                    <ArrowIcon />
                  </GetStartedButton>
                </div>
              </article>
            </Reveal>
            <Reveal delay={50}>
              <article className="bevel-panel bevel-panel-muted flex h-full flex-col p-5 sm:p-6">
                <h3 className="brand-font text-base tracking-tight text-fg">{homeCta.secondaryTitle}</h3>
                <p className="mt-2 flex-1 text-[12px] leading-5 text-muted">{homeCta.secondaryBody}</p>
                <div className="mt-5">
                  <GetStartedButton>
                    {homeCta.secondaryCta}
                    <ArrowIcon />
                  </GetStartedButton>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
