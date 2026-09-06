"use client";

import { useGetStarted } from "@/components/get-started-context";
import { useState } from "react";

const INTRO = "Tell us about your floor, plant, or network — we will help you start with Spectr OS.";

export function GetStartedExpandButton() {
  const { openGetStarted } = useGetStarted();
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`get-started-expand ${open ? "get-started-expand--open" : ""}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <button
        type="button"
        className="get-started-expand__shell"
        aria-expanded={open}
        onClick={() => openGetStarted("contact")}
      >
        <span className="get-started-expand__label">Get started</span>

        <div className="get-started-expand__body" aria-hidden={!open}>
          <p className="get-started-expand__text">{INTRO}</p>
          <span className="get-started-expand__cta">Start a conversation →</span>
        </div>
      </button>
    </div>
  );
}
