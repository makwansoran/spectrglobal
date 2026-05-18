-- Run in Supabase Dashboard → SQL → New query (if catalog tables are missing)
-- Full project schema: supabase/schema.sql

-- Company people (single people table)
create table if not exists public.company_people (
  company_slug text not null references public.companies (slug) on delete cascade,
  slug text not null,
  name text not null,
  title text not null default '',
  meta text not null default '',
  initials text not null default '',
  search_terms jsonb not null default '[]'::jsonb,
  profile_json jsonb not null,
  local_id text,
  sort_order int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (company_slug, slug)
);
create index if not exists company_people_slug_idx on public.company_people (slug);
create index if not exists company_people_name_idx on public.company_people (name);
alter table public.company_people enable row level security;
drop policy if exists "Public read company_people" on public.company_people;
create policy "Public read company_people" on public.company_people for select to anon, authenticated using (true);

-- Commodities (plural — not "commodity")
create table if not exists public.commodities (
  slug text primary key,
  name text not null,
  category text not null,
  meta text not null,
  initials text not null,
  search_terms jsonb not null default '[]'::jsonb,
  profile_json jsonb not null,
  updated_at timestamptz not null default now()
);
create index if not exists commodities_name_idx on public.commodities (name);
create index if not exists commodities_category_idx on public.commodities (category);
alter table public.commodities enable row level security;
drop policy if exists "Public read commodities" on public.commodities;
create policy "Public read commodities" on public.commodities for select to anon, authenticated using (true);

-- Vessels
create table if not exists public.vessels (
  slug text primary key,
  name text not null,
  company_slug text references public.companies (slug) on delete set null,
  vessel_type text not null default 'vessel',
  meta text not null default '',
  initials text not null default '',
  search_terms jsonb not null default '[]'::jsonb,
  profile_json jsonb not null,
  updated_at timestamptz not null default now()
);
create index if not exists vessels_name_idx on public.vessels (name);
alter table public.vessels enable row level security;
drop policy if exists "Public read vessels" on public.vessels;
create policy "Public read vessels" on public.vessels for select to anon, authenticated using (true);

-- Banks
create table if not exists public.banks (
  slug text primary key,
  name text not null,
  meta text not null default '',
  initials text not null default '',
  search_terms jsonb not null default '[]'::jsonb,
  profile_json jsonb not null,
  updated_at timestamptz not null default now()
);
create index if not exists banks_name_idx on public.banks (name);
alter table public.banks enable row level security;
drop policy if exists "Public read banks" on public.banks;
create policy "Public read banks" on public.banks for select to anon, authenticated using (true);

-- Investment banks
create table if not exists public.investment_banks (
  slug text primary key,
  name text not null,
  meta text not null default '',
  initials text not null default '',
  search_terms jsonb not null default '[]'::jsonb,
  profile_json jsonb not null,
  updated_at timestamptz not null default now()
);
create index if not exists investment_banks_name_idx on public.investment_banks (name);
alter table public.investment_banks enable row level security;
drop policy if exists "Public read investment_banks" on public.investment_banks;
create policy "Public read investment_banks" on public.investment_banks for select to anon, authenticated using (true);

-- Venture capital
create table if not exists public.venture_capital (
  slug text primary key,
  name text not null,
  meta text not null default '',
  initials text not null default '',
  search_terms jsonb not null default '[]'::jsonb,
  profile_json jsonb not null,
  updated_at timestamptz not null default now()
);
create index if not exists venture_capital_name_idx on public.venture_capital (name);
alter table public.venture_capital enable row level security;
drop policy if exists "Public read venture_capital" on public.venture_capital;
create policy "Public read venture_capital" on public.venture_capital for select to anon, authenticated using (true);

-- Reload PostgREST schema cache (Supabase picks this up automatically within ~1 min)
notify pgrst, 'reload schema';
