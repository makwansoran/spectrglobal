"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useGetStarted } from "@/components/get-started-context";
import { LogoMark } from "@/components/logo";
import { site, type NavSection } from "@/lib/site";

const referenceNavSections: NavSection[] = [
  {
    label: "Spectr OS",
    href: "/platforms/spectr-os",
    previewVideo: "/videos/spectr-os.mp4",
  },
];

export function Nav() {
  const pathname = usePathname();
  const { openGetStarted } = useGetStarted();
  const [menu, setMenu] = useState<string | null>(null);
  const [renderedPathname, setRenderedPathname] = useState(pathname);

  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname);
    setMenu(null);
  }

  useEffect(() => {
    if (!menu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  return (
    <header className="site-header site-header--reference">
      <div className="reference-nav-shell">
        <div className="reference-nav">
          <Link href="/" className="reference-nav__brand" aria-label={site.name}>
            <LogoMark className="h-[34px] w-[34px]" />
          </Link>

          <nav aria-label="Primary" className="reference-nav__links hidden lg:flex">
            {referenceNavSections.map((section, index) => (
              <NavDropdown
                key={section.label}
                section={section}
                isLast={index === referenceNavSections.length - 1}
                open={menu === section.label}
                onOpen={() => setMenu(section.label)}
                onClose={() => setMenu(null)}
              />
            ))}
          </nav>

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

function NavDropdown({
  section,
  isLast = false,
  open,
  onOpen,
  onClose,
}: {
  section: NavSection;
  isLast?: boolean;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const menuId = useId();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !section.previewVideo) return;
    if (open) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [open, section.previewVideo]);

  if (section.previewVideo) {
    return (
      <div
        className={`reference-nav__item reference-nav__item--os ${open ? "reference-nav__item--open" : ""}`}
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
      >
        <Link
          href={section.href ?? "/"}
          className="reference-nav__trigger reference-nav__trigger--os"
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls={menuId}
          onFocus={onOpen}
        >
          <span className="reference-nav__os-fill" aria-hidden="true" />
          <span className="reference-nav__os-label">{section.label}</span>
        </Link>
        {open ? (
          <div id={menuId} role="menu" className="reference-nav__os-mega">
            <Link
              href={section.href ?? "/"}
              role="menuitem"
              className="reference-nav__os-preview"
              aria-label="Spectr OS preview"
              onClick={onClose}
            >
              <span className="reference-nav__os-video">
                <video
                  ref={videoRef}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/images/products/spectr-os-ui.png"
                  aria-hidden="true"
                >
                  <source src={section.previewVideo} type="video/mp4" />
                </video>
              </span>
            </Link>
          </div>
        ) : null}
      </div>
    );
  }

  if (!section.items?.length) {
    return (
      <div className={`reference-nav__item ${isLast ? "reference-nav__item--last" : ""}`}>
        <Link href={section.href ?? "/"}>{section.label}</Link>
      </div>
    );
  }

  return (
    <div
      className={`reference-nav__item ${isLast ? "reference-nav__item--last" : ""} ${open ? "reference-nav__item--open" : ""}`}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      {section.href ? (
        <Link
          href={section.href}
          className="reference-nav__trigger"
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls={menuId}
          onFocus={onOpen}
        >
          {section.label}
        </Link>
      ) : (
        <button
          type="button"
          className="reference-nav__trigger"
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls={menuId}
          onFocus={onOpen}
          onClick={() => (open ? onClose() : onOpen())}
        >
          {section.label}
        </button>
      )}
      {open ? (
        <div id={menuId} role="menu" className="reference-nav__mega">
          {section.items.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              role="menuitem"
              className="reference-nav__mega-item"
              onClick={onClose}
            >
              <span>
                <span className="reference-nav__mega-title">{item.label}</span>
                {item.description ? <span className="reference-nav__mega-description">{item.description}</span> : null}
              </span>
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="m6 4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
