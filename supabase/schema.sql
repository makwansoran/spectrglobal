-- Spectr Parts — customer sign-ins (no Supabase Auth account required)

create table if not exists public.customer_signins (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  source text not null default 'login_page',
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint customer_signins_name_len check (char_length(trim(name)) between 1 and 120),
  constraint customer_signins_email_len check (char_length(trim(email)) between 3 and 254),
  constraint customer_signins_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint customer_signins_phone_len check (phone is null or char_length(trim(phone)) <= 40)
);

alter table public.customer_signins enable row level security;

-- Inserts use SUPABASE_SERVICE_ROLE_KEY on the server; no public client policies.

-- Car makes shown in the parts finder. Each make is a distinct database row.
create table if not exists public.makes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  country text,
  region text,
  active boolean not null default true,
  logo_text text not null,
  logo_url text,
  popularity_rank integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint makes_name_len check (char_length(trim(name)) between 1 and 120),
  constraint makes_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint makes_logo_text_len check (char_length(trim(logo_text)) between 1 and 6)
);

alter table public.makes enable row level security;

drop policy if exists "Public read makes" on public.makes;
create policy "Public read makes"
  on public.makes
  for select
  to anon, authenticated
  using (true);

-- Car models supported by the parts finder. Models are linked to makes by FK.
create table if not exists public.models (
  id uuid primary key default gen_random_uuid(),
  make_id uuid not null references public.makes(id) on delete cascade,
  name text not null,
  body_type text,
  year_from integer,
  year_to integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint models_name_len check (char_length(trim(name)) between 1 and 160),
  constraint models_year_range check (year_to is null or year_from is null or year_to >= year_from),
  constraint models_make_name_unique unique (make_id, name)
);

alter table public.models enable row level security;

drop policy if exists "Public read models" on public.models;
create policy "Public read models"
  on public.models
  for select
  to anon, authenticated
  using (true);

create index if not exists models_make_name_idx on public.models (make_id, name);
create index if not exists models_years_idx on public.models (year_from, year_to);

