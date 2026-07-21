"use client";

import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

export function ProductFaq({ title, items }: { title: string; items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div>
      <h2 className="brand-font text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{title}</h2>
      <div className="mt-10 divide-y divide-border border-y border-border">
        {items.map((item, index) => {
          const open = openIndex === index;
          return (
            <div key={item.question}>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenIndex(open ? -1 : index)}
                className="flex w-full items-start justify-between gap-6 py-6 text-left"
              >
                <span className="text-lg font-medium leading-snug text-fg">{item.question}</span>
                <span
                  aria-hidden
                  className={`mt-1 shrink-0 text-muted transition-transform ${open ? "rotate-45" : ""}`}
                >
                  +
                </span>
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="pb-6 text-base leading-8 text-muted">{item.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
