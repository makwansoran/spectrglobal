/**
 * Optional full-page scrape via vercel-labs/agent-browser CLI.
 * Install: npm install agent-browser && npx agent-browser install
 */

const { spawnSync } = require("child_process");

const BIN = process.env.AGENT_BROWSER_BIN || "agent-browser";
const TIMEOUT_MS = Number(process.env.AGENT_BROWSER_TIMEOUT_MS || 120000);

function isAvailable() {
  try {
    const r = spawnSync(BIN, ["--version"], {
      encoding: "utf8",
      timeout: 8000,
      shell: process.platform === "win32",
    });
    return r.status === 0;
  } catch {
    return false;
  }
}

function runArgs(args) {
  const r = spawnSync(BIN, args, {
    encoding: "utf8",
    timeout: TIMEOUT_MS,
    maxBuffer: 64 * 1024 * 1024,
    shell: process.platform === "win32",
  });
  if (r.status !== 0) {
    const err = (r.stderr || r.stdout || "").trim() || `agent-browser exit ${r.status}`;
    throw new Error(err);
  }
  return (r.stdout || "").trim();
}

/**
 * Load URL and return document HTML (body or full page).
 */
function scrapePageHtml(url, options = {}) {
  if (!isAvailable()) {
    return { html: null, method: "unavailable", error: "agent-browser not installed" };
  }

  const selector = options.selector || "html";
  try {
    runArgs(["open", url]);
    runArgs(["wait", "--load", "networkidle"]);
    if (options.extraWaitMs) {
      runArgs(["wait", String(options.extraWaitMs)]);
    }
    const html = runArgs(["get", "html", selector]);
    runArgs(["close"]);
    return { html, method: "agent-browser", error: null };
  } catch (err) {
    try {
      runArgs(["close"]);
    } catch {
      /* ignore */
    }
    return { html: null, method: "agent-browser", error: err.message };
  }
}

module.exports = {
  isAvailable,
  scrapePageHtml,
};
