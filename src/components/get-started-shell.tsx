"use client";

import { GetStartedProvider } from "@/components/get-started-context";
import { GetStartedSidebar } from "@/components/get-started-sidebar";

export function GetStartedShell({ children }: { children: React.ReactNode }) {
  return (
    <GetStartedProvider>
      {children}
      <GetStartedSidebar />
    </GetStartedProvider>
  );
}
