import { createHmac, timingSafeEqual } from "crypto";

export const DEMO_COOKIE = "spectr_demo_session";

function secret(): string | null {
  return process.env.SPECTR_DEMO_SECRET || process.env.SPECTR_BOOTSTRAP_SECRET || null;
}

export function demoCredentialsConfigured(): boolean {
  return Boolean(
    process.env.SPECTR_DEMO_EMAIL?.trim() &&
      process.env.SPECTR_DEMO_PASSWORD &&
      secret(),
  );
}

export function verifyDemoCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.SPECTR_DEMO_EMAIL?.trim().toLowerCase();
  const expectedPassword = process.env.SPECTR_DEMO_PASSWORD;
  if (!expectedEmail || !expectedPassword || !secret()) return false;
  return email.trim().toLowerCase() === expectedEmail && password === expectedPassword;
}

export function signDemoSession(email: string): string {
  const s = secret();
  if (!s) throw new Error("Demo auth secret missing");
  const payload = Buffer.from(
    JSON.stringify({ email: email.trim().toLowerCase(), exp: Date.now() + 1000 * 60 * 60 * 24 * 7 }),
  ).toString("base64url");
  const sig = createHmac("sha256", s).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function readDemoSession(token: string | undefined): { email: string } | null {
  if (!token || !secret()) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", secret()!).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      email?: string;
      exp?: number;
    };
    if (!data.email || !data.exp || data.exp < Date.now()) return null;
    return { email: data.email };
  } catch {
    return null;
  }
}
