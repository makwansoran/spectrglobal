-- Editor role for company profile management (run once in Supabase SQL editor)
-- After this: node scripts/create-editor.js --email you@example.com --password "..." --username yourname

alter table public.profiles
  add column if not exists role text not null default 'user';

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check check (role in ('user', 'editor'));

create index if not exists profiles_role_idx on public.profiles (role) where role = 'editor';
