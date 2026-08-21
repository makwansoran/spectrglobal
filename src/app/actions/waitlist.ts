"use server";

export type WaitlistErrorCode = "email" | "generic";

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
  if (!email || !isValidEmail(email)) {
    return { ok: false, error: "email" };
  }

  const to = process.env.CONTACT_TO_EMAIL ?? "makwan@spectr.no";
  const from = process.env.CONTACT_FROM_EMAIL ?? "Spectr Website <onboarding@resend.dev>";
  const apiKey = process.env.RESEND_API_KEY;
  const subject = "spectrOs waitlist";
  const body = [
    name ? `Name: ${name}` : null,
    `Email: ${email}`,
    "",
    "Requested early access to spectrOs.",
  ]
    .filter(Boolean)
    .join("\n");

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
