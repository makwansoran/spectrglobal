"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export function LocaleSwitcher({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const light = variant === "light";

  function onChange(nextLocale: Locale) {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <label className={`inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] ${light ? "text-black/60" : "text-white/50"}`}>
      <span className="sr-only">{t("label")}</span>
      <select
        aria-label={t("label")}
        value={locale}
        className={`cursor-pointer border bg-transparent px-2 py-1 outline-none ${light ? "border-black/15 text-black" : "border-white/15 text-white"}`}
        onChange={(event) => onChange(event.target.value as Locale)}
      >
        {routing.locales.map((item) => (
          <option key={item} value={item} className="text-black">
            {t(item)}
          </option>
        ))}
      </select>
    </label>
  );
}
