export function formatCurrency(value: number, currency = "USD"): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  const symbols: Record<string, string> = { USD: "$", EUR: "€", NOK: "kr ", GBP: "£" };
  const sym = symbols[currency] ?? `${currency} `;

  if (abs >= 1e12) return `${sign}${sym}${(abs / 1e12).toFixed(1)}T`;
  if (abs >= 1e9) return `${sign}${sym}${(abs / 1e9).toFixed(0)}B`;
  if (abs >= 1e6) return `${sign}${sym}${(abs / 1e6).toFixed(0)}M`;
  if (abs >= 1e3) return `${sign}${sym}${(abs / 1e3).toFixed(0)}K`;
  return `${sign}${sym}${abs.toFixed(0)}`;
}

export function formatNumber(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(0)}K`;
  return `${sign}${abs.toLocaleString()}`;
}

export function formatPercent(value: number, signed = true): string {
  const prefix = signed && value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(2)}%`;
}

export function formatMetric(value: number, format: string, currency = "USD"): string {
  switch (format) {
    case "currency":
      return formatCurrency(value, currency);
    case "percent":
      return formatPercent(value, false);
    case "ratio":
      return value.toFixed(2) + "x";
    default:
      return formatNumber(value);
  }
}

export function countryFlag(code: string): string {
  const cc = code.toUpperCase();
  if (cc.length !== 2) return "🌐";
  return String.fromCodePoint(...[...cc].map((c) => 0x1f1e6 - 65 + c.charCodeAt(0)));
}
