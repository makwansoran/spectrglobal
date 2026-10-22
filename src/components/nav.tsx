"use client";

import Link from "next/link";
import { useGetStarted } from "@/components/get-started-context";
import { LogoMark, Wordmark } from "@/components/logo";
import { site } from "@/lib/site";
import "./vision-nav.css";

export function Nav() {
  const { openGetStarted } = useGetStarted();

  return (
    <header className="vision-nav">
      <div className="vision-nav__inner">
        <Link href="/" className="vision-nav__brand" aria-label={site.name}>
          <LogoMark className="h-7 w-7" />
          <Wordmark className="text-[#1e1f2b]" />
        </Link>

        <div className="vision-nav__actions">
          <button type="button" className="vision-nav__contact" onClick={() => openGetStarted("contact")}>
            Contact
          </button>
          <Link href="/developers" className="vision-nav__cta">
            Documentation
          </Link>
        </div>
      </div>
    </header>
  );
}
