"use client";

import { useEffect } from "react";
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
    pathname === "/check-email" ||
    pathname.startsWith("/mfa");
  const whiteTheme = pathname === "/about";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("theme-white", whiteTheme);
    return () => root.classList.remove("theme-white");
  }, [whiteTheme]);

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
