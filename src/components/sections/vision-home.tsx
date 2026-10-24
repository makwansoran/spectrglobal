"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetStarted } from "@/components/get-started-context";
import { models } from "@/lib/vision";
import { servicesPage } from "@/lib/services";
import { HeroNorthernLights } from "@/components/sections/hero-northern-lights";
import { HomeCtaSection } from "@/components/sections/home-cta-section";
import "@/components/vision-nav.css";
import "@/components/sections/home-cta-section.css";
import "./vision-home.css";

const visionLab = models.find((model) => model.name === "VisionLab");

const industries = [
  {
    name: "Waste Management",
    line: "From the bin to the plant, one loop.",
    image: "/images/industries/waste-management.jpg",
    imageAlt: "Sorting plant conveyors and trommel with workers on the floor",
  },
  {
    name: "Manufacturing",
    line: "Strategy, materials, and the line as one model.",
    image: "/images/industries/manufacturing.jpg",
    imageAlt: "Circuit boards under an automated inspection head",
  },
  {
    name: "Agriculture",
    line: "Count what the field is doing.",
    image: "/images/industries/agriculture.jpg",
    imageAlt: "Sprayers working a green crop field",
  },
  {
    name: "Mining",
    line: "Pit, plant, and materials as one model.",
    image: "/images/industries/infrastructure.jpg",
    imageAlt: "Heavy industrial site and materials operations",
  },
  {
    name: "Ports",
    line: "Watch the gate on hardware you own.",
    image: "/images/industries/ports.jpg",
    imageAlt: "Container terminal and cranes at dusk",
  },
  {
    name: "Logistics",
    line: "Planning and execution without the seam between them.",
    image: "/images/industries/logistics.jpg",
    imageAlt: "Warehouse floor with yellow roller conveyor and inventory",
  },
] as const;

function IndustryCard({ industry }: { industry: (typeof industries)[number] }) {
  return (
    <article className="vision-practice">
      <Image
        src={industry.image}
        alt={industry.imageAlt}
        fill
        quality={92}
        sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 420px"
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
      </div>
    </article>
  );
}

export function VisionHome() {
  const { openGetStarted } = useGetStarted();

  return (
    <div className="vision">
      <section className="vision-hero" aria-labelledby="landing-title">
        <HeroNorthernLights />
        <h1 id="landing-title">Eyes of Compute</h1>
      </section>

      <section className="vision-models" aria-label="VisionLab and Our Services">
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

        <article className="vision-model" aria-labelledby="services-title">
          <h2 id="services-title">Our Services</h2>
          <p>{servicesPage.homeBody}</p>
          <div className="vision-model__actions">
            <Link href="/services" className="vision-nav__cta">
              Learn more
            </Link>
            <button
              type="button"
              className="vision-model__text-link"
              onClick={() => openGetStarted("contact")}
            >
              Contact
            </button>
          </div>
          <video
            className="vision-model__video"
            src={servicesPage.homeVideo}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label={servicesPage.homeVideoAlt}
          />
        </article>
      </section>

      <section className="vision-stories vision-stories--customer" aria-labelledby="stories-title">
        <div className="vision-stories__copy">
          <h2 id="stories-title">Customer success</h2>
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
        <div className="vision-story__media">
          <Image
            src="/images/customer-success-veolia.jpg"
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className="vision-story__image"
          />
        </div>
      </section>

      <section className="vision-stories vision-stories--smart" aria-labelledby="smart-system-title">
        <div className="vision-story__media">
          <Image
            src="/images/spectr-smart-system.jpg"
            alt="Spectr Smart System hardware"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className="vision-story__image"
          />
        </div>
        <div className="vision-stories__copy">
          <h2 id="smart-system-title">Spectr Smart System</h2>
          <p>
            The industrial runtime above the camera — fuse site data with live
            detections so the next move on the floor is ranked, not reported
            tomorrow.
          </p>
          <p className="vision-story__soon">Coming Soon</p>
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
