"use client";

import { usePathname } from "next/navigation";
import { GetStartedProvider } from "@/components/get-started-context";
import { GetStartedSidebar } from "@/components/get-started-sidebar";

export function GetStartedShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare =
    pathname === "/app" ||
    pathname.startsWith("/app/") ||
    pathname === "/login";

  if (bare) {
    return <>{children}</>;
  }

  return (
    <GetStartedProvider>
      {children}
      <GetStartedSidebar />
    </GetStartedProvider>
  );
}
