import { createAdminClient } from "@/lib/supabase/admin";

export type AdminProfile = {
  id: string;
  email: string;
  full_name: string | null;
  product_access: boolean;
  careers_access: boolean;
  os_download_granted: boolean;
  created_at: string;
};

export type WaitlistRow = {
  id: string;
  name: string;
  email: string;
  country: string;
  company: string;
  purpose: string;
  created_at: string;
};

export type InquiryRow = {
  id: string;
  kind: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  organization: string;
  product: string;
  message: string;
  country: string;
  work_url: string;
  created_at: string;
};

async function countRows(admin: ReturnType<typeof createAdminClient>, table: string, filter?: { column: string; value: string | boolean }) {
  let query = admin.from(table).select("*", { count: "exact", head: true });
  if (filter) query = query.eq(filter.column, filter.value);
  const { count, error } = await query;
  return { count: count ?? 0, error };
}

export async function loadAdminOverview() {
  const admin = createAdminClient();

  const [
    profilesRes,
    waitlistRes,
    inquiriesRes,
    waitlistCount,
    inquiryCount,
    careerCount,
    spectrCount,
    careersLoginCount,
    osCount,
    accountCount,
  ] = await Promise.all([
    admin
      .from("profiles")
      .select("id, email, full_name, product_access, careers_access, os_download_granted, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
    admin.from("waitlist_signups").select("*").order("created_at", { ascending: false }).limit(100),
    admin.from("inquiries").select("*").order("created_at", { ascending: false }).limit(100),
    countRows(admin, "waitlist_signups"),
    countRows(admin, "inquiries"),
    countRows(admin, "inquiries", { column: "kind", value: "careers" }),
    countRows(admin, "profiles", { column: "product_access", value: true }),
    countRows(admin, "profiles", { column: "careers_access", value: true }),
    countRows(admin, "profiles", { column: "os_download_granted", value: true }),
    countRows(admin, "profiles"),
  ]);

  const profiles = (profilesRes.data ?? []) as AdminProfile[];
  const waitlist = (waitlistRes.data ?? []) as WaitlistRow[];
  const inquiries = (inquiriesRes.data ?? []) as InquiryRow[];
  const storageReady = !waitlistRes.error && !inquiriesRes.error && !waitlistCount.error;

  return {
    profiles,
    waitlist,
    careers: inquiries.filter((row) => row.kind === "careers"),
    contacts: inquiries.filter((row) => row.kind !== "careers"),
    storageReady,
    counts: {
      waitlist: waitlistCount.count,
      careers: careerCount.count,
      contacts: Math.max(0, inquiryCount.count - careerCount.count),
      spectrLogins: spectrCount.count,
      careersLogins: careersLoginCount.count,
      osGranted: osCount.count,
      accounts: accountCount.count,
    },
  };
}

export function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}
