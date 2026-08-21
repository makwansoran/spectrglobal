"use server";

export type ContactErrorCode = "name" | "email" | "product" | "message" | "generic";

export type ContactFormState = {
  ok: boolean;
  error?: ContactErrorCode;
};

type ContactPayload = {
  firstName: string;
  lastName: string;
  organization?: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  country?: string;
  product: string;
  message: string;
  website?: string;
  workUrl?: string;
};

function validate(payload: ContactPayload): ContactErrorCode | null {
  if (payload.website) return null;
  if (!payload.firstName.trim() || !payload.lastName.trim()) return "name";
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
  const firstName = String(formData.get("firstName") ?? "");
  const lastName = String(formData.get("lastName") ?? "");
  const legacyName = String(formData.get("name") ?? "");

  const payload: ContactPayload = {
    firstName: firstName || legacyName.split(" ")[0] || "",
    lastName: lastName || legacyName.split(" ").slice(1).join(" ") || legacyName,
    organization: String(formData.get("organization") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    jobTitle: String(formData.get("jobTitle") ?? ""),
    country: String(formData.get("country") ?? ""),
    product: String(formData.get("product") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
    workUrl: String(formData.get("workUrl") ?? ""),
  };

  const error = validate(payload);
  if (error) {
    return { ok: false, error };
  }

  const to = process.env.CONTACT_TO_EMAIL ?? "makwan@spectr.no";
  const from = process.env.CONTACT_FROM_EMAIL ?? "Spectr Website <onboarding@resend.dev>";
  const apiKey = process.env.RESEND_API_KEY;

  const name = `${payload.firstName} ${payload.lastName}`.trim();
  const subject = payload.product.startsWith("Careers")
    ? `Spectr careers — ${payload.product}`
    : `Spectr inquiry — ${payload.product}`;
  const body = [
    `Name: ${name}`,
    payload.jobTitle ? `Job title: ${payload.jobTitle}` : null,
    payload.organization ? `Company / Institution: ${payload.organization}` : null,
    payload.workUrl ? `Work link: ${payload.workUrl}` : null,
    payload.country ? `Country: ${payload.country}` : null,
    `Email: ${payload.email}`,
    payload.phone ? `Phone: ${payload.phone}` : null,
    `Inquiry: ${payload.product}`,
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
