import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function requireUser() {
  const { supabase, user } = await getAuthUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function getProfileAccess(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("product_access, careers_access, os_download_granted")
    .eq("id", userId)
    .maybeSingle();
  return {
    productAccess: Boolean(data?.product_access),
    careersAccess: Boolean(data?.careers_access),
    osDownloadGranted: Boolean(data?.os_download_granted),
  };
}

export async function requireCareersUser() {
  const { supabase, user } = await getAuthUser();
  if (!user) redirect("/careers/login");
  const access = await getProfileAccess(user.id);
  if (!access.careersAccess) redirect("/careers/login");
  return { supabase, user };
}

export async function requireAal2() {
  const { supabase, user } = await requireUser();
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  const { data: factors } = await supabase.auth.mfa.listFactors();
  const hasVerifiedTotp = Boolean(factors?.totp.some((factor) => factor.status === "verified"));

  if (!hasVerifiedTotp) redirect("/mfa/enroll");
  if (aal?.currentLevel !== "aal2") redirect("/mfa/verify");

  return { supabase, user };
}
