-- Spectr installer: profiles for name, country, and business email.
-- Run this in the Supabase SQL editor for project uhntpugwazcctllgpxax.
--
-- Also in Authentication settings:
-- 1. Email provider: enable OTP / email codes (needed for the 2FA step)
-- 2. Site URL: http://localhost:3000
-- 3. Redirect URLs: http://localhost:3000/auth/callback

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  country text not null default '',
  email text not null,
  username text unique,
  product_access boolean not null default false,
  careers_access boolean not null default false,
  os_download_granted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists username text unique;
alter table public.profiles add column if not exists product_access boolean not null default false;
alter table public.profiles add column if not exists careers_access boolean not null default false;
alter table public.profiles add column if not exists os_download_granted boolean not null default false;

alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, country, email, username, product_access, careers_access)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'country', ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'username', null),
    coalesce((new.raw_user_meta_data->>'product_access')::boolean, false),
    coalesce((new.raw_user_meta_data->>'careers_access')::boolean, false)
  )
  on conflict (id) do update
    set full_name = excluded.full_name,
        country = excluded.country,
        email = excluded.email,
        username = excluded.username;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Grant Spectr OS download for a user:
-- update public.profiles set os_download_granted = true where email = 'someone@company.com';

create table if not exists public.email_otps (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  code_hash text not null,
  kind text not null,
  purpose text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.email_otps enable row level security;
revoke all on public.email_otps from anon, authenticated;

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  email text not null unique,
  country text not null default '',
  company text not null default '',
  purpose text not null default '',
  created_at timestamptz not null default now()
);

alter table public.waitlist_signups enable row level security;
revoke all on public.waitlist_signups from anon, authenticated;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  first_name text not null default '',
  last_name text not null default '',
  email text not null default '',
  phone text not null default '',
  organization text not null default '',
  job_title text not null default '',
  country text not null default '',
  product text not null default '',
  message text not null default '',
  work_url text not null default '',
  created_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;
revoke all on public.inquiries from anon, authenticated;

create table if not exists public.editorial_posts (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('blog', 'research')),
  slug text not null,
  date text not null default '',
  title text not null,
  dek text not null default '',
  image text not null default '',
  image_alt text not null default '',
  paragraphs jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (kind, slug)
);

alter table public.editorial_posts enable row level security;

drop policy if exists "Editorial posts are public" on public.editorial_posts;
create policy "Editorial posts are public"
  on public.editorial_posts
  for select
  using (true);
