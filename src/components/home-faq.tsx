"use client";

import { useState } from "react";
import { BevelButton } from "@/components/bevel-button";

export type FaqItem = {
  question: string;
  answer: string;
};

type HomeFaqProps = {
  title: string;
  items: FaqItem[];
  contactLabel: string;
};

export function HomeFaq({ title, items, contactLabel }: HomeFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="brand-font bg-bg px-5 py-24 sm:px-8 lg:px-16 lg:py-32">
      <div className="mx-auto grid w-full max-w-[88rem] gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <h2 className="max-w-md text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-fg sm:text-5xl">
          {title}
        </h2>
        <div className="divide-y divide-border border-y border-border">
          {items.map((item, index) => {
            const open = openIndex === index;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="flex w-full items-start justify-between gap-6 py-6 text-left"
                >
                  <span className="text-lg font-semibold tracking-[-0.03em] text-fg sm:text-xl">
                    {item.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-1 font-mono text-sm text-muted"
                  >
                    {open ? "−" : "+"}
                  </span>
                </button>
                {open ? (
                  <div className="pb-6 pr-10 text-base leading-8 text-muted">
                    <p>{item.answer}</p>
                    {index === items.length - 1 ? (
                      <BevelButton href="/contact" className="mt-6">
                        {contactLabel}
                        <span aria-hidden="true">→</span>
                      </BevelButton>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
