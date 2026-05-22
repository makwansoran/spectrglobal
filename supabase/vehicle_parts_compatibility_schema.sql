-- Spectr — join table linking parts to specific car models.
-- Run after schema.sql (which creates public.parts and public.models).

create table if not exists public.vehicle_parts_compatibility (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references public.models(id) on delete cascade,
  part_id text not null references public.parts(id) on delete cascade,
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vehicle_parts_compatibility_unique unique (model_id, part_id)
);

alter table public.vehicle_parts_compatibility enable row level security;

drop policy if exists "Public read vehicle_parts_compatibility" on public.vehicle_parts_compatibility;
create policy "Public read vehicle_parts_compatibility"
  on public.vehicle_parts_compatibility
  for select
  to anon, authenticated
  using (true);

create index if not exists vehicle_parts_compatibility_model_idx
  on public.vehicle_parts_compatibility (model_id, sort_order);

create index if not exists vehicle_parts_compatibility_part_idx
  on public.vehicle_parts_compatibility (part_id);

-- Realistic demo catalog — 10 example parts covering the main categories.
-- Each one is linked to every model so a vehicle search returns a believable list.
-- Safe to re-run; uses ON CONFLICT DO NOTHING.
insert into public.parts (id, name, category, sku, price, stock, description, delivery_time, vehicles, active) values
  ('demo-bosch-front-brake-pads', 'Bosch QuietCast Front Brake Pads', 'Brakes', 'BOSCH-BP-F-001', 69.00, 25,
    'Ceramic front brake pads with low-dust formula. Demo catalog entry — replace with real product copy when ready.',
    '2-5 days', '[]'::jsonb, true),
  ('demo-bosch-rear-brake-pads', 'Bosch QuietCast Rear Brake Pads', 'Brakes', 'BOSCH-BP-R-001', 59.00, 25,
    'Ceramic rear brake pads. Demo catalog entry.',
    '2-5 days', '[]'::jsonb, true),
  ('demo-philips-h7-headlight', 'Philips X-tremeVision Pro150 H7', 'Lighting', 'PHILIPS-H7-PRO150', 39.00, 40,
    'High-output halogen H7 bulb with 150 percent more brightness vs standard. Demo catalog entry.',
    '2-5 days', '[]'::jsonb, true),
  ('demo-philips-tail-bulb', 'Philips LongLife P21W Tail Bulb', 'Lighting', 'PHILIPS-P21W-LL', 8.00, 80,
    'Long-life rear / brake bulb. Demo catalog entry.',
    '2-5 days', '[]'::jsonb, true),
  ('demo-castrol-edge-5w30-5l', 'Castrol EDGE 5W-30 Fully Synthetic 5L', 'Oils', 'CASTROL-EDGE-5W30-5L', 59.00, 35,
    'Fully synthetic engine oil. Suitable for most modern petrol and diesel engines requiring 5W-30. Demo catalog entry.',
    '2-5 days', '[]'::jsonb, true),
  ('demo-kyb-front-shock', 'KYB Excel-G Front Shock Absorber', 'Suspension', 'KYB-EXG-F-001', 119.00, 18,
    'Gas-charged front shock absorber with OE-matched valving. Demo catalog entry.',
    '2-5 days', '[]'::jsonb, true),
  ('demo-luk-clutch-kit', 'LuK RepSet 3-Piece Clutch Kit', 'Transmission', 'LUK-REPSET-3PC', 249.00, 8,
    'Complete clutch kit including cover, disc and release bearing. Demo catalog entry.',
    '2-5 days', '[]'::jsonb, true),
  ('demo-mann-air-filter', 'Mann-Filter Air Filter Element', 'Filters', 'MANN-AF-001', 24.00, 50,
    'Premium engine air filter element. Demo catalog entry.',
    '2-5 days', '[]'::jsonb, true),
  ('demo-ngk-iridium-spark-plug', 'NGK Iridium IX Spark Plug', 'Engine', 'NGK-IRIDIUM-IX', 14.00, 100,
    'Long-life iridium spark plug for petrol engines. Demo catalog entry.',
    '2-5 days', '[]'::jsonb, true),
  ('demo-bosch-aerotwin-wipers', 'Bosch Aerotwin Wiper Blade Pair', 'Body', 'BOSCH-AT-PAIR', 39.00, 45,
    'Aerodynamic flat wiper blade pair. Demo catalog entry.',
    '2-5 days', '[]'::jsonb, true)
on conflict (id) do nothing;

-- Link every demo part to every (European) car model.
insert into public.vehicle_parts_compatibility (model_id, part_id, notes)
select mo.id, p.id, 'Demo catalog link'
from public.models mo
join public.makes mk on mk.id = mo.make_id
cross join (select id from public.parts where id like 'demo-%') p
where mk.region = 'Europe'
on conflict (model_id, part_id) do nothing;
