import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArgusCompareChart } from "@/components/argus-compare";
import { ArgusHeroActions } from "@/components/argus-hero-actions";
import { GetStartedButton } from "@/components/get-started-button";
import { Reveal } from "@/components/reveal";
import { argusPage, argusUseCases } from "@/lib/argus-page";
import "./argus-page.css";

export function ArgusPageView() {
  const page = argusPage;

  return (
    <main id="main-content" className="argus-page">
      <section className="argus-hero" aria-labelledby="argus-hero-title">
        <div className="argus-wrap argus-hero__layout">
          <Reveal className="argus-hero__copy">
            <p className="argus-kicker">Vision model</p>
            <h1 id="argus-hero-title">{page.name}</h1>
            <p className="argus-hero__lede">{page.heroBody}</p>
            <ArgusHeroActions />
          </Reveal>
          <Reveal delay={80} className="argus-hero__media">
            <video
              className="argus-hero__video"
              src={page.heroVideo}
              aria-label={page.heroVideoAlt}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
          </Reveal>
        </div>
      </section>

      <section className="argus-compare-section" aria-labelledby="argus-compare-title">
        <div className="argus-wrap argus-compare-layout">
          <Reveal className="argus-compare-copy">
            <h2 id="argus-compare-title">{page.compareTitle}</h2>
            <p>{page.compareBody}</p>
            <p className="argus-compare-note">{page.compareNote}</p>
          </Reveal>
          <Reveal delay={60} className="argus-compare-visual">
            <ArgusCompareChart />
          </Reveal>
        </div>
      </section>

      <section className="argus-usecases" aria-labelledby="argus-usecases-title">
        <div className="argus-wrap">
          <Reveal className="argus-section-head">
            <h2 id="argus-usecases-title">Use cases</h2>
            <p>Point Argus at the stream you already have. Same model, different floor.</p>
          </Reveal>
          <ul className="argus-usecases__grid">
            {argusUseCases.map((item, index) => (
              <li key={item.name} style={{ "--i": index } as CSSProperties}>
                <div className="argus-usecase">
                  <div className="argus-usecase__media">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 45vw, 22rem"
                      className="argus-usecase__image"
                    />
                  </div>
                  <div className="argus-usecase__copy">
                    <h3>{item.name}</h3>
                    <p>{item.line}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="argus-cta" aria-labelledby="argus-cta-title">
        <div className="argus-wrap">
          <div className="argus-cta__panel">
            <Image src={page.ctaImage} alt="" fill sizes="100vw" className="argus-cta__image" />
            <div className="argus-cta__scrim" />
            <div className="argus-cta__content">
              <h2 id="argus-cta-title">{page.ctaTitle}</h2>
              <div className="argus-cta__actions">
                <GetStartedButton label="Get started" size="lg" className="btn-on-dark">
                  Get started
                </GetStartedButton>
                <Link href="/developers/argus" className="argus-cta__ghost">
                  Read the docs
                </Link>
                <a
                  href={page.github}
                  className="argus-cta__ghost"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
