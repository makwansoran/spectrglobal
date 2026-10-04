"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetStarted } from "@/components/get-started-context";
import { LogoMark, Wordmark } from "@/components/logo";
import { navPrimary, site } from "@/lib/site";
import "./vision-nav.css";

export function Nav() {
  const { openGetStarted } = useGetStarted();
  const [open, setOpen] = useState(false);

  return (
    <header className="vision-nav">
      <div className="vision-nav__inner">
        <Link href="/" className="vision-nav__brand" aria-label={site.name} onClick={() => setOpen(false)}>
          <LogoMark invert className="h-7 w-7" />
          <Wordmark className="text-white" />
        </Link>

        <nav className="vision-nav__links" aria-label="Primary">
          {navPrimary.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="vision-nav__actions">
          <a className="vision-nav__ghost" href={site.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <button type="button" className="vision-nav__cta" onClick={() => openGetStarted("contact")}>
            Get started
          </button>
          <button
            type="button"
            className="vision-nav__menu"
            aria-expanded={open}
            aria-controls="vision-nav-panel"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </button>
        </div>
      </div>

      {open ? (
        <div id="vision-nav-panel" className="vision-nav__panel">
          {navPrimary.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <a href={site.github} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
            GitHub
          </a>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openGetStarted("contact");
            }}
          >
            Get started
          </button>
        </div>
      ) : null}
    </header>
  );
}
