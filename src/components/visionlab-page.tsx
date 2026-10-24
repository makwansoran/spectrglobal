import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { GetStartedButton } from "@/components/get-started-button";
import { Reveal } from "@/components/reveal";
import { VisionlabHeroActions } from "@/components/visionlab-hero-actions";
import { VisionlabModelsCatalog } from "@/components/visionlab-models";
import { visionlabPage, visionlabUseCases } from "@/lib/visionlab-page";
import "./product-page.css";

export function VisionlabPageView() {
  const page = visionlabPage;

  return (
    <main id="main-content" className="product-page">
      <section className="product-hero" aria-labelledby="visionlab-hero-title">
        <div className="product-wrap product-hero__layout">
          <Reveal className="product-hero__copy">
            <p className="product-kicker">Vision app</p>
            <h1 id="visionlab-hero-title">{page.name}</h1>
            <p className="product-hero__lede">{page.heroBody}</p>
            <VisionlabHeroActions />
          </Reveal>
          <Reveal delay={80} className="product-hero__media">
            <Image
              src={page.heroImage}
              alt={page.heroImageAlt}
              fill
              priority
              sizes="(max-width: 960px) 100vw, 52rem"
              className="product-hero__video"
            />
          </Reveal>
        </div>
      </section>

      <VisionlabModelsCatalog />

      <section className="product-usecases" aria-labelledby="visionlab-usecases-title">
        <div className="product-wrap">
          <Reveal className="product-section-head">
            <h2 id="visionlab-usecases-title">Use cases</h2>
            <p>Open the stream you already have. Same app, different floor.</p>
          </Reveal>
          <ul className="product-usecases__grid">
            {visionlabUseCases.map((item, index) => (
              <li key={item.name} style={{ "--i": index } as CSSProperties}>
                <div className="product-usecase">
                  <div className="product-usecase__media">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 45vw, 22rem"
                      className="product-usecase__image"
                    />
                  </div>
                  <div className="product-usecase__copy">
                    <h3>{item.name}</h3>
                    <p>{item.line}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="product-cta" aria-labelledby="visionlab-cta-title">
        <div className="product-wrap">
          <div className="product-cta__panel">
            <Image src={page.ctaImage} alt="" fill sizes="100vw" className="product-cta__image" />
            <div className="product-cta__scrim" />
            <div className="product-cta__content">
              <h2 id="visionlab-cta-title">{page.ctaTitle}</h2>
              <div className="product-cta__actions">
                <GetStartedButton label="Book a meeting" size="lg" className="btn-on-dark">
                  Book a meeting
                </GetStartedButton>
                <Link href="/developers/visionlab" className="product-cta__ghost">
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
