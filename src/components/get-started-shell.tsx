"use client";

import { usePathname } from "next/navigation";
import { GetStartedProvider } from "@/components/get-started-context";
import { GetStartedSidebar } from "@/components/get-started-sidebar";
import { Nav } from "@/components/nav";
import { isAppChromePath } from "@/lib/chrome";

export function GetStartedShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = isAppChromePath(pathname);

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
