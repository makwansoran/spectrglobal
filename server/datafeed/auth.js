/**
 * Shared auth for cron / manual datafeed sync triggers.
 * Vercel Cron sends Authorization: Bearer <CRON_SECRET> when CRON_SECRET is set.
 */

function collectSecrets() {
  return [process.env.CRON_SECRET, process.env.EURONEXT_SYNC_SECRET, process.env.DATAFEED_SYNC_SECRET].filter(
    Boolean
  );
}

function extractToken(req) {
  const header =
    req.headers["x-spectr-sync-secret"] ||
    req.headers["authorization"] ||
    req.headers["Authorization"] ||
    "";
  if (typeof header !== "string") return "";
  if (header.startsWith("Bearer ")) return header.slice(7).trim();
  return header.trim();
}

function authorizeDatafeedSync(req) {
  const secrets = collectSecrets();
  const isProd = process.env.VERCEL_ENV === "production";
  const isVercelCron = req.headers["x-vercel-cron"] === "1";

  // Vercel Cron sets x-vercel-cron: 1 and sends Authorization: Bearer <CRON_SECRET>
  if (isVercelCron && process.env.VERCEL === "1") {
    if (secrets.length === 0) return true;
    const token = extractToken(req);
    if (token && secrets.some((s) => token === s)) return true;
  }

  if (isProd && secrets.length === 0 && !isVercelCron) {
    console.warn("[datafeed] Refusing sync: set CRON_SECRET in Vercel project settings");
    return false;
  }

  if (secrets.length === 0) return true;

  const token = extractToken(req);
  if (!token) return false;
  return secrets.some((s) => token === s);
}

module.exports = { authorizeDatafeedSync, collectSecrets };
