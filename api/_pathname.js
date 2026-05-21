/**
 * Resolve canonical /api/... pathname for Vercel serverless handlers.
 */
function pathnameFromRequest(req, mountPrefix) {
  const host = req.headers.host || "localhost";
  const raw = req.url || "/";
  const href = raw.startsWith("http") ? raw : `https://${host}${raw.startsWith("/") ? raw : `/${raw}`}`;
  let pathname = new URL(href).pathname;

  if (mountPrefix && !pathname.startsWith(mountPrefix)) {
    const tail = pathname.startsWith("/") ? pathname : `/${pathname}`;
    pathname = `${mountPrefix}${tail}`;
  }

  return pathname;
}

module.exports = { pathnameFromRequest };
