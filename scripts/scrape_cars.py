"""Spectr — car brands and models scraper.

Pulls makes and models from multiple authoritative sources, dedupes them,
writes a reviewable CSV, then idempotently upserts everything into Supabase.

Sources (run in order, all results merged and deduped):
  1. NHTSA vPIC API  (US gov, no auth required, very broad)
  2. CarQueryAPI     (clean JSON, includes years + body type)
  3. Wikipedia       ("List of car brands" + per-brand model tables)

Run:
    pip install -r scripts/requirements.txt
    cp scripts/.env.example scripts/.env   # then fill SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
    python scripts/scrape_cars.py --csv-only        # write CSV without touching DB
    python scripts/scrape_cars.py                   # write CSV + upsert to Supabase
    python scripts/scrape_cars.py --seed-examples   # also seed one example part per make

The script is idempotent — re-running it never duplicates makes/models
because it matches existing rows by slug (makes) and by (make_id, name) (models).
"""

from __future__ import annotations

import argparse
import csv
import json
import logging
import os
import re
import sys
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple
from urllib.parse import quote

import requests

try:
    from bs4 import BeautifulSoup  # noqa: F401  # used only for Wikipedia source
except ImportError:  # pragma: no cover
    BeautifulSoup = None  # type: ignore

try:
    from dotenv import load_dotenv
except ImportError:  # pragma: no cover
    load_dotenv = None  # type: ignore

try:
    from supabase import create_client, Client
except ImportError:  # pragma: no cover
    create_client = None  # type: ignore
    Client = None  # type: ignore


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_ENV = REPO_ROOT / ".env"
SCRIPT_ENV = REPO_ROOT / "scripts" / ".env"
DEFAULT_CSV = REPO_ROOT / "scripts" / "scraped_data.csv"

HTTP_TIMEOUT = 30
USER_AGENT = "spectrglobal-car-scraper/1.0 (+https://spectr.no)"

logger = logging.getLogger("spectr.scrape_cars")


# ---------------------------------------------------------------------------
# Data types
# ---------------------------------------------------------------------------


@dataclass
class CarRecord:
    brand_name: str
    model_name: str
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    engine_type: Optional[str] = None
    body_type: Optional[str] = None
    sources: List[str] = field(default_factory=list)

    @property
    def brand_slug(self) -> str:
        return slugify(self.brand_name)

    @property
    def dedupe_key(self) -> Tuple[str, str]:
        return (self.brand_slug, slugify(self.model_name))


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def slugify(value: str) -> str:
    if not value:
        return ""
    text = value.strip().lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def clean_year(value) -> Optional[int]:
    try:
        year = int(str(value).strip()[:4])
    except (TypeError, ValueError):
        return None
    if 1900 <= year <= 2100:
        return year
    return None


def http_get(url: str, params: Optional[dict] = None, retries: int = 3) -> Optional[requests.Response]:
    headers = {"User-Agent": USER_AGENT, "Accept": "application/json, text/html;q=0.8"}
    backoff = 1.0
    for attempt in range(1, retries + 1):
        try:
            response = requests.get(url, params=params, headers=headers, timeout=HTTP_TIMEOUT)
            if response.status_code == 200:
                return response
            logger.warning("GET %s -> HTTP %s (attempt %s)", url, response.status_code, attempt)
        except requests.RequestException as err:
            logger.warning("GET %s failed: %s (attempt %s)", url, err, attempt)
        time.sleep(backoff)
        backoff *= 2
    return None


# ---------------------------------------------------------------------------
# Source: NHTSA vPIC
# ---------------------------------------------------------------------------


def fetch_nhtsa_makes() -> List[str]:
    url = "https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes"
    response = http_get(url, params={"format": "json"})
    if not response:
        return []
    payload = response.json().get("Results", [])
    names = [str(item.get("Make_Name", "")).strip() for item in payload]
    return [name for name in names if name]


