"use client";

import { usePathname } from "next/navigation";
import { SiteBackground } from "@/components/site-background";
import { CookieConsentLazy } from "@/components/cookie-consent-lazy";
import { SiteTracker } from "@/components/site-tracker";
import { isAppChromePath } from "@/lib/chrome";

export function MarketingChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = isAppChromePath(pathname);
  if (bare) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteBackground />
      {children}
      <SiteTracker />
      <CookieConsentLazy />
    </>
  );
}
