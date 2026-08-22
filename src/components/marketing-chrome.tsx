"use client";

import { usePathname } from "next/navigation";
import { SiteBackground } from "@/components/site-background";
import { CookieConsentLazy } from "@/components/cookie-consent-lazy";

export function MarketingChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare =
    pathname === "/app" ||
    pathname.startsWith("/app/") ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/careers/login" ||
    pathname === "/careers/signup" ||
    pathname === "/check-email" ||
    pathname.startsWith("/mfa");
  if (bare) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteBackground />
      {children}
      <CookieConsentLazy />
    </>
  );
}
