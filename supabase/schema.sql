-- Run in Supabase Dashboard → SQL → New query
-- https://supabase.com/dashboard/project/_/sql

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
