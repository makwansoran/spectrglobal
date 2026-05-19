/**
 * Create a Spectr editor account (can add company profiles via /admin-company.html).
 *
 * Prerequisites:
 *   1. Run supabase/editor-role.sql in Supabase SQL editor (once)
 *   2. SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env
 *
 * Usage:
 *   node scripts/create-editor.js --email you@example.com --password "YourPass123" --username editor1
 */
require("./load-env").loadEnv();

const { getAdminClient, hasSupabaseWrites, isSupabaseEnabled } = require("../server/supabase-client");

const USERNAME_RE = /^[a-zA-Z0-9_]{3,32}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--email" || a === "-e") out.email = argv[++i];
    else if (a === "--password" || a === "-p") out.password = argv[++i];
    else if (a === "--username" || a === "-u") out.username = argv[++i];
    else if (a === "--help" || a === "-h") out.help = true;
  }
  return out;
}

function usage() {
  console.log(`
Create a Spectr editor account.

  node scripts/create-editor.js --email you@example.com --password "min8chars" --username editor1

Then sign in at /login.html and open /admin-company.html
`);
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    usage();
    return;
  }

  if (!isSupabaseEnabled() || !hasSupabaseWrites()) {
    console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
    process.exit(1);
  }

  const email = String(args.email || "").trim().toLowerCase();
  const password = String(args.password || "");
  const username = String(args.username || "")
    .trim()
    .toLowerCase();

  if (!EMAIL_RE.test(email)) {
    console.error("Valid --email is required.");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }
  if (!USERNAME_RE.test(username)) {
    console.error("Username must be 3–32 characters (letters, numbers, underscore).");
    process.exit(1);
  }

  const admin = getAdminClient();

  const { data: existingUsername } = await admin
    .from("profiles")
    .select("id")
    .ilike("username", username)
    .limit(1);
  if (existingUsername?.length) {
    console.error(`Username "${username}" is already taken.`);
    process.exit(1);
  }

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: "editor" },
    user_metadata: { username },
  });

  if (createErr) {
    console.error("Could not create user:", createErr.message);
    process.exit(1);
  }

  const userId = created.user?.id;
  if (!userId) {
    console.error("User created but id missing.");
    process.exit(1);
  }

  const { error: profileErr } = await admin.from("profiles").insert({
    id: userId,
    username,
    email,
    role: "editor",
  });

  if (profileErr) {
    await admin.auth.admin.deleteUser(userId).catch(() => {});
    if (/role|column/i.test(profileErr.message || "")) {
      console.error(
        "profiles.role column missing. Run supabase/editor-role.sql in Supabase SQL editor, then retry."
      );
    } else {
      console.error("Could not save profile:", profileErr.message);
    }
    process.exit(1);
  }

  console.log("Editor account created.");
  console.log(`  Email:    ${email}`);
  console.log(`  Username: ${username}`);
  console.log(`  Sign in:  /login.html`);
  console.log(`  Form:     /admin-company.html`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
