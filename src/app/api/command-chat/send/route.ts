import { NextResponse } from "next/server";
import { getCommandChatConfig } from "@/lib/command-chat-config";

type Body = {
  requestId?: string;
  turns?: Array<{ role: string; content: unknown }>;
  tools?: unknown[];
};

/**
 * Minimal chat proxy for the web demo. Streams NDJSON events compatible with
 * the Spectr commandChat.onDelta consumer. Full tool-calling parity with
 * Electron can be expanded later.
 */
export async function POST(request: Request) {
  const cfg = getCommandChatConfig();
  if (!cfg.configured) {
    return new NextResponse(
      `${JSON.stringify({
        type: "error",
        message: "Command chat is not configured. Set SPECTR_COMMAND_CHAT_API_KEY.",
      })}\n${JSON.stringify({ type: "done", stop: "end" })}\n`,
      {
        status: 200,
        headers: { "Content-Type": "application/x-ndjson; charset=utf-8" },
      }
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const turns = body.turns ?? [];
  const lastUser = [...turns].reverse().find((t) => t.role === "user");
  const userText =
    typeof lastUser?.content === "string"
      ? lastUser.content
      : Array.isArray(lastUser?.content)
        ? lastUser.content
            .map((part) =>
              typeof part === "object" && part && "text" in part
                ? String((part as { text: string }).text)
                : ""
            )
            .join("")
        : "Hello";

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: unknown) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      try {
        if (cfg.provider === "anthropic") {
          const res = await fetch(`${cfg.baseUrl.replace(/\/$/, "")}/v1/messages`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-api-key": cfg.apiKey,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: cfg.model,
              max_tokens: 1024,
              messages: [{ role: "user", content: userText }],
            }),
          });

          if (!res.ok) {
            const errText = await res.text();
            send({ type: "error", message: errText.slice(0, 500) || `HTTP ${res.status}` });
            send({ type: "done", stop: "end" });
            controller.close();
            return;
          }

          const data = (await res.json()) as {
            content?: Array<{ type: string; text?: string }>;
          };
          const text = (data.content ?? [])
            .filter((c) => c.type === "text" && c.text)
            .map((c) => c.text)
            .join("\n");
          if (text) send({ type: "text", text });
          send({ type: "done", stop: "end" });
        } else {
          const res = await fetch(`${cfg.baseUrl.replace(/\/$/, "")}/chat/completions`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${cfg.apiKey}`,
            },
            body: JSON.stringify({
              model: cfg.model,
              messages: [{ role: "user", content: userText }],
            }),
          });
          if (!res.ok) {
            const errText = await res.text();
            send({ type: "error", message: errText.slice(0, 500) || `HTTP ${res.status}` });
            send({ type: "done", stop: "end" });
            controller.close();
            return;
          }
          const data = (await res.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
          };
          const text = data.choices?.[0]?.message?.content ?? "";
          if (text) send({ type: "text", text });
          send({ type: "done", stop: "end" });
        }
      } catch (err) {
        send({
          type: "error",
          message: err instanceof Error ? err.message : "Command chat failed",
        });
        send({ type: "done", stop: "end" });
      }
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8" },
  });
}
