/**
 * Local static dev server for Spectr.
 * Usage: node scripts/dev-server.js
 */
require("./load-env").loadEnv();

const http = require("http");
const fs = require("fs");
const path = require("path");
const { handleApi } = require("../server/api");
const { isSupabaseEnabled } = require("../server/supabase-client");

const ROOT = path.resolve(__dirname, "..");
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

function isInsideRoot(filePath) {
  const rel = path.relative(ROOT, filePath);
  return rel && !rel.startsWith("..") && !path.isAbsolute(rel);
}

function resolveFilePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const rel = decoded === "/" ? "index.html" : decoded.replace(/^\//, "");
  const filePath = path.resolve(ROOT, rel);
  if (!isInsideRoot(filePath)) return null;
  return filePath;
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
    console.error(`Port ${PORT} is already in use.`);
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, HOST, () => {
  console.log("");
  console.log("  Spectr dev server");
  console.log(`  → http://${HOST}:${PORT}/`);
  console.log(`  → http://${HOST}:${PORT}/login.html`);
  console.log(
    `  Supabase ${isSupabaseEnabled() ? "configured" : "not configured (set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)"}`
  );
  console.log("");
});
