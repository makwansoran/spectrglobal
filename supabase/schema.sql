-- Run in Supabase Dashboard → SQL → New query (run the FULL file once)
-- https://supabase.com/dashboard/project/_/sql
--
-- Tables in this project (public schema — visible in Table Editor):
--   companies           — listed / private companies
--   company_people      — executives & board (per company; full profile in profile_json)
--   commodities         — futures / physical commodities
--   vessels             — ships & offshore units
--   planes              — aircraft & routes
--   banks               — commercial & retail banks
--   investment_banks    — bulge bracket / boutique IBs
--   venture_capital     — VC firms & funds
--   maritime_waterways  — straits & canals (maritime traffic maps)
--   chat_messages       — profile chat rooms
--   profiles            — user accounts (username, email); run supabase/auth-profiles.sql
--   euronext_listings   — Oslo Børs instruments (Euronext Live sync)
--   euronext_market_snapshots — scraped Oslo market page snapshots
--
-- Run this ENTIRE file once in Supabase → SQL → New query → Run
-- Then: npm run db:status  &&  npm run db:seed-all

create table if not exists public.companies (
  slug text primary key,
  name text not null,
  legal_name text not null,
  meta text not null,
  initials text not null,
  search_terms jsonb not null default '[]'::jsonb,
  profile_json jsonb not null,
  map_geojson jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists companies_name_idx on public.companies (name);

alter table public.companies enable row level security;

-- Public read (homepage search + profile API via anon key if needed)
drop policy if exists "Public read companies" on public.companies;
create policy "Public read companies"
  on public.companies
  for select
  to anon, authenticated
  using (true);

-- Writes use SUPABASE_SERVICE_ROLE_KEY in seed/scripts (bypasses RLS)

-- Company people (one table — person profile + company role)
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
create policy "Public read company_people"
  on public.company_people
  for select
  to anon, authenticated
  using (true);

-- Commodities (futures / physical — separate from listed companies)
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
create policy "Public read commodities"
  on public.commodities
  for select
  to anon, authenticated
  using (true);

-- Vessels (shipping fleet — positions, routes; optional company link)
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
create index if not exists vessels_company_idx on public.vessels (company_slug);

alter table public.vessels enable row level security;

drop policy if exists "Public read vessels" on public.vessels;
create policy "Public read vessels"
  on public.vessels
  for select
  to anon, authenticated
  using (true);

-- Planes / aircraft (registration, type, routes in profile_json)
create table if not exists public.planes (
  slug text primary key,
  name text not null,
  company_slug text references public.companies (slug) on delete set null,
  registration text,
  meta text not null default '',
  initials text not null default '',
  search_terms jsonb not null default '[]'::jsonb,
  profile_json jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists planes_name_idx on public.planes (name);
create index if not exists planes_company_idx on public.planes (company_slug);

alter table public.planes enable row level security;

drop policy if exists "Public read planes" on public.planes;
create policy "Public read planes"
  on public.planes
  for select
  to anon, authenticated
  using (true);

-- Banks (commercial / retail)
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
create policy "Public read banks"
  on public.banks
  for select
  to anon, authenticated
  using (true);

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
create policy "Public read investment_banks"
  on public.investment_banks
  for select
  to anon, authenticated
  using (true);

-- Venture capital firms
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
create policy "Public read venture_capital"
  on public.venture_capital
  for select
  to anon, authenticated
  using (true);

-- Live chat on company / commodity profile pages
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  room_type text not null check (room_type in ('company', 'commodity')),
  room_slug text not null,
  author_id text not null,
  author_name text not null,
  body text not null check (char_length(body) > 0 and char_length(body) <= 2000),
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_room_idx
  on public.chat_messages (room_type, room_slug, created_at desc);

alter table public.chat_messages enable row level security;

drop policy if exists "Public read chat" on public.chat_messages;
create policy "Public read chat"
  on public.chat_messages
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public insert chat" on public.chat_messages;
create policy "Public insert chat"
  on public.chat_messages
  for insert
  to anon, authenticated
  with check (
    room_type in ('company', 'commodity')
    and char_length(room_slug) > 0
    and char_length(trim(body)) > 0
    and char_length(body) <= 2000
    and char_length(author_id) > 0
    and char_length(author_name) > 0
  );

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'chat_messages'
  ) then
    alter publication supabase_realtime add table public.chat_messages;
  end if;
end $$;

-- Maritime straits & canals — seed: npm run db:seed-waterways
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

-- User accounts (Supabase Auth + profiles)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_len check (char_length(username) between 3 and 32),
  constraint profiles_username_format check (username ~ '^[a-zA-Z0-9_]+$')
);

create unique index if not exists profiles_username_lower_idx on public.profiles (lower(username));
create unique index if not exists profiles_email_lower_idx on public.profiles (lower(email));

alter table public.profiles enable row level security;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
