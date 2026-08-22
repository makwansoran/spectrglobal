"use client";

import { Footer } from "@/components/footer";
import { CareersSubnav } from "@/components/careers/careers-subnav";
import { isAppChromePath } from "@/lib/chrome";
import { usePathname } from "next/navigation";

export function CareersFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isAppChromePath(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-1 flex-col bg-white text-[#0A0A0A]">
      <CareersSubnav />
      {children}
      <Footer />
    </div>
  );
}
