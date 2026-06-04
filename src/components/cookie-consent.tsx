"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "spectr-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!window.localStorage.getItem(STORAGE_KEY));
  }, []);

  function saveConsent(value: "accepted" | "essential") {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        value,
        savedAt: new Date().toISOString(),
      }),
    );
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/20 px-4 py-6 backdrop-blur-sm sm:px-6">
      <section className="brand-font w-full max-w-2xl border border-border bg-bg p-6 text-center text-fg shadow-2xl shadow-black/20 sm:p-8">
        <div className="flex flex-col items-center">
          <Image
            src="/spectr-logo.png"
            alt="Spectr"
            width={44}
            height={44}
            className="h-11 w-auto"
            priority
          />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Cookie notice</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.045em] sm:text-3xl">
            Spectr uses cookies to run and improve this website.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
            We use essential cookies to remember your choices and keep the site working. With your permission, we may also use analytics or similar tools to understand website usage. You can read more in our{" "}
            <Link href="/privacy" className="text-fg underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => saveConsent("essential")}
            className="inline-flex justify-center border border-border px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-fg transition-colors hover:border-fg"
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={() => saveConsent("accepted")}
            className="inline-flex justify-center bg-fg px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-bg transition-opacity hover:opacity-80"
          >
            Accept Cookies
          </button>
        </div>
      </section>
    </div>
  );
}
