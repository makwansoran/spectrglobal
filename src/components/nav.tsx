"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { GetStartedButton } from "@/components/get-started-button";
import { LogoMark } from "@/components/logo";
import { navSections, site, type NavSection } from "@/lib/site";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [renderedPathname, setRenderedPathname] = useState(pathname);

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

  return (
    <>
      <header className="site-header">
        <div className="container-x">
          <div className="flex h-[4.25rem] items-center gap-6 lg:h-[4.75rem]">
            <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={site.name}>
              <LogoMark className="h-8 w-8" />
              <span className="text-[15px] font-medium tracking-[-0.02em] text-fg">Spectr</span>
            </Link>

            <nav aria-label="Primary" className="hidden flex-1 items-center justify-center gap-1 lg:flex">
              {navSections.map((section) => (
                <NavDropdown
                  key={section.label}
                  section={section}
                  open={menu === section.label}
                  onOpen={() => setMenu(section.label)}
                  onClose={() => setMenu(null)}
                />
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <Link href="/login" className="btn btn-secondary btn-sm hidden sm:inline-flex">
                Login
              </Link>
              <Link href="/contact" className="btn btn-secondary btn-sm hidden sm:inline-flex">
                Contact
              </Link>
              <GetStartedButton className="nav-cta hidden sm:inline-flex" label="Get started" size="sm">
                Get started
              </GetStartedButton>
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls="site-nav-overlay"
                aria-label={open ? "Close menu" : "Open menu"}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-fg lg:hidden"
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
            {navSections.map((section) => (
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
              <Link href="/contact" className="btn btn-secondary" onClick={() => setOpen(false)}>
                Contact
              </Link>
              <GetStartedButton
                className="nav-cta"
                label="Get started"
                onClick={() => setOpen(false)}
              >
                Get started
              </GetStartedButton>
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
      <Link href={section.href} className="nav-link rounded-full px-3 py-2">
        {section.label}
      </Link>
    );
  }

  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <Link
        href={section.href}
        className="nav-link inline-flex items-center gap-1 rounded-full px-3 py-2"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={menuId}
        onFocus={onOpen}
      >
        {section.label}
        <svg viewBox="0 0 12 12" className="h-3 w-3 opacity-50" fill="none" aria-hidden="true">
          <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </Link>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute left-1/2 top-full z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 pt-3"
        >
          <div className="rounded-2xl border border-border bg-surface p-2 shadow-[0_24px_60px_rgba(22,21,19,0.12)]">
            {section.items.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                role="menuitem"
                className="block rounded-xl px-4 py-3 hover:bg-surface-2"
                onClick={onClose}
              >
                <p className="text-[15px] font-medium tracking-[-0.01em] text-fg">{item.label}</p>
                {item.description ? <p className="mt-1 text-sm leading-5 text-muted">{item.description}</p> : null}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
