/** GET /api/companies/:slug and /api/companies/:slug/:resource (assets, filings, news, …) */
module.exports = require("../../_serve").createHandler("/api/companies");
