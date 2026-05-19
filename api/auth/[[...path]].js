/** /api/auth/* — sign-in, sign-up, session (Vercel needs a nested handler for multi-segment paths). */
module.exports = require("../_serve").createHandler("/api/auth");
