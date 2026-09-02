import { NextResponse } from "next/server";
import { recordSiteEvent, type SiteEventKind } from "@/lib/analytics/store";

export async function POST(request: Request) {
  let body: { kind?: string; path?: string; label?: string };
  try {
    body = (await request.json()) as { kind?: string; path?: string; label?: string };
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const kind = body.kind === "click" ? "click" : body.kind === "pageview" ? "pageview" : null;
  if (!kind) return NextResponse.json({ ok: false }, { status: 400 });

  await recordSiteEvent({
    kind: kind as SiteEventKind,
    path: typeof body.path === "string" ? body.path : "/",
    label: typeof body.label === "string" ? body.label : "",
  }).catch(() => undefined);
  return NextResponse.json({ ok: true });
}
