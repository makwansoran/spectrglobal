"use client";

import { useEffect, useState } from "react";

type NavItem = {
  id: string;
  label: string;
};

export function ProductSectionNav({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Page sections"
      className="sticky top-16 z-40 border-y border-border bg-bg/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 sm:px-8">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`relative shrink-0 px-4 py-4 text-sm transition-colors ${
                isActive ? "text-fg" : "text-muted hover:text-fg"
              }`}
            >
              {item.label}
              <span
                aria-hidden
                className={`absolute inset-x-4 bottom-0 h-0.5 bg-accent transition-opacity ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              />
            </a>
          );
        })}
      </div>
    </nav>
  );
}
