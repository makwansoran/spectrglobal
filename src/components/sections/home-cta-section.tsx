"use client";

import Link from "next/link";
import { useGetStarted } from "@/components/get-started-context";
import "./home-cta-section.css";

export function HomeCtaSection() {
  const { openGetStarted } = useGetStarted();

  return (
    <section className="home-cta" aria-label="Get started">
      <button
        type="button"
        className="home-cta__tile home-cta__tile--light"
        onClick={() => openGetStarted("contact")}
      >
        <span>Request a Demo</span>
        <span aria-hidden="true">→</span>
      </button>
      <Link href="/developers" className="home-cta__tile home-cta__tile--dark">
        <span>Documentation</span>
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
