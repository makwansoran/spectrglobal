/**
 * Shared Vercel serverless entry — resolves pathname and delegates to handleApi.
 */
require("../scripts/load-env").loadEnv();
const { handleApi } = require("../server/api");
const { pathnameFromRequest } = require("./_pathname");

function createHandler(mountPrefix) {
  return async function serveApi(req, res) {
    const pathname = pathnameFromRequest(req, mountPrefix);
    const handled = await handleApi(req, res, pathname);
    if (!handled) {
      res.status(404).json({ error: "Not found", path: pathname });
    }
  };
}

module.exports = createHandler();
module.exports.createHandler = createHandler;
