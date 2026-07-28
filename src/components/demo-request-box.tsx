"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitContactForm, type ContactFormState } from "@/app/actions/contact";
import { Button } from "@/components/button";
import { demoRequest } from "@/lib/content";

const initialState: ContactFormState = { ok: false };

const errorMessages: Record<string, string> = {
  name: "Please enter your first and last name.",
  email: "Please enter a valid business email address.",
  product: "Please choose an inquiry type.",
  message: "Please tell us a bit about your project.",
  generic: "Something went wrong sending that. Email makwan@spectr.no and we will pick it up.",
};

export function DemoRequestBox() {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);

  return (
    <div className="bevel-panel bevel-panel-muted mt-16 overflow-hidden sm:mt-20">
      <div className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:p-10">
        <div>
          <h2 className="brand-font text-[clamp(1.75rem,4vw,2.75rem)] leading-none tracking-tight text-fg">
            {demoRequest.title}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted sm:text-[15px] sm:leading-7">
            {demoRequest.body}
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />
          <input type="hidden" name="product" value="Contact / Demo Request" />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" htmlFor="demo-firstName" required>
              <input
                id="demo-firstName"
                name="firstName"
                type="text"
                required
                autoComplete="given-name"
              />
            </Field>
            <Field label="Last name" htmlFor="demo-lastName" required>
              <input
                id="demo-lastName"
                name="lastName"
                type="text"
                required
                autoComplete="family-name"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Business email" htmlFor="demo-email" required>
              <input id="demo-email" name="email" type="email" required autoComplete="email" />
            </Field>
            <Field label="Company / Institution" htmlFor="demo-organization">
              <input
                id="demo-organization"
                name="organization"
                type="text"
                autoComplete="organization"
              />
            </Field>
          </div>

          <Field label="Tell us about your project" htmlFor="demo-message" required>
            <textarea
              id="demo-message"
              name="message"
              required
              rows={4}
              placeholder="A bit of context helps us connect you to the right team faster."
            />
          </Field>

          {state.ok ? (
            <p
              role="status"
              className="border border-emerald-600/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800"
            >
              Thanks — that is with us. We reply within one working day.
            </p>
          ) : null}

          {state.error ? (
            <p role="alert" className="border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-800">
              {errorMessages[state.error] ?? errorMessages.generic}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" size="lg" disabled={pending || state.ok}>
              {pending ? "Submitting…" : demoRequest.submitLabel}
            </Button>
            <p className="max-w-xs text-xs leading-5 text-muted">
              Please see our{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-fg">
                Privacy Policy
              </Link>{" "}
              regarding how we will handle this information.
            </p>
          </div>
        </form>
      </div>
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
      <div className="mt-2 [&_input]:w-full [&_input]:border [&_input]:border-border [&_input]:bg-surface [&_input]:px-3.5 [&_input]:py-2.5 [&_input]:text-[15px] [&_input]:text-fg [&_input]:outline-none [&_input]:focus:border-fg [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:border [&_textarea]:border-border [&_textarea]:bg-surface [&_textarea]:px-3.5 [&_textarea]:py-2.5 [&_textarea]:text-[15px] [&_textarea]:text-fg [&_textarea]:outline-none [&_textarea]:focus:border-fg">
        {children}
      </div>
    </div>
  );
}
