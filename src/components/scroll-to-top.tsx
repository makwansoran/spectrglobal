"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "@/i18n/navigation";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function scrollAllRootsToTop() {
  if (typeof window === "undefined") return;

  const previousBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";

  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  document.querySelectorAll<HTMLElement>("main, [data-scroll-root]").forEach((element) => {
    element.scrollTop = 0;
  });

  document.documentElement.style.scrollBehavior = previousBehavior;
}

export function scheduleScrollResets() {
  scrollAllRootsToTop();
  window.requestAnimationFrame(scrollAllRootsToTop);

  const delays = [0, 16, 50, 120, 300];
  const timers = delays.map((delay) => window.setTimeout(scrollAllRootsToTop, delay));

  return () => timers.forEach((timer) => window.clearTimeout(timer));
}

export function ScrollToTop() {
  const pathname = usePathname();

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;

    return scheduleScrollResets();
  }, [pathname]);

  return null;
}
