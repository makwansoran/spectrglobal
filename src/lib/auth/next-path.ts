const FALLBACK = "/dashboard";

export function safeNextPath(value: string | null | undefined, fallback = FALLBACK) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("://")) {
    return fallback;
  }
  return value;
}
