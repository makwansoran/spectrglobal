"use client";

import Link from "next/link";
import { useState } from "react";

const PREVIEW =
  "One OS across manufacturing, logistics, and waste management.";

export function IndustriesExpandButton() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`industries-expand ${open ? "industries-expand--open" : ""}`}
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
        className="industries-expand__shell"
        aria-expanded={open}
        aria-label="Industries"
      >
        <span className="industries-expand__label">Industries</span>

        <div className="industries-expand__body" aria-hidden={!open}>
          <div className="industries-expand__preview" />
          <p className="industries-expand__text">{PREVIEW}</p>
        </div>
      </Link>
    </div>
  );
}
