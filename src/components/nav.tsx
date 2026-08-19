"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GetStartedButton } from "@/components/get-started-button";
import { LogoMark, Wordmark } from "@/components/logo";
import { newsItems } from "@/lib/content";
import { navPrimary, navQuickLinks, site } from "@/lib/site";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [renderedPathname, setRenderedPathname] = useState(pathname);

  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="container-x pointer-events-auto pt-4 sm:pt-5">
          <div className="nav-island">
            <div className="flex h-16 items-center justify-between gap-4 px-3 sm:px-5">
              <Link href="/" className="flex items-center gap-2.5 hover:opacity-70" aria-label={site.name}>
                <LogoMark className="h-7 w-7" />
                <Wordmark className="text-nav-fg" />
              </Link>

              <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
                <Link href="/platforms/spectr-os" className="nav-link">
                  Spectr OS
                </Link>
                <Link href="/about" className="nav-link">
                  About
                </Link>
                <Link href="/news" className="nav-link">
                  News
                </Link>
                <Link href="/careers" className="nav-link">
                  Careers
                </Link>
              </nav>

              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/contact"
                  className="hidden text-[11px] font-medium uppercase tracking-[0.15em] text-fg/75 transition hover:text-fg sm:inline-flex"
                >
                  Contact
                </Link>
                <GetStartedButton className="nav-cta hidden sm:inline-flex" />
                <button
                  type="button"
                  onClick={() => setOpen((value) => !value)}
                  aria-expanded={open}
                  aria-controls="site-nav-overlay"
                  aria-label={open ? "Close menu" : "Open menu"}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/70 text-nav-fg hover:bg-white md:hidden"
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                    {open ? (
                      <path
                        d="m5 5 10 10M15 5 5 15"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    ) : (
                      <path
                        d="M3 6h14M3 10h14M3 14h14"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {open ? (
        <div id="site-nav-overlay" className="nav-overlay" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="nav-overlay__grid" aria-hidden="true" />

          <div className="relative z-10">
            <div className="container-x pt-4 sm:pt-5">
              <div className="flex h-14 items-center justify-between gap-4 px-1">
                <Link
                  href="/"
                  className="flex items-center gap-2.5 hover:opacity-70"
                  aria-label={site.name}
                  onClick={() => setOpen(false)}
                >
                  <LogoMark invert className="h-7 w-7" />
                  <Wordmark className="text-fg" />
                </Link>
                <div className="flex items-center gap-2 sm:gap-3">
                  <GetStartedButton
                    className="nav-cta hidden sm:inline-flex"
                    onClick={() => {
                      setOpen(false);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-fg hover:bg-white/10"
                  >
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                      <path
                        d="m5 5 10 10M15 5 5 15"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="container-x grid gap-0 pb-16 pt-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)_minmax(0,1fr)] lg:pt-0">
              <nav className="lg:pr-8 lg:pt-10" aria-label="Main">
                <p className="label mb-6">Navigation</p>
                <ul className="space-y-1">
                  {navPrimary.map((item) => (
                    <li key={item.label} className="nav-item group">
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="brand-font block flex-1 py-2 text-3xl tracking-tight text-fg hover:opacity-60 sm:text-4xl"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="grid sm:grid-cols-2 lg:col-span-2 lg:grid-cols-2">
                <section className="py-10 lg:px-8 lg:pt-10">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <h2 className="label">Latest News</h2>
                    <Link
                      href="/news"
                      onClick={() => setOpen(false)}
                      className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted hover:text-fg"
                    >
                      Newsroom →
                    </Link>
                  </div>
                  <ul className="space-y-8">
                    {newsItems.map((item) => (
                      <li key={item.id}>
                        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                          {item.source}, {item.date}
                        </p>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="mt-2 block text-base leading-7 text-fg hover:opacity-70"
                        >
                          {item.title}
                        </Link>
                        <p className="mt-2 text-sm leading-6 text-muted">{item.summary}</p>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="mt-3 inline-block text-sm text-fg/80 hover:text-fg"
                        >
                          ↳ {item.cta}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>

                <div className="grid">
                  <section className="px-0 py-10 lg:px-8 lg:pt-10">
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <h2 className="label">Solutions</h2>
                      <Link
                        href="/#features"
                        onClick={() => setOpen(false)}
                        className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted hover:text-fg"
                      >
                        View All →
                      </Link>
                    </div>
                    <p className="text-sm leading-7 text-muted">
                      Our platforms help warehouses and industrial floors implement solutions to the hardest
                      problems they face.
                    </p>
                    <Link
                      href="/platforms/spectr-os"
                      onClick={() => setOpen(false)}
                      className="mt-4 inline-block text-sm text-fg/80 hover:text-fg"
                    >
                      ↳ Learn more about Spectr OS
                    </Link>
                  </section>

                  <section className="py-10 lg:px-8">
                    <h2 className="label mb-6">Quick links</h2>
                    <ul className="columns-1 gap-x-8 text-sm sm:columns-2">
                      {navQuickLinks.map((link) => (
                        <li key={link.href} className="mb-2 break-inside-avoid">
                          <Link
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="text-muted hover:text-fg"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
