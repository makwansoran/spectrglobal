-- Datafeed sync run log (observability for cron + GitHub Actions)
-- Run after supabase/euronext-tables.sql

create table if not exists public.datafeed_sync_runs (
  id bigserial primary key,
  source text not null,
  status text not null default 'running',
  stats jsonb not null default '{}'::jsonb,
  error_message text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create index if not exists datafeed_sync_runs_started_idx
  on public.datafeed_sync_runs (started_at desc);

create index if not exists datafeed_sync_runs_source_idx
  on public.datafeed_sync_runs (source, started_at desc);

alter table public.datafeed_sync_runs enable row level security;

drop policy if exists "Public read datafeed_sync_runs" on public.datafeed_sync_runs;
create policy "Public read datafeed_sync_runs"
  on public.datafeed_sync_runs
  for select
  to anon, authenticated
  using (true);
