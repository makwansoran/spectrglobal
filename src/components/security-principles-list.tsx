"use client";

import { useState, type KeyboardEvent, type MouseEvent } from "react";

export type SecurityPrincipleItem = {
  slug: string;
  title: string;
  text: string;
  paragraphs: string[];
};

type SecurityPrinciplesListProps = {
  principles: SecurityPrincipleItem[];
};

export function SecurityPrinciplesList({ principles }: SecurityPrinciplesListProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const handleClick = (event: MouseEvent<HTMLDivElement>, slug: string) => {
    if (!window.matchMedia("(hover: none)").matches) {
      return;
    }

    event.preventDefault();
    setOpenSlug((current) => (current === slug ? null : slug));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, slug: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpenSlug((current) => (current === slug ? null : slug));
    }

    if (event.key === "Escape") {
      setOpenSlug(null);
    }
  };

  return (
    <div className="security-principles-stack border-t border-border">
      {principles.map((principle, index) => {
        const expanded = openSlug === principle.slug;
        const indexLabel = `/0.${index + 1}`;

        return (
          <div
            key={principle.slug}
            className={`security-principle group border-b border-border py-10 lg:py-14 ${
              expanded ? "is-open" : ""
            }`}
            onClick={(event) => handleClick(event, principle.slug)}
            onKeyDown={(event) => handleKeyDown(event, principle.slug)}
            role="button"
            tabIndex={0}
            aria-expanded={expanded}
          >
            <div className="flex flex-col gap-4 lg:gap-5">
              <span className="font-mono text-sm tracking-[0.08em] text-muted">
                {indexLabel}
              </span>
              <h2 className="max-w-5xl text-4xl font-semibold leading-[0.95] tracking-[-0.055em] text-fg transition-opacity duration-300 group-hover:opacity-100 sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
                {principle.title}
              </h2>
            </div>

            <div className="security-principle-panel">
              <div>
                <div className="max-w-3xl space-y-6 pt-8 text-base leading-8 text-muted sm:pt-10 sm:text-lg sm:leading-9">
                  <p className="text-fg/75">{principle.text}</p>
                  {principle.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
