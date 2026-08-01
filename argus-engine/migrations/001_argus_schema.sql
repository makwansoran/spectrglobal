-- Argus Engine schema (shared Supabase with Spectr)
-- Apply in Supabase SQL editor. Engine uses service role; RLS later for UI.

create extension if not exists "pgcrypto";

create table if not exists public.argus_cameras (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rtsp_url text,
  source_path text,
  enabled boolean not null default true,
  zones jsonb not null default '[]'::jsonb,
  -- zones: [{"name":"dock","polygon":[[0.1,0.1],[0.9,0.1],[0.9,0.9],[0.1,0.9]]}]  coords 0–1
  schedule jsonb not null default '{}'::jsonb,
  -- schedule: {"tz":"Europe/Amsterdam","windows":[{"dow":[1,2,3,4,5],"start":"00:00","end":"23:59"}]}
  -- empty schedule = always allow
  confidence double precision not null default 0.5,
  subsample_fps double precision not null default 3.0,
  created_at timestamptz not null default now()
);

create table if not exists public.argus_config (
  key text primary key,
  value jsonb not null default '{}'::jsonb
);

create table if not exists public.argus_incidents (
  id uuid primary key default gen_random_uuid(),
  camera_id uuid references public.argus_cameras (id) on delete set null,
  ts timestamptz not null default now(),
  label text not null,
  score double precision not null,
  status text not null default 'open'
    check (status in ('open', 'acked', 'dismissed')),
  clip_path text,
  thumb_path text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists argus_incidents_ts_desc on public.argus_incidents (ts desc);
create index if not exists argus_incidents_status on public.argus_incidents (status);
create index if not exists argus_cameras_enabled on public.argus_cameras (enabled);

-- Sensible defaults
insert into public.argus_config (key, value) values
  ('motion_threshold', '0.02'::jsonb),
  ('cooldown_seconds', '30'::jsonb),
  ('default_confidence', '0.5'::jsonb),
  ('allowed_labels', '["person"]'::jsonb)
on conflict (key) do nothing;

-- Enable Realtime for Spectr UI (safe to re-run)
do $$
begin
  begin
    alter publication supabase_realtime add table public.argus_incidents;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.argus_cameras;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.argus_config;
  exception when duplicate_object then null;
  end;
end $$;
