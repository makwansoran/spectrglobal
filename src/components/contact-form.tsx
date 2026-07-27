"use client";

import { useActionState } from "react";
import { Button } from "@/components/button";
import { submitContactForm, type ContactFormState } from "@/app/actions/contact";

const initialState: ContactFormState = { ok: false };

const errorMessages: Record<string, string> = {
  name: "Please tell us your name.",
  email: "Please enter a valid email address.",
  product: "Please choose what this is about.",
  message: "Please add a short message.",
  generic: "Something went wrong sending that. Email makwan@spectr.no and we will pick it up.",
};

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <input id="name" name="name" type="text" required autoComplete="name" />
        </Field>
        <Field label="Company" htmlFor="organization">
          <input id="organization" name="organization" type="text" autoComplete="organization" />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Email" htmlFor="email">
          <input id="email" name="email" type="email" required autoComplete="email" />
        </Field>
        <Field label="Phone" htmlFor="phone">
          <input id="phone" name="phone" type="tel" autoComplete="tel" />
        </Field>
      </div>

      <Field label="What is this about?" htmlFor="product">
        <select id="product" name="product" required defaultValue="">
          <option value="" disabled>
            Select a topic
          </option>
          <option value="Spectr OS">Getting Spectr OS</option>
          <option value="Metaphysics">Metaphysics</option>
          <option value="Partnership">Partnership</option>
          <option value="Press">Press</option>
          <option value="General">Something else</option>
        </select>
      </Field>

      <Field label="Message" htmlFor="message">
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell us about your operation — sites, order volume, what you run today."
        />
      </Field>

      {state.ok ? (
        <p role="status" className="border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Thanks — that is with us. We reply to everything within one working day.
        </p>
      ) : null}

      {state.error ? (
        <p role="alert" className="border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {errorMessages[state.error] ?? errorMessages.generic}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label">
        {label}
      </label>
      <div className="mt-3 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-border [&_input]:bg-surface [&_input]:px-4 [&_input]:py-3 [&_input]:text-[15px] [&_input]:outline-none [&_input]:focus:border-accent [&_select]:w-full [&_select]:appearance-none [&_select]:rounded-xl [&_select]:border [&_select]:border-border [&_select]:bg-surface [&_select]:px-4 [&_select]:py-3 [&_select]:text-[15px] [&_select]:outline-none [&_select]:focus:border-accent [&_textarea]:w-full [&_textarea]:resize-none [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-border [&_textarea]:bg-surface [&_textarea]:px-4 [&_textarea]:py-3 [&_textarea]:text-[15px] [&_textarea]:outline-none [&_textarea]:focus:border-accent">
        {children}
      </div>
    </div>
  );
}
