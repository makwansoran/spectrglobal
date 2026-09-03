"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GetStartedButton } from "@/components/get-started-button";
import { Reveal } from "@/components/reveal";
import { spectrEdgePage } from "@/lib/spectr-edge-page";
import "./spectr-edge-page.css";

const SECTION_IDS = spectrEdgePage.nav.map((item) => item.id);

function useActiveSection() {
  const [active, setActive] = useState(SECTION_IDS[0] ?? "");

  useEffect(() => {
    const nodes = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.15, 0.35, 0.6] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return [active, setActive] as const;
}

export function SpectrEdgePageView() {
  const page = spectrEdgePage;
  const [active, setActive] = useActiveSection();
  const [designTab, setDesignTab] = useState(0);
  const tab = page.design.tabs[designTab];

  return (
    <main id="main-content" className="se-page relative flex-1">
      <section className="se-hero" aria-labelledby="se-hero-heading">
        <div className="se-hero__media" aria-hidden="true">
          <Image
            src={page.heroImage}
            alt=""
            fill
            priority
            quality={90}
            sizes="100vw"
          />
          <div className="se-hero__scrim" />
        </div>
        <div className="container-x se-hero__copy">
          <h1 id="se-hero-heading" className="home-display">
            {page.name}
          </h1>
          <p className="se-hero__sub">{page.heroTagline}</p>
          <div className="se-hero__actions">
            <GetStartedButton label="Join waitlist" size="lg" className="btn-on-dark">
              Join waitlist
            </GetStartedButton>
            <GetStartedButton
              label="Request a demo"
              size="lg"
              variant="secondary"
              className="se-hero__ghost"
            >
              Request a demo
            </GetStartedButton>
          </div>
        </div>
      </section>

      <nav className="se-subnav" aria-label="Spectr Edge">
        <div className="container-x se-subnav__row">
          <p className="se-subnav__name">{page.name}</p>
          <div className="se-subnav__links">
            {page.nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={active === item.id ? "se-subnav__link is-active" : "se-subnav__link"}
                onClick={() => setActive(item.id)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <section id="overview" className="se-overview" aria-labelledby="se-overview-heading">
        <div className="container-x">
          <Reveal>
            <h2 id="se-overview-heading" className="home-display">
              {page.overviewTitle}
            </h2>
            <p className="se-overview__body">{page.overviewBody}</p>
            <div className="se-overview__actions">
              <GetStartedButton label="Join waitlist" size="lg">
                Join waitlist
              </GetStartedButton>
              <GetStartedButton label="Request a demo" size="lg" variant="secondary">
                Request a demo
              </GetStartedButton>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="se-specs" aria-label="Spectr Edge at a glance">
        <div className="container-x">
          <div className="se-specs__row">
            {page.specs.map((spec) => (
              <div key={spec.label} className="se-specs__item">
                <span className="se-specs__label">{spec.label}</span>
                <p className="se-specs__value">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="design" className="se-chapter se-design" aria-labelledby="se-design-heading">
        <div className="container-x">
          <h2 id="se-design-heading" className="se-chapter__title">
            Design
          </h2>
          <div className="se-bleed">
            <Image
              src={page.design.image}
              alt={page.design.imageAlt}
              fill
              sizes="100vw"
              quality={90}
            />
          </div>
          <div className="se-design__copy">
            <div className="se-tabs" role="tablist" aria-label="Design">
              {page.design.tabs.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={designTab === index}
                  className={designTab === index ? "is-active" : undefined}
                  onClick={() => setDesignTab(index)}
                >
                  {item.title.replace(/\.$/, "")}
                </button>
              ))}
            </div>
            <h3 className="se-design__title">{tab.title}</h3>
            <p className="se-design__body">{tab.body}</p>
          </div>
        </div>
      </section>

      <section
        id="performance"
        className="se-performance"
        aria-labelledby="se-performance-heading"
      >
        <div className="container-x se-performance__grid">
          <div className="se-bleed">
            <Image
              src={page.performance.image}
              alt={page.performance.imageAlt}
              fill
              sizes="(max-width: 960px) 100vw, 55vw"
              quality={85}
            />
          </div>
          <Reveal className="se-performance__copy">
            <h2 id="se-performance-heading" className="se-performance__title">
              {page.performance.title}
            </h2>
            <p className="se-performance__body">{page.performance.body}</p>
            <div className="se-points">
              {page.performance.points.map((point) => (
                <div key={point.title} className="se-point">
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="technology" className="se-tech" aria-labelledby="se-tech-heading">
        <div className="container-x">
          <Reveal className="se-tech__intro">
            <h2 id="se-tech-heading" className="home-display">
              {page.technology.title}
            </h2>
          </Reveal>
          <div className="se-cards">
            {page.technology.items.map((item) => (
              <article key={item.title} className="se-card">
                <div className="se-card__media">
                  <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 720px) 100vw, 30vw" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="deploy" className="se-deploy" aria-labelledby="se-deploy-heading">
        <div className="container-x">
          <Reveal className="se-deploy__intro">
            <h2 id="se-deploy-heading" className="home-display">
              {page.deploy.title}
            </h2>
          </Reveal>
          <div className="se-cards">
            {page.deploy.items.map((item) => (
              <article key={item.name} className="se-card">
                <div className="se-card__media">
                  <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 720px) 100vw, 30vw" />
                </div>
                <h3>{item.name}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="se-related-wrap" aria-labelledby="se-related-heading">
        <div className="container-x">
          <Link href={page.related.href} className="se-related">
            <div className="se-related__media">
              <Image src={page.related.image} alt={page.related.imageAlt} fill sizes="(max-width: 720px) 100vw, 40vw" />
            </div>
            <div>
              <h2 id="se-related-heading">{page.related.title}</h2>
              <p>{page.related.body}</p>
              <span>Explore Spectr OS</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="se-cta" aria-labelledby="se-cta-heading">
        <div className="container-x">
          <div className="se-cta__panel">
            <Image src={page.ctaImage} alt="" fill sizes="100vw" />
            <div className="se-cta__scrim" />
            <div className="se-cta__content">
              <h2 id="se-cta-heading" className="display text-[clamp(2.2rem,5.4vw,4.8rem)]">
                {page.ctaTitle}
              </h2>
              <div className="se-cta__actions">
                <GetStartedButton label="Join waitlist" size="lg" className="btn-on-dark">
                  Join waitlist
                </GetStartedButton>
                <GetStartedButton
                  label="Request a demo"
                  size="lg"
                  variant="secondary"
                  className="se-cta__ghost"
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
