"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { aboutPage } from "@/lib/about";
import { useGetStarted } from "@/components/get-started-context";
import { industryPages } from "@/lib/use-cases";
import "./vision-home.css";

function downloadVisionLab() {
  window.location.assign("/visionlab");
}

const stories = [
  {
    title: "Customer success",
    image: "/images/customer-success-veolia.jpg",
    body: "Computer vision on the floor — turning site operations into a shorter loop.",
    action: "View case study",
    kind: "contact" as const,
  },
  {
    title: "VisionLab",
    image: "/visionlab-app.jpg",
    body: "Label, train, and ship vision models from one workspace — from the first frame to the floor.",
    action: "Try VisionLab",
    kind: "visionlab" as const,
  },
  {
    title: "Spectr Smart System",
    image: "/images/products/spectr-os-materials.jpg",
    body: "The industrial smart system for live sites — perception, decisions, and action in one loop.",
    action: "Explore Spectr OS",
    kind: "os" as const,
  },
];

export function VisionHome() {
  const { openGetStarted } = useGetStarted();
  const [industryIndex, setIndustryIndex] = useState(0);
  const industry = industryPages[industryIndex];

  function openStory(kind: (typeof stories)[number]["kind"]) {
    if (kind === "contact") openGetStarted("contact");
    else if (kind === "visionlab") downloadVisionLab();
    else window.location.assign("/platforms/spectr-os");
  }

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

      <section className="vision-trust" aria-label="Customer">
        <p>Customer</p>
        <Image src="/images/veolia-logo.png" alt="Veolia" width={180} height={45} className="vision-trust__logo" />
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
          <h2 id="stories-title">What we build</h2>
          <p>Customer work, the lab, and the system that runs on site.</p>
        </div>
        <div className="vision-stories__grid">
          {stories.map((story) => (
            <article key={story.title} className="vision-story">
              <div className="vision-story__media">
                <Image src={story.image} alt="" fill sizes="(max-width: 800px) 100vw, 28rem" className="vision-story__image" />
              </div>
              <h3>{story.title}</h3>
              <p>{story.body}</p>
              <button type="button" className="vision-text-link" onClick={() => openStory(story.kind)}>
                {story.action}
                <span aria-hidden="true">→</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="vision-industries" aria-labelledby="industries-title">
        <div className="vision-industries__head">
          <h2 id="industries-title">Every site. Every industry.</h2>
          <p>One OS across manufacturing, logistics, waste, and mining.</p>
        </div>
        <div className="vision-industries__layout">
          <div className="vision-industries__tabs" role="tablist" aria-label="Industries">
            {industryPages.map((page, index) => (
              <button
                key={page.slug}
                type="button"
                role="tab"
                aria-selected={index === industryIndex}
                className={index === industryIndex ? "is-active" : undefined}
                onClick={() => setIndustryIndex(index)}
              >
                {page.name}
              </button>
            ))}
          </div>
          <article className="vision-industries__panel" role="tabpanel">
            <div className="vision-industries__photo">
              <Image
                src={industry.image}
                alt={industry.imageAlt}
                fill
                sizes="(max-width: 800px) 100vw, 40rem"
                className="vision-industries__image"
              />
            </div>
            <div className="vision-industries__text">
              <h3>{industry.headline}</h3>
              <p>{industry.listingDescription}</p>
              <Link href={industry.href} className="vision-text-link">
                Read more
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="vision-belief" aria-labelledby="vision-title">
        <h2 id="vision-title">Our vision</h2>
        <p className="vision-belief__lead">{aboutPage.belief}</p>
        <div className="vision-belief__body">
          {aboutPage.founding.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <Link href="/about" className="vision-text-link">
          About Spectr
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="vision-close" aria-label="Get started">
        <h2>See it on your own footage.</h2>
        <p>Open VisionLab, or tell us about the site.</p>
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
