import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "@/lib/supabase/env";

export function createAdminClient() {
  const url = supabaseUrl();
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url || !key) {
    throw new Error("Supabase admin is not configured.");
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
