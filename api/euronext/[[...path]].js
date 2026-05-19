/** /api/euronext/* — dedicated route (Vercel cron + catch-all routing) */
module.exports = require("../_serve").createHandler("/api/euronext");
