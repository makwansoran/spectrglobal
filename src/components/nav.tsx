"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";
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
            <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-5">
              <Link href="/" className="flex items-center gap-2.5 hover:opacity-70" aria-label={site.name}>
                <LogoMark invert className="h-7 w-7" />
                <Wordmark className="text-nav-fg" />
              </Link>

              <div className="flex items-center gap-2 sm:gap-3">
                <Button href="/contact" className="btn-on-dark hidden sm:inline-flex">
                  Get Started
                </Button>
                <button
                  type="button"
                  onClick={() => setOpen((value) => !value)}
                  aria-expanded={open}
                  aria-controls="site-nav-overlay"
                  aria-label={open ? "Close menu" : "Open menu"}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/0 text-nav-fg hover:bg-white/10"
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
                  <Button href="/contact" className="btn-on-dark hidden sm:inline-flex" onClick={() => setOpen(false)}>
                    Get Started
                  </Button>
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

            <div className="container-x grid gap-0 border-t border-border pb-16 pt-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)_minmax(0,1fr)] lg:pt-0">
              <nav className="border-border lg:border-r lg:pr-8 lg:pt-10" aria-label="Main">
                <p className="label mb-6">Navigation</p>
                <ul className="space-y-1">
                  {navPrimary.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="brand-font block py-2 text-3xl tracking-tight text-fg hover:opacity-60 sm:text-4xl"
                      >
                        {item.label}
                      </Link>
                      {"children" in item && item.children ? (
                        <ul className="mb-3 ml-1 space-y-1 border-l border-border pl-4">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <Link
                                href={child.href}
                                onClick={() => setOpen(false)}
                                className="block py-1.5 text-sm text-muted hover:text-fg"
                              >
                                ↳ {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="grid border-border sm:grid-cols-2 lg:col-span-2 lg:grid-cols-2 lg:border-l-0">
                <section className="border-t border-border py-10 sm:border-r lg:border-t-0 lg:px-8 lg:pt-10">
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

                <div className="grid border-t border-border sm:border-t-0 lg:border-l lg:border-border">
                  <section className="border-b border-border px-0 py-10 lg:px-8 lg:pt-10">
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <h2 className="label">Offerings</h2>
                      <Link
                        href="/#offerings"
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
                      href="/wms"
                      onClick={() => setOpen(false)}
                      className="mt-4 inline-block text-sm text-fg/80 hover:text-fg"
                    >
                      ↳ Learn more about Metaphysics
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
