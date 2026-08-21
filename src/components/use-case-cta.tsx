"use client";

import { useGetStarted } from "@/components/get-started-context";

export function UseCaseCta() {
  const { openGetStarted } = useGetStarted();

  return (
    <div className="uc-cta__actions">
      <button type="button" className="uc-btn" onClick={() => openGetStarted("contact")}>
        Get started
      </button>
      <button type="button" className="uc-btn uc-btn--ghost" onClick={() => openGetStarted("contact")}>
        Talk to Spectr
      </button>
    </div>
  );
}
