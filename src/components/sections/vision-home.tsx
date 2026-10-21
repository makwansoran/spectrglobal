"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useGetStarted } from "@/components/get-started-context";
import "./vision-home.css";

function downloadVisionLab() {
  window.location.assign("/visionlab");
}

function FrostPanel({ children }: { children: ReactNode }) {
  return (
    <div
      className="vision-card__panel"
      style={{
        backdropFilter: "blur(18px) saturate(1.35)",
        WebkitBackdropFilter: "blur(18px) saturate(1.35)",
      }}
    >
      {children}
    </div>
  );
}

export function VisionHome() {
  const { openGetStarted } = useGetStarted();

  return (
    <div className="vision">
      <section className="vision-landing" aria-labelledby="landing-title">
        <h1 id="landing-title">Eyes of Compute</h1>
      </section>

      <section className="vision-card-section" aria-labelledby="customer-success-title">
        <div className="vision-card-section__inner">
          <h2 id="customer-success-title" className="vision-card-section__label">
            Customer success
          </h2>
          <article className="vision-card">
            <Image
              src="/images/customer-success-veolia.jpg"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 48rem"
              className="vision-card__image"
              priority={false}
            />
            <FrostPanel>
              <div className="vision-card__panel-top">
                <Image
                  src="/images/veolia-logo.png"
                  alt="Veolia"
                  width={200}
                  height={50}
                  className="vision-card__logo"
                  priority={false}
                />
                <span className="vision-card__tag">Industry</span>
              </div>
              <p className="vision-card__headline">
                Computer vision on the floor — turning site operations into a shorter loop.
              </p>
              <button type="button" className="vision-card__link" onClick={() => openGetStarted("contact")}>
                View case study
                <span aria-hidden="true">→</span>
              </button>
            </FrostPanel>
          </article>
        </div>
      </section>

      <section className="vision-card-section" aria-labelledby="visionlab-title">
        <div className="vision-card-section__inner vision-card-section__inner--wide">
          <h2 id="visionlab-title" className="vision-card-section__label">
            VisionLab
          </h2>
          <article className="vision-card vision-card--wide">
            <Image
              src="/visionlab-app.jpg"
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 72rem"
              className="vision-card__image"
              priority={false}
            />
            <FrostPanel>
              <div className="vision-card__panel-top">
                <span className="vision-card__brand">VisionLab</span>
                <span className="vision-card__tag">Product</span>
              </div>
              <p className="vision-card__headline">
                Label, train, and ship vision models from one workspace — from the first frame to the floor.
              </p>
              <button type="button" className="vision-card__link" onClick={downloadVisionLab}>
                Try VisionLab
                <span aria-hidden="true">→</span>
              </button>
            </FrostPanel>
          </article>
        </div>
      </section>

      <section className="vision-close" aria-label="Get started">
        <div className="vision-close__row">
          <button type="button" className="vision-close__action vision-close__action--light" onClick={downloadVisionLab}>
            <span>Try VisionLab</span>
            <span aria-hidden="true">→</span>
          </button>
          <button type="button" className="vision-close__action vision-close__action--dark" onClick={() => openGetStarted("contact")}>
            <span>Get in touch</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </div>
  );
}
