"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { careersNav } from "@/lib/careers";

export function CareersSubnav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-[#D2D2CE] bg-white">
      <div className="mx-auto w-full max-w-[1100px] px-6">
        <nav aria-label="Careers" className="flex gap-6 overflow-x-auto py-3 sm:gap-8">
          {careersNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative shrink-0 pt-2 text-[13px] tracking-[-0.01em] transition-colors ${
                  active ? "font-medium text-[#0A0A0A]" : "text-[#6B6B72] hover:text-[#0A0A0A]"
                }`}
              >
                {active ? (
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-[#0A0A0A]" />
                ) : null}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
