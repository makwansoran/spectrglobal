"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitWaitlistForm, type WaitlistFormState } from "@/app/actions/waitlist";
import { countries } from "@/lib/countries";

const initialState: WaitlistFormState = { ok: false };

const errorMessages: Record<string, string> = {
  name: "Enter your name.",
  email: "Enter a valid email so we can reach you.",
  country: "Tell us where you are from.",
  company: "Enter the company you work at.",
  purpose: "Tell us what you will use Spectr OS for.",
  generic: "Something went wrong. Email makwan@spectr.no and we will add you.",
};

export function WaitlistForm() {
  const [state, formAction, pending] = useActionState(submitWaitlistForm, initialState);

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

      <Field label="Name" htmlFor="waitlist-name" required>
        <input id="waitlist-name" name="name" type="text" required autoComplete="name" />
      </Field>

      <Field label="Email" htmlFor="waitlist-email" required>
        <input id="waitlist-email" name="email" type="email" required autoComplete="email" />
      </Field>

      <Field label="Where you are from" htmlFor="waitlist-country" required>
        <select id="waitlist-country" name="country" required defaultValue="">
          <option value="" disabled>
            Select a country
          </option>
          {countries.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Company you work at" htmlFor="waitlist-company" required>
        <input
          id="waitlist-company"
          name="company"
          type="text"
          required
          autoComplete="organization"
        />
      </Field>

      <Field label="What you will use it for" htmlFor="waitlist-purpose" required>
        <textarea
          id="waitlist-purpose"
          name="purpose"
          required
          rows={6}
          placeholder="The site, the work, and what you want Spectr OS to do."
        />
      </Field>

      {state.ok ? (
        <p role="status" className="border border-emerald-700/30 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          You are on the list. We will email you when Spectr OS is ready.
        </p>
      ) : null}

      {state.error ? (
        <p role="alert" className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessages[state.error] ?? errorMessages.generic}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || state.ok}
        className="inline-flex w-full items-center justify-center border border-[#0A0A0A] bg-[#0A0A0A] px-[22px] py-[12px] text-sm font-semibold text-white transition-colors hover:bg-[#262626] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {pending ? "Joining…" : "Join waitlist"}
      </button>

      <p className="text-xs leading-6 text-[#6B6B72]">
        We will only use this to tell you when Spectr OS is ready. See our{" "}
        <Link href="/privacy" className="underline underline-offset-4 hover:text-[#0A0A0A]">
          privacy policy
        </Link>
        .
      </p>
    </form>
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
      <label htmlFor={htmlFor} className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#6B6B72]">
        {required ? "* " : null}
        {label}
      </label>
      <div className="mt-2 [&_input]:w-full [&_input]:border [&_input]:border-[#D2D2CE] [&_input]:bg-white [&_input]:px-3.5 [&_input]:py-2.5 [&_input]:text-[15px] [&_input]:outline-none [&_input]:focus:border-[#0A0A0A] [&_select]:w-full [&_select]:appearance-none [&_select]:border [&_select]:border-[#D2D2CE] [&_select]:bg-white [&_select]:px-3.5 [&_select]:py-2.5 [&_select]:text-[15px] [&_select]:outline-none [&_select]:focus:border-[#0A0A0A] [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:border [&_textarea]:border-[#D2D2CE] [&_textarea]:bg-white [&_textarea]:px-3.5 [&_textarea]:py-2.5 [&_textarea]:text-[15px] [&_textarea]:outline-none [&_textarea]:focus:border-[#0A0A0A]">
        {children}
      </div>
    </div>
  );
}
