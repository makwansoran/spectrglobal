"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

function scrollAllRootsToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  document.querySelectorAll<HTMLElement>("main").forEach((main) => {
    main.scrollTop = 0;
  });
}

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;

    scrollAllRootsToTop();

    const frame = window.requestAnimationFrame(() => {
      scrollAllRootsToTop();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
