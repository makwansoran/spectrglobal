"use client";

import { usePathname } from "next/navigation";
import { GetStartedProvider } from "@/components/get-started-context";
import { GetStartedSidebar } from "@/components/get-started-sidebar";
import { Nav } from "@/components/nav";

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
      <Nav />
      {children}
      <GetStartedSidebar />
    </GetStartedProvider>
  );
}
