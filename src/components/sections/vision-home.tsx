"use client";

import Image from "next/image";
import { useGetStarted } from "@/components/get-started-context";
import "./vision-home.css";

function downloadVisionLab() {
  window.location.assign("/visionlab");
}

export function VisionHome() {
  const { openGetStarted } = useGetStarted();

  return (
    <div className="vision">
      <section className="vision-landing" aria-labelledby="landing-title">
        <h1 id="landing-title">Eyes of Compute</h1>
      </section>

      <section className="vision-success" aria-labelledby="customer-success-title">
        <div className="vision-success__inner">
          <h2 id="customer-success-title" className="vision-success__label">
            Customer success
          </h2>
          <article className="vision-success__box">
            <Image
              src="/images/customer-success-veolia.jpg"
              alt="Veolia industrial facility"
              fill
              sizes="(max-width: 768px) 100vw, 48rem"
              className="vision-success__image"
              priority={false}
            />
            <div
              className="vision-success__panel"
              style={{
                backdropFilter: "blur(18px) saturate(1.35)",
                WebkitBackdropFilter: "blur(18px) saturate(1.35)",
              }}
            >
              <div className="vision-success__panel-top">
                <Image
                  src="/images/veolia-logo.png"
                  alt="Veolia"
                  width={200}
                  height={50}
                  className="vision-success__logo"
                  priority={false}
                />
                <span className="vision-success__tag">Industry</span>
              </div>
              <p className="vision-success__headline">
                Computer vision on the floor — turning site operations into a shorter loop.
              </p>
              <button
                type="button"
                className="vision-success__link"
                onClick={() => openGetStarted("contact")}
              >
                View case study
                <span aria-hidden="true">→</span>
              </button>
            </div>
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
