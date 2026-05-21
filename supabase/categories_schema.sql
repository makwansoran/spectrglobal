-- Spectr — parts category hierarchy.
-- Run before parts_categories_seed.sql.

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id) on delete cascade,
  name text not null,
  slug text not null unique,
  level integer not null,
  icon text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_name_len check (char_length(trim(name)) between 1 and 160),
  constraint categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint categories_level_allowed check (level between 1 and 3),
  constraint categories_parent_level check (
    (level = 1 and parent_id is null) or
    (level > 1 and parent_id is not null)
  )
);

alter table public.categories enable row level security;

drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories"
  on public.categories
  for select
  to anon, authenticated
  using (true);

create index if not exists categories_parent_sort_idx
  on public.categories (parent_id, sort_order, name);

create index if not exists categories_level_sort_idx
  on public.categories (level, sort_order, name);
