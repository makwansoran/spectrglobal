import { parseParagraphStyle, type EssayTextStyle } from "@/lib/editorial/typography";

export type ResearchChartType = "bar" | "line" | "pie";

export type ResearchChartPoint = {
  label: string;
  value: number;
};

export type ResearchChart = {
  id: string;
  type: ResearchChartType;
  title: string;
  caption: string;
  yLabel: string;
  points: ResearchChartPoint[];
};

export type EssayBlock =
  | { type: "paragraph"; text: string; style?: EssayTextStyle }
  | { type: "chart"; chart: ResearchChart };

const TOKEN_RE = /%%CHART%%([\s\S]*?)%%ENDCHART%%/g;

function encodePayload(chart: ResearchChart) {
  return encodeURIComponent(JSON.stringify(chart));
}

function decodePayload(encoded: string): unknown {
  return JSON.parse(decodeURIComponent(encoded));
}

export function encodeChartToken(chart: ResearchChart) {
  return `%%CHART%%${encodePayload(normalizeChart(chart))}%%ENDCHART%%`;
}

export function newChartId() {
  return `fig-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function emptyChart(type: ResearchChartType = "bar"): ResearchChart {
  return {
    id: newChartId(),
    type,
    title: "",
    caption: "",
    yLabel: "",
    points: [
      { label: "Series A", value: 42 },
      { label: "Series B", value: 27 },
      { label: "Series C", value: 18 },
    ],
  };
}

export function normalizeChart(input: unknown): ResearchChart {
  const raw = input && typeof input === "object" ? (input as Partial<ResearchChart>) : {};
  const type: ResearchChartType = raw.type === "pie" || raw.type === "line" ? raw.type : "bar";
  const points = Array.isArray(raw.points)
    ? raw.points
        .map((point) => {
          if (!point || typeof point !== "object") return null;
          const label = String((point as ResearchChartPoint).label ?? "").trim();
          const value = Number((point as ResearchChartPoint).value);
          if (!label || !Number.isFinite(value)) return null;
          return { label, value };
        })
        .filter((point): point is ResearchChartPoint => Boolean(point))
        .slice(0, 24)
    : [];

  return {
    id: String(raw.id ?? "").trim() || newChartId(),
    type,
    title: String(raw.title ?? "").trim(),
    caption: String(raw.caption ?? "").trim(),
    yLabel: String(raw.yLabel ?? "").trim(),
    points,
  };
}

export function parseChartToken(token: string): ResearchChart | null {
  const match = token.trim().match(/^%%CHART%%([\s\S]*?)%%ENDCHART%%$/);
  if (!match) return null;
  try {
    return normalizeChart(decodePayload(match[1]));
  } catch {
    return null;
  }
}

function paragraphBlock(text: string): EssayBlock {
  const parsed = parseParagraphStyle(text);
  return parsed.style
    ? { type: "paragraph", text: parsed.text, style: parsed.style }
    : { type: "paragraph", text: parsed.text };
}

export function parseBodyBlocks(paragraphs: string[]): EssayBlock[] {
  const blocks: EssayBlock[] = [];

  for (const paragraph of paragraphs) {
    const re = new RegExp(TOKEN_RE.source, "g");
    let last = 0;
    let match: RegExpExecArray | null;

    while ((match = re.exec(paragraph))) {
      const before = paragraph.slice(last, match.index).trim();
      if (before) blocks.push(paragraphBlock(before));
      try {
        blocks.push({ type: "chart", chart: normalizeChart(decodePayload(match[1])) });
      } catch {
        const leftover = paragraph.slice(match.index, match.index + match[0].length).trim();
        if (leftover) blocks.push(paragraphBlock(leftover));
      }
      last = match.index + match[0].length;
    }

    const after = paragraph.slice(last).trim();
    if (after) blocks.push(paragraphBlock(after));
  }

  return blocks;
}

export function insertChartToken(body: string, token: string, index: number) {
  const at = Math.max(0, Math.min(index, body.length));
  const before = body.slice(0, at);
  const after = body.slice(at);
  const leftPad = before.length === 0 || before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
  const rightPad = after.length === 0 || after.startsWith("\n\n") ? "" : after.startsWith("\n") ? "\n" : "\n\n";
  return `${before}${leftPad}${token}${rightPad}${after}`;
}
