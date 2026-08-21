"use client";

import { useActionState } from "react";
import { submitWaitlistForm, type WaitlistFormState } from "@/app/actions/waitlist";
import { Button } from "@/components/button";

const initialState: WaitlistFormState = { ok: false };

const errorMessages: Record<string, string> = {
  email: "Enter a valid email so we can reach you.",
  generic: "Something went wrong. Email makwan@spectr.no and we will add you.",
};

export function WaitlistForm() {
  const [state, formAction, pending] = useActionState(submitWaitlistForm, initialState);

  if (state.ok) {
    return (
      <p role="status" className="max-w-md text-[15px] leading-7 text-[#111111]">
        You are on the list. We will email you when spectrOs is ready.
      </p>
    );
  }

  return (
    <form action={formAction} className="spectros-waitlist__form">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <label htmlFor="spectros-waitlist-email" className="sr-only">
        Email address
      </label>
      <input
        id="spectros-waitlist-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Work email"
        disabled={pending}
      />
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Joining…" : "Join the waitlist"}
      </Button>
      {state.error ? (
        <p role="alert" className="spectros-waitlist__error">
          {errorMessages[state.error] ?? errorMessages.generic}
        </p>
      ) : null}
    </form>
  );
}
