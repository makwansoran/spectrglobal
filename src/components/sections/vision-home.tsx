"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetStarted } from "@/components/get-started-context";
import { aboutPage } from "@/lib/about";
import { models } from "@/lib/vision";
import { HeroNorthernLights } from "@/components/sections/hero-northern-lights";
import { HomeCtaSection } from "@/components/sections/home-cta-section";
import "@/components/vision-nav.css";
import "@/components/sections/home-cta-section.css";
import "./vision-home.css";

const visionLab = models.find((model) => model.name === "VisionLab");
const argus = models.find((model) => model.name === "Argus");

const industries = [
  {
    name: "Waste Management",
    href: "/use-cases/waste-management",
    line: "From the bin to the plant, one loop.",
    detail: "Collection, plants, and materials as one loop, so a lift is an operational decision.",
    image: "/images/industries/waste-management.jpg",
    imageAlt: "Landfill compactors on a waste pile",
  },
  {
    name: "Manufacturing",
    href: "/use-cases/manufacturing",
    line: "Strategy, materials, and the line as one model.",
    detail: "An operating system for the line: strategy, materials, and the shop floor as one model.",
    image: "/images/industries/manufacturing.jpg",
    imageAlt: "Circuit board under a pick-and-place head",
  },
  {
    name: "Agriculture",
    line: "Count what the field is doing.",
    detail: "Classify and measure from aerial and ground cameras across a field or a herd.",
    image: "/images/industries/agriculture.jpg",
    imageAlt: "Sprayers working a green crop field",
  },
  {
    name: "Mining",
    line: "Pit, plant, and materials as one model.",
    detail: "Fleets, grades, and recovery handled as the shift runs.",
    image: "/images/industries/infrastructure.jpg",
    imageAlt: "Heavy industrial site and materials operations",
  },
  {
    name: "Ports",
    line: "Watch the gate on hardware you own.",
    detail: "Detection and tracking for a perimeter, a floor, or a port stay on machines you control.",
    image: "/images/industries/ports.jpg",
    imageAlt: "Container terminal and cranes at dusk",
  },
  {
    name: "Logistics",
    href: "/use-cases/logistics",
    line: "Planning and execution without the seam between them.",
    detail: "Planning and execution in one runtime. Inventory, yards, and disruption handled as they happen.",
    image: "/images/industries/logistics.jpg",
    imageAlt: "Cardboard carton on a roller conveyor",
  },
] as const;

function IndustryCard({ industry }: { industry: (typeof industries)[number] }) {
  const card = (
    <>
      <Image
        src={industry.image}
        alt={industry.imageAlt}
        fill
        sizes="(max-width: 700px) 100vw, (max-width: 1100px) 45vw, 22rem"
        className="vision-practice__photo"
      />
      <div
        className="vision-practice__glass"
        style={{
          backdropFilter: "blur(18px) saturate(1.35)",
          WebkitBackdropFilter: "blur(18px) saturate(1.35)",
        }}
      >
        <p className="vision-practice__company">{industry.name}</p>
        <p className="vision-practice__quote">{industry.line}</p>
        <p className="vision-practice__detail">{industry.detail}</p>
      </div>
    </>
  );

  if ("href" in industry) {
    return (
      <Link href={industry.href} className="vision-practice">
        {card}
      </Link>
    );
  }

  return <article className="vision-practice">{card}</article>;
}

export function VisionHome() {
  const { openGetStarted } = useGetStarted();

  return (
    <div className="vision">
      <section className="vision-hero" aria-labelledby="landing-title">
        <HeroNorthernLights />
        <h1 id="landing-title">Eyes of Compute</h1>
      </section>

      <section className="vision-models" aria-label="VisionLab and Argus">
        <article className="vision-model" aria-labelledby="visionlab-title">
          <h2 id="visionlab-title">VisionLab</h2>
          <p>{visionLab?.body}</p>
          <div className="vision-model__actions">
            <Link href="/visionlab" className="vision-nav__cta">
              Learn VisionLab
            </Link>
            <Link href="/developers/visionlab" className="vision-model__text-link">
              Documentation
            </Link>
          </div>
          <div className="vision-model__media">
            <Image
              src={visionLab?.image ?? "/visionlab-app.jpg"}
              alt={visionLab?.imageAlt ?? "VisionLab"}
              fill
              sizes="(max-width: 900px) 100vw, 36rem"
              className="vision-model__image"
            />
          </div>
        </article>

        <article className="vision-model" aria-labelledby="argus-title">
          <h2 id="argus-title">Argus</h2>
          <p>{argus?.body}</p>
          <div className="vision-model__actions">
            <Link href="/argus" className="vision-nav__cta">
              Learn Argus
            </Link>
            <Link href="/developers/argus" className="vision-model__text-link">
              Documentation
            </Link>
          </div>
          <video
            className="vision-model__video"
            src="/videos/argusone-demo.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label={argus?.imageAlt ?? "Argus detection demo"}
          />
        </article>
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

      <section className="vision-stories" aria-labelledby="smart-system-title">
        <div className="vision-stories__head">
          <h2 id="smart-system-title">Spectr Smart System</h2>
        </div>
        <article className="vision-story">
          <div className="vision-story__media">
            <Image
              src="/images/spectr-smart-system.jpg"
              alt="Spectr Smart System hardware"
              fill
              sizes="(max-width: 800px) 100vw, 70rem"
              className="vision-story__image vision-story__image--diagram"
            />
            <div
              className="vision-story__glass"
              style={{
                backdropFilter: "blur(18px) saturate(1.35)",
                WebkitBackdropFilter: "blur(18px) saturate(1.35)",
              }}
            >
              <p>Spectr Smart System</p>
              <p className="vision-story__soon">Coming Soon</p>
            </div>
          </div>
        </article>
      </section>

      <section className="vision-about" aria-labelledby="about-title">
        <div className="vision-about__copy">
          <h2 id="about-title">About us</h2>
          <p className="vision-about__belief">{aboutPage.belief}</p>
          <p className="vision-about__body">{aboutPage.statement}</p>
          <Link href="/about" className="vision-model__text-link">
            Learn more
          </Link>
        </div>
        <div className="vision-about__media">
          <Image
            src={aboutPage.heroImage}
            alt={aboutPage.heroImageAlt}
            fill
            sizes="(max-width: 900px) 100vw, 36rem"
            className="vision-about__image"
          />
        </div>
      </section>

      <section className="vision-practices" aria-labelledby="industries-title">
        <div className="vision-practices__head">
          <h2 id="industries-title">
            Every site.
            <br />
            Every industry.
          </h2>
        </div>
        <div className="vision-practices__grid">
          {industries.map((industry) => (
            <IndustryCard key={industry.name} industry={industry} />
          ))}
        </div>
      </section>

      <HomeCtaSection />
    </div>
  );
}
