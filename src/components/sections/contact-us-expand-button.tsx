"use client";

import { useActionState, useState } from "react";
import { submitContactForm, type ContactFormState } from "@/app/actions/contact";
import { FormSuccess } from "@/components/form-success";

const initialState: ContactFormState = { ok: false };

const INTRO = "Tell us about your operation — we reply within one working day.";

export function ContactUsExpandButton() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);

  return (
    <div
      className={`contact-us-expand ${open ? "contact-us-expand--open" : ""}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <div className="contact-us-expand__shell" aria-expanded={open}>
        <span className="contact-us-expand__label">Contact us</span>

        <div className="contact-us-expand__body" aria-hidden={!open}>
          <p className="contact-us-expand__text">{INTRO}</p>

          {state.ok ? (
            <FormSuccess tone="light" />
          ) : (
            <form action={formAction} className="contact-us-expand__form">
              <input type="hidden" name="product" value="Contact / Demo Request" />
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div className="contact-us-expand__row">
                <input
                  name="firstName"
                  type="text"
                  required
                  placeholder="First name"
                  autoComplete="given-name"
                />
                <input
                  name="lastName"
                  type="text"
                  required
                  placeholder="Last name"
                  autoComplete="family-name"
                />
              </div>
              <input
                name="email"
                type="email"
                required
                placeholder="Business email"
                autoComplete="email"
              />
              <textarea
                name="message"
                required
                rows={3}
                placeholder="How can we help?"
              />

              {state.error ? (
                <p className="contact-us-expand__error" role="alert">
                  Please check the form and try again.
                </p>
              ) : null}

              <button type="submit" disabled={pending} className="contact-us-expand__submit">
                {pending ? "Sending…" : "Send"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
