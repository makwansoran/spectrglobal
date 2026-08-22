"use server";

import { createHash, randomInt } from "node:crypto";
import type { AccountKind } from "@/lib/auth/account";
import { buildOtpEmailHtml, otpEmailCopy, otpLogoUrl } from "@/lib/auth/otp-email";
import { createAdminClient } from "@/lib/supabase/admin";

export type AuthOtpResult = {
  ok: boolean;
  error?: string;
  tokenHash?: string;
};

type Purpose = "login" | "signup";

function hashCode(email: string, code: string) {
  return createHash("sha256").update(`${email}:${code}`).digest("hex");
}

function randomCode() {
  return String(randomInt(100000, 1000000));
}

export async function sendAuthOtp(input: {
  email: string;
  kind: AccountKind;
  purpose: Purpose;
}): Promise<AuthOtpResult> {
  const email = input.email.trim().toLowerCase();
  const code = randomCode();
  const copy = otpEmailCopy(input.kind, input.purpose);

  try {
    const admin = createAdminClient();
    await admin.from("email_otps").delete().eq("email", email).eq("purpose", input.purpose);
    const { error } = await admin.from("email_otps").insert({
      email,
      code_hash: hashCode(email, code),
      kind: input.kind,
      purpose: input.purpose,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });
    if (error) {
      return { ok: false, error: error.message };
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL ?? "Spectr <onboarding@resend.dev>";
    const html = buildOtpEmailHtml({
      code,
      heading: copy.heading,
      intro: copy.intro,
      accountLabel: copy.accountLabel,
      logoUrl: otpLogoUrl(),
    });
    const text = `${copy.heading}\n\n${copy.intro}\n\nCode: ${code}\n`;

    if (!apiKey) {
      console.info("[auth-otp]", email, code);
      return { ok: true };
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: `${copy.accountLabel}: ${code} is your authentication code`,
        html,
        text,
      }),
    });

    if (!response.ok) {
      return { ok: false, error: "Could not send the authentication email." };
    }

    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not send the code.";
    return { ok: false, error: message };
  }
}

export async function verifyAuthOtp(input: {
  email: string;
  code: string;
  kind: AccountKind;
  purpose: Purpose;
}): Promise<AuthOtpResult> {
  const email = input.email.trim().toLowerCase();
  const code = input.code.trim();
  if (!/^\d{6}$/.test(code)) {
    return { ok: false, error: "Enter the 6-digit code from your email." };
  }

  try {
    const admin = createAdminClient();
    const { data: rows, error } = await admin
      .from("email_otps")
      .select("id, code_hash, expires_at, kind")
      .eq("email", email)
      .eq("purpose", input.purpose)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) return { ok: false, error: error.message };
    const row = rows?.[0];
    if (!row || row.code_hash !== hashCode(email, code)) {
      return { ok: false, error: "That code is not valid." };
    }
    if (new Date(row.expires_at).getTime() < Date.now()) {
      return { ok: false, error: "That code has expired. Send a new one." };
    }

    await admin.from("email_otps").delete().eq("id", row.id);

    let userId = await findUserIdByEmail(admin, email);
    if (!userId) {
      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          product_access: input.kind === "product",
          careers_access: input.kind === "careers",
        },
        password: `${crypto.randomUUID()}Aa1!`,
      });
      if (createError || !created.user) {
        return { ok: false, error: createError?.message ?? "Could not create that account." };
      }
      userId = created.user.id;
    }

    await upsertAccess(admin, userId, email, input.kind);

    const { data: link, error: linkError } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    const tokenHash = link?.properties?.hashed_token;
    if (linkError || !tokenHash) {
      return { ok: false, error: linkError?.message ?? "Could not start your session." };
    }

    return { ok: true, tokenHash };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not verify the code.";
    return { ok: false, error: message };
  }
}

async function findUserIdByEmail(admin: ReturnType<typeof createAdminClient>, email: string) {
  const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  return data.users.find((user) => user.email?.toLowerCase() === email)?.id;
}

async function upsertAccess(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
  email: string,
  kind: AccountKind,
) {
  const { data: existing } = await admin
    .from("profiles")
    .select("product_access, careers_access, os_download_granted, full_name, country")
    .eq("id", userId)
    .maybeSingle();
  await admin.from("profiles").upsert({
    id: userId,
    email,
    full_name: existing?.full_name ?? "",
    country: existing?.country ?? "",
    product_access: Boolean(existing?.product_access) || kind === "product",
    careers_access: Boolean(existing?.careers_access) || kind === "careers",
    os_download_granted: Boolean(existing?.os_download_granted),
  });
}
