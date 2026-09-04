import Image from "next/image";
import Link from "next/link";
import { GetStartedButton } from "@/components/get-started-button";
import { industryPages, type IndustryPage } from "@/lib/use-cases";
import "./industry-page.css";

export function IndustryPageView({ page }: { page: IndustryPage }) {
  return (
    <article className="ind-page">
      <nav className="ind-subnav" aria-label="Solutions">
        <div className="ind-subnav__inner">
          {industryPages.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className={item.slug === page.slug ? "is-current" : undefined}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      <header className="ind-hero">
        <div className="ind-hero__graphic" aria-hidden="true">
          <div className="ind-hero__plane ind-hero__plane--back" />
          <div className="ind-hero__plane ind-hero__plane--mid" />
          <div className="ind-hero__plane">
            <Image src={page.image} alt="" fill sizes="18rem" />
          </div>
        </div>
        <h1>{page.name}</h1>
        <p>{page.tagline}</p>
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

      <section className="ind-objects" aria-labelledby="ind-objects-title">
        <div className="ind-wrap">
          <p className="ind-kicker" id="ind-objects-title">
            {page.objectsEyebrow}
          </p>
          <div className="ind-objects__labels">
            {page.objects.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="ind-objects__media">
            <Image src={page.objectsImage} alt={page.objectsImageAlt} fill sizes="100vw" />
          </div>
        </div>
      </section>

      <section className="ind-scale" aria-labelledby="ind-scale-title">
        <div className="ind-wrap">
          <div className="ind-scale__head">
            <p className="ind-kicker">{page.scaleEyebrow}</p>
            <h2 id="ind-scale-title">
              {page.scaleTitle} <em>{page.scaleAccent}</em>
            </h2>
          </div>
          <ul>
            {page.scale.map((item) => (
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
