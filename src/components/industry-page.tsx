import Image from "next/image";
import { GetStartedButton } from "@/components/get-started-button";
import { type IndustryPage } from "@/lib/use-cases";
import "./industry-page.css";

export function IndustryPageView({ page }: { page: IndustryPage }) {
  return (
    <article className="ind-page">
      <header className="ind-hero">
        <div className="ind-hero__media" aria-hidden="true">
          <Image
            src={page.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="ind-hero__image"
          />
          <div className="ind-hero__scrim" />
        </div>
        <div className="ind-hero__copy">
          <h1>{page.name}</h1>
          <p>{page.tagline}</p>
        </div>
        <span className="ind-hero__cue" aria-hidden="true" />
      </header>

      <section className="ind-system" aria-labelledby="ind-system-title">
        <div className="ind-wrap">
          <div className="ind-system__panel">
            <video
              src={page.systemVideo}
              aria-label={page.systemTitle}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            />
            <div className="ind-system__copy">
              <h2 id="ind-system-title">{page.systemTitle}</h2>
              <p>{page.systemBody}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ind-overview" aria-labelledby="ind-overview-title">
        <div className="ind-wrap">
          <div className="ind-overview__inner">
            <p className="ind-kicker">{page.overviewEyebrow}</p>
            <h2 id="ind-overview-title">
              {page.overviewTitle} <em>{page.overviewAccent}</em>
            </h2>
            <span className="ind-overview__callout">{page.overviewCallout}</span>
          </div>
        </div>
      </section>

      <section className="ind-grid" aria-label="How Spectr helps">
        <div className="ind-wrap">
          <ul>
            {page.pillars.map((item) => (
              <li key={item.title} className="ind-card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ind-cta" aria-labelledby="ind-cta-title">
        <div className="ind-wrap">
          <div className="ind-cta__panel">
            <Image src={page.ctaImage} alt="" fill sizes="100vw" />
            <div className="ind-cta__scrim" />
            <div className="ind-cta__content">
              <h2 id="ind-cta-title">{page.ctaTitle}</h2>
              <div className="ind-cta__actions">
                <GetStartedButton label="Get started" size="lg" className="btn-on-dark">
                  Get started
                </GetStartedButton>
                <GetStartedButton
                  label="Talk to Spectr"
                  size="lg"
                  variant="secondary"
                  className="ind-cta__ghost"
                >
                  Talk to Spectr
                </GetStartedButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
