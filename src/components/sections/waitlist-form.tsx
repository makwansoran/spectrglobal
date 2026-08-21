"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { submitWaitlistForm, type WaitlistFormState } from "@/app/actions/waitlist";

const initialState: WaitlistFormState = { ok: false };

const errorMessages: Record<string, string> = {
  email: "Enter a valid email so we can reach you.",
  generic: "Something went wrong. Email makwan@spectr.no and we will add you.",
};

export function WaitlistForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(submitWaitlistForm, initialState);
  const titleId = useId();
  const emailId = useId();
  const nameId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (state.ok) {
      const timer = window.setTimeout(() => setOpen(false), 1600);
      return () => window.clearTimeout(timer);
    }
  }, [state.ok]);

  return (
    <>
      <button type="button" className="spectros-waitlist__join" onClick={() => setOpen(true)}>
        Join waitlist
      </button>

      {open ? (
        <div className="spectros-waitlist__dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
          <button
            type="button"
            className="spectros-waitlist__backdrop"
            aria-label="Close waitlist form"
            onClick={() => setOpen(false)}
          />
          <div className="spectros-waitlist__panel">
            <div className="spectros-waitlist__panel-head">
              <div>
                <h3 id={titleId}>Join the waitlist</h3>
                <p>We&apos;ll email you when spectrOs is ready.</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                className="spectros-waitlist__close"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                  <path
                    d="m5 5 10 10M15 5 5 15"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {state.ok ? (
              <p role="status" className="spectros-waitlist__status">
                You are on the list.
              </p>
            ) : (
              <form action={formAction}>
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />
                <div>
                  <label htmlFor={nameId}>Name</label>
                  <input id={nameId} name="name" type="text" autoComplete="name" />
                </div>
                <div>
                  <label htmlFor={emailId}>Email</label>
                  <input id={emailId} name="email" type="email" required autoComplete="email" />
                </div>
                {state.error ? (
                  <p role="alert" className="spectros-waitlist__error">
                    {errorMessages[state.error] ?? errorMessages.generic}
                  </p>
                ) : null}
                <button type="submit" className="spectros-waitlist__submit" disabled={pending}>
                  {pending ? "Joining…" : "Join waitlist"}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
