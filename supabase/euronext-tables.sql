-- Euronext Oslo listings + page snapshots (run after supabase/schema.sql)
-- https://supabase.com/dashboard/project/_/sql

create table if not exists public.euronext_listings (
  isin text not null,
  mic text not null,
  ticker text not null,
  name text not null,
  market_label text not null default '',
  currency text not null default 'NOK',
  last_price numeric,
  day_change_pct numeric,
  last_trade_label text,
  product_path text not null,
  product_url text not null,
  company_slug text,
  raw_row jsonb not null default '[]'::jsonb,
  page_html text,
  page_scraped_at timestamptz,
  synced_at timestamptz not null default now(),
  primary key (isin, mic)
);

create index if not exists euronext_listings_ticker_idx on public.euronext_listings (ticker);
create index if not exists euronext_listings_name_idx on public.euronext_listings (name);
create index if not exists euronext_listings_company_slug_idx on public.euronext_listings (company_slug);

alter table public.euronext_listings enable row level security;

drop policy if exists "Public read euronext_listings" on public.euronext_listings;
create policy "Public read euronext_listings"
  on public.euronext_listings
  for select
  to anon, authenticated
  using (true);

create table if not exists public.euronext_market_snapshots (
  id bigserial primary key,
  market_key text not null default 'oslo',
  source_url text not null,
  payload_json jsonb not null default '{}'::jsonb,
  page_html text,
  scrape_method text not null default 'http',
  scraped_at timestamptz not null default now()
);

create index if not exists euronext_market_snapshots_market_idx
  on public.euronext_market_snapshots (market_key, scraped_at desc);

alter table public.euronext_market_snapshots enable row level security;

drop policy if exists "Public read euronext_market_snapshots" on public.euronext_market_snapshots;
create policy "Public read euronext_market_snapshots"
  on public.euronext_market_snapshots
  for select
  to anon, authenticated
  using (true);
