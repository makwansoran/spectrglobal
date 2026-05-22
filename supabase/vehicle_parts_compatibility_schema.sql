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

-- Seed one example part per make and link it to every model for that make.
-- Safe to re-run; uses ON CONFLICT DO NOTHING.
with make_parts as (
  select
    'example-' || m.slug || '-starter-kit' as id,
    'Starter Service Kit — ' || m.name as name,
    'Service Kits' as category,
    upper(replace(m.slug, '-', '')) || '-STARTER-001' as sku,
    49.00::numeric as price,
    10 as stock,
    'Example part used to test the parts-by-vehicle search for ' || m.name
      || ' vehicles. Replace with real catalog entries when ready.' as description,
    '2-5 days' as delivery_time,
    jsonb_build_array(jsonb_build_object('brand', m.name, 'model', 'All models')) as vehicles,
    true as active
  from public.makes m
)
insert into public.parts (id, name, category, sku, price, stock, description, delivery_time, vehicles, active)
select id, name, category, sku, price, stock, description, delivery_time, vehicles, active
from make_parts
on conflict (id) do nothing;

insert into public.vehicle_parts_compatibility (model_id, part_id, notes)
select mo.id, 'example-' || mk.slug || '-starter-kit', 'Auto-seeded example linking'
from public.models mo
join public.makes mk on mk.id = mo.make_id
where exists (
  select 1 from public.parts p where p.id = 'example-' || mk.slug || '-starter-kit'
)
on conflict (model_id, part_id) do nothing;
