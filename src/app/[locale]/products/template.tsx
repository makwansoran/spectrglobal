"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { scheduleScrollResets } from "@/components/scroll-to-top";

export default function ProductsTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (window.location.hash) return;
    return scheduleScrollResets();
  }, [pathname]);

  return children;
}
