"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCases, useCasesSection } from "@/lib/content";

export function UseCases() {
  const [activeId, setActiveId] = useState(useCases[0]?.id ?? "");
  const active = useCases.find((item) => item.id === activeId) ?? useCases[0];

  if (!active) return null;

  return (
    <section id="use-cases" className="scroll-mt-24 bg-white px-4 pb-20 pt-16 sm:px-6 sm:pb-[140px] sm:pt-[128px]">
      <div className="mx-auto grid w-full max-w-[1400px] items-start gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:gap-x-14">
        <h2 className="m-0 font-normal text-[clamp(30px,4.4vw,46px)] leading-none tracking-[-0.02em] text-[#1E1F2B] lg:col-start-1">
          {useCasesSection.title}
        </h2>

        <aside className="min-w-0 lg:col-start-2 lg:row-span-2 lg:sticky lg:top-28" aria-hidden="true">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#D8D8D3] lg:aspect-auto lg:h-[min(42rem,calc(100vh-8rem))]">
            {useCases.map((item) => (
              <Image
                key={item.id}
                src={item.image}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className={`object-cover transition-opacity duration-500 ${
                  item.id === active.id ? "opacity-100" : "opacity-0"
                }`}
                priority={item.id === useCases[0]?.id}
              />
            ))}
            <div className="absolute inset-x-0 bottom-0 z-[1] bg-gradient-to-t from-black/70 to-transparent px-5 py-5">
              <p className="m-0 text-[17px] leading-snug text-white">{active.cta}</p>
            </div>
          </div>
        </aside>

        <ul className="m-0 list-none p-0 lg:col-start-1 lg:mt-8">
          {useCases.map((item) => {
            const isActive = item.id === active.id;

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  aria-label={`${item.name}. ${item.description}`}
                  aria-current={isActive ? "true" : undefined}
                  className="group grid items-start gap-3 py-4 no-underline sm:grid-cols-[minmax(11rem,0.4fr)_minmax(0,1fr)] sm:gap-8 sm:py-3 sm:pb-14"
                  onMouseEnter={() => setActiveId(item.id)}
                  onFocus={() => setActiveId(item.id)}
                >
                  <div className="max-w-[16.5rem]">
                    <p className="m-0 text-[17px] leading-[1.4] text-[#1E1F2B]">{item.description}</p>
                    <p className="mt-3 m-0 text-[15px] leading-snug text-[#AAAAAA]">{item.index}</p>
                  </div>

                  <div className="flex min-w-0 items-start justify-between gap-4">
                    <h3
                      className={`m-0 min-w-0 overflow-hidden text-[clamp(2rem,10vw,6.25rem)] font-normal leading-[0.86] tracking-[-0.055em] text-[#1E1F2B] sm:whitespace-nowrap ${
                        isActive ? "" : "sm:opacity-90"
                      }`}
                    >
                      {item.name}
                    </h3>
                    <span className="mt-2 hidden shrink-0 text-[15px] leading-snug text-[#AAAAAA] sm:inline">
                      {item.index}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
