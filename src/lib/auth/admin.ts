export const ADMIN_EMAIL = "makwan@spectr.no";
export const ADMIN_PASSWORD = "spectr";

export function normalizeAdminEmail(value: string) {
  const id = value.trim().toLowerCase();
  if (id === "makwan@spectr" || id === ADMIN_EMAIL) return ADMIN_EMAIL;
  return id;
}

export function isAdminIdentifier(value: string) {
  return normalizeAdminEmail(value) === ADMIN_EMAIL;
}

export function adminEmails() {
  return [ADMIN_EMAIL];
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return normalizeAdminEmail(email) === ADMIN_EMAIL;
}
