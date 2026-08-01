import { NextResponse } from "next/server";
import {
  DEMO_COOKIE,
  demoCredentialsConfigured,
  signDemoSession,
  verifyDemoCredentials,
} from "@/lib/demo-auth";

export async function POST(request: Request) {
  if (!demoCredentialsConfigured()) {
    return NextResponse.json({ error: "Demo sign-in is not configured." }, { status: 503 });
  }

  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";
  if (!verifyDemoCredentials(email, password)) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  const token = signDemoSession(email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DEMO_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DEMO_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
