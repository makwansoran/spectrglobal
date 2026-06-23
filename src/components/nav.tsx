"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type NavProps = {
  variant?: "dark" | "light";
};

export function Nav({ variant = "dark" }: NavProps) {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);
  const light = variant === "light";

  const menuSections = [
    {
      title: t("sections.development"),
      links: [
        { label: t("links.recon"), href: "/products/recon" },
        { label: t("links.centurion"), href: "/products/centurion" },
      ],
    },
    {
      title: t("sections.company"),
      links: [
        { label: t("links.contact"), href: "/contact" },
        { label: t("links.about"), href: "/about" },
        { label: t("links.products"), href: "/products" },
        { label: t("links.careers"), href: "/careers" },
      ],
    },
    {
      title: t("sections.resources"),
      links: [
        { label: t("links.newsroom"), href: "/newsroom" },
        { label: t("links.documentation"), href: "/documentation" },
        { label: t("links.security"), href: "/security" },
        { label: t("links.investor"), href: "/investor" },
        { label: t("links.privacy"), href: "/privacy" },
        { label: t("links.terms"), href: "/terms" },
      ],
    },
  ];

  const headerClass = light
    ? "bg-white text-black shadow-2xl shadow-black/20 ring-1 ring-black/10"
    : "bg-black text-white shadow-2xl shadow-black/20 ring-1 ring-white/10";
  const logoClass = light ? "h-8 w-auto" : "h-8 w-auto invert";
  const ctaUnderlineClass = light ? "bg-black" : "bg-white";
  const menuLineClass = light ? "bg-black" : "bg-white";

  useEffect(() => {
    const main = document.querySelector("main") as HTMLElement | null;
    if (main) main.style.overflow = open ? "hidden" : "";
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      if (main) main.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-4 z-50 px-4">
        <div className={`relative mx-auto flex h-16 max-w-5xl items-center justify-between rounded-full px-5 sm:px-7 ${headerClass}`}>
          <Link href="/" className="flex items-center gap-3 hover:opacity-70" onClick={() => setOpen(false)}>
            <Image src="/spectr-logo.png" alt={t("brand")} width={32} height={32} className={logoClass} priority />
            <span className="brand-font text-sm font-semibold uppercase tracking-[0.34em]">{t("brand")}</span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-5">
            <Link href="/contact" onClick={() => setOpen(false)} className="group relative py-2 text-xs uppercase tracking-[0.16em]">
              {t("getStarted")}
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${ctaUnderlineClass}`}
              />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t("closeMenu") : t("openMenu")}
              aria-expanded={open}
              className="relative flex h-8 w-8 flex-col items-center justify-center gap-[5px] focus:outline-none"
            >
              <span className={`block h-px w-5 origin-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "translate-y-[3px] rotate-45" : ""} ${menuLineClass}`} />
              <span className={`block h-px transition-[width,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "w-0 opacity-0" : "w-5"} ${menuLineClass}`} />
              <span className={`block h-px w-5 origin-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "-translate-y-[3px] -rotate-45" : ""} ${menuLineClass}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-40 bg-black transition-[opacity,visibility] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <div className={`flex h-full flex-col px-5 pb-10 pt-28 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-8 ${open ? "translate-y-0" : "translate-y-6"}`}>
          <nav className="mx-auto w-full max-w-5xl flex-1">
            <div className="grid gap-14 pt-4 sm:grid-cols-3 sm:gap-8">
              {menuSections.map((section) => (
                <div key={section.title}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">{section.title}</p>
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

          <div className="mx-auto w-full max-w-5xl border-t border-white/10 pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-7">
                <SocialLink href="https://x.com/spectrnorway" label="X / Twitter">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.264 5.632L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
                </SocialLink>
                <SocialLink href="https://www.linkedin.com/company/spectr-norway/" label="LinkedIn">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
                </SocialLink>
                <SocialLink href="https://www.instagram.com/spectr.no/" label="Instagram">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.34 3.608 1.315.975.975 1.253 2.242 1.315 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.34 2.633-1.315 3.608-.975.975-2.242 1.253-3.608 1.315-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.34-3.608-1.315-.975-.975-1.253-2.242-1.315-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.34-2.633 1.315-3.608.975-.975 2.242-1.253 3.608-1.315 1.266-.058 1.646-.07 4.85-.07Zm0 1.77c-3.15 0-3.522.012-4.77.069-1.154.052-1.781.245-2.197.407-.55.214-.943.47-1.356.883-.413.413-.669.806-.883 1.356-.162.416-.355 1.043-.407 2.197-.057 1.248-.069 1.62-.069 4.77s.012 3.522.069 4.77c.052 1.154.245 1.781.407 2.197.214.55.47.943.883 1.356.413.413.806.669 1.356.883.416.162 1.043.355 2.197.407 1.248.057 1.62.069 4.77.069s3.522-.012 4.77-.069c1.154-.052 1.781-.245 2.197-.407.55-.214.943-.47 1.356-.883.413-.413.669-.806.883-1.356.162-.416.355-1.043.407-2.197.057-1.248.069-1.62.069-4.77s-.012-3.522-.069-4.77c-.052-1.154-.245-1.781-.407-2.197-.214-.55-.47-.943-.883-1.356-.413-.413-.806-.669-1.356-.883-.416-.162-1.043-.355-2.197-.407-1.248-.057-1.62-.069-4.77-.069Zm0 3.675a4.392 4.392 0 1 1 0 8.784 4.392 4.392 0 0 1 0-8.784Zm0 1.77a2.622 2.622 0 1 0 0 5.244 2.622 2.622 0 0 0 0-5.244Zm4.62-2.034a1.026 1.026 0 1 1 0 2.052 1.026 1.026 0 0 1 0-2.052Z" />
                </SocialLink>
                <SocialLink href="https://www.youtube.com/@SpectrNorway" label="YouTube">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
                </SocialLink>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/25">© 2026 Spectr</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-white/40 transition-opacity hover:text-white">
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        {children}
      </svg>
    </a>
  );
}
