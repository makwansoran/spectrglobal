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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faqs" className="brand-font bg-[#f8f8f8] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto w-full max-w-[55.5rem]">
        <h2 className="text-center text-3xl font-semibold tracking-[-0.05em] text-fg sm:text-4xl lg:text-[2.25rem]">
          {title}
        </h2>

        <ul className="mt-12 list-none p-0">
          {items.map((item, index) => {
            const open = openIndex === index;
            const isLast = index === items.length - 1;

            return (
              <li
                key={item.question}
                className={`relative border-t border-[#d4d4d4] ${isLast ? "border-b" : ""}`}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="flex w-full items-start justify-between gap-6 py-6 pr-10 text-left"
                >
                  <span className="text-xl font-semibold tracking-[-0.03em] text-[#0a0a0a] sm:text-[2.25rem] sm:leading-none">
                    {item.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`absolute right-0 top-7 transition-transform duration-300 ${
                      open ? "rotate-0" : "rotate-180"
                    }`}
                  >
                    <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M17.7295 9.18394C17.3518 9.58686 16.719 9.60726 16.3161 9.22954L9 2.37072L1.684 9.22954C1.281 9.60726 0.648195 9.58686 0.270395 9.18394C-0.107204 8.78102 -0.0868033 8.14818 0.315996 7.77046L8.31606 0.270395C8.70072 -0.0902051 9.29928 -0.090205 9.68394 0.270396L17.6839 7.77046C18.0869 8.14818 18.1073 8.78102 17.7295 9.18394Z"
                        fill="#0A0A0A"
                      />
                    </svg>
                  </span>
                </button>

                {open ? (
                  <div className="pb-6 pr-10">
                    <p className="text-lg leading-[1.45] text-[#0a0a0a] sm:text-xl sm:leading-[1.3]">
                      {item.answer}
                    </p>
                    {isLast ? (
                      <BevelButton href="/contact" className="mt-6 tracking-[0.16em]">
                        {contactLabel}
                        <span aria-hidden="true">→</span>
                      </BevelButton>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
