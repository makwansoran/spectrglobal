"use server";

import type { AccountKind } from "@/lib/auth/account";
import { isAdminEmail } from "@/lib/auth/admin";

export async function resolveLoginNext(input: {
  email: string;
  kind: AccountKind;
  fallback: string;
}) {
  if (input.kind === "product" && isAdminEmail(input.email)) return "/admin";
  return input.fallback;
}
