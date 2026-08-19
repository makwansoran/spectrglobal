"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { submitContactForm, type ContactFormState } from "@/app/actions/contact";
import { Button } from "@/components/button";
import { useGetStarted, type GetStartedTab } from "@/components/get-started-context";

const initialState: ContactFormState = { ok: false };

const inquiryOptions: { id: GetStartedTab; label: string }[] = [
  { id: "contact", label: "Contact / Demo Request" },
  { id: "partnership", label: "Partnership Inquiry" },
  { id: "investor", label: "Investor Relations" },
];

const countries = [
  "Norway",
  "Sweden",
  "Denmark",
  "Finland",
  "United Kingdom",
  "Germany",
  "France",
  "Netherlands",
  "United States",
  "Canada",
  "Other",
];

const errorMessages: Record<string, string> = {
  name: "Please enter your first and last name.",
  email: "Please enter a valid business email address.",
  product: "Please choose an inquiry type.",
  message: "Please tell us a bit about your project.",
  generic: "Something went wrong sending that. Email makwan@spectr.no and we will pick it up.",
};

export function GetStartedSidebar() {
  const { open, tab, closeGetStarted } = useGetStarted();
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);

  useEffect(() => {
    if (state.ok) {
      const timer = window.setTimeout(() => closeGetStarted(), 2200);
      return () => window.clearTimeout(timer);
    }
  }, [state.ok, closeGetStarted]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Get Started">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close get started panel"
        onClick={closeGetStarted}
      />

      <aside className="get-started-panel absolute inset-y-0 right-0 flex w-full max-w-[42rem] flex-col border-l border-border bg-bg text-fg shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 sm:px-6">
          <p className="text-sm font-medium text-muted">Get started</p>
          <button
            type="button"
            onClick={closeGetStarted}
            aria-label="Close"
            className="btn bevel-button btn-icon btn-on-dark"
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

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
          <h2 className="brand-font text-2xl tracking-tight text-fg sm:text-3xl">
            Interested in solving your problems with Spectr software?
          </h2>

          <form action={formAction} className="mt-8 space-y-5" key={tab}>
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <Field label="Inquiry type" htmlFor="product" required>
              <select id="product" name="product" required defaultValue={inquiryOptions.find((o) => o.id === tab)?.label ?? ""}>
                <option value="" disabled>
                  Select...
                </option>
                {inquiryOptions.map((option) => (
                  <option key={option.id} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="First Name" htmlFor="firstName" required>
                <input id="firstName" name="firstName" type="text" required autoComplete="given-name" />
              </Field>
              <Field label="Last Name" htmlFor="lastName" required>
                <input id="lastName" name="lastName" type="text" required autoComplete="family-name" />
              </Field>
            </div>

            <Field label="Business Email Address" htmlFor="email" required>
              <input id="email" name="email" type="email" required autoComplete="email" />
            </Field>

            <Field label="Phone Number" htmlFor="phone" required>
              <input id="phone" name="phone" type="tel" required autoComplete="tel" />
            </Field>

            <Field label="Job Title" htmlFor="jobTitle" required>
              <input id="jobTitle" name="jobTitle" type="text" required autoComplete="organization-title" />
            </Field>

            <Field label="Company / Institution" htmlFor="organization" required>
              <input
                id="organization"
                name="organization"
                type="text"
                required
                autoComplete="organization"
              />
            </Field>

            <Field label="Country" htmlFor="country" required>
              <select id="country" name="country" required defaultValue="">
                <option value="" disabled>
                  Select...
                </option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Tell us about your project" htmlFor="message" required>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="A bit of context will allow us to connect you to the right team faster."
              />
            </Field>

            {state.ok ? (
              <p
                role="status"
                className="border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
              >
                Thanks — that is with us. We reply within one working day.
              </p>
            ) : null}

            {state.error ? (
              <p
                role="alert"
                className="border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-300"
              >
                {errorMessages[state.error] ?? errorMessages.generic}
              </p>
            ) : null}

            <Button type="submit" size="lg" disabled={pending || state.ok}>
              {pending ? "Submitting…" : "Submit"}
            </Button>

            <p className="text-xs leading-6 text-muted">
              Please see our{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-fg" onClick={closeGetStarted}>
                Privacy Policy
              </Link>{" "}
              regarding how we will handle this information.
            </p>
          </form>
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label">
        {required ? "* " : null}
        {label}
        {required ? ":" : null}
      </label>
      <div className="mt-2 [&_input]:w-full [&_input]:border [&_input]:border-border [&_input]:bg-surface [&_input]:px-3.5 [&_input]:py-2.5 [&_input]:text-[15px] [&_input]:outline-none [&_input]:focus:border-white [&_select]:w-full [&_select]:appearance-none [&_select]:border [&_select]:border-border [&_select]:bg-surface [&_select]:px-3.5 [&_select]:py-2.5 [&_select]:text-[15px] [&_select]:outline-none [&_select]:focus:border-white [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:border [&_textarea]:border-border [&_textarea]:bg-surface [&_textarea]:px-3.5 [&_textarea]:py-2.5 [&_textarea]:text-[15px] [&_textarea]:outline-none [&_textarea]:focus:border-white">
        {children}
      </div>
    </div>
  );
}
