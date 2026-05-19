-- Countries + politicians (run after supabase/schema.sql)
-- Seed: npm run db:build-countries && npm run db:seed-countries
--       npm run db:seed-politicians

-- Sovereign states / territories catalog
create table if not exists public.countries (
  slug text primary key,
  iso_code text not null,
  name text not null,
  meta text not null default '',
  initials text not null default '',
  search_terms jsonb not null default '[]'::jsonb,
  profile_json jsonb not null,
  map_geojson jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists countries_name_idx on public.countries (name);
create index if not exists countries_iso_idx on public.countries (iso_code);

alter table public.countries enable row level security;

drop policy if exists "Public read countries" on public.countries;
create policy "Public read countries"
  on public.countries
  for select
  to anon, authenticated
  using (true);

-- Politicians (office holders — one row per person per country)
create table if not exists public.politicians (
  country_slug text not null references public.countries (slug) on delete cascade,
  slug text not null,
  name text not null,
  office text not null default '',
  meta text not null default '',
  initials text not null default '',
  search_terms jsonb not null default '[]'::jsonb,
  profile_json jsonb not null,
  sort_order int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (country_slug, slug)
);

create index if not exists politicians_slug_idx on public.politicians (slug);
create index if not exists politicians_name_idx on public.politicians (name);
create index if not exists politicians_country_idx on public.politicians (country_slug);

alter table public.politicians enable row level security;

drop policy if exists "Public read politicians" on public.politicians;
create policy "Public read politicians"
  on public.politicians
  for select
  to anon, authenticated
  using (true);
