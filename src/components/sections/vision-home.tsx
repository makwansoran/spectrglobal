"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetStarted } from "@/components/get-started-context";
import { models } from "@/lib/vision";
import "./vision-home.css";

const visionLab = models.find((model) => model.name === "VisionLab");

const industries = [
  {
    name: "Waste Management",
    href: "/use-cases/waste-management",
    line: "From the bin to the plant, one loop.",
    detail: "Collection, plants, and materials as one loop, so a lift is an operational decision.",
  },
  {
    name: "Manufacturing",
    href: "/use-cases/manufacturing",
    line: "Strategy, materials, and the line as one model.",
    detail: "An operating system for the line: strategy, materials, and the shop floor as one model.",
  },
  {
    name: "Agriculture",
    line: "Count what the field is doing.",
    detail: "Classify and measure from aerial and ground cameras across a field or a herd.",
  },
  {
    name: "Ports",
    line: "Watch the gate on hardware you own.",
    detail: "Detection and tracking for a perimeter, a floor, or a port stay on machines you control.",
  },
  {
    name: "Logistics",
    href: "/use-cases/logistics",
    line: "Planning and execution without the seam between them.",
    detail: "Planning and execution in one runtime. Inventory, yards, and disruption handled as they happen.",
  },
] as const;

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

      <section className="vision-practices" aria-labelledby="industries-title">
        <div className="vision-practices__head">
          <h2 id="industries-title">
            Every site.
            <br />
            Every industry.
          </h2>
        </div>
        <div className="vision-practices__marquee">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="vision-practices__row"
              aria-hidden={copy === 1 || undefined}
              {...(copy === 1 ? { inert: true } : {})}
            >
              {industries.map((industry) => {
                const card = (
                  <>
                    <p className="vision-practice__company">{industry.name}</p>
                    <p className="vision-practice__quote">{industry.line}</p>
                    <footer>
                      <span>{industry.detail}</span>
                    </footer>
                  </>
                );

                return "href" in industry ? (
                  <Link key={`${copy}-${industry.name}`} href={industry.href} className="vision-practice">
                    {card}
                  </Link>
                ) : (
                  <article key={`${copy}-${industry.name}`} className="vision-practice">
                    {card}
                  </article>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
