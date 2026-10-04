"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetStarted } from "@/components/get-started-context";
import { LogoMark, Wordmark } from "@/components/logo";
import { downloads, navPrimary, site } from "@/lib/site";
import "./vision-nav.css";

function downloadVisionLab() {
  const ua = navigator.userAgent;
  const href = /Mac/i.test(ua)
    ? downloads.mac
    : /Linux/i.test(ua) && !/Android/i.test(ua)
      ? downloads.linux
      : downloads.windows;
  window.location.assign(href);
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 20 20" className="vision-nav__download" aria-hidden="true">
      <path
        d="M10 3.25v8.2m0 0 3.1-3.1M10 11.45 6.9 8.35M4.25 13.5v1.25c0 .69.56 1.25 1.25 1.25h9c.69 0 1.25-.56 1.25-1.25V13.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
          <button type="button" className="vision-nav__contact" onClick={() => openGetStarted("contact")}>
            Contact
          </button>
          <button type="button" className="vision-nav__cta" onClick={downloadVisionLab}>
            <DownloadIcon />
            VisionLab
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
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openGetStarted("contact");
            }}
          >
            Contact
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              downloadVisionLab();
            }}
          >
            <DownloadIcon />
            VisionLab
          </button>
        </div>
      ) : null}
    </header>
  );
}
