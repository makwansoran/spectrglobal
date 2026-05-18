/**
 * Company news — profile_json items plus live Finnhub headlines when available.
 */
const { getCompanyRaw } = require("./store");
const finnhub = require("./finnhub");

function normalizeProfileNews(items) {
  return (items || [])
    .filter((n) => n && (n.title || n.headline))
    .map((n, i) => ({
      id: String(n.id ?? `profile-${i}`),
      title: n.title || n.headline || "",
      summary: n.summary || "",
      source: n.source || "Spectr",
      date: n.date || "",
      url: n.url || null,
      image: n.image || null,
    }));
}

function mergeNews(profileItems, liveItems) {
  const seen = new Set();
  const merged = [];

  const add = (item) => {
    const key = `${item.title}`.toLowerCase().trim();
    if (!key || seen.has(key)) return;
    seen.add(key);
    merged.push(item);
  };

  for (const item of profileItems) add(item);
  for (const item of liveItems) add(item);

  return merged.sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 30);
}

async function getCompanyNews(slug) {
  const company = await getCompanyRaw(slug);
  if (!company?.profile) return null;

  const profile = company.profile;
  const profileNews = normalizeProfileNews(profile.news);
  let liveNews = [];

  if (finnhub.isEnabled() && profile.stock?.ticker) {
    liveNews = await finnhub.fetchCompanyNewsForProfile(profile);
  }

  const news = mergeNews(profileNews, liveNews);
  return {
    slug,
    news,
    sources: {
      profile: profileNews.length,
      finnhub: liveNews.length,
    },
  };
}

module.exports = {
  getCompanyNews,
  mergeNews,
  normalizeProfileNews,
};
