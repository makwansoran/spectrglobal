"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { GetStartedButton } from "@/components/get-started-button";
import { Reveal } from "@/components/reveal";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { edgeModels, edgeModelsSection } from "@/lib/edge-models";
import { spectrEdgePage } from "@/lib/spectr-edge-page";
import "./spectr-edge-page.css";

function HailoCallout() {
  const { design } = spectrEdgePage;
  const stageRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLSpanElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [line, setLine] = useState({ x1: 0, y1: 0, x2: 0, y2: 0, ready: false });

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const pin = pinRef.current;
    const target = targetRef.current;
    if (!stage || !pin || !target) return;

    function measure() {
      if (!stage || !pin || !target) return;
      const stageBox = stage.getBoundingClientRect();
      const pinBox = pin.getBoundingClientRect();
      const targetBox = target.getBoundingClientRect();
      setLine({
        x1: pinBox.left + pinBox.width / 2 - stageBox.left,
        y1: pinBox.top + pinBox.height / 2 - stageBox.top,
        x2: targetBox.left - stageBox.left,
        y2: targetBox.top + 14 - stageBox.top,
        ready: true,
      });
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div ref={stageRef} className="se-design__stage">
      <div className="se-design__board">
        <Image
          src={design.image}
          alt={design.imageAlt}
          fill
          sizes="(max-width: 960px) 100vw, 52vw"
          quality={90}
        />
        <span
          ref={pinRef}
          className="se-design__pin"
          style={{ left: `${design.chip.x}%`, top: `${design.chip.y}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="se-design__hailo">
        <p className="se-design__hailo-label">{design.hailo.label}</p>
        <div ref={targetRef} className="se-design__hailo-target">
          <h3 className="se-design__title">{design.hailo.title}</h3>
        </div>
        <p className="se-design__body">{design.hailo.body}</p>
        <dl className="se-design__sheet">
          {design.hailo.specs.map((spec) => (
            <div key={spec.label} className="se-design__sheet-row">
              <dt>{spec.label}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <svg className="se-design__line" aria-hidden="true">
        {line.ready ? (
          <>
            <path
              className="se-design__line-edge"
              d={`M ${line.x1} ${line.y1} L ${Math.max(line.x1 + 24, line.x2 - 28)} ${line.y1} L ${line.x2} ${line.y2}`}
            />
            <path
              className="se-design__line-core"
              d={`M ${line.x1} ${line.y1} L ${Math.max(line.x1 + 24, line.x2 - 28)} ${line.y1} L ${line.x2} ${line.y2}`}
            />
          </>
        ) : null}
      </svg>
    </div>
  );
}

export function SpectrEdgePageView() {
  const page = spectrEdgePage;

  return (
    <main id="main-content" className="se-page relative flex-1">
      <section className="se-hero" aria-labelledby="se-hero-heading">
        <div className="container-x se-hero__layout">
          <div className="se-hero__copy">
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
          <div className="se-hero__media">
            <Image
              src={page.heroImage}
              alt={page.heroImageAlt}
              fill
              priority
              quality={90}
              sizes="(max-width: 960px) 100vw, 52vw"
            />
          </div>
        </div>
      </section>

      <section id="overview" className="se-overview" aria-labelledby="se-overview-heading">
        <div className="container-x se-overview__layout">
          <div className="se-overview__media" aria-label={page.overviewVideoAlt}>
            {page.overviewVideo ? (
              <video
                className="se-overview__video"
                src={page.overviewVideo}
                aria-label={page.overviewVideoAlt}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              />
            ) : null}
          </div>
          <Reveal className="se-overview__copy">
            <h2 id="se-overview-heading" className="home-display">
              {page.overviewTitle}
            </h2>
            <p className="se-overview__body">{page.overviewBody}</p>
          </Reveal>
        </div>
      </section>

      <section id="design" className="se-chapter se-design" aria-label="Design">
        <div className="container-x">
          <HailoCallout />
          <figure className="se-design__photo">
            <div className="se-design__photo-frame">
              <Image
                src={page.design.enclosure.image}
                alt={page.design.enclosure.imageAlt}
                fill
                sizes="(max-width: 960px) 100vw, 44rem"
                quality={90}
              />
            </div>
          </figure>
        </div>
      </section>

      <LogoMarquee
        compact
        id="models"
        headingId="se-models-heading"
        heading={edgeModelsSection.title}
        body={edgeModelsSection.body}
        items={edgeModels}
        ariaLabel="AI models on Spectr Edge"
      />

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