with seed(name, country, region, active) as (
  values
    ('Ford', 'USA', 'North America', true),
    ('Chevrolet', 'USA', 'North America', true),
    ('GMC', 'USA', 'North America', true),
    ('Cadillac', 'USA', 'North America', true),
    ('Buick', 'USA', 'North America', true),
    ('Dodge', 'USA', 'North America', true),
    ('Chrysler', 'USA', 'North America', true),
    ('Jeep', 'USA', 'North America', true),
    ('Ram', 'USA', 'North America', true),
    ('Lincoln', 'USA', 'North America', true),
    ('Tesla', 'USA', 'North America', true),
    ('Rivian', 'USA', 'North America', true),
    ('Lucid', 'USA', 'North America', true),
    ('Hummer', 'USA', 'North America', true),
    ('Shelby', 'USA', 'North America', true),
    ('Pontiac', 'USA', 'North America', false),
    ('Oldsmobile', 'USA', 'North America', false),
    ('Saturn', 'USA', 'North America', false),
    ('Plymouth', 'USA', 'North America', false),
    ('Mercury', 'USA', 'North America', false),
    ('Hummer (H2/H3)', 'USA', 'North America', false),
    ('Volkswagen', 'Germany', 'Europe', true),
    ('Audi', 'Germany', 'Europe', true),
    ('BMW', 'Germany', 'Europe', true),
    ('Mercedes-Benz', 'Germany', 'Europe', true),
    ('Porsche', 'Germany', 'Europe', true),
    ('Opel', 'Germany', 'Europe', true),
    ('Smart', 'Germany', 'Europe', true),
    ('Maybach', 'Germany', 'Europe', true),
    ('Alpina', 'Germany', 'Europe', true),
    ('Fiat', 'Italy', 'Europe', true),
    ('Alfa Romeo', 'Italy', 'Europe', true),
    ('Lancia', 'Italy', 'Europe', true),
    ('Abarth', 'Italy', 'Europe', true),
    ('Ferrari', 'Italy', 'Europe', true),
    ('Lamborghini', 'Italy', 'Europe', true),
    ('Maserati', 'Italy', 'Europe', true),
    ('Pagani', 'Italy', 'Europe', true),
    ('Renault', 'France', 'Europe', true),
    ('Peugeot', 'France', 'Europe', true),
    ('Citroën', 'France', 'Europe', true),
    ('DS Automobiles', 'France', 'Europe', true),
    ('Alpine', 'France', 'Europe', true),
    ('Bugatti', 'France', 'Europe', true),
    ('Bentley', 'United Kingdom', 'Europe', true),
    ('Rolls-Royce', 'United Kingdom', 'Europe', true),
    ('Jaguar', 'United Kingdom', 'Europe', true),
    ('Land Rover', 'United Kingdom', 'Europe', true),
    ('Aston Martin', 'United Kingdom', 'Europe', true),
    ('McLaren', 'United Kingdom', 'Europe', true),
    ('Lotus', 'United Kingdom', 'Europe', true),
    ('MINI', 'United Kingdom', 'Europe', true),
    ('Vauxhall', 'United Kingdom', 'Europe', true),
    ('MG', 'United Kingdom', 'Europe', true),
    ('Morgan', 'United Kingdom', 'Europe', true),
    ('Rover', 'United Kingdom', 'Europe', false),
    ('Volvo', 'Sweden', 'Europe', true),
    ('Polestar', 'Sweden', 'Europe', true),
    ('Koenigsegg', 'Sweden', 'Europe', true),
    ('SAAB', 'Sweden', 'Europe', false),
    ('SEAT', 'Spain', 'Europe', true),
    ('Cupra', 'Spain', 'Europe', true),
    ('Škoda', 'Czech Republic', 'Europe', true),
    ('Dacia', 'Romania', 'Europe', true),
    ('Spyker', 'Netherlands', 'Europe', true),
    ('Donkervoort', 'Netherlands', 'Europe', true),
    ('Rimac', 'Croatia', 'Europe', true),
    ('Togg', 'Turkey', 'Europe', true),
    ('Lada', 'Russia', 'Europe', true),
    ('UAZ', 'Russia', 'Europe', true),
    ('BYD', 'China', 'Asia', true),
    ('Geely', 'China', 'Asia', true),
    ('Great Wall', 'China', 'Asia', true),
    ('Haval', 'China', 'Asia', true),
    ('Chery', 'China', 'Asia', true),
    ('Changan', 'China', 'Asia', true),
    ('NIO', 'China', 'Asia', true),
    ('Xpeng', 'China', 'Asia', true),
    ('Li Auto', 'China', 'Asia', true),
    ('Wuling', 'China', 'Asia', true),
    ('Lynk & Co', 'China', 'Asia', true),
    ('Zeekr', 'China', 'Asia', true),
    ('Hongqi', 'China', 'Asia', true),
    ('Roewe', 'China', 'Asia', true),
    ('Baojun', 'China', 'Asia', true),
    ('Omoda', 'China', 'Asia', true),
    ('Jaecoo', 'China', 'Asia', true),
    ('Deepal', 'China', 'Asia', true),
    ('Avatr', 'China', 'Asia', true),
    ('Voyah', 'China', 'Asia', true),
    ('Aito', 'China', 'Asia', true),
    ('Jetour', 'China', 'Asia', true),
    ('JAC', 'China', 'Asia', true),
    ('Leapmotor', 'China', 'Asia', true),
    ('Neta', 'China', 'Asia', true),
    ('ORA', 'China', 'Asia', true),
    ('Tank', 'China', 'Asia', true),
    ('Denza', 'China', 'Asia', true),
    ('Yangwang', 'China', 'Asia', true),
    ('Arcfox', 'China', 'Asia', true),
    ('Brilliance', 'China', 'Asia', true),
    ('Foton', 'China', 'Asia', true),
    ('GAC', 'China', 'Asia', true),
    ('FAW', 'China', 'Asia', true),
    ('Dongfeng', 'China', 'Asia', true),
    ('SAIC', 'China', 'Asia', true),
    ('BAIC', 'China', 'Asia', true),
    ('Toyota', 'Japan', 'Asia', true),
    ('Honda', 'Japan', 'Asia', true),
    ('Nissan', 'Japan', 'Asia', true),
    ('Mazda', 'Japan', 'Asia', true),
    ('Subaru', 'Japan', 'Asia', true),
    ('Mitsubishi', 'Japan', 'Asia', true),
    ('Suzuki', 'Japan', 'Asia', true),
    ('Daihatsu', 'Japan', 'Asia', true),
    ('Lexus', 'Japan', 'Asia', true),
    ('Infiniti', 'Japan', 'Asia', true),
    ('Acura', 'Japan', 'Asia', true),
    ('Isuzu', 'Japan', 'Asia', true),
    ('Hino', 'Japan', 'Asia', true),
    ('Scion', 'Japan', 'Asia', false),
    ('Hyundai', 'South Korea', 'Asia', true),
    ('Kia', 'South Korea', 'Asia', true),
    ('Genesis', 'South Korea', 'Asia', true),
    ('KG Mobility', 'South Korea', 'Asia', true),
    ('SsangYong', 'South Korea', 'Asia', false),
    ('Daewoo', 'South Korea', 'Asia', false)
),
normalized as (
  select
    trim(both '-' from regexp_replace(
      lower(translate(replace(name, '&', ' and '), 'ŠšëéÉöø', 'sseeeoo')),
      '[^a-z0-9]+',
      '-',
      'g'
    )) as slug,
    name,
    country,
    region,
    active,
    upper(left(regexp_replace(translate(name, 'ŠšëéÉöø', 'sseeeoo'), '[^A-Za-z0-9]', '', 'g'), 3)) as logo_text,
    'https://cdn.simpleicons.org/' ||
      case trim(both '-' from regexp_replace(
        lower(translate(replace(name, '&', ' and '), 'ŠšëéÉöø', 'sseeeoo')),
        '[^a-z0-9]+',
        '-',
        'g'
      ))
        when 'mercedes-benz' then 'mercedes'
        when 'alfa-romeo' then 'alfaromeo'
        when 'ds-automobiles' then 'dsautomobiles'
        when 'rolls-royce' then 'rollsroyce'
        when 'land-rover' then 'landrover'
        when 'aston-martin' then 'astonmartin'
        when 'mini' then 'mini'
        when 'great-wall' then 'greatwall'
        when 'li-auto' then 'liauto'
        when 'lynk-and-co' then 'lynkco'
        when 'kg-mobility' then 'kgmobility'
        else replace(trim(both '-' from regexp_replace(
          lower(translate(replace(name, '&', ' and '), 'ŠšëéÉöø', 'sseeeoo')),
          '[^a-z0-9]+',
          '-',
          'g'
        )), '-', '')
      end || '/111827' as logo_url
  from seed
)
insert into public.makes (slug, name, country, region, active, logo_text, logo_url)
select slug, name, country, region, active, logo_text, logo_url
from normalized
on conflict (slug) do update set
  name = excluded.name,
  country = excluded.country,
  region = excluded.region,
  active = excluded.active,
  logo_text = excluded.logo_text,
  logo_url = excluded.logo_url,
  updated_at = now();

