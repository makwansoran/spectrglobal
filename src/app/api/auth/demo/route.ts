import { NextResponse } from "next/server";
import {
  DEMO_COOKIE,
  signLocalSession,
  verifyLocalCredentials,
} from "@/lib/demo-auth";

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export async function POST(request: Request) {
  let body: { username?: string; password?: string };
  try {
    body = (await request.json()) as { username?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";
  if (!verifyLocalCredentials(username, password)) {
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  const token = await signLocalSession(username);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DEMO_COOKIE, token, cookieOptions(60 * 60 * 24 * 7));
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DEMO_COOKIE, "", cookieOptions(0));
  return res;
}
