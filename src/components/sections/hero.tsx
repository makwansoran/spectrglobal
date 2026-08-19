"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { featuredNews, hero } from "@/lib/content";

export function Hero() {
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % featuredNews.length);
      setCycle((value) => value + 1);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden pb-10 pt-10 sm:pb-14 sm:pt-16 lg:pb-20 lg:pt-20">
      <div className="container-x grid items-end gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.75fr)] lg:gap-16">
        <div>
          <h1 className="display max-w-4xl text-[clamp(3.4rem,9vw,8.25rem)] text-fg">
            {hero.title}
            <br />
            {hero.titleLine2}
          </h1>
          <p className="mt-8 max-w-md text-lg leading-8 text-muted sm:text-xl sm:leading-8">
            {hero.body}
          </p>
        </div>

        <aside aria-label="Featured news" className="min-w-0">
          <p className="text-sm font-medium text-muted">Featured news</p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface">
            {featuredNews.map((item, index) => {
              const current = index === active;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`block border-b border-border px-5 py-4 last:border-b-0 ${current ? "bg-white" : "bg-transparent"}`}
                  onMouseEnter={() => {
                    setActive(index);
                    setCycle((value) => value + 1);
                  }}
                >
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{item.category}</p>
                  <p className={`mt-2 text-[1.05rem] leading-6 tracking-[-0.02em] ${current ? "text-fg" : "text-muted"}`}>
                    {item.title}
                  </p>
                  {current ? (
                    <span key={cycle} className="news-progress mt-4 block h-px bg-accent" />
                  ) : (
                    <span className="mt-4 block h-px bg-transparent" />
                  )}
                </Link>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}
