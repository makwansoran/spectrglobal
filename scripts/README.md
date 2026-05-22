# Car brands & models scraper

Populate `public.makes`, `public.models`, and (optionally) seed a small realistic demo catalog plus the `vehicle_parts_compatibility` join table.

The script is **idempotent** — it matches existing rows by slug (`makes`) and by `(make_id, name)` (`models`), so re-runs only add new data.

> **European-only catalog.** The scraper filters every scraped brand against `EUROPEAN_BRAND_SLUGS` in `scrape_cars.py` and skips anything else (American / Asian brands are dropped). Edit that set if you ever want to expand the catalog.

## Workflow

```
NHTSA vPIC API   ─┐
CarQueryAPI       │─► Dedupe & clean ─► scripts/scraped_data.csv ─► Supabase
Wikipedia (list)  ─┘
```

## 1. Install dependencies

```powershell
python -m pip install -r scripts/requirements.txt
```

Requires Python 3.9+.

## 2. Configure credentials

```powershell
Copy-Item scripts/.env.example scripts/.env
notepad scripts/.env
```

Fill in:

```
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

The service-role key is server-side only — never commit it.

## 3. Make sure the schema exists

The base tables (`makes`, `models`, `parts`) come from `supabase/schema.sql`. If you also want the join table for connecting parts to specific car models, run:

```sql
-- In the Supabase SQL editor
\i supabase/vehicle_parts_compatibility_schema.sql
```

(or copy/paste the file's contents).

## 4. Run the scraper

Preview the data without touching Supabase:

```powershell
python scripts/scrape_cars.py --csv-only
```

Then open `scripts/scraped_data.csv` to review.

Full run — write CSV **and** upsert into Supabase:

```powershell
python scripts/scrape_cars.py
```

Also seed the realistic demo catalog (Bosch brake pads, Philips bulbs, Castrol EDGE 5W-30, KYB shock, LuK clutch kit, Mann air filter, NGK spark plug, Bosch Aerotwin wipers) and link every demo part to every European model so you can immediately test "search car → see parts" on the site:

```powershell
python scripts/scrape_cars.py --seed-examples
```

Limit to the first N brands while debugging:

```powershell
python scripts/scrape_cars.py --brand-limit 5 --verbose
```

## 5. Verify in Supabase

```sql
select count(*) from public.makes;
select count(*) from public.models;
select count(*) from public.vehicle_parts_compatibility;
```

## 6. Browse on the site

Once parts and compatibility rows exist, the site can ask:

```
GET /api/vehicle-parts?model_id=<uuid>
GET /api/vehicle-parts?make_id=<uuid>
```

The response is a list of parts already shaped like the rest of `/api/parts`,
so the existing catalog UI can render them directly.

## Adding your own parts

Use the admin **Supply management** page or insert directly into `public.parts`, then add rows to `public.vehicle_parts_compatibility` linking each part to the models it fits. Example:

```sql
insert into public.vehicle_parts_compatibility (model_id, part_id)
select id, 'my-part-id'
from public.models
where make_id = (select id from public.makes where slug = 'bmw');
```
