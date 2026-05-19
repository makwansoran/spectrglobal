/**
 * Fetch heads of state / government and finance ministers via Wikidata.
 */
const UA = "SpectrGlobal/1.0 (contact@spectr.global)";

const ROLE_OFFICE = {
  head_of_state: "Head of State",
  head_of_government: "Prime Minister",
  vice_president: "Vice President",
};

const POSITION_RE =
  /finance|treasury|exchequer|minister of finance|minister for finance|minister of the treasury|finanzminister|ministro de finanzas|ministre des finances|ministro das finanças/i;

const SKIP_PERSON_RE =
  /constitution|declaration|act of|treaty|law of|government of|parliament|national assembly/i;

function normalizeQid(value) {
  const raw = String(value || "");
  const m = raw.match(/(Q\d+)\s*$/i);
  return m ? m[1].toUpperCase() : raw;
}

async function sparql(query, timeoutMs = 120000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}`, {
      headers: { Accept: "application/sparql-results+json", "User-Agent": UA },
      signal: ctrl.signal,
    });
    const text = await res.text();
    if (!res.ok || !text.startsWith("{")) {
      throw new Error(text.slice(0, 120) || `HTTP ${res.status}`);
    }
    return JSON.parse(text).results.bindings;
  } finally {
    clearTimeout(timer);
  }
}

async function wikidataSearch(label) {
  const url =
    `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(label)}` +
    `&language=en&limit=5&format=json`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  const data = await res.json();
  return data.search || [];
}

async function entityLabels(ids) {
  if (!ids.length) return {};
  const uniq = [...new Set(ids)];
  const out = {};
  for (let i = 0; i < uniq.length; i += 40) {
    const chunk = uniq.slice(i, i + 40);
    const url =
      `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${chunk.join("|")}` +
      `&props=labels&languages=en&format=json`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    const data = await res.json();
    for (const id of chunk) {
      out[id] = data.entities?.[id]?.labels?.en?.value || id;
    }
    await sleep(120);
  }
  return out;
}

async function entityClaims(id) {
  const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${id}&props=claims&format=json`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  const data = await res.json();
  return data.entities?.[id]?.claims || {};
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function claimPersonId(claims, prop) {
  const c = claims?.[prop]?.[0]?.mainsnak?.datavalue?.value;
  return c?.id || null;
}

function isLivingPersonId(id, labels, claimsById) {
  const claims = claimsById?.[id];
  if (!claims) return true;
  const death = claims.P570?.[0]?.mainsnak?.datavalue?.value;
  return !death;
}

