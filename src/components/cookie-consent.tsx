"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/button";
import { LogoMark } from "@/components/logo";

const STORAGE_KEY = "spectr-cookie-consent";

export function CookieConsent() {
  // This component is loaded with `ssr: false`, so reading storage during
  // initialisation is safe and avoids a flash of the banner for users who
  // have already answered.
  const [visible, setVisible] = useState(
    () => typeof window !== "undefined" && !window.localStorage.getItem(STORAGE_KEY),
  );

  function saveConsent(value: "accepted" | "essential") {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ value, savedAt: new Date().toISOString() }),
    );
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-title"
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40 p-4 sm:items-center sm:p-6"
    >
      <section className="w-full max-w-lg rounded-2xl border border-border bg-surface p-7 sm:p-8">
        <LogoMark className="h-8 w-8" />
        <h2 id="cookie-title" className="display mt-5 text-3xl text-fg">
          Cookies on spectr.no
        </h2>
        <p className="mt-3.5 text-sm leading-7 text-muted">
          We use essential cookies to run this site, and optional ones to understand how it is used.
          You can choose. Read the{" "}
          <Link href="/privacy" className="text-fg underline underline-offset-4">
            privacy policy
          </Link>{" "}
          for the detail.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button type="button" className="flex-1" onClick={() => saveConsent("essential")}>
            Essential only
          </Button>
          <Button type="button" className="flex-1" onClick={() => saveConsent("accepted")}>
            Accept all
          </Button>
        </div>
      </section>
    </div>
  );
}
