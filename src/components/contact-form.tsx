"use client";

import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { BevelButton } from "@/components/bevel-button";
import { submitContactForm, type ContactFormState } from "@/app/actions/contact";

const initialState: ContactFormState = { ok: false };

export function ContactForm() {
  const t = useTranslations("Contact");
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!role) return;
    setMessage(t("rolePrefill", { role: role.replace(/-/g, " ") }));
  }, [role, t]);

  const errorMessage = state.error
    ? ({
        name: t("errorName"),
        email: t("errorEmail"),
        product: t("errorProduct"),
        message: t("errorMessage"),
        generic: t("errorGeneric"),
      }[state.error] ?? t("errorGeneric"))
    : null;

  return (
    <form action={formAction} className="mt-12 space-y-6">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <Field label={t("name")}>
        <input name="name" type="text" required autoComplete="name" />
      </Field>

      <Field label={t("organization")}>
        <input name="organization" type="text" autoComplete="organization" />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label={t("email")}>
          <input name="email" type="email" required autoComplete="email" />
        </Field>
        <Field label={t("phone")}>
          <input name="phone" type="tel" autoComplete="tel" />
        </Field>
      </div>

      <Field label={t("product")}>
        <select name="product" required defaultValue="">
          <option value="" disabled>
            {t("selectProduct")}
          </option>
          <option value="general">{t("general")}</option>
        </select>
      </Field>

      <Field label={t("message")}>
        <textarea name="message" required rows={6} value={message} onChange={(event) => setMessage(event.target.value)} />
      </Field>

      {state.ok ? (
        <p role="status" className="text-sm text-fg">
          {t("success")}
        </p>
      ) : null}

      {errorMessage ? (
        <p role="alert" className="text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <BevelButton type="submit" size="form" disabled={pending}>
        {pending ? t("submitting") : t("submit")}
      </BevelButton>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label block">{label}</span>
      <div className="mt-3 [&_input]:w-full [&_input]:border [&_input]:border-border [&_input]:bg-bg [&_input]:px-4 [&_input]:py-3 [&_input]:text-base [&_input]:outline-none [&_input]:focus:border-fg [&_select]:w-full [&_select]:appearance-none [&_select]:border [&_select]:border-border [&_select]:bg-bg [&_select]:px-4 [&_select]:py-3 [&_select]:text-base [&_select]:outline-none [&_select]:focus:border-fg [&_textarea]:w-full [&_textarea]:resize-none [&_textarea]:border [&_textarea]:border-border [&_textarea]:bg-bg [&_textarea]:px-4 [&_textarea]:py-3 [&_textarea]:text-base [&_textarea]:outline-none [&_textarea]:focus:border-fg">
        {children}
      </div>
    </label>
  );
}
