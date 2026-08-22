const FREE_EMAIL_DOMAINS = new Set([
  "aol.com",
  "fastmail.com",
  "gmail.com",
  "gmx.com",
  "gmx.de",
  "gmx.net",
  "googlemail.com",
  "hotmail.com",
  "hotmail.co.uk",
  "icloud.com",
  "inbox.com",
  "live.com",
  "mac.com",
  "mail.com",
  "mail.ru",
  "me.com",
  "msn.com",
  "outlook.com",
  "outlook.co.uk",
  "pm.me",
  "proton.me",
  "protonmail.com",
  "tutanota.com",
  "yahoo.com",
  "yahoo.co.uk",
  "yandex.com",
  "yandex.ru",
  "zoho.com",
]);

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmailShape(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export function isBusinessEmail(email: string) {
  const value = normalizeEmail(email);
  if (!isValidEmailShape(value)) return false;

  const domain = value.split("@")[1];
  if (!domain || domain.split(".").length < 2) return false;
  if (FREE_EMAIL_DOMAINS.has(domain)) return false;

  const root = domain.split(".").slice(-2).join(".");
  if (FREE_EMAIL_DOMAINS.has(root)) return false;

  return true;
}

export function businessEmailError(email: string) {
  const value = normalizeEmail(email);
  if (!value) return "Enter your work email.";
  if (!isValidEmailShape(value)) return "Enter a valid email address.";
  if (!isBusinessEmail(value)) {
    return "Use a business email. Personal inboxes such as Gmail, Outlook, and Yahoo are not accepted.";
  }
  return null;
}

export function emailErrorForKind(email: string, kind: "product" | "careers") {
  if (kind === "careers") {
    const value = normalizeEmail(email);
    if (!value) return "Enter your email.";
    if (!isValidEmailShape(value)) return "Enter a valid email address.";
    return null;
  }
  return businessEmailError(email);
}
