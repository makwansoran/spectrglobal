"use server";

import { saveWaitlistSignup } from "@/lib/leads";

export type WaitlistErrorCode = "name" | "email" | "country" | "company" | "purpose" | "generic";

export type WaitlistFormState = {
  ok: boolean;
  error?: WaitlistErrorCode;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function submitWaitlistForm(
  _prev: WaitlistFormState,
  formData: FormData,
): Promise<WaitlistFormState> {
  const website = String(formData.get("website") ?? "");
  if (website) {
    return { ok: true };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const purpose = String(formData.get("purpose") ?? "").trim();

  if (!name) return { ok: false, error: "name" };
  if (!email || !isValidEmail(email)) return { ok: false, error: "email" };
  if (!country) return { ok: false, error: "country" };
  if (!company) return { ok: false, error: "company" };
  if (!purpose) return { ok: false, error: "purpose" };

  await saveWaitlistSignup({ name, email, country, company, purpose });

  const to = process.env.CONTACT_TO_EMAIL ?? "makwan@spectr.no";
  const from = process.env.CONTACT_FROM_EMAIL ?? "Spectr Website <onboarding@resend.dev>";
  const apiKey = process.env.RESEND_API_KEY;
  const subject = "Spectr OS waitlist";
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Where from: ${country}`,
    `Company: ${company}`,
    "",
    "What they will use it for:",
    purpose,
  ].join("\n");

  if (!apiKey) {
    console.info("[waitlist]", subject, body);
    return { ok: true };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject,
        text: body,
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return { ok: true };
  } catch (err) {
    console.error("[waitlist]", err);
    return { ok: false, error: "generic" };
  }
}
