"use client";

import Link from "next/link";
import { useGetStarted } from "@/components/get-started-context";
import "@/components/vision-nav.css";

export function ArgusHeroActions() {
  const { openGetStarted } = useGetStarted();

  return (
    <div className="argus-hero__actions">
      <button type="button" className="vision-nav__cta" onClick={() => openGetStarted("contact")}>
        Build with Argus
      </button>
      <Link href="/developers/argus" className="argus-text-link">
        Documentation
      </Link>
    </div>
  );
}
