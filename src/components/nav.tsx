"use client";

import { useGetStarted } from "@/components/get-started-context";
import { LogoMark } from "@/components/logo";
import { site } from "@/lib/site";
import Link from "next/link";

export function Nav() {
  const { openGetStarted } = useGetStarted();

  return (
    <header className="site-header site-header--reference">
      <div className="reference-nav-shell">
        <div className="reference-nav">
          <Link href="/" className="reference-nav__brand" aria-label={site.name}>
            <LogoMark className="h-[34px] w-[34px]" />
          </Link>

          <div className="reference-nav__actions">
            <button
              type="button"
              onClick={() => openGetStarted("contact")}
              className="reference-nav__action reference-nav__action--contact flex"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
