import { getTranslations } from "next-intl/server";

export async function SkipLink() {
  const t = await getTranslations("Common");

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-fg focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:uppercase focus:tracking-[0.14em] focus:text-bg"
    >
      {t("skipToContent")}
    </a>
  );
}
