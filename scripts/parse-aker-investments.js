const fs = require("fs");
const html = fs.readFileSync("c:/Users/makwa/spectrglobal/tmp-aker-investment.html", "utf8");

const BASE = "https://www.akerasa.com";

function extractTab(id) {
  const re = new RegExp(`id="${id}"[\\s\\S]*?(?=id="tabs-\\d"|</section>)`);
  const m = html.match(re);
  return m ? m[0] : "";
}

function field(block, label) {
  const re = new RegExp(
    `<h3 class="headline-sm[^"]*">${label}[^<]*</h3>\\s*<p class="body-sm[^"]*">([^<]+)`,
    "i"
  );
  const m = block.match(re);
  return m ? m[1].trim() : "";
}

function parseProfiles(chunk, listing) {
  const wrappers = chunk.split(/<motion[^>]*>|<motion-div[^>]*>/i);
  const parts = chunk.split(/<motion-div|<div class="profiles__wrapper/);
  const blocks = [];
  for (const p of parts) {
    if (p.includes("bod-card") || p.includes("bod-detail")) blocks.push(p);
  }
  // split on profiles__wrapper more reliably
  const items = [];
  const re = /<motion-div[^>]*>|<div class="profiles__wrapper/g;
  const splits = chunk.split(/profiles__wrapper h-100/);
  for (let i = 1; i < splits.length; i++) {
    const b = splits[i];
    const nameMatch = b.match(/<h2 class="headline-md[^"]*">([^<]+)<\/h2>/);
    if (!nameMatch) continue;
    const sectorMatch = b.match(/<span class="tag-text[^"]*">([^<]+)<\/span>/);
    const logoMatch =
      b.match(/color-image\/([^"?]+)/) ||
      b.match(/color-img[^>]+data-src="[^"]*\/(?:color-image|black-images)\/([^"?]+)/) ||
      b.match(/black-images\/([^"?]+)/);
    const titleMatch = b.match(/<h3 class="display-sm">([^<]+)<\/h3>/);
    const bodyMd = b.match(/<div class="bod-detail__intro-content">[\s\S]*?<p class="body-md">([\s\S]*?)<\/p>/);
    let description = "";
    if (bodyMd) {
      description = bodyMd[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    }
    const websiteMatch = b.match(/<a href="(https?:\/\/[^"]+)"/);
    const ownership = field(b, "Aker.s ownership") || field(b, "Aker's ownership");
    const assetShare = field(b, "Share of Aker.s total assets");
    const ticker = field(b, "Listed, ticker") || field(b, "Listed ticker");
    const category = field(b, "Category");
    const chair = field(b, "Chair") || field(b, "Chairman");
    const ceo = field(b, "CEO");
    items.push({
      listing,
      name: nameMatch[1].trim(),
      sector: sectorMatch ? sectorMatch[1].trim() : category,
      ownership,
      assetShare,
      ticker,
      category,
      chair,
      ceo,
      tagline: titleMatch ? titleMatch[1].trim() : "",
      description,
      website: websiteMatch ? websiteMatch[1] : "",
      logoPath: logoMatch ? `/~/media/Images/A/aker-corp/templates/custom-board-of-directors/color-image/${logoMatch[1]}` : "",
      logoUrl: logoMatch
        ? `${BASE}/~/media/Images/A/aker-corp/templates/custom-board-of-directors/color-image/${encodeURI(logoMatch[1])}`
        : "",
    });
  }
  return items;
}

const listed = parseProfiles(extractTab("tabs-1"), "listed");
const unlisted = parseProfiles(extractTab("tabs-2"), "unlisted");
console.log(JSON.stringify({ listed, unlisted, counts: { listed: listed.length, unlisted: unlisted.length } }, null, 2));
