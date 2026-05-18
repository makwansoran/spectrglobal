/**
 * Supabase-backed entity catalogs (read/write via catalog store factory).
 */
const { createCatalogStore } = require("./supabase-catalog-store");

const commodities = createCatalogStore("commodities", {
  kind: "commodity",
  urlPrefix: "/commodity",
  hasCategory: true,
});

const banks = createCatalogStore("banks", {
  kind: "bank",
  urlPrefix: "/bank",
});

const investmentBanks = createCatalogStore("investment_banks", {
  kind: "investment_bank",
  urlPrefix: "/investment-bank",
});

const ventureCapital = createCatalogStore("venture_capital", {
  kind: "venture_capital",
  urlPrefix: "/venture-capital",
});

module.exports = {
  commodities,
  banks,
  investmentBanks,
  ventureCapital,
};
