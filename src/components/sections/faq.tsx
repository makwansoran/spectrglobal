"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { faqSection, faqs } from "@/lib/content";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section scroll-mt-20">
      <div className="container-x">
        <SectionHeading title={faqSection.title} />

        <Reveal className="mx-auto mt-14 max-w-3xl">
          <dl className="divide-y divide-border overflow-hidden rounded-[22px] border border-border">
            {faqs.map((faq, index) => {
              const expanded = open === index;
              return (
                <div key={faq.question} className="bg-surface">
                  <dt>
                    <button
                      type="button"
                      onClick={() => setOpen(expanded ? null : index)}
                      aria-expanded={expanded}
                      aria-controls={`faq-answer-${index}`}
                      className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left hover:bg-surface-2 sm:px-8"
                    >
                      <span className="brand-font text-base font-medium tracking-tight text-fg">
                        {faq.question}
                      </span>
                      <PlusIcon expanded={expanded} />
                    </button>
                  </dt>
                  <dd
                    id={`faq-answer-${index}`}
                    hidden={!expanded}
                    className="px-6 pb-7 text-sm leading-7 text-muted sm:px-8"
                  >
                    {faq.answer}
                  </dd>
                </div>
              );
            })}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

function PlusIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${
        expanded ? "rotate-45 text-accent" : ""
      }`}
      fill="none"
      aria-hidden="true"
    >
      <path d="M10 3.5v13M3.5 10h13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
