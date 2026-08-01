import { NextResponse } from "next/server";

type Body = {
  email?: string;
  password?: string;
};

/**
 * One-shot bootstrap for demo Auth users (email confirm + password reset).
 * Requires SPECTR_BOOTSTRAP_SECRET + SUPABASE_SERVICE_ROLE_KEY on the server.
 * Remove the secret (or this route) after demo users are ready.
 */
export async function POST(request: Request) {
  const bootstrap = process.env.SPECTR_BOOTSTRAP_SECRET;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  // Prefer the public URL (kept in sync with the live Auth project).
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

  if (!bootstrap || !service || !url) {
    return NextResponse.json({ error: "Bootstrap is not configured." }, { status: 503 });
  }

  const header = request.headers.get("x-bootstrap-secret");
  if (!header || header !== bootstrap) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    body = {};
  }

  const email = (body.email || "demo@spectr.no").trim().toLowerCase();
  const password =
    body.password ||
    `SpectrDemo-${Math.random().toString(36).slice(2, 12)}`;

  const headers = {
    Authorization: `Bearer ${service}`,
    apikey: service,
    "Content-Type": "application/json",
  };

  const listRes = await fetch(`${url.replace(/\/$/, "")}/auth/v1/admin/users?page=1&per_page=200`, {
    headers,
  });
  if (!listRes.ok) {
    return NextResponse.json(
      { error: "Could not list users", detail: (await listRes.text()).slice(0, 300) },
      { status: 502 },
    );
  }

  const listed = (await listRes.json()) as { users?: Array<{ id: string; email?: string }> };
  let user = (listed.users ?? []).find((u) => (u.email || "").toLowerCase() === email);

  if (!user) {
    const createRes = await fetch(`${url.replace(/\/$/, "")}/auth/v1/admin/users`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email, password, email_confirm: true }),
    });
    if (!createRes.ok) {
      return NextResponse.json(
        { error: "Could not create user", detail: (await createRes.text()).slice(0, 300) },
        { status: 502 },
      );
    }
    const created = (await createRes.json()) as { id: string; email?: string };
    return NextResponse.json({
      ok: true,
      created: true,
      email: created.email ?? email,
      password,
    });
  }

  const updRes = await fetch(`${url.replace(/\/$/, "")}/auth/v1/admin/users/${user.id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ password, email_confirm: true }),
  });
  if (!updRes.ok) {
    return NextResponse.json(
      { error: "Could not confirm user", detail: (await updRes.text()).slice(0, 300) },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, created: false, email, password });
}