/** P6/P35/P457 for all sovereign states (fast). */
async function fetchLeadershipByIso() {
  const q = `SELECT ?iso ?person ?personLabel ?role WHERE {
    ?country wdt:P31/wdt:P279* wd:Q3624078 .
    ?country wdt:P297 ?iso .
    {
      ?country wdt:P35 ?person . BIND("head_of_state" AS ?role)
    } UNION {
      ?country wdt:P6 ?person . BIND("head_of_government" AS ?role)
    } UNION {
      ?country wdt:P457 ?person . BIND("vice_president" AS ?role)
    }
    ?person rdfs:label ?personLabel FILTER(LANG(?personLabel)="en")
  }`;
  const rows = await sparql(q);

  const byIso = new Map();

  for (const row of rows) {
    const iso = row.iso.value;
    const role = row.role.value;
    const personId = normalizeQid(row.person.value);
    const name = row.personLabel?.value || personId;
    if (!name || SKIP_PERSON_RE.test(name) || /^https?:\/\//i.test(name) || /^Q\d+$/i.test(name)) continue;

    if (!byIso.has(iso)) byIso.set(iso, []);
    const office =
      role === "head_of_state" && /king|queen|emperor|sultan|pope|grand duke/i.test(name)
        ? "Head of State"
        : role === "head_of_state" && iso === "US"
          ? "President"
          : ROLE_OFFICE[role] || role;

    byIso.get(iso).push({ office, name, personId, role });
  }

  return byIso;
}

/** Finance ministers in ISO batches (heavy query). */
async function fetchFinanceByIsoBatch(isoCodes, batchSize = 35) {
  const byIso = new Map();
  for (let i = 0; i < isoCodes.length; i += batchSize) {
    const batch = isoCodes.slice(i, i + batchSize);
    const values = batch.map((c) => `"${c}"`).join(" ");
    const q = `SELECT ?iso ?posLabel ?personLabel WHERE {
      VALUES ?iso { ${values} }
      ?country wdt:P297 ?iso .
      ?pos wdt:P17 ?country .
      ?pos wdt:P39 ?person .
      ?pos rdfs:label ?posLabel FILTER(LANG(?posLabel)="en")
      ?person rdfs:label ?personLabel FILTER(LANG(?personLabel)="en")
      FILTER(REGEX(LCASE(?posLabel), "finance|treasury|exchequer|minister of finance|minister for finance"))
    }`;
    try {
      const rows = await sparql(q, 90000);
      for (const row of rows) {
        const iso = row.iso.value;
        const posLabel = row.posLabel.value;
        const name = row.personLabel?.value;
        if (!name || !POSITION_RE.test(posLabel) || SKIP_PERSON_RE.test(name)) continue;
        if (!byIso.has(iso)) byIso.set(iso, []);
        const list = byIso.get(iso);
        if (!list.some((x) => x.name === name && x.office === posLabel)) {
          list.push({ office: normalizeFinanceOffice(posLabel), name, role: "finance" });
        }
      }
    } catch (err) {
      console.warn(`  finance batch ${i / batchSize + 1} failed:`, err.message);
    }
    await sleep(800);
  }
  return byIso;
}

function normalizeFinanceOffice(posLabel) {
  if (/exchequer/i.test(posLabel)) return "Chancellor of the Exchequer";
  if (/treasury/i.test(posLabel)) return "Secretary of the Treasury";
  return "Minister of Finance";
}

/** Fallback finance lookup via position search + current P39 on person. */
async function fetchFinanceFallback(countryName, iso) {
  const queries = [
    `Minister of Finance of ${countryName}`,
    `Minister of Finance (${countryName})`,
    `${countryName} Secretary of the Treasury`,
    `Minister for Finance (${countryName})`,
  ];
  if (iso === "GB") queries.unshift("Chancellor of the Exchequer");

  for (const q of queries) {
    const hits = await wikidataSearch(q);
    for (const hit of hits) {
      if (!POSITION_RE.test(hit.label) && !/exchequer|treasury/i.test(hit.label)) continue;
      const claims = await entityClaims(hit.id);
      const holder = claimPersonId(claims, "P1308") || (await currentHolderFromBacklinks(hit.id));
      if (!holder) continue;
      const labels = await entityLabels([holder]);
      const name = labels[holder];
      if (!name || SKIP_PERSON_RE.test(name)) continue;
      return { office: normalizeFinanceOffice(hit.label), name, role: "finance" };
    }
    await sleep(200);
  }
  return null;
}

async function currentHolderFromBacklinks(positionId) {
  const url =
    `https://www.wikidata.org/w/api.php?action=query&list=backlinks` +
    `&bltitle=${positionId}&blnamespace=0&bllimit=50&format=json`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  const data = await res.json();
  const links = data.query?.backlinks || [];
  const personIds = links.map((l) => l.title).filter((t) => t.startsWith("Q"));

  for (const pid of personIds) {
    const claims = await entityClaims(pid);
    const positions = claims.P39 || [];
    const current = positions.find((c) => {
      const pos = c.mainsnak?.datavalue?.value?.id;
      if (pos !== positionId) return false;
      return !c.qualifiers?.P582?.length;
    });
    if (current) return pid;
  }
  return null;
}

/**
 * Merge leadership + finance maps; dedupe offices per country.
 */
function mergeOfficials(leadershipMap, financeMap) {
  const out = new Map();
  for (const [iso, list] of leadershipMap) {
    out.set(iso, [...list]);
  }
  for (const [iso, list] of financeMap) {
    if (!out.has(iso)) out.set(iso, []);
    const merged = out.get(iso);
    for (const f of list) {
      if (!merged.some((x) => x.name === f.name && x.office === f.office)) merged.push(f);
    }
  }
  return out;
}

/**
 * Map head_of_state → President for presidential republics where P6 is historical.
 */
function postProcessCountryOfficials(iso, officials) {
  const hasPresident = officials.some((o) => o.office === "President" || o.role === "head_of_state");
  const hasPm = officials.some((o) => o.office === "Prime Minister");
  const filtered = [];

  for (const o of officials) {
    let office = o.office;
    if (o.role === "head_of_state" && !/king|queen|emperor|pope|sultan/i.test(o.name)) {
      if (iso === "US" || (!hasPm && o.role === "head_of_state")) office = "President";
      else if (/monarch|king|queen/i.test(o.name)) office = "Head of State";
      else if (!hasPm) office = "President";
    }
    if (o.role === "head_of_government") office = "Prime Minister";
    if (o.role === "vice_president") office = "Vice President";

    if (o.role === "head_of_state" && hasPm && /king|queen|emperor|pope|harald|charles iii|felipe|margrethe/i.test(o.name)) {
      office = "Head of State";
    }

    filtered.push({ ...o, office });
  }

  const seen = new Set();
  return filtered.filter((o) => {
    const key = `${o.office}::${o.name}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

module.exports = {
  sparql,
  fetchLeadershipByIso,
  fetchFinanceByIsoBatch,
  fetchFinanceFallback,
  mergeOfficials,
  postProcessCountryOfficials,
  sleep,
};
