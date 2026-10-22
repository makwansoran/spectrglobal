import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { GetStartedButton } from "@/components/get-started-button";
import { Reveal } from "@/components/reveal";
import { VisionlabCompareChart } from "@/components/visionlab-compare";
import { VisionlabHeroActions } from "@/components/visionlab-hero-actions";
import { visionlabPage, visionlabUseCases } from "@/lib/visionlab-page";
import "./argus-page.css";

export function VisionlabPageView() {
  const page = visionlabPage;

  return (
    <main id="main-content" className="argus-page">
      <section className="argus-hero" aria-labelledby="visionlab-hero-title">
        <div className="argus-wrap argus-hero__layout">
          <Reveal className="argus-hero__copy">
            <p className="argus-kicker">Vision app</p>
            <h1 id="visionlab-hero-title">{page.name}</h1>
            <p className="argus-hero__lede">{page.heroBody}</p>
            <VisionlabHeroActions />
          </Reveal>
          <Reveal delay={80} className="argus-hero__media">
            <Image
              src={page.heroImage}
              alt={page.heroImageAlt}
              fill
              priority
              sizes="(max-width: 960px) 100vw, 52rem"
              className="argus-hero__video"
            />
          </Reveal>
        </div>
      </section>

      <section className="argus-compare-section" aria-labelledby="visionlab-compare-title">
        <div className="argus-wrap argus-compare-layout">
          <Reveal className="argus-compare-copy">
            <h2 id="visionlab-compare-title">{page.compareTitle}</h2>
            <p>{page.compareBody}</p>
            <p className="argus-compare-note">{page.compareNote}</p>
          </Reveal>
          <Reveal delay={60} className="argus-compare-visual">
            <VisionlabCompareChart />
          </Reveal>
        </div>
      </section>

      <section className="argus-usecases" aria-labelledby="visionlab-usecases-title">
        <div className="argus-wrap">
          <Reveal className="argus-section-head">
            <h2 id="visionlab-usecases-title">Use cases</h2>
            <p>Open the stream you already have. Same app, different floor.</p>
          </Reveal>
          <ul className="argus-usecases__grid">
            {visionlabUseCases.map((item, index) => (
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

      <section className="argus-cta" aria-labelledby="visionlab-cta-title">
        <div className="argus-wrap">
          <div className="argus-cta__panel">
            <Image src={page.ctaImage} alt="" fill sizes="100vw" className="argus-cta__image" />
            <div className="argus-cta__scrim" />
            <div className="argus-cta__content">
              <h2 id="visionlab-cta-title">{page.ctaTitle}</h2>
              <div className="argus-cta__actions">
                <GetStartedButton label="Book a meeting" size="lg" className="btn-on-dark">
                  Book a meeting
                </GetStartedButton>
                <Link href="/developers/visionlab" className="argus-cta__ghost">
                  Read the docs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
