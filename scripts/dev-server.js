/**
 * Local static dev server for spectrglobal (no npm install required).
 * Usage: node scripts/dev-server.js
 *
 * Serves /company/* as the React SPA (company/index.html) when built.
 */
require("./load-env").loadEnv();

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const COMPANY_SPA = path.join(ROOT, "company", "index.html");
const { handleApi } = require("../server/api");
const { listCompanies, storageMode, isSupabaseEnabled } = require("../server/store");

function isInsideRoot(filePath) {
  const rel = path.relative(ROOT, filePath);
  return rel && !rel.startsWith("..") && !path.isAbsolute(rel);
}
const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT) || 3000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

function resolveFilePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const rel = decoded === "/" ? "index.html" : decoded.replace(/^\//, "");
  const filePath = path.resolve(ROOT, rel);
  if (!isInsideRoot(filePath)) return null;
  return filePath;
}

function isCompanyAppRoute(pathname) {
  return pathname === "/company" || pathname.startsWith("/company/");
}

function isPersonAppRoute(pathname) {
  return pathname === "/person" || pathname.startsWith("/person/");
}

function isCommodityRoute(pathname) {
  return pathname === "/commodity" || pathname.startsWith("/commodity/");
}

function isProfileSpaRoute(pathname) {
  return isCompanyAppRoute(pathname) || isPersonAppRoute(pathname) || isCommodityRoute(pathname);
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  fs.readFile(filePath, (err, data) => {
    if (err) {
      const code = err.code === "ENOENT" ? 404 : 500;
      res.writeHead(code, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(code === 404 ? "Not found" : "Server error");
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
}

function serveStatic(req, res, pathname) {
  const filePath = resolveFilePath(pathname);

  if (!filePath) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) {
      sendFile(res, filePath);
      return;
    }

    if (isProfileSpaRoute(pathname) && fs.existsSync(COMPANY_SPA)) {
      sendFile(res, COMPANY_SPA);
      return;
    }

    if (isProfileSpaRoute(pathname)) {
      res.writeHead(503, { "Content-Type": "text/html; charset=utf-8" });
      res.end(
        "<!DOCTYPE html><html><body style='font-family:sans-serif;padding:2rem'>" +
          "<h1>Company profile not built</h1>" +
          "<p>Run <code>npm run build:profile</code> from the repo root, then refresh this page.</p>" +
          "</body></html>"
      );
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  });
}

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, `http://${HOST}`).pathname;

  if (pathname.startsWith("/api/")) {
    handleApi(req, res, pathname)
      .then((handled) => {
        if (!handled) {
          res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ error: "Not found" }));
        }
      })
      .catch((err) => {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "Internal server error" }));
      });
    return;
  }

  serveStatic(req, res, pathname);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error("");
    console.error(`  Port ${PORT} is already in use.`);
    console.error(`  Open http://${HOST}:${PORT}/ in your browser, or stop the other process:`);
    console.error(`    netstat -ano | findstr :${PORT}`);
    console.error("    taskkill /PID <pid> /F");
    console.error("");
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, HOST, () => {
  const companyReady = fs.existsSync(COMPANY_SPA);
  console.log("");
  console.log("  Spectr local dev server");
  console.log(`  → http://${HOST}:${PORT}/`);
  console.log(`  → http://${HOST}:${PORT}/index.html`);
  if (companyReady) {
    console.log(`  → http://${HOST}:${PORT}/company/equinor  (company profile)`);
    console.log(`  → http://${HOST}:${PORT}/person/karl-johnny-hersvik  (person profile)`);
  } else {
    console.log("  Warning: company profile missing — run: npm run build:profile");
  }
  console.log(`  Storage  ${storageMode()}${isSupabaseEnabled() ? " (Supabase)" : " (local SQLite/JSON)"}`);
  listCompanies()
    .then((rows) => {
      console.log(`  API      /api/companies (${rows.length} companies)`);
      if (rows.length === 0) {
        console.log("  Warning: empty — run: npm run db:seed");
      }
    })
    .catch((err) => {
      console.log("  Warning: could not list companies —", err.message);
    });
  console.log("");
  console.log("  Edit files and refresh the browser to see changes.");
  console.log("  Press Ctrl+C to stop.");
  console.log("");
});
