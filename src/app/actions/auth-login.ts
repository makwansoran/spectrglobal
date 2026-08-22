"use server";

import type { AccountKind } from "@/lib/auth/account";
import { isAdminEmail } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function finishPasswordLogin(input: {
  accessToken?: string;
  kind: AccountKind;
}): Promise<{ skipOtp: boolean; next?: string }> {
  if (!input.accessToken) return { skipOtp: false };

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.auth.getUser(input.accessToken);
    const user = data.user;
    if (error || !user?.email || !isAdminEmail(user.email)) {
      return { skipOtp: false };
    }

    await admin
      .from("profiles")
      .update({
        product_access: true,
        careers_access: true,
        os_download_granted: true,
      })
      .eq("id", user.id);

    return { skipOtp: true, next: "/admin" };
  } catch {
    return { skipOtp: false };
  }
}
