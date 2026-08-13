"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const PREVIEW =
  "The operating system for the enterprise — data fusion, decision making, and agentic workflows in one runtime.";

export function SpectrOsExpandButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative h-[3.25rem] w-[9.5rem] shrink-0">
      <div
        className={`spectr-os-expand ${open ? "spectr-os-expand--open" : ""}`}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocusCapture={() => setOpen(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setOpen(false);
          }
        }}
      >
        <Link
          href="/platforms/spectr-os"
          className="spectr-os-expand__shell"
          aria-expanded={open}
          aria-label="Spectr OS"
        >
          <span className="spectr-os-expand__label">Spectr OS</span>

          <div className="spectr-os-expand__body" aria-hidden={!open}>
            <div className="spectr-os-expand__preview">
              <Image
                src="/images/products/spectr-os-ui.png"
                alt="Spectr OS interface preview"
                fill
                className="object-cover object-top"
                sizes="360px"
                priority={false}
              />
            </div>
            <p className="spectr-os-expand__text">{PREVIEW}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
