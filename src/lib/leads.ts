import { createAdminClient } from "@/lib/supabase/admin";

export function inquiryKind(product: string) {
  const value = product.trim().toLowerCase();
  if (value.startsWith("careers")) return "careers";
  if (value.includes("partner")) return "partnership";
  if (value.includes("investor")) return "investor";
  return "contact";
}

export async function saveWaitlistSignup(input: {
  name: string;
  email: string;
  country: string;
  company: string;
  purpose: string;
}) {
  try {
    const admin = createAdminClient();
    const email = input.email.trim().toLowerCase();
    const { error } = await admin.from("waitlist_signups").upsert(
      {
        name: input.name.trim(),
        email,
        country: input.country.trim(),
        company: input.company.trim(),
        purpose: input.purpose.trim(),
      },
      { onConflict: "email" },
    );
    if (error) console.error("[waitlist] save", error.message);
  } catch (err) {
    console.error("[waitlist] save", err);
  }
}

export async function saveInquiry(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization?: string;
  jobTitle?: string;
  country?: string;
  product: string;
  message: string;
  workUrl?: string;
}) {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("inquiries").insert({
      kind: inquiryKind(input.product),
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone?.trim() ?? "",
      organization: input.organization?.trim() ?? "",
      job_title: input.jobTitle?.trim() ?? "",
      country: input.country?.trim() ?? "",
      product: input.product.trim(),
      message: input.message.trim(),
      work_url: input.workUrl?.trim() ?? "",
    });
    if (error) console.error("[inquiry] save", error.message);
  } catch (err) {
    console.error("[inquiry] save", err);
  }
}
