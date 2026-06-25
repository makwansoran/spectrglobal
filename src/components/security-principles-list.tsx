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
    <div className="space-y-8">
      {principles.map((principle) => {
        const expanded = openSlug === principle.slug;

        return (
          <div
            key={principle.slug}
            className={`security-principle group w-full text-left ${expanded ? "is-open" : ""}`}
            onClick={(event) => handleClick(event, principle.slug)}
            onKeyDown={(event) => handleKeyDown(event, principle.slug)}
            role="button"
            tabIndex={0}
            aria-expanded={expanded}
          >
            <div className="grid gap-5 py-3 sm:grid-cols-[260px_1fr] sm:items-start">
              <span className="text-3xl font-semibold leading-none tracking-[-0.055em] text-fg">
                {principle.title}
              </span>
              <div className="min-w-0">
                <span className="block max-w-3xl text-sm leading-7 text-muted">
                  {principle.text}
                </span>
                <div className="security-principle-panel">
                  <div>
                    <div className="space-y-6 pt-6 text-sm leading-7 text-muted sm:text-base sm:leading-8">
                      {principle.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <span className="mt-5 block h-px w-1/2 origin-left bg-fg transition-transform duration-500 ease-out group-hover:scale-x-0 group-[.is-open]:scale-x-0" />
          </div>
        );
      })}
    </div>
  );
}
