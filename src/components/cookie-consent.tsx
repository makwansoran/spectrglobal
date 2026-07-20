"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { BevelButton } from "@/components/bevel-button";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "spectr-cookie-consent";

export function CookieConsent() {
  const t = useTranslations("CookieConsent");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!window.localStorage.getItem(STORAGE_KEY));
  }, []);

  function saveConsent(value: "accepted" | "essential") {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ value, savedAt: new Date().toISOString() }),
    );
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 px-4 py-6 sm:px-6">
      <section className="brand-font w-full max-w-2xl border border-border bg-surface p-6 text-center text-fg shadow-2xl shadow-black/40 sm:p-8">
        <div className="flex flex-col items-center">
          <Image src="/spectr-logo.png" alt="Spectr" width={44} height={44} className="h-11 w-auto invert" />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-muted">{t("label")}</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.045em] sm:text-3xl">{t("title")}</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
            {t("description")}{" "}
            <Link href="/privacy" className="text-fg underline underline-offset-4">
              {t("privacyLink")}
            </Link>
            .
          </p>
        </div>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <BevelButton type="button" variant="secondary" className="justify-center" onClick={() => saveConsent("essential")}>
            {t("essential")}
          </BevelButton>
          <BevelButton type="button" className="justify-center" onClick={() => saveConsent("accepted")}>
            {t("accept")}
          </BevelButton>
        </div>
      </section>
    </div>
  );
}
