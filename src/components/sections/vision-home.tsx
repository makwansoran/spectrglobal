"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useGetStarted } from "@/components/get-started-context";
import { industryPages } from "@/lib/use-cases";
import "./vision-home.css";

function downloadVisionLab() {
  window.location.assign("/visionlab");
}

export function VisionHome() {
  const { openGetStarted } = useGetStarted();
  const [industryIndex, setIndustryIndex] = useState(0);

  return (
    <div className="vision">
      <section className="vision-hero" aria-labelledby="landing-title">
        <Image
          src="/images/customer-success-veolia.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="vision-hero__image"
        />
        <div className="vision-hero__shade" />
        <div className="vision-hero__copy">
          <h1 id="landing-title">Eyes of Compute</h1>
          <p>Open models for computer vision, AI vision, and VLA.</p>
          <div className="vision-hero__actions">
            <button type="button" className="vision-hero__contact" onClick={() => openGetStarted("contact")}>
              Contact
            </button>
            <button type="button" className="vision-hero__cta" onClick={downloadVisionLab}>
              VisionLab
            </button>
          </div>
        </div>
      </section>

      <section className="vision-intro" aria-labelledby="intro-title">
        <div className="vision-intro__copy">
          <h2 id="intro-title">Introducing Spectr OS</h2>
          <p className="vision-intro__lead">The operating system for the enterprise.</p>
          <p>
            Fuse data. Decide. Act. One runtime for the sites where a camera has to see, and someone has to move.
          </p>
          <Link href="/platforms/spectr-os" className="vision-text-link">
            Explore Spectr OS
            <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="vision-intro__media">
          <Image
            src="/images/offerings/spectr-os.jpg"
            alt="Spectr OS running enterprise operations"
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

      <section className="vision-practices" aria-labelledby="industries-title">
        <div className="vision-practices__head">
          <h2 id="industries-title">
            Every site.
            <br />
            Every industry.
          </h2>
          <p>One OS across manufacturing, logistics, waste, and mining.</p>
        </div>
        <div className="vision-practices__row">
          {industryPages.map((page, index) => {
            const active = index === industryIndex;
            return (
              <article key={page.slug} className={active ? "vision-practice is-active" : "vision-practice"}>
                {active ? (
                  <div className="vision-practice__open">
                    <div className="vision-practice__photo">
                      <Image
                        src={page.image}
                        alt={page.imageAlt}
                        fill
                        sizes="(max-width: 800px) 100vw, 24rem"
                        className="vision-practice__image"
                      />
                    </div>
                    <h3>{page.headline}</h3>
                    <p>{page.listingDescription}</p>
                    <Link href={page.href} className="vision-text-link">
                      Read more
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                ) : (
                  <button type="button" className="vision-practice__tile" onClick={() => setIndustryIndex(index)}>
                    <Image
                      src={page.image}
                      alt=""
                      fill
                      sizes="16rem"
                      className="vision-practice__image"
                    />
                    <span className="vision-practice__shade" aria-hidden="true" />
                    <span className="vision-practice__label">{page.name}</span>
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
