"use client";

import Link from "next/link";
import { useGetStarted } from "@/components/get-started-context";
import "@/components/vision-nav.css";

export function VisionlabHeroActions() {
  const { openGetStarted } = useGetStarted();

  return (
    <div className="product-hero__actions">
      <button type="button" className="vision-nav__cta" onClick={() => openGetStarted("contact")}>
        Book a meeting
      </button>
      <Link href="/developers/visionlab" className="product-text-link">
        Documentation
      </Link>
    </div>
  );
}
