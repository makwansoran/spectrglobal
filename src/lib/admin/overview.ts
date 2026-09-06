import { createAdminClient } from "@/lib/supabase/admin";

export type AdminProfile = {
  id: string;
  email: string;
  full_name: string | null;
  os_download_granted: boolean;
  created_at: string;
};

export async function loadAdminUsers() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, email, full_name, os_download_granted, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw error;
  return (data ?? []) as AdminProfile[];
}

export function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}
