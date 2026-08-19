import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

export function createClient() {
  return createBrowserClient<Database>(supabaseUrl(), supabaseAnonKey());
}
