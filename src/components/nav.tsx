"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";

const NAV_LINKS = [
  { key: "about", href: "/about" },
  { key: "research", href: "/research" },
  { key: "news", href: "/news" },
  { key: "careers", href: "/careers" },
  { key: "contact", href: "/contact" },
] as const;

export function Nav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || open
            ? "border-b border-border bg-bg/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-70"
            onClick={() => setOpen(false)}
          >
            <Image src="/spectr-logo.png" alt={t("brand")} width={30} height={30} className="h-7 w-auto invert" priority />
            <span className="brand-font text-base font-semibold uppercase tracking-[0.3em]">{t("brand")}</span>
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`text-sm transition-colors hover:text-fg ${
                    active ? "text-fg" : "text-muted"
                  }`}
                >
                  {t(`links.${link.key}`)}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <LocaleSwitcher className="hidden sm:flex" />
            <Link href="/contact" className="pill pill--primary hidden text-sm sm:inline-flex">
              {t("getInTouch")}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t("closeMenu") : t("openMenu")}
              aria-expanded={open}
              className="relative flex h-9 w-9 flex-col items-center justify-center gap-[5px] lg:hidden"
            >
              <span className={`block h-px w-5 bg-fg transition-transform duration-300 ${open ? "translate-y-[3px] rotate-45" : ""}`} />
              <span className={`block h-px bg-fg transition-all duration-300 ${open ? "w-0 opacity-0" : "w-5"}`} />
              <span className={`block h-px w-5 bg-fg transition-transform duration-300 ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-40 bg-bg transition-[opacity,visibility] duration-400 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="flex h-full flex-col px-6 pb-10 pt-24">
          <nav className="flex-1">
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="brand-font block py-2 text-3xl font-medium tracking-[-0.03em] text-fg hover:opacity-50"
                  >
                    {t(`links.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center justify-between border-t border-border pt-6">
            <LocaleSwitcher />
            <Link href="/contact" className="pill pill--primary text-sm" onClick={() => setOpen(false)}>
              {t("getInTouch")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
