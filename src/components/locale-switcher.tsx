"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("LocaleSwitcher");
  const pathname = usePathname();

  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label={t("label")}>
      {routing.locales.map((loc, index) => (
        <span key={loc} className="flex items-center gap-1">
          {index > 0 ? <span className="text-muted/50">/</span> : null}
          <Link
            href={pathname}
            locale={loc}
            className="text-xs font-medium uppercase tracking-[0.12em] text-muted transition-colors hover:text-fg"
          >
            {t(loc)}
          </Link>
        </span>
      ))}
    </div>
  );
}
