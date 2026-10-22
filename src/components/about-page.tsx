"use client";

import Link from "next/link";
import { useGetStarted } from "@/components/get-started-context";
import { aboutPage } from "@/lib/about";
import "@/components/sections/home-cta-section.css";
import "./about-page.css";

export function AboutPageView() {
  const content = aboutPage;
  const { openGetStarted } = useGetStarted();

  return (
    <main id="main-content" className="about-page">
      <section className="about-page__hero" aria-labelledby="about-heading">
        <div className="about-page__hero-inner">
          <h1 id="about-heading" className="about-page__title home-display">
            About us
          </h1>
          <p className="about-page__belief">{content.belief}</p>
        </div>
      </section>

      <section className="about-page__statement" aria-label="About Spectr">
        <p>{content.statement}</p>
      </section>

      <section className="home-cta about-page__cta" aria-label="Get started">
        <button
          type="button"
          className="home-cta__tile home-cta__tile--light"
          onClick={() => openGetStarted("contact")}
        >
          <span>Contact us</span>
          <span aria-hidden="true">→</span>
        </button>
        <Link href="/developers" className="home-cta__tile home-cta__tile--dark">
          <span>Documentation</span>
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
