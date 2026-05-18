/**
 * List Spectr Supabase tables and row counts.
 * Run: node scripts/db-status.js
 */
require("./load-env").loadEnv();

const { createClient } = require("@supabase/supabase-js");

const TABLES = [
  "companies",
  "company_people",
  "commodities",
  "vessels",
  "planes",
  "banks",
  "investment_banks",
  "venture_capital",
  "chat_messages",
];

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) in .env");
    process.exit(1);
  }

  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log(`Supabase: ${url}\n`);
  console.log("Table".padEnd(20), "Status".padEnd(14), "Rows");
  console.log("-".repeat(48));

  let missing = 0;

  for (const table of TABLES) {
    // Use a real SELECT (not HEAD-only) — PostgREST can return a false OK on head for missing tables.
    const { data, count, error } = await client
      .from(table)
      .select("slug", { count: "exact" })
      .limit(1);

    if (error) {
      const notFound =
        /does not exist|schema cache|Could not find the table/i.test(error.message || "");
      console.log(table.padEnd(20), notFound ? "MISSING" : "ERROR", notFound ? "—" : error.message);
      if (notFound) missing++;
    } else {
      console.log(table.padEnd(20), "OK".padEnd(14), String(count ?? data?.length ?? 0));
    }
  }

  console.log("");
  if (missing > 0) {
    console.log(`${missing} table(s) missing. Run the full SQL in supabase/schema.sql in the Supabase SQL editor.`);
    console.log("Dashboard → SQL → New query → paste schema.sql → Run");
  } else {
    console.log("All tables exist. Use npm run db:seed-* to load data.");
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
