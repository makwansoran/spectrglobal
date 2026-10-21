"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetStarted } from "@/components/get-started-context";
import "./vision-home.css";

const industries = [
  {
    name: "Waste management",
    href: "/use-cases/waste-management",
    image: "/images/industries/waste-management-hero.jpg",
    alt: "Collection and materials recovery",
  },
  {
    name: "Manufacturing",
    href: "/use-cases/manufacturing",
    image: "/images/industries/manufacturing-hero.jpg",
    alt: "Manufacturing production line",
  },
  {
    name: "Agriculture",
    image: "/images/industries/energy.jpg",
    alt: "Open field at sunset",
  },
  {
    name: "Mining",
    image: "/images/industries/infrastructure.jpg",
    alt: "Industrial site and materials operations",
  },
  {
    name: "Ports",
    image: "/images/industries/ports.jpg",
    alt: "Container ships at a port terminal",
  },
  {
    name: "Logistics",
    href: "/use-cases/logistics",
    image: "/images/industries/logistics-hero.jpg",
    alt: "Warehouse logistics and pallet operations",
  },
] as const;

function downloadVisionLab() {
  window.location.assign("/visionlab");
}

export function VisionHome() {
  const { openGetStarted } = useGetStarted();

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
          <p>One OS across waste, manufacturing, agriculture, mining, ports, and logistics.</p>
        </div>
        <div className="vision-practices__row">
          {industries.map((industry) => {
            const card = (
              <>
                <Image
                  src={industry.image}
                  alt={industry.alt}
                  fill
                  sizes="(max-width: 800px) 42vw, 16rem"
                  className="vision-practice__image"
                />
                <span className="vision-practice__shade" aria-hidden="true" />
                <span className="vision-practice__label">{industry.name}</span>
              </>
            );

            return "href" in industry ? (
              <Link key={industry.name} href={industry.href} className="vision-practice">
                {card}
              </Link>
            ) : (
              <div key={industry.name} className="vision-practice">
                {card}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
