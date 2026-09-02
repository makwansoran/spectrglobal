"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { isAppChromePath } from "@/lib/chrome";

function send(kind: "pageview" | "click", path: string, label = "") {
  const payload = JSON.stringify({ kind, path, label });
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
    return;
  }
  void fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  });
}

export function SiteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (isAppChromePath(pathname)) return;
    send("pageview", pathname);
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (isAppChromePath(window.location.pathname)) return;
      const target = (event.target as HTMLElement | null)?.closest("a, button");
      if (!target) return;
      const label =
        target.getAttribute("aria-label") ||
        target.textContent?.replace(/\s+/g, " ").trim() ||
        (target instanceof HTMLAnchorElement ? target.getAttribute("href") : "") ||
        "click";
      send("click", window.location.pathname, label.slice(0, 120));
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
