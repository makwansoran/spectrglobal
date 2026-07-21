"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Nav() {
  const t = useTranslations("Nav");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border bg-bg/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-70">
          <Image
            src="/spectr-logo.png"
            alt={t("brand")}
            width={30}
            height={30}
            className="h-7 w-auto invert"
            priority
          />
          <span className="brand-font text-base font-semibold uppercase tracking-[0.3em]">
            {t("brand")}
          </span>
        </Link>

        <Link href="/contact" className="pill pill--primary text-sm">
          {t("getInTouch")}
        </Link>
      </div>
    </header>
  );
}
