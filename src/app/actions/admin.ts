"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/local-session";
import { createAdminClient } from "@/lib/supabase/admin";

export async function setOsDownloadGranted(formData: FormData) {
  await requireAdminSession();
  const userId = String(formData.get("userId") ?? "");
  const granted = String(formData.get("granted") ?? "") === "true";
  if (!userId) return;

  const admin = createAdminClient();
  await admin.from("profiles").update({ os_download_granted: granted }).eq("id", userId);
  revalidatePath("/admin");
}
