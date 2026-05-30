"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const menuSections = [
  {
    title: "Development",
    links: [
      { label: "ATTACK", href: "/products/attack" },
      { label: "RECON", href: "/products/recon" },
      { label: "JAMMER", href: "/products/jammer" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Get Started", href: "/contact" },
      { label: "Products", href: "/products" },
    ],
  },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const main = document.querySelector("main") as HTMLElement | null;
    if (main) main.style.overflow = open ? "hidden" : "";
    return () => {
      if (main) main.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-4 z-50 px-4">
        <div className="relative mx-auto flex h-16 max-w-5xl items-center justify-between rounded-full bg-black px-5 text-white shadow-2xl shadow-black/20 ring-1 ring-white/10 sm:px-7">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-70"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/inzure-logo.png"
              alt="Spectr"
              width={32}
              height={32}
              className="h-8 w-auto invert"
              priority
            />
            <span className="brand-font text-sm font-semibold uppercase tracking-[0.34em]">
              Spectr
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-5">
            {/* CTA */}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="text-xs uppercase tracking-[0.16em] bg-white px-5 py-2.5 text-black transition-opacity hover:opacity-80"
            >
              Get Started
            </Link>

            {/* Hamburger / Close */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="relative flex h-8 w-8 flex-col items-center justify-center gap-[5px] focus:outline-none"
            >
              <span
                className={`block h-px w-5 origin-center bg-white transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  open ? "translate-y-[3px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px bg-white transition-[width,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  open ? "w-0 opacity-0" : "w-5"
                }`}
              />
              <span
                className={`block h-px w-5 origin-center bg-white transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  open ? "-translate-y-[3px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen overlay */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-40 bg-black transition-[opacity,visibility] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div
          className={`flex h-full flex-col px-5 pb-10 pt-28 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-8 ${
            open ? "translate-y-0" : "translate-y-6"
          }`}
        >
          <nav className="mx-auto w-full max-w-5xl flex-1">
            <div className="grid gap-14 pt-4 sm:grid-cols-3 sm:gap-8">
              {menuSections.map((section) => (
                <div key={section.title}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
                    {section.title}
                  </p>
                  <ul className="mt-7 space-y-5">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="brand-font block text-2xl font-medium tracking-[-0.02em] text-white/90 transition-opacity duration-200 hover:text-white/40 sm:text-3xl"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>

          {/* Social icons row at bottom of overlay */}
          <div className="mx-auto w-full max-w-5xl border-t border-white/10 pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-7">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X / Twitter"
                  className="text-white/40 transition-opacity hover:text-white"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.264 5.632L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-white/40 transition-opacity hover:text-white"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="text-white/40 transition-opacity hover:text-white"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
                  </svg>
                </a>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/25">
                © 2026 Spectr
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