update public.makes
set popularity_rank = ranked.rank
from (
  values
    ('toyota', 1),
    ('volkswagen', 2),
    ('ford', 3),
    ('honda', 4),
    ('hyundai', 5),
    ('nissan', 6),
    ('chevrolet', 7),
    ('kia', 8)
) as ranked(slug, rank)
where public.makes.slug = ranked.slug;

update public.makes
set popularity_rank = null
where slug not in ('toyota', 'volkswagen', 'ford', 'honda', 'hyundai', 'nissan', 'chevrolet', 'kia');

-- Car parts catalog (storefront lists active rows via GET /api/parts).
create table if not exists public.parts (
  id text primary key,
  name text not null,
  category text not null default 'Other',
  sku text,
  price numeric(12, 2) not null default 0 check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  description text,
  vehicles jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint parts_name_len check (char_length(trim(name)) between 1 and 200),
  constraint parts_category_len check (char_length(trim(category)) between 1 and 80),
  constraint parts_sku_len check (sku is null or char_length(trim(sku)) <= 64),
  constraint parts_vehicles_is_array check (jsonb_typeof(vehicles) = 'array')
);

alter table public.parts enable row level security;

drop policy if exists "Public read parts" on public.parts;
create policy "Public read parts"
  on public.parts
  for select
  to anon, authenticated
  using (true);

create index if not exists parts_active_category_idx
  on public.parts (active, category)
  where active = true;
