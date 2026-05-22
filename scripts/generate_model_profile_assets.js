/**
 * Generate consistent local profile pictures for every vehicle model.
 *
 * The hand-curated PNGs in assets/models stay untouched. Every other model
 * receives a local SVG profile image so the brand model carousel never falls
 * back to missing or mismatched remote images.
 */
require("./load-env").loadEnv();

const fs = require("fs");
const path = require("path");
const { getAdminClient } = require("../server/supabase-client");

const REPO_ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(REPO_ROOT, "assets", "models", "generated");
const PUBLIC_PREFIX = "/assets/models/generated";

const KEEP_LOCAL_IMAGES = new Set([
  "/assets/models/volkswagen-amarok-profile.png",
  "/assets/models/volkswagen-arteon-profile.png",
  "/assets/models/volkswagen-caddy-profile.png",
  "/assets/models/volkswagen-polo-profile.png",
]);

function slugify(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "model";
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function bodyFamily(bodyType) {
  const body = String(bodyType || "").toLowerCase();
  if (body.includes("pickup")) return "pickup";
  if (body.includes("van") || body.includes("mpv")) return "van";
  if (body.includes("suv") || body.includes("crossover")) return "suv";
  if (body.includes("coupe") || body.includes("convertible")) return "coupe";
  if (body.includes("wagon") || body.includes("estate")) return "wagon";
  if (body.includes("hatch")) return "hatchback";
  return "sedan";
}

function bodyPath(family) {
  const paths = {
    pickup: "M142 377 C166 313 213 282 286 282 H446 C485 282 511 298 539 333 L609 333 C657 333 701 352 732 384 L799 398 C833 405 853 428 853 459 V504 H790 C783 455 745 421 696 421 C646 421 608 455 601 504 H326 C319 455 281 421 232 421 C183 421 145 455 138 504 H84 V448 C84 414 105 390 142 377 Z M278 306 H430 C464 306 483 318 506 346 H278 Z M153 346 H253 V280 H162 C143 299 136 322 153 346 Z",
    van: "M113 358 C131 299 172 270 236 270 H548 C614 270 674 303 708 359 L786 374 C829 383 852 412 852 457 V504 H790 C783 455 745 421 696 421 C646 421 608 455 601 504 H323 C316 455 278 421 229 421 C180 421 142 455 135 504 H84 V424 C84 393 95 372 113 358 Z M246 298 H415 V356 H246 Z M435 298 H554 C603 298 641 318 669 356 H435 Z",
    suv: "M118 381 C144 319 194 288 268 288 H490 C558 288 614 316 657 371 L775 388 C825 397 854 426 854 468 V504 H790 C783 455 745 421 696 421 C646 421 608 455 601 504 H323 C316 455 278 421 229 421 C180 421 142 455 135 504 H84 V444 C84 413 96 394 118 381 Z M268 315 H413 V364 H244 Z M436 315 H505 C558 315 599 331 630 364 H436 Z",
    coupe: "M112 397 C159 346 223 316 313 306 L501 286 C588 277 660 317 719 389 L788 400 C828 407 854 435 854 469 V504 H790 C783 455 745 421 696 421 C646 421 608 455 601 504 H323 C316 455 278 421 229 421 C180 421 142 455 135 504 H84 V449 C84 425 94 409 112 397 Z M300 327 H445 C498 327 541 341 577 371 H256 Z",
    wagon: "M113 385 C148 326 205 297 283 297 H539 C600 297 656 329 696 385 L785 399 C829 407 854 435 854 470 V504 H790 C783 455 745 421 696 421 C646 421 608 455 601 504 H323 C316 455 278 421 229 421 C180 421 142 455 135 504 H84 V447 C84 420 94 401 113 385 Z M276 322 H425 V368 H256 Z M449 322 H540 C587 322 625 337 657 368 H449 Z",
    hatchback: "M121 388 C154 329 208 300 282 300 H498 C559 300 612 330 653 386 L775 401 C824 408 854 435 854 471 V504 H790 C783 455 745 421 696 421 C646 421 608 455 601 504 H323 C316 455 278 421 229 421 C180 421 142 455 135 504 H84 V450 C84 421 97 402 121 388 Z M282 324 H418 V368 H255 Z M443 324 H499 C548 324 586 339 618 368 H443 Z",
    sedan: "M109 392 C151 341 214 311 298 306 L518 297 C592 295 655 329 704 391 L789 402 C829 407 854 436 854 470 V504 H790 C783 455 745 421 696 421 C646 421 608 455 601 504 H323 C316 455 278 421 229 421 C180 421 142 455 135 504 H84 V449 C84 424 93 407 109 392 Z M298 326 H438 V369 H262 Z M461 326 H526 C581 326 622 340 657 369 H461 Z",
  };
  return paths[family] || paths.sedan;
}

function svgForModel(model) {
  const family = bodyFamily(model.body_type);
  const title = `${model.make_name} ${model.model_name}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="675" viewBox="0 0 1024 675" role="img" aria-label="${escapeHtml(title)} profile picture">
  <rect width="1024" height="675" fill="#fff"/>
  <ellipse cx="512" cy="526" rx="382" ry="23" fill="#d9dde3" opacity="0.52"/>
  <path d="${bodyPath(family)}" fill="#f9fafb" stroke="#475569" stroke-width="5" stroke-linejoin="round"/>
  <path d="${bodyPath(family)}" fill="none" stroke="#ffffff" stroke-width="10" stroke-linejoin="round" opacity="0.72"/>
  <g fill="#101827" stroke="#0f172a" stroke-width="5">
    <circle cx="229" cy="504" r="70"/>
    <circle cx="696" cy="504" r="70"/>
  </g>
  <g fill="#f8fafc" stroke="#64748b" stroke-width="5">
    <circle cx="229" cy="504" r="43"/>
    <circle cx="696" cy="504" r="43"/>
  </g>
  <g stroke="#94a3b8" stroke-width="7" stroke-linecap="round">
    <path d="M229 465 V543"/>
    <path d="M190 504 H268"/>
    <path d="M201 476 L257 532"/>
    <path d="M257 476 L201 532"/>
    <path d="M696 465 V543"/>
    <path d="M657 504 H735"/>
    <path d="M668 476 L724 532"/>
    <path d="M724 476 L668 532"/>
  </g>
  <g fill="#334155" opacity="0.84">
    <path d="M262 326 H438 V369 H262 Z"/>
    <path d="M461 326 H595 C622 335 644 349 657 369 H461 Z"/>
  </g>
  <g stroke="#cbd5e1" stroke-width="4" stroke-linecap="round" opacity="0.9">
    <path d="M356 382 V467"/>
    <path d="M503 379 V468"/>
    <path d="M379 404 H419"/>
    <path d="M526 404 H566"/>
    <path d="M161 430 H218"/>
    <path d="M768 429 H821"/>
  </g>
  <path d="M127 399 C180 353 245 333 324 331 H580" fill="none" stroke="#ffffff" stroke-width="12" stroke-linecap="round" opacity="0.8"/>
</svg>
`;
}

async function fetchAllModels(client) {
  const pageSize = 1000;
  const { data, error } = await client
    .from("models")
    .select("id, name, body_type, image_url, makes(slug, name)")
    .order("name", { ascending: true })
    .range(0, pageSize - 1);

  if (error) throw error;
  return (data || []).map((row) => {
    const make = Array.isArray(row.makes) ? row.makes[0] : row.makes;
    return {
      id: row.id,
      make_slug: make && make.slug,
      make_name: (make && make.name) || "Car",
      model_name: row.name,
      body_type: row.body_type || "",
      image_url: row.image_url || "",
    };
  });
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const client = getAdminClient();
  const models = await fetchAllModels(client);
  let generated = 0;
  let updated = 0;
  const updates = [];

  for (const model of models) {
    const currentUrl = String(model.image_url || "").trim();
    if (KEEP_LOCAL_IMAGES.has(currentUrl)) continue;

    const fileName = `${slugify(model.make_slug || model.make_name)}-${slugify(model.model_name)}-profile.svg`;
    const publicPath = `${PUBLIC_PREFIX}/${fileName}`;
    fs.writeFileSync(path.join(OUTPUT_DIR, fileName), svgForModel(model), "utf8");
    generated += 1;

    if (currentUrl !== publicPath) {
      updates.push({ id: model.id, image_url: publicPath });
    }
  }

  for (const update of updates) {
    const { error } = await client
      .from("models")
      .update({ image_url: update.image_url })
      .eq("id", update.id);
    if (error) throw error;
    updated += 1;
  }

  console.log(`Generated ${generated} model profile assets.`);
  console.log(`Updated ${updated} model image URLs.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
