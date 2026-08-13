import Link from "next/link";
import { ArrowIcon } from "@/components/button";
import { GetStartedButton } from "@/components/get-started-button";
import { LogoMark, Wordmark } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { spectrOsPage } from "@/lib/spectr-os-page";
import { site } from "@/lib/site";

export function SpectrOsPageView() {
  const page = spectrOsPage;

  return (
    <main id="main-content" className="theme-light relative flex-1 bg-bg text-fg">
      <Link
        href="/"
        className="absolute left-5 top-5 z-20 flex items-center gap-2.5 hover:opacity-70 sm:left-8 sm:top-6"
        aria-label={site.name}
      >
        <LogoMark className="h-7 w-7" />
        <Wordmark className="text-fg" />
      </Link>

      {/* Intro */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="container-x flex min-h-[70svh] flex-col justify-end pb-14 pt-28 sm:pb-20 sm:pt-32">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              {page.eyebrow}
            </p>
            <h1 className="brand-font mt-4 text-[clamp(2.75rem,10vw,6.5rem)] font-normal leading-[0.9] tracking-[-0.05em] text-fg">
              {page.name}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg sm:leading-8">
              {page.heroBody}
            </p>
            <div className="mt-8">
              <GetStartedButton label="Contact us" size="lg">
                Contact us
                <ArrowIcon />
              </GetStartedButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What it is */}
      <section className="border-b border-border py-16 sm:py-24">
        <div className="container-x">
          <Reveal>
            <h2 className="brand-font text-[clamp(1.75rem,4vw,3rem)] leading-[1.1] tracking-tight text-fg">
              {page.introTitle}
            </h2>
            <p className="mt-6 max-w-3xl text-[1.05rem] leading-8 text-muted sm:text-[1.125rem] sm:leading-8">
              {page.intro}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24">
        <div className="container-x">
          <Reveal>
            <h2 className="brand-font text-[clamp(1.75rem,4vw,3rem)] leading-[1.1] tracking-tight text-fg">
              {page.featuresTitle}
            </h2>
          </Reveal>

          <ul className="mt-12 space-y-3">
            {page.features.map((feature, index) => (
              <li key={feature.id}>
                <Reveal delay={Math.min(index * 30, 180)}>
                  <article className="bevel-panel bevel-panel-muted grid gap-4 px-5 py-6 sm:grid-cols-[minmax(0,0.35fr)_minmax(0,1fr)] sm:gap-10 sm:px-6 sm:py-8">
                    <div className="flex items-baseline justify-between gap-4 sm:block">
                      <h3 className="brand-font text-[clamp(1.35rem,3vw,2rem)] leading-none tracking-tight text-fg">
                        {feature.title}
                      </h3>
                      <span className="font-mono text-[11px] tracking-[0.12em] text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="max-w-2xl text-[15px] leading-7 text-muted sm:text-base sm:leading-8">
                      {feature.body}
                    </p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-16 sm:py-24">
        <div className="container-x">
          <Reveal>
            <h2 className="brand-font text-[clamp(1.5rem,3.5vw,2.5rem)] tracking-tight text-fg">
              {page.ctaTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted sm:text-base sm:leading-8">
              {page.ctaBody}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <GetStartedButton label="Contact us" size="lg">
                Contact us
                <ArrowIcon />
              </GetStartedButton>
              <GetStartedButton label="Request a demo" size="lg" variant="secondary">
                Request a demo
                <ArrowIcon />
              </GetStartedButton>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