def fetch_nhtsa_models(brand: str) -> List[CarRecord]:
    url = f"https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/{quote(brand)}"
    response = http_get(url, params={"format": "json"})
    if not response:
        return []
    rows = response.json().get("Results", []) or []
    out: List[CarRecord] = []
    for item in rows:
        model_name = str(item.get("Model_Name", "")).strip()
        if not model_name:
            continue
        out.append(CarRecord(brand_name=brand, model_name=model_name, sources=["nhtsa"]))
    return out


# ---------------------------------------------------------------------------
# Source: CarQueryAPI
# ---------------------------------------------------------------------------


def fetch_carquery_makes() -> List[str]:
    url = "https://www.carqueryapi.com/api/0.3/?cmd=getMakes"
    response = http_get(url)
    if not response:
        return []
    try:
        payload = response.json()
    except ValueError:
        text = response.text.strip()
        if text.startswith("?(") and text.endswith(");"):
            text = text[2:-2]
        try:
            payload = json.loads(text)
        except ValueError:
            return []
    makes = payload.get("Makes", []) if isinstance(payload, dict) else []
    return [str(item.get("make_display", "")).strip() for item in makes if item.get("make_display")]


def fetch_carquery_models(brand: str) -> List[CarRecord]:
    url = "https://www.carqueryapi.com/api/0.3/"
    response = http_get(url, params={"cmd": "getModels", "make": brand.lower()})
    if not response:
        return []
    try:
        payload = response.json()
    except ValueError:
        text = response.text.strip()
        if text.startswith("?(") and text.endswith(");"):
            text = text[2:-2]
        try:
            payload = json.loads(text)
        except ValueError:
            return []
    models = payload.get("Models", []) if isinstance(payload, dict) else []
    out: List[CarRecord] = []
    for item in models:
        model_name = str(item.get("model_name", "")).strip()
        if not model_name:
            continue
        out.append(
            CarRecord(
                brand_name=brand,
                model_name=model_name,
                start_year=clean_year(item.get("model_make_year_from")),
                end_year=clean_year(item.get("model_make_year_to")),
                body_type=str(item.get("model_body", "")).strip() or None,
                sources=["carquery"],
            )
        )
    return out


# ---------------------------------------------------------------------------
# Source: Wikipedia (enrichment only)
# ---------------------------------------------------------------------------


def fetch_wikipedia_brands(limit: int = 60) -> List[str]:
    if BeautifulSoup is None:
        logger.info("BeautifulSoup not installed — skipping Wikipedia source.")
        return []
    url = "https://en.wikipedia.org/wiki/List_of_car_brands"
    response = http_get(url)
    if not response:
        return []
    soup = BeautifulSoup(response.text, "html.parser")
    brands: List[str] = []
    for li in soup.select("div.mw-parser-output li"):
        link = li.find("a")
        if not link or not link.get("href", "").startswith("/wiki/"):
            continue
        text = link.get_text(strip=True)
        if text and text not in brands and len(text) < 60:
            brands.append(text)
        if len(brands) >= limit:
            break
    return brands


# ---------------------------------------------------------------------------
# Aggregation
# ---------------------------------------------------------------------------


