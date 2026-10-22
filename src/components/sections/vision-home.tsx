"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetStarted } from "@/components/get-started-context";
import { partnerQuotes } from "@/lib/content";
import { models } from "@/lib/vision";
import "./vision-home.css";

const visionLab = models.find((model) => model.name === "VisionLab");

export function VisionHome() {
  const { openGetStarted } = useGetStarted();

  return (
    <div className="vision">
      <section className="vision-hero" aria-labelledby="landing-title">
        <h1 id="landing-title">Eyes of Compute</h1>
      </section>

      <section className="vision-intro" aria-labelledby="intro-title">
        <div className="vision-intro__copy">
          <h2 id="intro-title">Introducing VisionLab</h2>
          <p className="vision-intro__lead">{visionLab?.body}</p>
          <Link href="/visionlab" className="vision-text-link">
            Explore VisionLab
            <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="vision-intro__media">
          <Image
            src={visionLab?.image ?? "/visionlab-app.jpg"}
            alt={visionLab?.imageAlt ?? "VisionLab"}
            fill
            sizes="(max-width: 900px) 100vw, 42rem"
            className="vision-intro__image"
          />
        </div>
      </section>

      <section className="vision-stories" aria-labelledby="stories-title">
        <div className="vision-stories__head">
          <h2 id="stories-title">Customer success</h2>
        </div>
        <article className="vision-story">
          <div className="vision-story__media">
            <Image
              src="/images/customer-success-veolia.jpg"
              alt=""
              fill
              sizes="(max-width: 800px) 100vw, 70rem"
              className="vision-story__image"
            />
            <div
              className="vision-story__glass"
              style={{
                backdropFilter: "blur(18px) saturate(1.35)",
                WebkitBackdropFilter: "blur(18px) saturate(1.35)",
              }}
            >
              <Image
                src="/images/veolia-logo.png"
                alt="Veolia"
                width={200}
                height={50}
                className="vision-story__logo"
              />
              <p>Computer vision on the floor — turning site operations into a shorter loop.</p>
              <button type="button" className="vision-story__link" onClick={() => openGetStarted("contact")}>
                View case study
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </article>
      </section>

      <section className="vision-practices" aria-labelledby="partners-title">
        <div className="vision-practices__head">
          <h2 id="partners-title">What our partners say about us</h2>
        </div>
        <div className="vision-practices__marquee">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="vision-practices__row"
              aria-hidden={copy === 1 || undefined}
              {...(copy === 1 ? { inert: true } : {})}
            >
              {partnerQuotes.map((item) => (
                <blockquote key={`${copy}-${item.company}`} className="vision-practice">
                  <p className="vision-practice__company">{item.company}</p>
                  <p className="vision-practice__quote">“{item.quote}”</p>
                  <footer>
                    <span>{item.person}</span>
                    <span>{item.role}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
