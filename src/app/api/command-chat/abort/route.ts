import { NextResponse } from "next/server";

/** Abort is a no-op stub for the web demo (non-streaming request cycle). */
export async function POST() {
  return NextResponse.json({ ok: true });
}
