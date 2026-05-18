-- Run in Supabase Dashboard → SQL → New query (run the FULL file once)
-- https://supabase.com/dashboard/project/_/sql
--
-- Tables in this project:
--   companies        — company profiles (search + /company/:slug)
--   people           — person profiles (/person/:slug)
--   company_people   — links people ↔ companies (title, sort order)
--   commodities      — commodity profiles (/commodity/:slug)
--   vessels          — ships / offshore units (fleet data, maps)
--   planes           — aircraft + route network data (aviation maps)
--   chat_messages    — live chat per company / commodity room
--
-- After SQL: from repo root (with .env):
--   npm run db:status
--   npm run db:seed-commodities
--   npm run db:seed-people
--   npm run db:seed-vessels
--   npm run db:seed-planes

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

-- People (standalone profiles; linked to companies via company_people)
create table if not exists public.people (
  slug text primary key,
  name text not null,
  meta text not null,
  initials text not null,
  search_terms jsonb not null default '[]'::jsonb,
  profile_json jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists people_name_idx on public.people (name);

alter table public.people enable row level security;

drop policy if exists "Public read people" on public.people;
create policy "Public read people"
  on public.people
  for select
  to anon, authenticated
  using (true);

create table if not exists public.company_people (
  company_slug text not null references public.companies (slug) on delete cascade,
  person_slug text not null references public.people (slug) on delete cascade,
  title text not null default '',
  local_id text,
  sort_order int not null default 0,
  primary key (company_slug, person_slug)
);

create index if not exists company_people_person_idx on public.company_people (person_slug);

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
