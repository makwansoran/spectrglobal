import { site } from "@/lib/site";

export function adminEmails() {
  const raw = process.env.SPECTR_ADMIN_EMAIL || site.email;
  return raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return adminEmails().includes(email.trim().toLowerCase());
}
