"use client";

import Image from "next/image";
import { useGetStarted } from "@/components/get-started-context";
import { LogoMark } from "@/components/logo";
import { HomeProductField } from "@/components/sections/home-product-field";
import "./waitlist-section.css";

export function WaitlistSection() {
  const { openGetStarted } = useGetStarted();

  return (
    <>
      <section
        id="spectros"
        className="bg-white px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8"
        aria-labelledby="industry-preview-title"
      >
        <div className="mx-auto grid w-full max-w-[1400px] items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="spectros-waitlist__intro min-w-0 lg:self-center">
            <h1 id="industry-preview-title" className="home-display spectros-waitlist__headline">
              <span className="spectros-waitlist__line">
                <span className="spectros-waitlist__word" data-i="1">
                  <span>AI</span>
                </span>
                <span className="spectros-waitlist__word" data-i="2">
                  <span>system</span>
                </span>
              </span>
              <span className="spectros-waitlist__line">
                <span className="spectros-waitlist__word" data-i="3">
                  <span>for</span>
                </span>
                <span className="spectros-waitlist__word" data-i="4">
                  <span>materials</span>
                </span>
              </span>
            </h1>
            <p className="spectros-waitlist__logo">
              <LogoMark className="spectros-waitlist__logo-mark" title="" />
              Spectr
            </p>
          </div>

          <div className="spectros-waitlist__panel min-w-0">
            <Image
              src="/images/products/spectros-waitlist.png"
              alt="spectrOs running on a laptop"
              fill
              priority
              className="spectros-waitlist__image"
              sizes="(max-width: 1024px) 100vw, 44rem"
              quality={90}
            />
            <div className="spectros-waitlist__scrim" aria-hidden="true" />
            <div className="spectros-waitlist__content">
              <h2 id="spectros-hero-heading" className="home-display spectros-waitlist__title">
                The operating system
                <br />
                for the enterprise
              </h2>
              <div className="spectros-waitlist__cta">
                <button
                  type="button"
                  className="spectros-waitlist__join spectros-waitlist__join--on-media"
                  onClick={() => openGetStarted("contact")}
                >
                  Get started
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomeProductField
        id="spectr-os"
        headingId="spectros-product-heading"
        title="Spectr OS"
        lede="Fuse data, decide, and act in one runtime."
        image="/images/products/spectr-os-materials.jpg"
        imageAlt="Materials processing plant with conveyors and sorting equipment"
        ctaHref="/platforms/spectr-os"
        ctaLabel="Explore Spectr OS"
      />
    </>
  );
}
