"use client";

import { useGetStarted } from "@/components/get-started-context";
import "./home-cta-section.css";

export function HomeCtaSection() {
  const { openGetStarted } = useGetStarted();

  return (
    <section
      id="get-started"
      className="home-cta scroll-mt-24 bg-white px-4 pb-20 pt-4 sm:px-6 sm:pb-[140px] sm:pt-8"
      aria-labelledby="get-started-heading"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <h2 id="get-started-heading" className="home-display">
          Get Started
        </h2>
        <div className="mt-10">
          <button
            type="button"
            className="home-cta__demo"
            onClick={() => openGetStarted("contact")}
          >
            Request a Demo
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
