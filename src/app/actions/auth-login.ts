"use server";

import type { User } from "@supabase/supabase-js";
import type { AccountKind } from "@/lib/auth/account";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  isAdminEmail,
  isAdminIdentifier,
} from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function prepareAdminLogin(input: {
  identifier: string;
  password: string;
}): Promise<{ ok: boolean; email?: string; error?: string }> {
  if (!isAdminIdentifier(input.identifier)) {
    return { ok: false, error: "not-admin" };
  }
  if (input.password !== ADMIN_PASSWORD) {
    return { ok: false, error: "Incorrect email or password." };
  }

  try {
    const admin = createAdminClient();
    const existing = await findUserByEmail(admin, ADMIN_EMAIL);
    let user = existing;

    if (!user) {
      const created = await admin.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: {
          full_name: "Makwan",
          product_access: true,
          careers_access: true,
        },
      });
      if (created.error || !created.data.user) {
        return { ok: false, error: created.error?.message ?? "Could not create the admin account." };
      }
      user = created.data.user;
    } else {
      const updated = await admin.auth.admin.updateUserById(user.id, {
        password: ADMIN_PASSWORD,
        email_confirm: true,
      });
      if (updated.error) {
        return { ok: false, error: updated.error.message };
      }
    }

    await admin.from("profiles").upsert({
      id: user.id,
      email: ADMIN_EMAIL,
      full_name: "Makwan",
      country: "Norway",
      product_access: true,
      careers_access: true,
      os_download_granted: true,
    });

    return { ok: true, email: ADMIN_EMAIL };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not prepare the admin account.",
    };
  }
}

export async function resolveLoginNext(input: {
  email: string;
  kind: AccountKind;
  fallback: string;
}) {
  if (input.kind === "product" && isAdminEmail(input.email)) return "/admin";
  return input.fallback;
}

async function findUserByEmail(
  admin: ReturnType<typeof createAdminClient>,
  email: string,
): Promise<User | null> {
  const target = email.toLowerCase();
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) return null;
    const found = data.users.find((row) => row.email?.toLowerCase() === target);
    if (found) return found;
    if (data.users.length < 200) return null;
  }
  return null;
}
