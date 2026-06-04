"use client";

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
    <div className="fixed inset-x-0 bottom-0 z-[80] px-4 pb-4 sm:px-6 sm:pb-6">
      <section className="brand-font mx-auto max-w-5xl border border-border bg-bg p-5 text-fg shadow-2xl shadow-black/20 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Cookie notice</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.045em] sm:text-3xl">
              Spectr uses cookies to run and improve this website.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
              We use essential cookies to remember your choices and keep the site working. With your permission, we may also use analytics or similar tools to understand website usage. You can read more in our{" "}
              <Link href="/privacy" className="text-fg underline underline-offset-4">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
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
        </div>
      </section>
    </div>
  );
}