def collect_records(brand_limit: Optional[int]) -> List[CarRecord]:
    aggregated: Dict[Tuple[str, str], CarRecord] = {}

    logger.info("Fetching makes from NHTSA …")
    nhtsa_makes = fetch_nhtsa_makes()
    logger.info("  NHTSA returned %s makes", len(nhtsa_makes))

    logger.info("Fetching makes from CarQueryAPI …")
    carquery_makes = fetch_carquery_makes()
    logger.info("  CarQueryAPI returned %s makes", len(carquery_makes))

    logger.info("Fetching brand list from Wikipedia …")
    wiki_brands = fetch_wikipedia_brands()
    logger.info("  Wikipedia returned %s brands", len(wiki_brands))

    brand_pool: List[str] = []
    seen_slugs: set[str] = set()
    for source_list in (carquery_makes, nhtsa_makes, wiki_brands):
        for brand in source_list:
            slug = slugify(brand)
            if not slug or slug in seen_slugs:
                continue
            seen_slugs.add(slug)
            brand_pool.append(brand)

    if brand_limit:
        brand_pool = brand_pool[:brand_limit]
    logger.info("Resolving models for %s unique brands …", len(brand_pool))

    for index, brand in enumerate(brand_pool, 1):
        records: List[CarRecord] = []
        records.extend(fetch_carquery_models(brand))
        records.extend(fetch_nhtsa_models(brand))

        for record in records:
            key = record.dedupe_key
            if key in aggregated:
                existing = aggregated[key]
                if record.start_year and (not existing.start_year or record.start_year < existing.start_year):
                    existing.start_year = record.start_year
                if record.end_year and (not existing.end_year or record.end_year > existing.end_year):
                    existing.end_year = record.end_year
                if record.body_type and not existing.body_type:
                    existing.body_type = record.body_type
                if record.engine_type and not existing.engine_type:
                    existing.engine_type = record.engine_type
                for source in record.sources:
                    if source not in existing.sources:
                        existing.sources.append(source)
            else:
                aggregated[key] = record

        if index % 10 == 0 or index == len(brand_pool):
            logger.info("  Processed %s / %s brands (running total: %s models)", index, len(brand_pool), len(aggregated))

    return list(aggregated.values())


def write_csv(records: Iterable[CarRecord], path: Path) -> int:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.writer(fh)
        writer.writerow([
            "brand_name",
            "brand_slug",
            "model_name",
            "start_year",
            "end_year",
            "body_type",
            "engine_type",
            "sources",
        ])
        count = 0
        for record in records:
            writer.writerow([
                record.brand_name,
                record.brand_slug,
                record.model_name,
                record.start_year or "",
                record.end_year or "",
                record.body_type or "",
                record.engine_type or "",
                ";".join(record.sources),
            ])
            count += 1
    return count


# ---------------------------------------------------------------------------
# Supabase upsert
# ---------------------------------------------------------------------------


def load_env() -> None:
    if load_dotenv is None:
        return
    if SCRIPT_ENV.exists():
        load_dotenv(SCRIPT_ENV)
    elif DEFAULT_ENV.exists():
        load_dotenv(DEFAULT_ENV)


def supabase_client() -> Optional["Client"]:
    if create_client is None:
        logger.error("supabase-py is not installed. Run `pip install -r scripts/requirements.txt`.")
        return None
    url = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        logger.error(
            "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (see scripts/.env.example)."
        )
        return None
    return create_client(url, key)


def upsert_makes(client: "Client", records: List[CarRecord]) -> Dict[str, str]:
    unique: Dict[str, CarRecord] = {}
    for record in records:
        unique.setdefault(record.brand_slug, record)

    if not unique:
        return {}

    payload = []
    for record in unique.values():
        logo_text = re.sub(r"[^A-Z0-9]", "", record.brand_name.upper())[:6] or "CAR"
        payload.append({
            "slug": record.brand_slug,
            "name": record.brand_name,
            "logo_text": logo_text,
            "active": True,
        })

    logger.info("Upserting %s makes …", len(payload))
    client.table("makes").upsert(payload, on_conflict="slug").execute()

    rows = client.table("makes").select("id, slug").in_("slug", list(unique.keys())).execute().data or []
    return {row["slug"]: row["id"] for row in rows}


