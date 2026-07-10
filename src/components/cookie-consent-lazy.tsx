"use client";

import dynamic from "next/dynamic";

export const CookieConsentLazy = dynamic(
  () =>
    import("@/components/cookie-consent").then((mod) => ({
      default: mod.CookieConsent,
    })),
  { ssr: false },
);
