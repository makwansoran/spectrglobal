"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useGetStarted } from "@/components/get-started-context";
import { LogoMark } from "@/components/logo";
import { site, type NavSection } from "@/lib/site";

const referenceNavSections: NavSection[] = [
  {
    label: "Products",
    href: "/products",
    items: [
      { label: "Spectr OS", href: "/platforms/spectr-os", description: "The operating system for the enterprise." },
      { label: "Ontology", href: "/products/ontology", description: "Objects, relationships, and a shared operational world." },
      { label: "Agentic runtime", href: "/products/agents", description: "Beyond chat — agents that propose real work." },
      { label: "Command", href: "/products/command", description: "Ranked decisions with evidence." },
      { label: "Deploy", href: "/products/deploy", description: "Cloud, on-prem, and the edge." },
    ],
  },
  {
    label: "Solutions",
    href: "/solutions",
    items: [
      { label: "Manufacturing", href: "/use-cases/manufacturing" },
      { label: "Logistics", href: "/use-cases/logistics" },
      { label: "Energy", href: "/use-cases/energy" },
      { label: "Waste Management", href: "/use-cases/waste-management" },
    ],
  },
  {
    label: "Research",
    href: "/research",
    items: [
      { label: "Spectr Explained", href: "/research", description: "The ideas the product is built on." },
      { label: "Why an operating system", href: "/research/operating-system" },
      { label: "Ontology as truth", href: "/research/ontology" },
      { label: "Local AI", href: "/research/local-ai" },
    ],
  },
  {
    label: "Developers",
    href: "/developers",
    items: [
      { label: "Start building", href: "/developers", description: "APIs, ontology, and workflows." },
      { label: "Spectr OS", href: "/platforms/spectr-os" },
      { label: "SPECTR BOOTCAMP", href: "/bootcamp", description: "One video. Your data. Local." },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Customers", href: "/customers" },
  {
    label: "Company",
    href: "/company",
    items: [
      { label: "About us", href: "/about" },
      { label: "SPECTR BOOTCAMP", href: "/bootcamp" },
      { label: "News", href: "/news" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Nav() {
  const pathname = usePathname();
  const { openGetStarted } = useGetStarted();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [primaryNavOverflowing, setPrimaryNavOverflowing] = useState(false);
  const [renderedPathname, setRenderedPathname] = useState(pathname);
  const primaryNavRef = useRef<HTMLElement>(null);

  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname);
    setOpen(false);
    setMenu(null);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open && !menu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setMenu(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, menu]);

  useEffect(() => {
    const primaryNav = primaryNavRef.current;
    if (!primaryNav) return;

    const updateOverflow = () => {
      setPrimaryNavOverflowing(primaryNav.scrollWidth > primaryNav.clientWidth);
    };

    updateOverflow();
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(primaryNav);
    window.addEventListener("resize", updateOverflow);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateOverflow);
    };
  }, []);

  return (
    <>
      <header className="site-header site-header--reference">
        <div className="reference-nav-shell">
          <div className="reference-nav">
            <Link href="/" className="reference-nav__brand" aria-label={site.name}>
              <LogoMark className="h-[34px] w-[34px]" />
            </Link>

            <nav ref={primaryNavRef} aria-label="Primary" className="reference-nav__links hidden lg:flex">
              {referenceNavSections.map((section) => (
                <NavDropdown
                  key={section.label}
                  section={section}
                  open={menu === section.label}
                  onOpen={() => setMenu(section.label)}
                  onClose={() => setMenu(null)}
                />
              ))}
            </nav>

            <div className="reference-nav__actions">
              <Link
                href="/login"
                className={`reference-nav__action hidden sm:flex ${primaryNavOverflowing ? "reference-nav__action--merged" : ""}`}
              >
                Login
              </Link>
              <button
                type="button"
                onClick={() => openGetStarted("contact")}
                className="reference-nav__action reference-nav__action--contact hidden sm:flex"
              >
                Contact sales
              </button>
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls="site-nav-overlay"
                aria-label={open ? "Close menu" : "Open menu"}
                className="reference-nav__burger inline-flex lg:hidden"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                  {open ? (
                    <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  ) : (
                    <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {open ? (
        <div id="site-nav-overlay" className="nav-overlay" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="container-x flex h-[4.25rem] items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5" aria-label={site.name} onClick={() => setOpen(false)}>
              <LogoMark className="h-8 w-8" />
              <span className="text-[15px] font-medium tracking-[-0.02em]">Spectr</span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="container-x flex flex-col gap-1 pb-10 pt-6" aria-label="Mobile">
            {referenceNavSections.map((section) => (
              <div key={section.label} className="border-b border-border py-4">
                <Link
                  href={section.href}
                  onClick={() => setOpen(false)}
                  className="display block text-4xl tracking-[-0.03em] text-fg"
                >
                  {section.label}
                </Link>
                {section.items ? (
                  <ul className="mt-4 space-y-2">
                    {section.items.map((item) => (
                      <li key={item.href + item.label}>
                        <Link href={item.href} onClick={() => setOpen(false)} className="text-base text-muted hover:text-fg">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
            <div className="mt-8 flex flex-col gap-3">
              <Link href="/login" className="btn btn-secondary" onClick={() => setOpen(false)}>
                Login
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openGetStarted("contact");
                }}
                className="btn btn-secondary reference-nav__action--contact"
              >
                Contact sales
              </button>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}

function NavDropdown({
  section,
  open,
  onOpen,
  onClose,
}: {
  section: NavSection;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const menuId = useId();

  if (!section.items?.length) {
    return (
      <div className="reference-nav__item">
        <Link href={section.href}>{section.label}</Link>
      </div>
    );
  }

  return (
    <div
      className={`reference-nav__item ${section.label === "Company" ? "reference-nav__item--last" : ""} ${open ? "reference-nav__item--open" : ""}`}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
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
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="reference-nav__mega"
        >
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
