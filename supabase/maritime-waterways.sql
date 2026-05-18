-- Maritime straits & canals — run after schema.sql (or standalone on existing project)
-- Seed: npm run db:seed-waterways

create table if not exists public.maritime_waterways (
  slug text primary key,
  name text not null,
  waterway_type text not null check (waterway_type in ('strait', 'canal')),
  region_label text not null default '',
  meta text not null default '',
  initials text not null default '',
  search_terms jsonb not null default '[]'::jsonb,
  importance smallint not null default 3 check (importance between 1 and 5),
  bounds jsonb not null,
  center jsonb not null,
  waterway_geojson jsonb not null,
  profile_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists maritime_waterways_name_idx on public.maritime_waterways (name);
create index if not exists maritime_waterways_type_idx on public.maritime_waterways (waterway_type);

alter table public.maritime_waterways enable row level security;

drop policy if exists "Public read maritime_waterways" on public.maritime_waterways;
create policy "Public read maritime_waterways"
  on public.maritime_waterways
  for select
  to anon, authenticated
  using (true);