def upsert_models(client: "Client", records: List[CarRecord], make_ids: Dict[str, str]) -> int:
    grouped: Dict[str, List[CarRecord]] = {}
    for record in records:
        make_id = make_ids.get(record.brand_slug)
        if not make_id:
            continue
        grouped.setdefault(make_id, []).append(record)

    inserted = 0
    for make_id, items in grouped.items():
        existing = client.table("models").select("id, name").eq("make_id", make_id).execute().data or []
        existing_names = {slugify(row["name"]): row["id"] for row in existing}

        to_insert = []
        for record in items:
            if slugify(record.model_name) in existing_names:
                continue
            to_insert.append({
                "make_id": make_id,
                "name": record.model_name,
                "year_from": record.start_year,
                "year_to": record.end_year,
                "body_type": record.body_type,
            })

        for batch_start in range(0, len(to_insert), 500):
            batch = to_insert[batch_start : batch_start + 500]
            client.table("models").insert(batch).execute()
            inserted += len(batch)
            logger.info("  %s models inserted (running: %s)", len(batch), inserted)

    return inserted


def seed_example_parts(client: "Client", make_ids: Dict[str, str]) -> Tuple[int, int]:
    if not make_ids:
        return (0, 0)

    makes = client.table("makes").select("id, slug, name").in_("slug", list(make_ids.keys())).execute().data or []
    parts_payload = []
    for make in makes:
        slug = make.get("slug")
        name = make.get("name")
        if not slug or not name:
            continue
        sku = re.sub(r"[^A-Z0-9]", "", name.upper()) + "-STARTER-001"
        parts_payload.append({
            "id": f"example-{slug}-starter-kit",
            "name": f"Starter Service Kit — {name}",
            "category": "Service Kits",
            "sku": sku,
            "price": 49.00,
            "stock": 10,
            "description": (
                f"Example part used to test the parts-by-vehicle search for {name} "
                "vehicles. Replace with real catalog entries when ready."
            ),
            "delivery_time": "2-5 days",
            "vehicles": [{"brand": name, "model": "All models"}],
            "active": True,
        })

    if parts_payload:
        client.table("parts").upsert(parts_payload, on_conflict="id").execute()

    models = (
        client.table("models")
        .select("id, make_id")
        .in_("make_id", [make["id"] for make in makes])
        .execute()
        .data
        or []
    )
    make_slug_by_id = {make["id"]: make.get("slug") for make in makes}

    join_payload = []
    for model in models:
        slug = make_slug_by_id.get(model.get("make_id"))
        if not slug:
            continue
        join_payload.append({
            "model_id": model["id"],
            "part_id": f"example-{slug}-starter-kit",
            "notes": "Auto-seeded example linking",
        })

    inserted = 0
    for start in range(0, len(join_payload), 500):
        batch = join_payload[start : start + 500]
        client.table("vehicle_parts_compatibility").upsert(batch, on_conflict="model_id,part_id").execute()
        inserted += len(batch)

    return len(parts_payload), inserted


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Scrape car brands/models into Supabase.")
    parser.add_argument("--csv-only", action="store_true", help="Write CSV but skip Supabase upserts.")
    parser.add_argument("--csv-path", type=Path, default=DEFAULT_CSV, help="Where to write the CSV review file.")
    parser.add_argument("--brand-limit", type=int, default=None, help="Limit number of brands processed (debug).")
    parser.add_argument("--seed-examples", action="store_true", help="Seed example parts + compatibility rows.")
    parser.add_argument("--verbose", action="store_true", help="Enable debug logging.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s — %(message)s",
    )

    load_env()
    records = collect_records(args.brand_limit)
    if not records:
        logger.error("No records collected from any source — aborting.")
        return 1

    csv_count = write_csv(records, args.csv_path)
    logger.info("Wrote %s rows to %s", csv_count, args.csv_path)

    if args.csv_only:
        return 0

    client = supabase_client()
    if client is None:
        return 2

    make_ids = upsert_makes(client, records)
    logger.info("Upserted %s makes (have ids).", len(make_ids))

    inserted_models = upsert_models(client, records, make_ids)
    logger.info("Inserted %s new models.", inserted_models)

    if args.seed_examples:
        parts_count, join_count = seed_example_parts(client, make_ids)
        logger.info("Seeded %s example parts and %s compatibility rows.", parts_count, join_count)

    logger.info("Done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
