/**
 * Light IR / company-website filing link extraction (fetch + regex, no browser).
 * Env: FINNHUB_API_KEY optional; persistence via Supabase upsert in company-enrich.
 */

const USER_AGENT = "Spectr/1.0 (+https://spectr.no; company IR enrichment)";
const FETCH_TIMEOUT_MS = 8000;
const MAX_LINKS = 30;
const MIN_HOST_INTERVAL_MS = 1000;

const hostLastFetch = new Map();

const FILING_HREF =
  /(annual[-_ ]?report|10[-_ ]?k|10[-_ ]?q|8[-_ ]?k|investor|investors|ir\b|filing|sec\b|regulatory|financial[-_ ]?report|results|presentation|prospectus|\.pdf\b|interim|quarterly)/i;

const IR_PATH_HINTS = [
  "/investor",
  "/investors",
  "/investor-relations",
  "/ir",
  "/en/investors",
  "/about/investors",
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function throttleHost(url) {
  let host;
  try {
    host = new URL(url).hostname;
  } catch {
    return;
  }
  const last = hostLastFetch.get(host) || 0;
  const wait = Math.min(5000, Math.max(0, MIN_HOST_INTERVAL_MS - (Date.now() - last)));
  if (wait) await sleep(wait);
  hostLastFetch.set(host, Date.now());
}

async function fetchText(url) {
  await throttleHost(url);
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ac.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": USER_AGENT,
      },
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ct = res.headers.get("content-type") || "";
    if (!/text\/html|application\/xhtml/i.test(ct) && !ct.includes("text/plain")) {
      return "";
    }
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function resolveHref(baseUrl, href) {
  const h = String(href || "").trim();
  if (!h || h.startsWith("#") || /^javascript:/i.test(h) || /^mailto:/i.test(h)) return null;
  try {
    return new URL(h, baseUrl).href;
  } catch {
    return null;
  }
}

function guessType(title, href) {
  const t = `${title} ${href}`.toLowerCase();
  if (/10-k|annual/.test(t)) return "Annual report";
  if (/10-q|quarterly|interim/.test(t)) return "Quarterly report";
  if (/8-k/.test(t)) return "Current report";
  if (/presentation|investor presentation/.test(t)) return "Presentation";
  if (/\.pdf/.test(t)) return "PDF";
  if (/prospectus/.test(t)) return "Prospectus";
  return "Investor document";
}

function extractLinks(html, baseUrl, companyName) {
  const seen = new Set();
  const out = [];
  const re = /<a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) && out.length < MAX_LINKS * 3) {
    const href = resolveHref(baseUrl, m[1]);
    if (!href || seen.has(href)) continue;
    const title = String(m[2] || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const label = title || href.split("/").pop() || "Document";
    if (!FILING_HREF.test(`${label} ${href}`)) continue;
    seen.add(href);
    const id = `ir-${Buffer.from(href).toString("base64url").slice(0, 24)}`;
    out.push({
      id,
      title: label.slice(0, 200) || companyName || "Document",
      type: guessType(label, href),
      date: "",
      jurisdiction: "Company IR",
      url: href,
      source: "company-ir",
    });
    if (out.length >= MAX_LINKS) break;
  }
  return out;
}

function irCandidateUrls(baseUrl) {
  const urls = [baseUrl];
  let origin;
  try {
    origin = new URL(baseUrl).origin;
  } catch {
    return urls;
  }
  for (const path of IR_PATH_HINTS) {
    urls.push(`${origin}${path}`);
    urls.push(`${origin}${path}/`);
  }
  return [...new Set(urls)].slice(0, 6);
}

/**
 * Fetch company homepage / IR paths and extract filing-like links.
 * @param {string} url company or IR page URL
 * @param {string} [companyName]
 * @returns {Promise<object[]>}
 */
async function fetchIrFilingsFromWebsite(url, companyName = "") {
  const start = String(url || "").trim();
  if (!start) return [];

  let base;
  try {
    base = new URL(start.startsWith("http") ? start : `https://${start}`);
  } catch {
    return [];
  }

  const candidates = irCandidateUrls(base.href);
  const merged = [];
  const seen = new Set();

  for (const pageUrl of candidates) {
    let html;
    try {
      html = await fetchText(pageUrl);
    } catch (err) {
      if (pageUrl === base.href) console.warn("IR fetch:", pageUrl, err.message);
      continue;
    }
    if (!html || html.length < 200) continue;

    for (const row of extractLinks(html, pageUrl, companyName)) {
      if (seen.has(row.url)) continue;
      seen.add(row.url);
      merged.push(row);
      if (merged.length >= MAX_LINKS) return merged;
    }
    if (merged.length >= 8) break;
  }

  return merged;
}

module.exports = {
  fetchText,
  fetchIrFilingsFromWebsite,
  FETCH_TIMEOUT_MS,
  MAX_LINKS,
};
