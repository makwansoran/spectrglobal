import { NextResponse } from "next/server";
import { getCommandChatConfig } from "@/lib/command-chat-config";

export async function GET() {
  const cfg = getCommandChatConfig();
  return NextResponse.json({
    configured: cfg.configured,
    provider: cfg.provider,
    model: cfg.model,
    baseUrl: cfg.baseUrl,
  });
}
