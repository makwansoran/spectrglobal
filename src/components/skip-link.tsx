import { getTranslations } from "next-intl/server";
import { bevelButtonClassName } from "@/components/bevel-button";

export async function SkipLink() {
  const t = await getTranslations("Common");

  return (
    <a
      href="#main-content"
      className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] ${bevelButtonClassName({ variant: "primary" })}`}
    >
      {t("skipToContent")}
    </a>
  );
}
