/**
 * Deprecated — market data lives in Supabase profile_json (stock, financials, news).
 */
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.status(410).json({
    error: "Market API removed",
    hint: "Company profiles are served from Supabase only. Stock quotes and news are stored in profile_json.",
  });
};
