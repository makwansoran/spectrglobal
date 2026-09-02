import Image from "next/image";
import { GetStartedButton } from "@/components/get-started-button";
import { Reveal } from "@/components/reveal";
import { SpectrOsCapabilities } from "@/components/spectr-os-capabilities";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { spectrOsPage } from "@/lib/spectr-os-page";
import "./spectr-os-page.css";

export function SpectrOsPageView() {
  const page = spectrOsPage;

  return (
    <main id="main-content" className="sos-page relative flex-1">
      <section className="sos-hero">
        <div className="container-x">
          <Reveal className="sos-hero__copy">
            <p className="sos-hero__kicker">{page.eyebrow}</p>
            <h1 className="display text-[clamp(3.4rem,9vw,7.4rem)]">{page.name}</h1>
            <p className="sos-hero__sub">{page.heroBody}</p>
            <div className="sos-hero__actions">
              <GetStartedButton label="Get started" size="lg" className="btn-on-dark">
                Get started
              </GetStartedButton>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="sos-intro" aria-labelledby="sos-intro-heading">
        <div className="container-x">
          <div className="sos-intro__grid">
            <Reveal>
              <h2 id="sos-intro-heading" className="display text-[clamp(2.2rem,5.2vw,4.4rem)] text-fg">
                {page.introTitle}
              </h2>
            </Reveal>
            <Reveal delay={60}>
              <p className="sos-intro__body">{page.intro}</p>
            </Reveal>
          </div>
          <Reveal delay={80}>
            <div className="sos-intro__still">
              <Image
                src={page.heroImage}
                alt={page.heroImageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 92rem"
                priority
              />
            </div>
          </Reveal>
        </div>
      </section>

      <SpectrOsCapabilities title={page.featuresTitle} features={page.features} />

      <LogoMarquee />

      <section className="sos-cta" aria-labelledby="sos-cta-heading">
        <div className="container-x">
          <div className="sos-cta__panel">
            <Image
              src={page.ctaImage}
              alt=""
              fill
              sizes="100vw"
            />
            <div className="sos-cta__scrim" />
            <div className="sos-cta__content">
              <h2 id="sos-cta-heading" className="display text-[clamp(2.2rem,5.4vw,4.8rem)]">
                {page.ctaTitle}
              </h2>
              <p className="sos-cta__body">{page.ctaBody}</p>
              <div className="sos-cta__actions">
                <GetStartedButton label="Get started" size="lg" className="btn-on-dark">
                  Get started
                </GetStartedButton>
                <GetStartedButton
                  label="Request a demo"
                  size="lg"
                  variant="secondary"
                  className="sos-cta__ghost"
                >
                  Request a demo
                </GetStartedButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
