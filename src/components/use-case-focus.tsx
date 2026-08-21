"use client";

import Image from "next/image";
import { useState } from "react";
import type { UseCaseFocus } from "@/lib/use-cases";

export function UseCaseFocus({ focuses }: { focuses: UseCaseFocus[] }) {
  const [active, setActive] = useState(focuses[0]?.id ?? "");
  const current = focuses.find((item) => item.id === active) ?? focuses[0];

  if (!current) return null;

  return (
    <div className="uc-focus">
      <div className="uc-wrap">
        <ul className="uc-pills" role="tablist" aria-label="Focus areas">
          {focuses.map((item) => {
            const selected = item.id === current.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={`uc-pill${selected ? " is-active" : ""}`}
                  onClick={() => setActive(item.id)}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="uc-focus__panel">
          <blockquote className="uc-focus__quote">{current.statement}</blockquote>
          <dl className="uc-meta">
            <div>
              <dt>Focus</dt>
              <dd>{current.focus}</dd>
            </div>
            <div>
              <dt>What changes</dt>
              <dd>{current.change}</dd>
            </div>
          </dl>
          <div className="uc-focus__media">
            <Image
              src={current.image}
              alt={current.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 960px) 100vw, 32rem"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
