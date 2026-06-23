"use server";

export type ContactErrorCode = "name" | "email" | "product" | "message" | "generic";

export type ContactFormState = {
  ok: boolean;
  error?: ContactErrorCode;
};

type ContactPayload = {
  name: string;
  organization?: string;
  email: string;
  phone?: string;
  product: string;
  message: string;
  website?: string;
};

function validate(payload: ContactPayload): ContactErrorCode | null {
  if (payload.website) return null;
  if (!payload.name.trim()) return "name";
  if (!payload.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return "email";
  }
  if (!payload.product.trim()) return "product";
  if (!payload.message.trim()) return "message";
  return null;
}

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const payload: ContactPayload = {
    name: String(formData.get("name") ?? ""),
    organization: String(formData.get("organization") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    product: String(formData.get("product") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  };

  const error = validate(payload);
  if (error) {
    return { ok: false, error };
  }

  const to = process.env.CONTACT_TO_EMAIL ?? "makwan@spectr.no";
  const from = process.env.CONTACT_FROM_EMAIL ?? "Spectr Website <onboarding@resend.dev>";
  const apiKey = process.env.RESEND_API_KEY;

  const subject = `Spectr inquiry — ${payload.product}`;
  const body = [
    `Name: ${payload.name}`,
    payload.organization ? `Organization: ${payload.organization}` : null,
    `Email: ${payload.email}`,
    payload.phone ? `Phone: ${payload.phone}` : null,
    `Product: ${payload.product}`,
    "",
    payload.message,
  ]
    .filter(Boolean)
    .join("\n");

  if (!apiKey) {
    console.info("[contact]", subject, body);
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
        reply_to: payload.email,
        subject,
        text: body,
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return { ok: true };
  } catch (err) {
    console.error("[contact]", err);
    return { ok: false, error: "generic" };
  }
}
