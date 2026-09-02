export const essayFontFamilies = {
  sans: { label: "Sans", css: "var(--font-sans)" },
  serif: { label: "Serif", css: "var(--essay-font-serif)" },
  mono: { label: "Mono", css: "var(--essay-font-mono)" },
  display: { label: "Display", css: "var(--font-display)" },
} as const;

export const essayFontSizes = {
  sm: { label: "Small", css: "0.95rem" },
  md: { label: "Body", css: "1.125rem" },
  lg: { label: "Large", css: "1.35rem" },
  xl: { label: "Extra large", css: "1.7rem" },
  xxl: { label: "Display", css: "clamp(1.85rem, 3.2vw, 2.45rem)" },
} as const;

export const essayFontWeights = {
  "400": "Regular",
  "500": "Medium",
  "600": "Semibold",
  "700": "Bold",
} as const;

export type EssayFontFamily = keyof typeof essayFontFamilies;
export type EssayFontSize = keyof typeof essayFontSizes;
export type EssayFontWeight = keyof typeof essayFontWeights;

export type EssayTextStyle = {
  fontFamily?: EssayFontFamily;
  fontSize?: EssayFontSize;
  fontWeight?: EssayFontWeight;
};

const STYLE_RE = /^%%STYLE%%(.*?)%%/;

function isFontFamily(value: unknown): value is EssayFontFamily {
  return typeof value === "string" && value in essayFontFamilies;
}

function isFontSize(value: unknown): value is EssayFontSize {
  return typeof value === "string" && value in essayFontSizes;
}

function isFontWeight(value: unknown): value is EssayFontWeight {
  return typeof value === "string" && value in essayFontWeights;
}

export function normalizeTextStyle(input: unknown): EssayTextStyle {
  const raw = input && typeof input === "object" ? (input as EssayTextStyle) : {};
  const style: EssayTextStyle = {};
  if (isFontFamily(raw.fontFamily) && raw.fontFamily !== "sans") style.fontFamily = raw.fontFamily;
  if (isFontSize(raw.fontSize) && raw.fontSize !== "md") style.fontSize = raw.fontSize;
  if (isFontWeight(raw.fontWeight) && raw.fontWeight !== "400") style.fontWeight = raw.fontWeight;
  return style;
}

export function hasTextStyle(style?: EssayTextStyle) {
  return Boolean(style?.fontFamily || style?.fontSize || style?.fontWeight);
}

export function encodeStyleToken(style: EssayTextStyle) {
  const next = normalizeTextStyle(style);
  if (!hasTextStyle(next)) return "";
  return `%%STYLE%%${JSON.stringify(next)}%%`;
}

export function parseParagraphStyle(text: string): { text: string; style?: EssayTextStyle } {
  const match = text.match(STYLE_RE);
  if (!match) return { text };
  try {
    const style = normalizeTextStyle(JSON.parse(match[1]));
    return {
      text: text.slice(match[0].length).replace(/^\s+/, ""),
      style: hasTextStyle(style) ? style : undefined,
    };
  } catch {
    return { text };
  }
}

export function essayStyleVars(style?: EssayTextStyle): Record<string, string> {
  const family = style?.fontFamily ?? "sans";
  const size = style?.fontSize ?? "md";
  const weight = style?.fontWeight ?? "400";
  return {
    "--essay-font": essayFontFamilies[family].css,
    "--essay-size": essayFontSizes[size].css,
    "--essay-weight": weight,
  };
}

export function paragraphBounds(body: string, index: number) {
  const at = Math.max(0, Math.min(index, body.length));
  const before = body.slice(0, at);
  const sep = before.lastIndexOf("\n\n");
  const start = sep === -1 ? 0 : sep + 2;
  const afterSep = body.indexOf("\n\n", at);
  const end = afterSep === -1 ? body.length : afterSep;
  return { start, end };
}

export function styleAtIndex(body: string, index: number): EssayTextStyle {
  const { start, end } = paragraphBounds(body, index);
  return parseParagraphStyle(body.slice(start, end)).style ?? {};
}

export function applyStyleToParagraph(body: string, index: number, style: EssayTextStyle) {
  const { start, end } = paragraphBounds(body, index);
  const current = body.slice(start, end);
  if (current.includes("%%CHART%%")) return { body, cursor: index };
  const parsed = parseParagraphStyle(current);
  const token = encodeStyleToken(style);
  const offsetInText = Math.max(0, index - start - (current.length - parsed.text.length));
  const next = `${token}${parsed.text}`;
  return {
    body: `${body.slice(0, start)}${next}${body.slice(end)}`,
    cursor: start + token.length + Math.min(offsetInText, parsed.text.length),
  };
}
