"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitContactForm, type ContactFormState } from "@/app/actions/contact";
import { hiringAreas, type HiringAreaId } from "@/lib/careers";

const initialState: ContactFormState = { ok: false };

const errorMessages: Record<string, string> = {
  name: "Please enter your first and last name.",
  email: "Please enter a valid email address.",
  product: "Please choose an area.",
  message: "Please describe something you have built and why it was hard.",
  generic: "Something went wrong sending that. Email makwan@spectr.no and we will pick it up.",
};

const areaOptions: { id: HiringAreaId | "students" | "other"; label: string }[] = [
  ...hiringAreas.map((area) => ({ id: area.id, label: `${area.name} — ${area.summary}` })),
  { id: "students", label: "Students and early talent" },
  { id: "other", label: "Another overlap — tell us in the letter" },
];

export function CareerApplyForm({ defaultArea = "" }: { defaultArea?: string }) {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);
  const matched = areaOptions.find((option) => option.id === defaultArea);

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

      <Field label="Area" htmlFor="product" required>
        <select
          id="product"
          name="product"
          required
          defaultValue={matched ? `Careers — ${matched.label}` : ""}
        >
          <option value="" disabled>
            Select an area
          </option>
          {areaOptions.map((option) => (
            <option key={option.id} value={`Careers — ${option.label}`}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="First name" htmlFor="firstName" required>
          <input id="firstName" name="firstName" type="text" required autoComplete="given-name" />
        </Field>
        <Field label="Last name" htmlFor="lastName" required>
          <input id="lastName" name="lastName" type="text" required autoComplete="family-name" />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Email" htmlFor="email" required>
          <input id="email" name="email" type="email" required autoComplete="email" />
        </Field>
        <Field label="Phone" htmlFor="phone">
          <input id="phone" name="phone" type="tel" autoComplete="tel" />
        </Field>
      </div>

      <Field label="Where you are based" htmlFor="country">
        <input id="country" name="country" type="text" autoComplete="country-name" />
      </Field>

      <Field label="Link to work — GitHub, portfolio, paper, or deployment" htmlFor="workUrl">
        <input id="workUrl" name="workUrl" type="url" inputMode="url" placeholder="https://" />
      </Field>

      <Field label="Describe something you have built and why it was hard" htmlFor="message" required>
        <textarea
          id="message"
          name="message"
          required
          rows={8}
          placeholder="A system, a deployment, a product. What made it difficult, and what did you do?"
        />
      </Field>

      {state.ok ? (
        <p role="status" className="border border-emerald-700/30 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Thanks — that is with us. We read speculative applications properly and reply within a few working days.
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
        className="inline-flex items-center justify-center border border-[#0A0A0A] bg-[#0A0A0A] px-[22px] py-[11px] text-sm font-semibold text-white transition-colors hover:bg-[#262626] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Submitting…" : "Send application"}
      </button>

      <p className="text-xs leading-6 text-[#6B6B72]">
        We will use this to consider you for Spectr. See our{" "}
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
