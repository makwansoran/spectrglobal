-- Spectr — Supabase Auth-backed customer accounts and sign-in audit rows.

create table if not exists public.customer_signins (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete set null,
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

alter table public.customer_signins
  add column if not exists auth_user_id uuid references auth.users(id) on delete set null;

-- Inserts use SUPABASE_SERVICE_ROLE_KEY on the server; no public client policies.

create table if not exists public.customer_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  metadata jsonb not null default '{}'::jsonb,
  last_sign_in_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customer_profiles_auth_user_unique unique (auth_user_id),
  constraint customer_profiles_email_len check (char_length(trim(email)) between 3 and 254),
  constraint customer_profiles_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint customer_profiles_display_name_len check (display_name is null or char_length(trim(display_name)) <= 120)
);

alter table public.customer_profiles enable row level security;

drop policy if exists "Customers can read own profile" on public.customer_profiles;
create policy "Customers can read own profile"
  on public.customer_profiles
  for select
  to authenticated
  using (auth.uid() = auth_user_id);

drop policy if exists "Customers can update own profile" on public.customer_profiles;
create policy "Customers can update own profile"
  on public.customer_profiles
  for update
  to authenticated
  using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);

create index if not exists customer_profiles_email_idx
  on public.customer_profiles (lower(email));

create index if not exists customer_signins_auth_user_idx
  on public.customer_signins (auth_user_id, created_at desc);

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

-- OEM tyre sizes per car model. Tyre size is the bridge to tyre inventory rows.
create table if not exists public.car_tyre_fitment (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references public.models(id) on delete cascade,
  year_from integer,
  year_to integer,
  width integer not null,
  aspect_ratio integer not null,
  rim_diameter integer not null,
  load_index integer,
  speed_rating text,
  axle text not null default 'both',
  is_oem boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  constraint car_tyre_fitment_year_range check (year_to is null or year_from is null or year_to >= year_from),
  constraint car_tyre_fitment_width_range check (width between 100 and 405),
  constraint car_tyre_fitment_aspect_ratio_range check (aspect_ratio between 20 and 90),
  constraint car_tyre_fitment_rim_diameter_range check (rim_diameter between 10 and 30),
  constraint car_tyre_fitment_load_index_range check (load_index is null or load_index between 50 and 150),
  constraint car_tyre_fitment_speed_rating_len check (speed_rating is null or char_length(trim(speed_rating)) between 1 and 4),
  constraint car_tyre_fitment_axle_allowed check (axle in ('front', 'rear', 'both'))
);

alter table public.car_tyre_fitment enable row level security;

drop policy if exists "Public read car tyre fitment" on public.car_tyre_fitment;
create policy "Public read car tyre fitment"
  on public.car_tyre_fitment
  for select
  to anon, authenticated
  using (true);

create index if not exists idx_fitment_size
  on public.car_tyre_fitment (width, aspect_ratio, rim_diameter);

create index if not exists idx_fitment_model
  on public.car_tyre_fitment (model_id);

create unique index if not exists car_tyre_fitment_model_size_unique_idx
  on public.car_tyre_fitment (
    model_id,
    coalesce(year_from, -1),
    coalesce(year_to, -1),
    width,
    aspect_ratio,
    rim_diameter,
    coalesce(load_index, -1),
    coalesce(speed_rating, ''),
    axle,
    coalesce(notes, '')
  );

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
    ('Maserati', 'Italy', 'Europe', true),
    ('Pagani', 'Italy', 'Europe', true),
    ('Renault', 'France', 'Europe', true),
    ('Peugeot', 'France', 'Europe', true),
    ('Citroën', 'France', 'Europe', true),
    ('DS Automobiles', 'France', 'Europe', true),
    ('Alpine', 'France', 'Europe', true),
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
    ('SAAB', 'Sweden', 'Europe', false),
    ('SEAT', 'Spain', 'Europe', true),
    ('Cupra', 'Spain', 'Europe', true),
    ('Škoda', 'Czech Republic', 'Europe', true),
    ('Dacia', 'Romania', 'Europe', true),
    ('Spyker', 'Netherlands', 'Europe', true),
    ('Donkervoort', 'Netherlands', 'Europe', true),
    ('Rimac', 'Croatia', 'Europe', true),
    ('Togg', 'Turkey', 'Europe', true),
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
  image_url text,
  article_number text,
  ean_code text,
  delivery_time text not null default '2-5 days',
  features jsonb not null default '[]'::jsonb,
  reviews jsonb not null default '[]'::jsonb,
  specifications jsonb not null default '[]'::jsonb,
  vehicles jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint parts_name_len check (char_length(trim(name)) between 1 and 200),
  constraint parts_category_len check (char_length(trim(category)) between 1 and 80),
  constraint parts_sku_len check (sku is null or char_length(trim(sku)) <= 64),
  constraint parts_article_number_len check (article_number is null or char_length(trim(article_number)) <= 80),
  constraint parts_ean_code_len check (ean_code is null or char_length(trim(ean_code)) <= 80),
  constraint parts_delivery_time_len check (char_length(trim(delivery_time)) between 1 and 80),
  constraint parts_vehicles_is_array check (jsonb_typeof(vehicles) = 'array'),
  constraint parts_features_is_array check (jsonb_typeof(features) = 'array'),
  constraint parts_reviews_is_array check (jsonb_typeof(reviews) = 'array'),
  constraint parts_specifications_is_array check (jsonb_typeof(specifications) = 'array')
);

alter table public.parts
  add column if not exists image_url text,
  add column if not exists features jsonb not null default '[]'::jsonb,
  add column if not exists reviews jsonb not null default '[]'::jsonb,
  add column if not exists article_number text,
  add column if not exists ean_code text,
  add column if not exists delivery_time text not null default '2-5 days',
  add column if not exists specifications jsonb not null default '[]'::jsonb;

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

-- OEM tyre fitment seed data. Multiple rows per model represent multiple OEM size options.
insert into public.car_tyre_fitment (
  model_id,
  year_from,
  year_to,
  width,
  aspect_ratio,
  rim_diameter,
  load_index,
  speed_rating,
  axle,
  notes
)
select
  mo.id,
  v.year_from,
  v.year_to,
  v.width,
  v.aspect_ratio,
  v.rim_diameter,
  v.load_index,
  v.speed_rating,
  v.axle,
  v.notes
from public.models mo
join public.makes ma on mo.make_id = ma.id
join (
  values
    ('BMW', '1 Series', 2011, 2019, 195, 55, 16, 87, 'H', 'both', 'Base'),
    ('BMW', '1 Series', 2011, 2019, 205, 55, 16, 91, 'W', 'both', 'Standard'),
    ('BMW', '1 Series', 2011, 2019, 225, 45, 17, 91, 'W', 'both', 'Sport'),
    ('BMW', '1 Series', 2019, null, 205, 55, 16, 91, 'V', 'both', 'Base (F40)'),
    ('BMW', '1 Series', 2019, null, 225, 45, 17, 91, 'W', 'both', 'Standard (F40)'),
    ('BMW', '1 Series', 2019, null, 225, 40, 18, 92, 'Y', 'both', 'M Sport (F40)'),
    ('BMW', '2 Series', 2021, null, 225, 45, 18, 95, 'Y', 'front', 'Standard'),
    ('BMW', '2 Series', 2021, null, 255, 40, 18, 99, 'Y', 'rear', 'Standard staggered'),
    ('BMW', '2 Series', 2021, null, 245, 35, 19, 93, 'Y', 'front', 'M Sport'),
    ('BMW', '2 Series', 2021, null, 275, 30, 19, 96, 'Y', 'rear', 'M Sport staggered'),
    ('BMW', '3 Series', 2019, null, 225, 50, 17, 98, 'Y', 'both', 'Base'),
    ('BMW', '3 Series', 2019, null, 225, 45, 18, 95, 'Y', 'both', 'Standard'),
    ('BMW', '3 Series', 2019, null, 255, 40, 18, 99, 'Y', 'both', 'Standard rear'),
    ('BMW', '3 Series', 2019, null, 225, 40, 19, 93, 'Y', 'front', 'M Sport'),
    ('BMW', '3 Series', 2019, null, 255, 35, 19, 96, 'Y', 'rear', 'M Sport staggered'),
    ('BMW', '5 Series', 2017, null, 225, 55, 17, 97, 'W', 'both', 'Base'),
    ('BMW', '5 Series', 2017, null, 245, 45, 18, 100, 'W', 'both', 'Standard'),
    ('BMW', '5 Series', 2017, null, 245, 40, 19, 98, 'Y', 'front', 'M Sport'),
    ('BMW', '5 Series', 2017, null, 275, 35, 19, 100, 'Y', 'rear', 'M Sport staggered'),
    ('BMW', '7 Series', 2015, null, 245, 50, 18, 100, 'W', 'both', 'Standard'),
    ('BMW', '7 Series', 2015, null, 245, 45, 19, 102, 'W', 'front', 'Standard+'),
    ('BMW', '7 Series', 2015, null, 275, 40, 19, 105, 'W', 'rear', 'Standard+ staggered'),
    ('BMW', '7 Series', 2015, null, 245, 35, 20, 95, 'Y', 'front', 'Excellence'),
    ('BMW', '7 Series', 2015, null, 275, 30, 20, 97, 'Y', 'rear', 'Excellence staggered'),
    ('BMW', 'X1', 2015, 2022, 205, 60, 16, 92, 'V', 'both', 'Base'),
    ('BMW', 'X1', 2015, 2022, 225, 50, 17, 98, 'W', 'both', 'Standard'),
    ('BMW', 'X1', 2015, 2022, 225, 45, 18, 95, 'Y', 'both', 'Sport'),
    ('BMW', 'X1', 2022, null, 205, 60, 16, 96, 'V', 'both', 'Base (U11)'),
    ('BMW', 'X1', 2022, null, 235, 50, 18, 101, 'Y', 'both', 'Standard (U11)'),
    ('BMW', 'X3', 2017, null, 225, 60, 17, 99, 'V', 'both', 'Base'),
    ('BMW', 'X3', 2017, null, 245, 50, 18, 104, 'W', 'both', 'Standard'),
    ('BMW', 'X3', 2017, null, 245, 45, 19, 102, 'Y', 'both', 'M Sport'),
    ('BMW', 'X3', 2017, null, 265, 40, 20, 104, 'Y', 'both', 'xDrive M Sport'),
    ('BMW', 'X5', 2018, null, 255, 50, 19, 107, 'W', 'both', 'Base'),
    ('BMW', 'X5', 2018, null, 275, 40, 20, 106, 'Y', 'front', 'Standard'),
    ('BMW', 'X5', 2018, null, 315, 35, 20, 110, 'Y', 'rear', 'Standard staggered'),
    ('BMW', 'X5', 2018, null, 275, 35, 21, 99, 'Y', 'front', 'M Sport'),
    ('BMW', 'X5', 2018, null, 315, 30, 21, 105, 'Y', 'rear', 'M Sport staggered'),
    ('Volkswagen', 'Golf', 2012, 2019, 195, 65, 15, 91, 'H', 'both', 'Base (Mk7)'),
    ('Volkswagen', 'Golf', 2012, 2019, 205, 55, 16, 91, 'H', 'both', 'Standard (Mk7)'),
    ('Volkswagen', 'Golf', 2012, 2019, 225, 45, 17, 94, 'Y', 'both', 'Sport (Mk7)'),
    ('Volkswagen', 'Golf', 2019, null, 195, 65, 15, 91, 'H', 'both', 'Base (Mk8)'),
    ('Volkswagen', 'Golf', 2019, null, 205, 55, 16, 91, 'H', 'both', 'Standard (Mk8)'),
    ('Volkswagen', 'Golf', 2019, null, 225, 45, 17, 91, 'Y', 'both', 'Sport (Mk8)'),
    ('Volkswagen', 'Golf', 2019, null, 225, 40, 18, 92, 'Y', 'both', 'R-Line (Mk8)'),
    ('Volkswagen', 'Polo', 2017, null, 175, 70, 14, 84, 'T', 'both', 'Base'),
    ('Volkswagen', 'Polo', 2017, null, 185, 65, 15, 88, 'H', 'both', 'Standard'),
    ('Volkswagen', 'Polo', 2017, null, 205, 45, 16, 83, 'W', 'both', 'Sport'),
    ('Volkswagen', 'Passat', 2014, null, 205, 60, 16, 92, 'H', 'both', 'Base (B8)'),
    ('Volkswagen', 'Passat', 2014, null, 215, 55, 17, 94, 'H', 'both', 'Standard (B8)'),
    ('Volkswagen', 'Passat', 2014, null, 235, 45, 18, 94, 'Y', 'both', 'Sport (B8)'),
    ('Volkswagen', 'Tiguan', 2016, null, 215, 65, 16, 98, 'H', 'both', 'Base'),
    ('Volkswagen', 'Tiguan', 2016, null, 235, 55, 17, 99, 'H', 'both', 'Standard'),
    ('Volkswagen', 'Tiguan', 2016, null, 235, 50, 18, 97, 'Y', 'both', 'Sport'),
    ('Volkswagen', 'Tiguan', 2016, null, 235, 45, 19, 95, 'Y', 'both', 'R-Line'),
    ('Audi', 'A3', 2012, 2020, 195, 65, 15, 91, 'H', 'both', 'Base (8V)'),
    ('Audi', 'A3', 2012, 2020, 205, 55, 16, 91, 'H', 'both', 'Standard (8V)'),
    ('Audi', 'A3', 2012, 2020, 225, 45, 17, 91, 'W', 'both', 'Sport (8V)'),
    ('Audi', 'A3', 2020, null, 205, 55, 16, 91, 'H', 'both', 'Base (8Y)'),
    ('Audi', 'A3', 2020, null, 225, 45, 17, 94, 'Y', 'both', 'Standard (8Y)'),
    ('Audi', 'A3', 2020, null, 225, 40, 18, 92, 'Y', 'both', 'S line (8Y)'),
    ('Audi', 'A4', 2015, null, 205, 60, 16, 92, 'H', 'both', 'Base (B9)'),
    ('Audi', 'A4', 2015, null, 225, 50, 17, 94, 'W', 'both', 'Standard (B9)'),
    ('Audi', 'A4', 2015, null, 245, 40, 18, 93, 'Y', 'both', 'S line (B9)'),
    ('Audi', 'A4', 2015, null, 255, 35, 19, 96, 'Y', 'both', 'S4/Competition'),
    ('Audi', 'Q5', 2016, null, 235, 60, 18, 103, 'H', 'both', 'Base (FY)'),
    ('Audi', 'Q5', 2016, null, 255, 45, 19, 100, 'Y', 'both', 'Standard (FY)'),
    ('Audi', 'Q5', 2016, null, 255, 40, 20, 101, 'Y', 'both', 'S line'),
    ('Mercedes-Benz', 'C-Class', 2014, 2021, 205, 55, 16, 91, 'V', 'both', 'Base (W205)'),
    ('Mercedes-Benz', 'C-Class', 2014, 2021, 225, 50, 17, 98, 'W', 'both', 'Standard (W205)'),
    ('Mercedes-Benz', 'C-Class', 2014, 2021, 235, 45, 18, 98, 'Y', 'front', 'AMG Line (W205)'),
    ('Mercedes-Benz', 'C-Class', 2014, 2021, 255, 40, 18, 99, 'Y', 'rear', 'AMG Line staggered'),
    ('Mercedes-Benz', 'C-Class', 2021, null, 205, 55, 16, 91, 'V', 'both', 'Base (W206)'),
    ('Mercedes-Benz', 'C-Class', 2021, null, 225, 50, 17, 98, 'W', 'both', 'Standard (W206)'),
    ('Mercedes-Benz', 'C-Class', 2021, null, 255, 40, 18, 99, 'Y', 'both', 'AMG Line (W206)'),
    ('Mercedes-Benz', 'E-Class', 2016, null, 225, 55, 17, 97, 'H', 'both', 'Base (W213)'),
    ('Mercedes-Benz', 'E-Class', 2016, null, 245, 45, 18, 100, 'W', 'both', 'Standard (W213)'),
    ('Mercedes-Benz', 'E-Class', 2016, null, 245, 40, 19, 98, 'Y', 'front', 'AMG Line'),
    ('Mercedes-Benz', 'E-Class', 2016, null, 275, 35, 19, 100, 'Y', 'rear', 'AMG Line staggered'),
    ('Mercedes-Benz', 'GLC', 2015, null, 235, 60, 17, 102, 'H', 'both', 'Base'),
    ('Mercedes-Benz', 'GLC', 2015, null, 255, 50, 18, 106, 'W', 'both', 'Standard'),
    ('Mercedes-Benz', 'GLC', 2015, null, 255, 45, 19, 104, 'Y', 'both', 'AMG Line'),
    ('Mercedes-Benz', 'GLC', 2015, null, 255, 40, 20, 101, 'Y', 'both', 'AMG 43'),
    ('Toyota', 'Corolla', 2018, null, 195, 65, 15, 91, 'H', 'both', 'Base (E210)'),
    ('Toyota', 'Corolla', 2018, null, 205, 55, 16, 91, 'V', 'both', 'Standard (E210)'),
    ('Toyota', 'Corolla', 2018, null, 225, 45, 17, 91, 'W', 'both', 'Sport (E210)'),
    ('Toyota', 'Camry', 2017, null, 215, 55, 17, 94, 'V', 'both', 'Standard'),
    ('Toyota', 'Camry', 2017, null, 235, 45, 18, 94, 'W', 'both', 'Sport'),
    ('Toyota', 'RAV4', 2018, null, 225, 65, 17, 102, 'H', 'both', 'Base (XA50)'),
    ('Toyota', 'RAV4', 2018, null, 235, 55, 18, 100, 'V', 'both', 'Standard (XA50)'),
    ('Toyota', 'RAV4', 2018, null, 235, 50, 19, 99, 'W', 'both', 'Premium (XA50)'),
    ('Toyota', 'Yaris', 2020, null, 175, 65, 15, 84, 'H', 'both', 'Base (XP210)'),
    ('Toyota', 'Yaris', 2020, null, 195, 55, 16, 87, 'H', 'both', 'Standard (XP210)'),
    ('Toyota', 'Land Cruiser', 2021, null, 265, 65, 17, 112, 'H', 'both', 'Base (J300)'),
    ('Toyota', 'Land Cruiser', 2021, null, 285, 55, 20, 112, 'V', 'both', 'Standard (J300)'),
    ('Toyota', 'Hilux', 2015, null, 225, 70, 17, 108, 'S', 'both', 'Standard (AN120)'),
    ('Toyota', 'Hilux', 2015, null, 265, 60, 18, 110, 'H', 'both', 'Sport (AN120)'),
    ('Honda', 'Civic', 2022, null, 215, 55, 16, 93, 'V', 'both', 'Base (FE/FL)'),
    ('Honda', 'Civic', 2022, null, 235, 40, 18, 95, 'W', 'both', 'Sport (FE/FL)'),
    ('Honda', 'CR-V', 2018, null, 225, 65, 17, 102, 'H', 'both', 'Base (RW/RT)'),
    ('Honda', 'CR-V', 2018, null, 235, 55, 18, 100, 'H', 'both', 'Standard (RW/RT)'),
    ('Honda', 'HR-V', 2021, null, 215, 55, 16, 97, 'H', 'both', 'Standard'),
    ('Nissan', 'Qashqai', 2021, null, 215, 60, 16, 99, 'H', 'both', 'Base (J12)'),
    ('Nissan', 'Qashqai', 2021, null, 225, 55, 17, 101, 'V', 'both', 'Standard (J12)'),
    ('Nissan', 'Qashqai', 2021, null, 235, 45, 19, 95, 'W', 'both', 'Sport (J12)'),
    ('Nissan', 'X-Trail', 2021, null, 225, 60, 17, 99, 'H', 'both', 'Base (T33)'),
    ('Nissan', 'X-Trail', 2021, null, 235, 55, 18, 100, 'H', 'both', 'Standard (T33)'),
    ('Nissan', 'Juke', 2019, null, 195, 65, 15, 91, 'H', 'both', 'Base (F16)'),
    ('Nissan', 'Juke', 2019, null, 215, 55, 17, 94, 'W', 'both', 'Standard (F16)'),
    ('Nissan', 'Juke', 2019, null, 225, 45, 18, 95, 'Y', 'both', 'Sport (F16)'),
    ('Mazda', 'Mazda3', 2018, null, 195, 65, 15, 91, 'H', 'both', 'Base (BP)'),
    ('Mazda', 'Mazda3', 2018, null, 205, 60, 16, 92, 'V', 'both', 'Standard (BP)'),
    ('Mazda', 'Mazda3', 2018, null, 215, 45, 18, 89, 'W', 'both', 'Sport (BP)'),
    ('Mazda', 'CX-5', 2017, null, 225, 65, 16, 100, 'H', 'both', 'Base (KF)'),
    ('Mazda', 'CX-5', 2017, null, 225, 55, 19, 99, 'W', 'both', 'Sport (KF)'),
    ('Mazda', 'MX-5', 2015, null, 195, 50, 16, 84, 'V', 'both', 'Standard (ND)'),
    ('Mazda', 'MX-5', 2015, null, 205, 45, 17, 84, 'W', 'both', 'Sport (ND)'),
    ('Hyundai', 'Tucson', 2020, null, 225, 60, 17, 99, 'H', 'both', 'Base (NX4)'),
    ('Hyundai', 'Tucson', 2020, null, 235, 50, 18, 97, 'V', 'both', 'Standard (NX4)'),
    ('Hyundai', 'Tucson', 2020, null, 255, 40, 19, 100, 'W', 'both', 'N Line (NX4)'),
    ('Hyundai', 'i30', 2017, null, 195, 65, 15, 91, 'H', 'both', 'Base (PD)'),
    ('Hyundai', 'i30', 2017, null, 205, 55, 16, 91, 'H', 'both', 'Standard (PD)'),
    ('Hyundai', 'i30', 2017, null, 225, 45, 17, 91, 'W', 'both', 'Sport (PD)'),
    ('Hyundai', 'i30', 2017, null, 235, 40, 18, 95, 'Y', 'both', 'N Line/N (PD)'),
    ('Hyundai', 'Ioniq 5', 2021, null, 235, 55, 19, 105, 'V', 'both', 'Standard RWD'),
    ('Hyundai', 'Ioniq 5', 2021, null, 255, 45, 20, 105, 'W', 'both', 'AWD Performance'),
    ('Kia', 'Sportage', 2021, null, 225, 60, 17, 99, 'H', 'both', 'Base (NQ5)'),
    ('Kia', 'Sportage', 2021, null, 235, 55, 18, 100, 'V', 'both', 'Standard (NQ5)'),
    ('Kia', 'Sportage', 2021, null, 255, 40, 19, 100, 'W', 'both', 'GT Line (NQ5)'),
    ('Kia', 'EV6', 2021, null, 235, 55, 19, 105, 'V', 'both', 'Standard RWD'),
    ('Kia', 'EV6', 2021, null, 255, 45, 20, 105, 'W', 'both', 'GT AWD'),
    ('Kia', 'Ceed', 2018, null, 195, 65, 15, 91, 'H', 'both', 'Base (CD)'),
    ('Kia', 'Ceed', 2018, null, 205, 55, 16, 91, 'H', 'both', 'Standard (CD)'),
    ('Kia', 'Ceed', 2018, null, 225, 45, 17, 91, 'W', 'both', 'GT (CD)'),
    ('Ford', 'Focus', 2018, 2022, 205, 55, 16, 91, 'H', 'both', 'Base (Mk4)'),
    ('Ford', 'Focus', 2018, 2022, 215, 50, 17, 95, 'W', 'both', 'Standard (Mk4)'),
    ('Ford', 'Focus', 2018, 2022, 235, 40, 18, 95, 'Y', 'both', 'ST Line (Mk4)'),
    ('Ford', 'Kuga', 2019, null, 215, 60, 16, 99, 'H', 'both', 'Base (Mk3)'),
    ('Ford', 'Kuga', 2019, null, 235, 50, 18, 97, 'W', 'both', 'Standard (Mk3)'),
    ('Ford', 'Kuga', 2019, null, 235, 45, 19, 95, 'Y', 'both', 'ST Line (Mk3)'),
    ('Ford', 'Mustang', 2015, null, 235, 55, 17, 99, 'V', 'both', 'V6 Base'),
    ('Ford', 'Mustang', 2015, null, 255, 40, 19, 100, 'W', 'front', 'GT/EcoBoost'),
    ('Ford', 'Mustang', 2015, null, 275, 40, 19, 105, 'W', 'rear', 'GT/EcoBoost rear'),
    ('Volvo', 'XC60', 2017, null, 235, 60, 18, 107, 'H', 'both', 'Base (246)'),
    ('Volvo', 'XC60', 2017, null, 245, 50, 19, 105, 'W', 'both', 'Standard (246)'),
    ('Volvo', 'XC60', 2017, null, 255, 40, 20, 101, 'Y', 'both', 'R-Design'),
    ('Volvo', 'XC90', 2015, null, 235, 60, 18, 107, 'H', 'both', 'Base'),
    ('Volvo', 'XC90', 2015, null, 255, 50, 19, 107, 'W', 'both', 'Standard'),
    ('Volvo', 'XC90', 2015, null, 275, 40, 21, 107, 'Y', 'both', 'R-Design'),
    ('Volvo', 'XC40', 2017, null, 215, 65, 16, 98, 'H', 'both', 'Base'),
    ('Volvo', 'XC40', 2017, null, 235, 50, 18, 97, 'W', 'both', 'Standard'),
    ('Volvo', 'V60', 2018, null, 215, 55, 17, 94, 'H', 'both', 'Base'),
    ('Volvo', 'V60', 2018, null, 235, 45, 18, 94, 'W', 'both', 'Standard'),
    ('Škoda', 'Octavia', 2020, null, 195, 65, 15, 91, 'H', 'both', 'Base (Mk4)'),
    ('Škoda', 'Octavia', 2020, null, 215, 55, 16, 93, 'H', 'both', 'Standard (Mk4)'),
    ('Škoda', 'Octavia', 2020, null, 225, 45, 17, 91, 'Y', 'both', 'Sport (Mk4)'),
    ('Škoda', 'Octavia', 2020, null, 235, 40, 18, 95, 'Y', 'both', 'RS (Mk4)'),
    ('Škoda', 'Fabia', 2021, null, 185, 65, 15, 88, 'H', 'both', 'Base (Mk4)'),
    ('Škoda', 'Fabia', 2021, null, 195, 55, 16, 87, 'H', 'both', 'Standard (Mk4)'),
    ('Škoda', 'Kodiaq', 2016, null, 215, 65, 16, 102, 'H', 'both', 'Base'),
    ('Škoda', 'Kodiaq', 2016, null, 235, 55, 17, 99, 'H', 'both', 'Standard'),
    ('Škoda', 'Kodiaq', 2016, null, 235, 50, 18, 97, 'W', 'both', 'Sport'),
    ('Dacia', 'Sandero', 2020, null, 185, 65, 15, 88, 'H', 'both', 'Base (Mk3)'),
    ('Dacia', 'Sandero', 2020, null, 195, 55, 16, 91, 'H', 'both', 'Standard (Mk3)'),
    ('Dacia', 'Duster', 2017, null, 215, 65, 16, 102, 'H', 'both', 'Base (Mk2)'),
    ('Dacia', 'Duster', 2017, null, 215, 60, 17, 100, 'H', 'both', 'Standard (Mk2)'),
    ('Dacia', 'Duster', 2017, null, 215, 55, 18, 99, 'H', 'both', 'Prestige (Mk2)'),
    ('Peugeot', '208', 2019, null, 185, 65, 15, 88, 'H', 'both', 'Base (Mk2)'),
    ('Peugeot', '208', 2019, null, 195, 55, 16, 87, 'V', 'both', 'Standard (Mk2)'),
    ('Peugeot', '208', 2019, null, 205, 45, 17, 88, 'W', 'both', 'Sport (Mk2)'),
    ('Peugeot', '3008', 2016, null, 215, 65, 16, 98, 'H', 'both', 'Base'),
    ('Peugeot', '3008', 2016, null, 225, 55, 18, 98, 'V', 'both', 'Standard'),
    ('Peugeot', '3008', 2016, null, 235, 45, 19, 95, 'W', 'both', 'GT'),
    ('Renault', 'Clio', 2019, null, 185, 65, 15, 88, 'H', 'both', 'Base (Mk5)'),
    ('Renault', 'Clio', 2019, null, 195, 55, 16, 91, 'H', 'both', 'Standard (Mk5)'),
    ('Renault', 'Clio', 2019, null, 205, 45, 17, 88, 'W', 'both', 'RS Line (Mk5)'),
    ('Renault', 'Captur', 2019, null, 195, 60, 16, 89, 'H', 'both', 'Base (Mk2)'),
    ('Renault', 'Captur', 2019, null, 205, 50, 17, 93, 'W', 'both', 'Standard (Mk2)'),
    ('SEAT', 'Leon', 2020, null, 195, 65, 15, 91, 'H', 'both', 'Base (Mk4)'),
    ('SEAT', 'Leon', 2020, null, 205, 55, 16, 91, 'H', 'both', 'Standard (Mk4)'),
    ('SEAT', 'Leon', 2020, null, 215, 45, 18, 89, 'W', 'both', 'FR (Mk4)'),
    ('SEAT', 'Ibiza', 2017, null, 185, 65, 15, 88, 'H', 'both', 'Base (KJ)'),
    ('SEAT', 'Ibiza', 2017, null, 195, 55, 16, 87, 'H', 'both', 'Standard (KJ)'),
    ('SEAT', 'Ateca', 2016, null, 215, 65, 16, 98, 'H', 'both', 'Base'),
    ('SEAT', 'Ateca', 2016, null, 235, 50, 18, 97, 'W', 'both', 'FR'),
    ('Cupra', 'Formentor', 2020, null, 245, 40, 18, 97, 'Y', 'both', 'Standard'),
    ('Cupra', 'Formentor', 2020, null, 245, 35, 19, 97, 'Y', 'both', 'VZ'),
    ('Cupra', 'Born', 2021, null, 215, 50, 18, 92, 'W', 'both', 'Standard'),
    ('Cupra', 'Born', 2021, null, 235, 40, 19, 96, 'Y', 'both', 'Sport'),
    ('Tesla', 'Model 3', 2017, null, 235, 45, 18, 94, 'W', 'both', 'Standard RWD'),
    ('Tesla', 'Model 3', 2017, null, 235, 40, 19, 96, 'W', 'front', 'Performance front'),
    ('Tesla', 'Model 3', 2017, null, 265, 35, 19, 98, 'W', 'rear', 'Performance rear'),
    ('Tesla', 'Model Y', 2020, null, 255, 45, 19, 104, 'W', 'both', 'Standard AWD'),
    ('Tesla', 'Model Y', 2020, null, 255, 40, 20, 101, 'W', 'both', 'Performance'),
    ('Tesla', 'Model S', 2012, null, 245, 45, 19, 102, 'W', 'both', 'Standard'),
    ('Tesla', 'Model S', 2012, null, 265, 35, 21, 101, 'W', 'front', 'Performance front'),
    ('Tesla', 'Model S', 2012, null, 295, 30, 21, 102, 'W', 'rear', 'Performance rear'),
    ('Subaru', 'Impreza', 2017, null, 205, 55, 16, 91, 'H', 'both', 'Standard'),
    ('Subaru', 'WRX', 2021, null, 245, 40, 18, 97, 'Y', 'both', 'Standard'),
    ('Subaru', 'Forester', 2018, null, 225, 60, 17, 99, 'H', 'both', 'Standard (SK)'),
    ('Subaru', 'Forester', 2018, null, 225, 55, 18, 98, 'H', 'both', 'Sport (SK)'),
    ('Subaru', 'Outback', 2019, null, 225, 65, 17, 102, 'H', 'both', 'Standard (BT)'),
    ('Subaru', 'Outback', 2019, null, 225, 60, 18, 100, 'H', 'both', 'XT (BT)'),
    ('Porsche', 'Cayenne', 2017, null, 265, 45, 20, 108, 'Y', 'front', 'Base (9YA)'),
    ('Porsche', 'Cayenne', 2017, null, 295, 40, 20, 110, 'Y', 'rear', 'Base staggered'),
    ('Porsche', 'Cayenne', 2017, null, 285, 40, 21, 109, 'Y', 'front', 'S/GTS'),
    ('Porsche', 'Cayenne', 2017, null, 315, 35, 21, 111, 'Y', 'rear', 'S/GTS staggered'),
    ('Porsche', 'Macan', 2018, null, 235, 55, 18, 104, 'H', 'both', 'Base (95B Mk2)'),
    ('Porsche', 'Macan', 2018, null, 265, 45, 19, 105, 'Y', 'both', 'S/GTS (95B Mk2)'),
    ('Porsche', '911', 2019, null, 245, 35, 20, 95, 'Y', 'front', 'Carrera (992)'),
    ('Porsche', '911', 2019, null, 305, 30, 21, 104, 'Y', 'rear', 'Carrera (992) rear'),
    ('BYD', 'Atto 3', 2021, null, 215, 55, 18, 99, 'W', 'both', 'Standard'),
    ('BYD', 'Seal', 2022, null, 235, 50, 18, 101, 'W', 'both', 'Standard RWD'),
    ('BYD', 'Seal', 2022, null, 255, 45, 18, 103, 'W', 'both', 'AWD'),
    ('BYD', 'Han', 2020, null, 245, 45, 19, 102, 'W', 'both', 'Standard'),
    ('BYD', 'Tang', 2022, null, 265, 40, 20, 104, 'W', 'both', 'Standard')
) as v(make_name, model_name, year_from, year_to, width, aspect_ratio, rim_diameter, load_index, speed_rating, axle, notes)
  on ma.name = v.make_name and mo.name = v.model_name
where not exists (
  select 1
  from public.car_tyre_fitment existing
  where existing.model_id = mo.id
    and existing.year_from is not distinct from v.year_from
    and existing.year_to is not distinct from v.year_to
    and existing.width = v.width
    and existing.aspect_ratio = v.aspect_ratio
    and existing.rim_diameter = v.rim_diameter
    and existing.load_index is not distinct from v.load_index
    and existing.speed_rating is not distinct from v.speed_rating
    and existing.axle = v.axle
    and existing.notes is not distinct from v.notes
);

-- Engine oil brands and products. Product approvals are matched to car oil fitment specs.
create table if not exists public.oil_brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text,
  website text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint oil_brands_name_len check (char_length(trim(name)) between 1 and 120)
);

alter table public.oil_brands enable row level security;

drop policy if exists "Public read oil brands" on public.oil_brands;
create policy "Public read oil brands"
  on public.oil_brands
  for select
  to anon, authenticated
  using (true);

create unique index if not exists oil_brands_name_unique_idx
  on public.oil_brands (lower(name));

create table if not exists public.oil_products (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.oil_brands(id) on delete cascade,
  name text not null,
  viscosity text not null,
  base_type text,
  approvals text[] not null default '{}'::text[],
  volume_liters numeric(5, 1),
  price_eur numeric(10, 2),
  stock integer not null default 0,
  image_url text,
  marketing_description text,
  article_number text,
  ean_code text,
  delivery_time text not null default '2-5 days',
  features jsonb not null default '[]'::jsonb,
  reviews jsonb not null default '[]'::jsonb,
  specifications jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint oil_products_name_len check (char_length(trim(name)) between 1 and 180),
  constraint oil_products_viscosity_len check (char_length(trim(viscosity)) between 3 and 20),
  constraint oil_products_volume_positive check (volume_liters is null or volume_liters > 0),
  constraint oil_products_price_non_negative check (price_eur is null or price_eur >= 0),
  constraint oil_products_stock_non_negative check (stock >= 0)
);

alter table public.oil_products
  add column if not exists stock integer not null default 0,
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists image_url text,
  add column if not exists marketing_description text,
  add column if not exists features jsonb not null default '[]'::jsonb,
  add column if not exists reviews jsonb not null default '[]'::jsonb,
  add column if not exists article_number text,
  add column if not exists ean_code text,
  add column if not exists delivery_time text not null default '2-5 days',
  add column if not exists specifications jsonb not null default '[]'::jsonb;

alter table public.oil_products enable row level security;

drop policy if exists "Public read oil products" on public.oil_products;
create policy "Public read oil products"
  on public.oil_products
  for select
  to anon, authenticated
  using (true);

create index if not exists idx_oil_products_viscosity
  on public.oil_products (viscosity);

create index if not exists idx_oil_products_approvals
  on public.oil_products using gin (approvals);

create unique index if not exists oil_products_brand_name_size_unique_idx
  on public.oil_products (brand_id, lower(name), viscosity, coalesce(volume_liters, -1));

create table if not exists public.car_oil_fitment (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references public.models(id) on delete cascade,
  engine_type text,
  year_from integer,
  year_to integer,
  viscosity text not null,
  viscosity_alt text,
  required_specs text[] not null default '{}'::text[],
  oil_capacity_liters numeric(5, 2),
  change_interval_km integer,
  notes text,
  created_at timestamptz not null default now(),
  constraint car_oil_fitment_year_range check (year_to is null or year_from is null or year_to >= year_from),
  constraint car_oil_fitment_engine_type_allowed check (engine_type is null or engine_type in ('petrol', 'diesel', 'hybrid', 'lpg')),
  constraint car_oil_fitment_capacity_positive check (oil_capacity_liters is null or oil_capacity_liters > 0),
  constraint car_oil_fitment_interval_positive check (change_interval_km is null or change_interval_km > 0)
);

alter table public.car_oil_fitment enable row level security;

drop policy if exists "Public read car oil fitment" on public.car_oil_fitment;
create policy "Public read car oil fitment"
  on public.car_oil_fitment
  for select
  to anon, authenticated
  using (true);

create index if not exists idx_oil_fitment_model
  on public.car_oil_fitment (model_id);

create index if not exists idx_oil_fitment_viscosity
  on public.car_oil_fitment (viscosity);

create index if not exists idx_oil_fitment_required_specs
  on public.car_oil_fitment using gin (required_specs);

create unique index if not exists car_oil_fitment_model_engine_unique_idx
  on public.car_oil_fitment (
    model_id,
    coalesce(year_from, -1),
    coalesce(year_to, -1),
    coalesce(engine_type, ''),
    viscosity,
    coalesce(viscosity_alt, ''),
    coalesce(oil_capacity_liters, -1),
    coalesce(notes, '')
  );

insert into public.oil_brands (name, country, website, active)
select v.name, v.country, v.website, v.active
from (
  values
    ('Castrol', 'United Kingdom', 'castrol.com', true),
    ('Shell', 'Netherlands', 'shell.com', true),
    ('Mobil 1', 'USA', 'mobil.com', true),
    ('Motul', 'France', 'motul.com', true),
    ('Liqui Moly', 'Germany', 'liqui-moly.com', true),
    ('Total Energies', 'France', 'totalenergies.com', true),
    ('Valvoline', 'USA', 'valvoline.com', true),
    ('Repsol', 'Spain', 'repsol.com', true),
    ('Fuchs', 'Germany', 'fuchs.com', true),
    ('Mannol', 'Germany', 'mannol.de', true),
    ('Havoline', 'USA', 'havoline.com', true),
    ('Pennzoil', 'USA', 'pennzoil.com', true),
    ('Elf', 'France', 'elf-lubricants.com', true),
    ('Gulf', 'USA', 'gulf-oil.com', true),
    ('Ravenol', 'Germany', 'ravenol.de', true),
    ('Kroon-Oil', 'Netherlands', 'kroon-oil.com', true),
    ('WD-40 Specialist', 'USA', 'wd40.com', true),
    ('Comma', 'United Kingdom', 'commagroup.com', true),
    ('Q8 Oils', 'Kuwait', 'q8oils.com', true),
    ('Bardahl', 'USA', 'bardahl.com', true)
) as v(name, country, website, active)
where not exists (
  select 1
  from public.oil_brands existing
  where lower(existing.name) = lower(v.name)
);

insert into public.oil_products (
  brand_id,
  name,
  viscosity,
  base_type,
  approvals,
  volume_liters,
  price_eur,
  active
)
select
  b.id,
  v.name,
  v.viscosity,
  v.base_type,
  v.approvals::text[],
  v.volume_liters,
  v.price_eur,
  true
from public.oil_brands b
join (
  values
    ('Castrol', 'Edge 5W-30 LL', '5W-30', 'Fully Synthetic', '{VW 504.00,VW 507.00,BMW LL-04,ACEA C3,API SN}', 5.0, 38.99),
    ('Castrol', 'Edge 0W-30', '0W-30', 'Fully Synthetic', '{BMW LL-17 FE+,BMW LL-04,ACEA C2,API SP}', 5.0, 44.99),
    ('Castrol', 'Edge 5W-40', '5W-40', 'Fully Synthetic', '{MB 229.5,VW 502.00,VW 505.00,Porsche A40,ACEA A3/B4,API SN}', 5.0, 39.99),
    ('Castrol', 'Edge 0W-20', '0W-20', 'Fully Synthetic', '{Honda HTO-06,ILSAC GF-6A,Toyota WS,ACEA A1/B1,API SP}', 5.0, 42.99),
    ('Castrol', 'Edge 0W-40', '0W-40', 'Fully Synthetic', '{MB 229.5,Porsche A40,BMW LL-01,ACEA A3/B4,API SN}', 5.0, 45.99),
    ('Castrol', 'GTX Ultraclean 10W-40', '10W-40', 'Semi-Synthetic', '{ACEA A3/B4,API SL}', 5.0, 24.99),
    ('Castrol', 'Magnatec 5W-30 C3', '5W-30', 'Fully Synthetic', '{BMW LL-04,VW 504.00,VW 507.00,ACEA C3,API SN}', 5.0, 36.99),
    ('Castrol', 'Magnatec 5W-40 A3/B4', '5W-40', 'Fully Synthetic', '{MB 229.3,Renault RN0700,ACEA A3/B4,API SN}', 5.0, 34.99),
    ('Castrol', 'Magnatec 0W-20 A5', '0W-20', 'Fully Synthetic', '{Ford WSS-M2C948-B,ILSAC GF-6A,ACEA A1/B1,API SP}', 5.0, 38.99),
    ('Shell', 'Helix Ultra 5W-30', '5W-30', 'Fully Synthetic', '{MB 229.51,BMW LL-04,VW 504.00,VW 507.00,ACEA C3,API SN}', 5.0, 39.99),
    ('Shell', 'Helix Ultra 5W-40', '5W-40', 'Fully Synthetic', '{MB 229.5,Porsche A40,Renault RN0700,ACEA A3/B4,API SN}', 5.0, 38.99),
    ('Shell', 'Helix Ultra 0W-20', '0W-20', 'Fully Synthetic', '{Honda HTO-06,Toyota 08880,ILSAC GF-6A,ACEA A1/B1,API SP}', 5.0, 44.99),
    ('Shell', 'Helix Ultra 0W-30', '0W-30', 'Fully Synthetic', '{BMW LL-17 FE+,BMW LL-04,ACEA C2,API SP}', 5.0, 46.99),
    ('Shell', 'Helix Ultra ECT C3 5W-30', '5W-30', 'Fully Synthetic', '{BMW LL-04,VW 504.00,VW 507.00,MB 229.51,ACEA C3,API SN}', 5.0, 41.99),
    ('Shell', 'Helix HX7 10W-40', '10W-40', 'Semi-Synthetic', '{ACEA A3/B4,API SL}', 5.0, 22.99),
    ('Shell', 'Helix Ultra Racing 10W-60', '10W-60', 'Fully Synthetic', '{Porsche A60,BMW M,ACEA A3/B4,API SN}', 5.0, 64.99),
    ('Mobil 1', 'ESP 5W-30', '5W-30', 'Fully Synthetic', '{MB 229.51,MB 229.52,BMW LL-04,VW 504.00,VW 507.00,ACEA C3,API SN}', 5.0, 42.99),
    ('Mobil 1', 'New Life 0W-40', '0W-40', 'Fully Synthetic', '{MB 229.5,Porsche A40,BMW LL-01,ACEA A3/B4,API SN}', 5.0, 47.99),
    ('Mobil 1', 'FS 0W-40', '0W-40', 'Fully Synthetic', '{MB 229.5,Porsche A40,ACEA A3/B4,API SN}', 5.0, 46.99),
    ('Mobil 1', 'ESP Formula 0W-30', '0W-30', 'Fully Synthetic', '{BMW LL-04,BMW LL-17 FE+,MB 229.52,ACEA C2,API SP}', 5.0, 48.99),
    ('Mobil 1', 'Advanced Fuel Economy 0W-20', '0W-20', 'Fully Synthetic', '{ILSAC GF-6A,API SP,Honda HTO-06,Toyota 08880}', 5.0, 44.99),
    ('Mobil 1', 'Turbo Diesel 0W-40', '0W-40', 'Fully Synthetic', '{MB 229.5,VW 505.00,ACEA A3/B4,API CF}', 5.0, 45.99),
    ('Motul', '8100 X-clean+ 5W-30', '5W-30', 'Fully Synthetic', '{BMW LL-04,MB 229.51,VW 504.00,VW 507.00,Porsche C30,ACEA C3,API SN}', 5.0, 43.99),
    ('Motul', '8100 X-cess 5W-40', '5W-40', 'Fully Synthetic', '{MB 229.3,Renault RN0700,ACEA A3/B4,API SN}', 5.0, 41.99),
    ('Motul', '8100 Eco-nergy 0W-30', '0W-30', 'Fully Synthetic', '{Ford WSS-M2C913-D,Renault RN0710,ACEA A5/B5,API SN}', 5.0, 44.99),
    ('Motul', '8100 X-clean EFE 5W-30', '5W-30', 'Fully Synthetic', '{BMW LL-04,VW 504.00,VW 507.00,MB 229.52,ACEA C3,API SN}', 5.0, 45.99),
    ('Motul', '300V Power 5W-40', '5W-40', 'Fully Synthetic', '{ACEA A3/B4,API SN}', 5.0, 69.99),
    ('Motul', '8100 X-clean 0W-30', '0W-30', 'Fully Synthetic', '{BMW LL-04,BMW LL-17 FE+,MB 229.52,ACEA C2,API SP}', 5.0, 46.99),
    ('Liqui Moly', 'Synthoil High Tech 5W-30', '5W-30', 'Fully Synthetic', '{BMW LL-04,MB 229.51,VW 504.00,VW 507.00,ACEA C3,API SN}', 5.0, 46.99),
    ('Liqui Moly', 'Leichtlauf High Tech 5W-40', '5W-40', 'Fully Synthetic', '{MB 229.3,VW 502.00,VW 505.00,Renault RN0700,ACEA A3/B4}', 5.0, 43.99),
    ('Liqui Moly', 'Longtime High Tech 5W-30', '5W-30', 'Fully Synthetic', '{BMW LL-01,BMW LL-04,MB 229.5,VW 503.00,ACEA A3/B4}', 5.0, 44.99),
    ('Liqui Moly', 'Top Tec 6200 0W-20', '0W-20', 'Fully Synthetic', '{BMW LL-17 FE+,MB 229.71,VW 508.00,VW 509.00,ACEA C5}', 5.0, 52.99),
    ('Liqui Moly', 'Top Tec 4200 5W-30', '5W-30', 'Fully Synthetic', '{MB 229.51,BMW LL-04,VW 504.00,ACEA C3}', 5.0, 47.99),
    ('Liqui Moly', 'MoS2 Leichtlauf 10W-40', '10W-40', 'Semi-Synthetic', '{ACEA A3/B3,API SL}', 5.0, 28.99),
    ('Total Energies', 'Quartz 9000 Future XT 5W-30', '5W-30', 'Fully Synthetic', '{PSA B71 2312,Renault RN0710,Ford WSS-M2C913-D,ACEA C2}', 5.0, 37.99),
    ('Total Energies', 'Quartz 9000 Energy 0W-30', '0W-30', 'Fully Synthetic', '{BMW LL-04,BMW LL-17 FE+,ACEA C2,API SP}', 5.0, 41.99),
    ('Total Energies', 'Quartz 7000 10W-40', '10W-40', 'Semi-Synthetic', '{ACEA A3/B4,API SL}', 5.0, 23.99),
    ('Elf', 'Evolution 900 SXR 5W-30', '5W-30', 'Fully Synthetic', '{Renault RN0710,PSA B71 2312,Ford WSS-M2C913,ACEA C2}', 5.0, 36.99),
    ('Elf', 'Evolution 900 NF 5W-40', '5W-40', 'Fully Synthetic', '{Renault RN0700,ACEA A3/B4,API SN}', 5.0, 34.99),
    ('Fuchs', 'Titan GT1 Pro C-3 5W-30', '5W-30', 'Fully Synthetic', '{BMW LL-04,VW 504.00,VW 507.00,MB 229.52,ACEA C3}', 5.0, 44.99),
    ('Fuchs', 'Titan GT1 Flex 5 0W-20', '0W-20', 'Fully Synthetic', '{BMW LL-17 FE+,MB 229.71,VW 508.00,VW 509.00,ACEA C5}', 5.0, 49.99),
    ('Fuchs', 'Titan Race Pro S 5W-50', '5W-50', 'Fully Synthetic', '{BMW M,Porsche A50,ACEA A3/B4}', 5.0, 59.99),
    ('Ravenol', 'VST SAE 5W-40', '5W-40', 'Fully Synthetic', '{MB 229.5,VW 502.00,VW 505.00,Porsche A40,ACEA A3/B4,API SN}', 5.0, 39.99),
    ('Ravenol', 'HCS SAE 5W-40', '5W-40', 'Fully Synthetic', '{MB 229.3,ACEA A3/B4,API SN}', 5.0, 33.99),
    ('Mannol', 'Energy Premium 5W-30', '5W-30', 'Fully Synthetic', '{VW 504.00,VW 507.00,MB 229.51,BMW LL-04,ACEA C3,API SN}', 5.0, 27.99),
    ('Mannol', '7707 OEM 5W-30', '5W-30', 'Fully Synthetic', '{Renault RN0710,PSA B71 2312,ACEA C2,API SN}', 5.0, 26.99),
    ('Mannol', 'Energy Formula JP 0W-20', '0W-20', 'Fully Synthetic', '{ILSAC GF-6A,Honda HTO-06,Toyota 08880,API SP}', 5.0, 29.99),
    ('Mannol', 'Extreme 5W-40', '5W-40', 'Fully Synthetic', '{MB 229.3,VW 502.00,Renault RN0700,ACEA A3/B4,API SN}', 5.0, 24.99),
    ('Mannol', 'Classic 10W-40', '10W-40', 'Semi-Synthetic', '{ACEA A3/B4,API SL}', 5.0, 18.99),
    ('Valvoline', 'SynPower MST C3 5W-30', '5W-30', 'Fully Synthetic', '{BMW LL-04,MB 229.51,VW 504.00,VW 507.00,ACEA C3,API SN}', 5.0, 38.99),
    ('Valvoline', 'SynPower XT C2/C3 5W-30', '5W-30', 'Fully Synthetic', '{Renault RN0710,PSA B71 2312,Ford WSS-M2C913-D,ACEA C2,C3}', 5.0, 37.99),
    ('Valvoline', 'SynPower 0W-40', '0W-40', 'Fully Synthetic', '{MB 229.5,Porsche A40,ACEA A3/B4,API SN}', 5.0, 43.99),
    ('Gulf', 'Formula G 5W-30', '5W-30', 'Fully Synthetic', '{BMW LL-04,VW 504.00,MB 229.51,ACEA C3,API SN}', 5.0, 33.99),
    ('Gulf', 'Formula G 0W-20', '0W-20', 'Fully Synthetic', '{ILSAC GF-6A,Honda HTO-06,ACEA A1/B1,API SP}', 5.0, 35.99),
    ('Gulf', 'Ultrasynth X 5W-40', '5W-40', 'Fully Synthetic', '{MB 229.3,ACEA A3/B4,API SN}', 5.0, 31.99)
) as v(brand_name, name, viscosity, base_type, approvals, volume_liters, price_eur)
  on lower(b.name) = lower(v.brand_name)
where not exists (
  select 1
  from public.oil_products existing
  where existing.brand_id = b.id
    and lower(existing.name) = lower(v.name)
    and existing.viscosity = v.viscosity
    and existing.volume_liters is not distinct from v.volume_liters
);

insert into public.car_oil_fitment (
  model_id,
  year_from,
  year_to,
  engine_type,
  viscosity,
  viscosity_alt,
  required_specs,
  oil_capacity_liters,
  change_interval_km,
  notes
)
select
  mo.id,
  v.year_from,
  v.year_to,
  v.engine_type,
  v.viscosity,
  v.viscosity_alt,
  v.required_specs::text[],
  v.oil_capacity_liters,
  v.change_interval_km,
  v.notes
from public.models mo
join public.makes ma on mo.make_id = ma.id
join (
  values
    ('BMW', '1 Series', 2011, null, 'petrol', '5W-30', '0W-30', '{BMW LL-04}', 5.0, 15000, 'N13/N43/B38 engine'),
    ('BMW', '1 Series', 2011, null, 'diesel', '5W-30', '0W-30', '{BMW LL-04}', 4.5, 15000, 'N47/B37 engine'),
    ('BMW', '2 Series', 2013, null, 'petrol', '5W-30', '0W-30', '{BMW LL-04}', 5.0, 15000, 'B48 engine'),
    ('BMW', '2 Series', 2013, null, 'diesel', '5W-30', '0W-30', '{BMW LL-04}', 4.5, 15000, 'B47 engine'),
    ('BMW', '3 Series', 2019, null, 'petrol', '5W-30', '0W-30', '{BMW LL-04}', 5.0, 15000, 'B48 engine (G20)'),
    ('BMW', '3 Series', 2019, null, 'diesel', '5W-30', '0W-30', '{BMW LL-04}', 5.5, 15000, 'B57 engine (G20)'),
    ('BMW', '3 Series', 2019, null, 'hybrid', '5W-30', '0W-30', '{BMW LL-04}', 5.0, 15000, '330e PHEV (G20)'),
    ('BMW', '4 Series', 2020, null, 'petrol', '5W-30', '0W-30', '{BMW LL-04}', 5.0, 15000, 'B48 engine'),
    ('BMW', '4 Series', 2020, null, 'diesel', '5W-30', '0W-30', '{BMW LL-04}', 5.5, 15000, 'B57 engine'),
    ('BMW', '5 Series', 2017, null, 'petrol', '5W-30', '0W-30', '{BMW LL-04}', 5.0, 15000, 'B48/B58 engine (G30)'),
    ('BMW', '5 Series', 2017, null, 'diesel', '5W-30', '0W-30', '{BMW LL-04}', 6.5, 15000, 'B57 engine (G30)'),
    ('BMW', '5 Series', 2017, null, 'hybrid', '5W-30', '0W-30', '{BMW LL-04}', 5.0, 15000, '530e/545e PHEV'),
    ('BMW', '7 Series', 2015, null, 'petrol', '5W-30', '0W-30', '{BMW LL-04}', 6.5, 15000, 'B58/N63 engine (G11)'),
    ('BMW', '7 Series', 2015, null, 'diesel', '5W-30', '0W-30', '{BMW LL-04}', 7.0, 15000, 'B57 engine (G11)'),
    ('BMW', 'X1', 2015, null, 'petrol', '5W-30', '0W-30', '{BMW LL-04}', 4.5, 15000, 'B38 engine'),
    ('BMW', 'X1', 2015, null, 'diesel', '5W-30', '0W-30', '{BMW LL-04}', 4.5, 15000, 'B37/B47 engine'),
    ('BMW', 'X3', 2017, null, 'petrol', '5W-30', '0W-30', '{BMW LL-04}', 5.0, 15000, 'B48 engine (G01)'),
    ('BMW', 'X3', 2017, null, 'diesel', '5W-30', '0W-30', '{BMW LL-04}', 5.5, 15000, 'B47/B57 engine (G01)'),
    ('BMW', 'X5', 2018, null, 'petrol', '5W-30', '0W-30', '{BMW LL-04}', 6.5, 15000, 'B58 engine (G05)'),
    ('BMW', 'X5', 2018, null, 'diesel', '5W-30', '0W-30', '{BMW LL-04}', 7.0, 15000, 'B57 engine (G05)'),
    ('BMW', 'X5', 2018, null, 'hybrid', '5W-30', '0W-30', '{BMW LL-04}', 6.5, 15000, 'xDrive45e PHEV'),
    ('BMW', 'Z4', 2018, null, 'petrol', '5W-30', '0W-30', '{BMW LL-04}', 5.0, 15000, 'B48/B58 engine'),
    ('Volkswagen', 'Golf', 2012, 2019, 'petrol', '5W-30', '0W-30', '{VW 504.00}', 4.5, 15000, 'EA888 TSI (Mk7)'),
    ('Volkswagen', 'Golf', 2012, 2019, 'diesel', '5W-30', null, '{VW 507.00}', 4.3, 15000, 'EA288 TDI (Mk7)'),
    ('Volkswagen', 'Golf', 2019, null, 'petrol', '5W-30', '0W-20', '{VW 504.00,VW 508.00}', 4.5, 15000, 'EA888 TSI (Mk8)'),
    ('Volkswagen', 'Golf', 2019, null, 'diesel', '5W-30', '0W-20', '{VW 507.00,VW 509.00}', 4.3, 15000, 'EA288 TDI (Mk8)'),
    ('Volkswagen', 'Golf', 2019, null, 'hybrid', '5W-30', '0W-20', '{VW 504.00,VW 508.00}', 4.5, 15000, 'GTE PHEV (Mk8)'),
    ('Volkswagen', 'Polo', 2017, null, 'petrol', '5W-30', null, '{VW 504.00}', 3.6, 15000, 'EA211 TSI'),
    ('Volkswagen', 'Passat', 2014, null, 'petrol', '5W-30', '0W-20', '{VW 504.00,VW 508.00}', 4.5, 15000, 'EA888 TSI (B8)'),
    ('Volkswagen', 'Passat', 2014, null, 'diesel', '5W-30', '0W-20', '{VW 507.00,VW 509.00}', 4.3, 15000, 'EA288 TDI (B8)'),
    ('Volkswagen', 'Tiguan', 2016, null, 'petrol', '5W-30', '0W-20', '{VW 504.00,VW 508.00}', 4.5, 15000, 'EA888 TSI'),
    ('Volkswagen', 'Tiguan', 2016, null, 'diesel', '5W-30', '0W-20', '{VW 507.00,VW 509.00}', 4.3, 15000, 'EA288 TDI'),
    ('Volkswagen', 'Amarok', 2010, null, 'diesel', '5W-30', null, '{VW 507.00}', 5.7, 15000, 'TDI V6 / 2.0 TDI'),
    ('Volkswagen', 'Transporter', 2015, null, 'diesel', '5W-30', null, '{VW 507.00}', 5.7, 15000, 'T6 TDI'),
    ('Audi', 'A3', 2012, null, 'petrol', '5W-30', '0W-20', '{VW 504.00,VW 508.00}', 4.5, 15000, 'EA888 TFSI'),
    ('Audi', 'A3', 2012, null, 'diesel', '5W-30', '0W-20', '{VW 507.00,VW 509.00}', 4.3, 15000, 'EA288 TDI'),
    ('Audi', 'A4', 2015, null, 'petrol', '5W-30', '0W-20', '{VW 504.00,VW 508.00}', 4.5, 15000, 'EA888 TFSI (B9)'),
    ('Audi', 'A4', 2015, null, 'diesel', '5W-30', '0W-20', '{VW 507.00,VW 509.00}', 4.3, 15000, 'EA288 TDI (B9)'),
    ('Audi', 'A6', 2018, null, 'petrol', '5W-30', '0W-20', '{VW 504.00,VW 508.00}', 5.7, 15000, 'EA839 TFSI V6 (C8)'),
    ('Audi', 'A6', 2018, null, 'diesel', '5W-30', '0W-20', '{VW 507.00,VW 509.00}', 5.7, 15000, 'EA898 TDI V6 (C8)'),
    ('Audi', 'Q5', 2016, null, 'petrol', '5W-30', '0W-20', '{VW 504.00,VW 508.00}', 5.7, 15000, 'EA839 TFSI (FY)'),
    ('Audi', 'Q5', 2016, null, 'diesel', '5W-30', '0W-20', '{VW 507.00,VW 509.00}', 5.7, 15000, 'EA288 TDI (FY)'),
    ('Audi', 'Q7', 2015, null, 'petrol', '5W-30', '0W-20', '{VW 504.00,VW 508.00}', 7.0, 15000, 'EA839 TFSI V6'),
    ('Audi', 'Q7', 2015, null, 'diesel', '5W-30', '0W-20', '{VW 507.00,VW 509.00}', 7.0, 15000, 'EA898 TDI V6'),
    ('Audi', 'R8', 2015, null, 'petrol', '5W-40', null, '{VW 502.00}', 9.5, 10000, 'FSI V10'),
    ('Mercedes-Benz', 'A-Class', 2018, null, 'petrol', '5W-30', '0W-20', '{MB 229.51,MB 229.71}', 5.5, 15000, 'M282 engine (W177)'),
    ('Mercedes-Benz', 'A-Class', 2018, null, 'diesel', '5W-30', null, '{MB 229.51,MB 229.52}', 5.5, 15000, 'OM654 engine (W177)'),
    ('Mercedes-Benz', 'C-Class', 2014, null, 'petrol', '5W-30', '0W-20', '{MB 229.51,MB 229.71}', 6.5, 15000, 'M274/M264 engine'),
    ('Mercedes-Benz', 'C-Class', 2014, null, 'diesel', '5W-30', null, '{MB 229.51,MB 229.52}', 6.5, 15000, 'OM651/OM654 engine'),
    ('Mercedes-Benz', 'C-Class', 2014, null, 'hybrid', '5W-30', '0W-20', '{MB 229.51,MB 229.71}', 6.5, 15000, 'C300e PHEV'),
    ('Mercedes-Benz', 'E-Class', 2016, null, 'petrol', '5W-30', '0W-20', '{MB 229.51,MB 229.71}', 7.5, 15000, 'M274/M264 (W213)'),
    ('Mercedes-Benz', 'E-Class', 2016, null, 'diesel', '5W-30', null, '{MB 229.51,MB 229.52}', 7.5, 15000, 'OM654 (W213)'),
    ('Mercedes-Benz', 'GLC', 2015, null, 'petrol', '5W-30', '0W-20', '{MB 229.51,MB 229.71}', 6.5, 15000, 'M274/M264'),
    ('Mercedes-Benz', 'GLC', 2015, null, 'diesel', '5W-30', null, '{MB 229.51,MB 229.52}', 6.5, 15000, 'OM651/OM654'),
    ('Mercedes-Benz', 'GLE', 2019, null, 'petrol', '5W-30', '0W-20', '{MB 229.51,MB 229.71}', 7.5, 15000, 'M256 (W167)'),
    ('Mercedes-Benz', 'GLE', 2019, null, 'diesel', '5W-30', null, '{MB 229.51,MB 229.52}', 8.5, 15000, 'OM656 (W167)'),
    ('Mercedes-Benz', 'G-Class', 2018, null, 'petrol', '5W-40', null, '{MB 229.5}', 9.0, 10000, 'M176 V8 AMG'),
    ('Mercedes-Benz', 'Sprinter', 2018, null, 'diesel', '5W-30', null, '{MB 229.51}', 7.0, 20000, 'OM651/OM654'),
    ('Mercedes-Benz', 'Vito', 2014, null, 'diesel', '5W-30', null, '{MB 229.51}', 6.0, 15000, 'OM651/OM622'),
    ('Mercedes-Benz', 'AMG GT', 2014, null, 'petrol', '0W-40', null, '{MB 229.5}', 8.5, 10000, 'M178 V8 BiTurbo'),
    ('Porsche', '911', 2019, null, 'petrol', '0W-40', '5W-40', '{Porsche A40}', 8.75, 10000, 'Flat-6 (992)'),
    ('Porsche', 'Cayenne', 2017, null, 'petrol', '0W-40', '5W-40', '{Porsche A40}', 8.75, 10000, 'V6/V8 (9YA)'),
    ('Porsche', 'Cayenne', 2017, null, 'diesel', '5W-30', null, '{VW 507.00}', 8.0, 15000, 'V6 TDI (9YA)'),
    ('Porsche', 'Cayenne', 2017, null, 'hybrid', '0W-40', '5W-40', '{Porsche A40}', 8.75, 10000, 'E-Hybrid PHEV'),
    ('Porsche', 'Macan', 2018, null, 'petrol', '5W-40', null, '{Porsche A40,VW 502.00}', 5.7, 10000, 'EA839/EA888'),
    ('Porsche', 'Panamera', 2016, null, 'petrol', '0W-40', '5W-40', '{Porsche A40}', 8.75, 10000, 'V6/V8'),
    ('Toyota', 'Corolla', 2018, null, 'petrol', '0W-20', '5W-30', '{ILSAC GF-6A}', 4.2, 15000, '2ZR/M20A engine (E210)'),
    ('Toyota', 'Corolla', 2018, null, 'hybrid', '0W-20', '5W-30', '{ILSAC GF-6A}', 4.2, 15000, '2ZR-FXE hybrid (E210)'),
    ('Toyota', 'Camry', 2017, null, 'petrol', '0W-20', '5W-30', '{ILSAC GF-6A}', 4.7, 15000, 'A25A/2AR engine'),
    ('Toyota', 'Camry', 2017, null, 'hybrid', '0W-20', '5W-30', '{ILSAC GF-6A}', 4.7, 15000, 'A25A-FXS hybrid'),
    ('Toyota', 'RAV4', 2018, null, 'petrol', '0W-20', '5W-30', '{ILSAC GF-6A}', 4.5, 15000, 'M20A engine (XA50)'),
    ('Toyota', 'RAV4', 2018, null, 'hybrid', '0W-20', '5W-30', '{ILSAC GF-6A}', 4.5, 15000, 'A25A-FXS hybrid (XA50)'),
    ('Toyota', 'Yaris', 2020, null, 'petrol', '0W-20', null, '{ILSAC GF-6A}', 3.6, 15000, '1KR-VE/M15A engine'),
    ('Toyota', 'Yaris', 2020, null, 'hybrid', '0W-20', null, '{ILSAC GF-6A}', 3.6, 15000, 'M15A-FXE hybrid'),
    ('Toyota', 'Land Cruiser', 2021, null, 'petrol', '0W-20', '5W-30', '{ILSAC GF-6A}', 9.5, 10000, 'V35A V6 Turbo (J300)'),
    ('Toyota', 'Land Cruiser', 2021, null, 'diesel', '5W-30', null, '{ILSAC GF-6A}', 9.5, 10000, 'F33A V6 Turbo Diesel'),
    ('Toyota', 'Hilux', 2015, null, 'diesel', '5W-30', null, '{ILSAC GF-6A}', 6.0, 10000, '2GD-FTV/1GD-FTV diesel'),
    ('Toyota', 'Supra', 2019, null, 'petrol', '5W-30', '0W-30', '{BMW LL-04}', 5.0, 15000, 'B58 engine (shared BMW)'),
    ('Toyota', 'GR86', 2021, null, 'petrol', '5W-30', '0W-20', '{ILSAC GF-6A}', 5.5, 10000, 'FA24D boxer'),
    ('Honda', 'Civic', 2022, null, 'petrol', '0W-20', null, '{Honda HTO-06}', 3.7, 10000, '1.5T VTEC Turbo (FE/FL)'),
    ('Honda', 'Accord', 2017, null, 'petrol', '0W-20', null, '{Honda HTO-06}', 3.7, 10000, '1.5T/2.0T VTEC'),
    ('Honda', 'CR-V', 2018, null, 'petrol', '0W-20', null, '{Honda HTO-06}', 3.7, 10000, '1.5T VTEC (RW/RT)'),
    ('Honda', 'CR-V', 2018, null, 'hybrid', '0W-20', null, '{Honda HTO-06}', 3.7, 10000, 'e:HEV hybrid'),
    ('Honda', 'HR-V', 2021, null, 'hybrid', '0W-20', null, '{Honda HTO-06}', 3.7, 10000, 'e:HEV hybrid (RV)'),
    ('Honda', 'Jazz', 2020, null, 'hybrid', '0W-20', null, '{Honda HTO-06}', 2.3, 10000, 'e:HEV hybrid (GR)'),
    ('Nissan', 'Qashqai', 2021, null, 'petrol', '5W-30', '0W-20', '{Renault RN0710}', 5.0, 15000, '1.3T DiG-T (J12)'),
    ('Nissan', 'Qashqai', 2021, null, 'hybrid', '5W-30', null, '{Renault RN0710}', 5.0, 15000, 'e-Power hybrid'),
    ('Nissan', 'X-Trail', 2021, null, 'petrol', '5W-30', '0W-20', '{Renault RN0710}', 5.5, 15000, '1.5T (T33)'),
    ('Nissan', 'X-Trail', 2021, null, 'hybrid', '5W-30', null, '{Renault RN0710}', 5.5, 15000, 'e-Power (T33)'),
    ('Nissan', 'Juke', 2019, null, 'petrol', '5W-30', null, '{Renault RN0710}', 4.9, 15000, '1.0T DiG-T (F16)'),
    ('Nissan', 'Navara', 2015, null, 'diesel', '5W-30', null, '{Renault RN0710}', 6.5, 10000, '2.3 dCi diesel'),
    ('Nissan', 'GT-R', 2007, null, 'petrol', '5W-40', null, '{ACEA A3/B4}', 5.5, 10000, 'VR38DETT V6 Twin Turbo'),
    ('Mazda', 'Mazda3', 2018, null, 'petrol', '0W-20', null, '{ILSAC GF-6A}', 4.0, 10000, '2.0 SkyActiv-G (BP)'),
    ('Mazda', 'Mazda3', 2018, null, 'diesel', '5W-30', null, '{ACEA C3}', 5.0, 10000, '1.8 SkyActiv-D (BP)'),
    ('Mazda', 'CX-5', 2017, null, 'petrol', '0W-20', null, '{ILSAC GF-6A}', 4.5, 10000, '2.0/2.5 SkyActiv-G (KF)'),
    ('Mazda', 'CX-5', 2017, null, 'diesel', '5W-30', null, '{ACEA C3}', 5.7, 10000, '2.2 SkyActiv-D (KF)'),
    ('Mazda', 'MX-5', 2015, null, 'petrol', '5W-30', '0W-20', '{ILSAC GF-6A}', 4.0, 10000, 'P5-VP/P5-VPS SkyActiv'),
    ('Subaru', 'Impreza', 2017, null, 'petrol', '0W-20', '5W-30', '{ILSAC GF-6A}', 5.3, 10000, 'FB16/FB20 Boxer'),
    ('Subaru', 'WRX', 2021, null, 'petrol', '5W-30', null, '{ILSAC GF-6A}', 5.5, 10000, 'FA24F Turbo Boxer'),
    ('Subaru', 'Forester', 2018, null, 'petrol', '0W-20', '5W-30', '{ILSAC GF-6A}', 5.3, 10000, 'FB20B (SK)'),
    ('Subaru', 'Forester', 2018, null, 'hybrid', '0W-20', '5W-30', '{ILSAC GF-6A}', 5.3, 10000, 'e-Boxer hybrid'),
    ('Subaru', 'Outback', 2019, null, 'petrol', '0W-20', '5W-30', '{ILSAC GF-6A}', 5.3, 10000, 'FB25D (BT)'),
    ('Hyundai', 'Tucson', 2020, null, 'petrol', '5W-30', '0W-20', '{Hyundai SP}', 4.2, 10000, '1.6T Smartstream (NX4)'),
    ('Hyundai', 'Tucson', 2020, null, 'diesel', '5W-30', null, '{Hyundai SP}', 5.0, 10000, '2.0 CRDi (NX4)'),
    ('Hyundai', 'Tucson', 2020, null, 'hybrid', '5W-30', '0W-20', '{Hyundai SP}', 4.2, 10000, '1.6T PHEV (NX4)'),
    ('Hyundai', 'i30', 2017, null, 'petrol', '5W-30', '0W-20', '{Hyundai SP}', 3.8, 10000, '1.0T/1.4T (PD)'),
    ('Hyundai', 'i30', 2017, null, 'diesel', '5W-30', null, '{Hyundai SP}', 4.0, 10000, '1.6 CRDi (PD)'),
    ('Hyundai', 'i20', 2020, null, 'petrol', '5W-30', '0W-20', '{Hyundai SP}', 3.3, 10000, '1.0T Smartstream (BC3)'),
    ('Hyundai', 'Kona', 2017, null, 'petrol', '5W-30', '0W-20', '{Hyundai SP}', 3.8, 10000, '1.0T/1.6T'),
    ('Hyundai', 'Santa Fe', 2018, null, 'petrol', '5W-30', '0W-20', '{Hyundai SP}', 4.8, 10000, '2.5T (TM)'),
    ('Hyundai', 'Santa Fe', 2018, null, 'diesel', '5W-30', null, '{Hyundai SP}', 5.8, 10000, '2.2 CRDi (TM)'),
    ('Hyundai', 'Palisade', 2018, null, 'petrol', '5W-30', '0W-20', '{Hyundai SP}', 5.5, 10000, '3.8 V6'),
    ('Hyundai', 'Palisade', 2018, null, 'diesel', '5W-30', null, '{Hyundai SP}', 6.0, 10000, '2.2 CRDi'),
    ('Kia', 'Sportage', 2021, null, 'petrol', '5W-30', '0W-20', '{Hyundai SP}', 4.2, 10000, '1.6T Smartstream (NQ5)'),
    ('Kia', 'Sportage', 2021, null, 'diesel', '5W-30', null, '{Hyundai SP}', 5.0, 10000, '2.0 CRDi (NQ5)'),
    ('Kia', 'Sportage', 2021, null, 'hybrid', '5W-30', '0W-20', '{Hyundai SP}', 4.2, 10000, '1.6T PHEV (NQ5)'),
    ('Kia', 'Ceed', 2018, null, 'petrol', '5W-30', '0W-20', '{Hyundai SP}', 3.8, 10000, '1.0T/1.4T (CD)'),
    ('Kia', 'Ceed', 2018, null, 'diesel', '5W-30', null, '{Hyundai SP}', 4.0, 10000, '1.6 CRDi (CD)'),
    ('Kia', 'Sorento', 2020, null, 'petrol', '5W-30', '0W-20', '{Hyundai SP}', 4.8, 10000, '2.5T (MQ4)'),
    ('Kia', 'Sorento', 2020, null, 'diesel', '5W-30', null, '{Hyundai SP}', 5.8, 10000, '2.2 CRDi (MQ4)'),
    ('Kia', 'Stinger', 2017, null, 'petrol', '5W-30', '0W-20', '{Hyundai SP}', 5.5, 10000, '2.5T / 3.3T V6'),
    ('Kia', 'Niro', 2016, null, 'hybrid', '5W-30', '0W-20', '{Hyundai SP}', 3.3, 10000, '1.6 GDi Hybrid'),
    ('Ford', 'Focus', 2018, 2022, 'petrol', '5W-30', '0W-20', '{Ford WSS-M2C913-D}', 3.8, 15000, '1.0T/1.5T EcoBoost (Mk4)'),
    ('Ford', 'Focus', 2018, 2022, 'diesel', '5W-30', null, '{Ford WSS-M2C913-D}', 5.0, 15000, '1.5T/2.0T EcoBlue (Mk4)'),
    ('Ford', 'Kuga', 2019, null, 'petrol', '5W-30', '0W-20', '{Ford WSS-M2C913-D}', 3.8, 15000, '1.5T/2.5T EcoBoost (Mk3)'),
    ('Ford', 'Kuga', 2019, null, 'diesel', '5W-30', null, '{Ford WSS-M2C913-D}', 5.0, 15000, '2.0T EcoBlue (Mk3)'),
    ('Ford', 'Kuga', 2019, null, 'hybrid', '5W-30', '0W-20', '{Ford WSS-M2C913-D}', 3.8, 15000, 'PHEV 2.5T'),
    ('Ford', 'Mustang', 2015, null, 'petrol', '5W-50', null, '{Ford WSS-M2C937-A}', 9.0, 10000, '5.0 Coyote V8'),
    ('Ford', 'Mustang', 2015, null, 'petrol', '5W-30', null, '{Ford WSS-M2C913-D}', 5.7, 10000, '2.3T EcoBoost'),
    ('Ford', 'Explorer', 2019, null, 'petrol', '5W-30', null, '{Ford WSS-M2C913-D}', 5.7, 10000, '3.0T EcoBoost'),
    ('Ford', 'Transit', 2013, null, 'diesel', '5W-30', null, '{Ford WSS-M2C913-D}', 8.5, 15000, '2.0T EcoBlue'),
    ('Volvo', 'XC60', 2017, null, 'petrol', '0W-20', '5W-30', '{Volvo VCC-RBS0-2AE}', 6.5, 15000, 'B4/B6 petrol (246)'),
    ('Volvo', 'XC60', 2017, null, 'diesel', '0W-20', '5W-30', '{Volvo VCC-RBS0-2AE}', 6.5, 15000, 'D4/D5 diesel (246)'),
    ('Volvo', 'XC60', 2017, null, 'hybrid', '0W-20', '5W-30', '{Volvo VCC-RBS0-2AE}', 6.5, 15000, 'T6/T8 Recharge PHEV'),
    ('Volvo', 'XC90', 2015, null, 'petrol', '0W-20', '5W-30', '{Volvo VCC-RBS0-2AE}', 8.5, 15000, 'B5/B6 (SPA)'),
    ('Volvo', 'XC90', 2015, null, 'diesel', '0W-20', '5W-30', '{Volvo VCC-RBS0-2AE}', 8.5, 15000, 'D5 diesel'),
    ('Volvo', 'XC90', 2015, null, 'hybrid', '0W-20', '5W-30', '{Volvo VCC-RBS0-2AE}', 8.5, 15000, 'T8 Recharge PHEV'),
    ('Volvo', 'XC40', 2017, null, 'petrol', '0W-20', '5W-30', '{Volvo VCC-RBS0-2AE}', 4.2, 15000, 'B3/B4 petrol'),
    ('Volvo', 'XC40', 2017, null, 'diesel', '0W-20', '5W-30', '{Volvo VCC-RBS0-2AE}', 4.2, 15000, 'D3/D4 diesel'),
    ('Volvo', 'V60', 2018, null, 'petrol', '0W-20', '5W-30', '{Volvo VCC-RBS0-2AE}', 6.5, 15000, 'B4/B5 petrol'),
    ('Volvo', 'S60', 2018, null, 'petrol', '0W-20', '5W-30', '{Volvo VCC-RBS0-2AE}', 6.5, 15000, 'B4/B5 petrol'),
    ('Škoda', 'Octavia', 2020, null, 'petrol', '5W-30', '0W-20', '{VW 504.00,VW 508.00}', 4.5, 15000, 'EA888/EA211 (Mk4)'),
    ('Škoda', 'Octavia', 2020, null, 'diesel', '5W-30', '0W-20', '{VW 507.00,VW 509.00}', 4.3, 15000, 'EA288 TDI (Mk4)'),
    ('Škoda', 'Fabia', 2021, null, 'petrol', '5W-30', null, '{VW 504.00}', 3.6, 15000, 'EA211 (Mk4)'),
    ('Škoda', 'Kodiaq', 2016, null, 'petrol', '5W-30', '0W-20', '{VW 504.00,VW 508.00}', 4.5, 15000, 'EA888 TSI'),
    ('Škoda', 'Kodiaq', 2016, null, 'diesel', '5W-30', '0W-20', '{VW 507.00,VW 509.00}', 4.3, 15000, 'EA288 TDI'),
    ('SEAT', 'Leon', 2020, null, 'petrol', '5W-30', '0W-20', '{VW 504.00,VW 508.00}', 4.5, 15000, 'EA888/EA211 (Mk4)'),
    ('SEAT', 'Leon', 2020, null, 'diesel', '5W-30', '0W-20', '{VW 507.00,VW 509.00}', 4.3, 15000, 'EA288 TDI (Mk4)'),
    ('SEAT', 'Ibiza', 2017, null, 'petrol', '5W-30', null, '{VW 504.00}', 3.6, 15000, 'EA211 TSI (KJ)'),
    ('SEAT', 'Ateca', 2016, null, 'petrol', '5W-30', '0W-20', '{VW 504.00,VW 508.00}', 4.5, 15000, 'EA888 TSI'),
    ('Cupra', 'Formentor', 2020, null, 'petrol', '5W-30', '0W-20', '{VW 504.00,VW 508.00}', 4.5, 15000, 'EA888 TSI 2.0T'),
    ('Dacia', 'Sandero', 2020, null, 'petrol', '5W-30', null, '{Renault RN0710}', 4.5, 15000, '1.0T/1.0 SCe'),
    ('Dacia', 'Duster', 2017, null, 'petrol', '5W-30', null, '{Renault RN0710}', 5.0, 15000, '1.3T/1.6 SCe (Mk2)'),
    ('Dacia', 'Duster', 2017, null, 'diesel', '5W-30', null, '{Renault RN0710}', 5.5, 15000, '1.5 Blue dCi (Mk2)'),
    ('Renault', 'Clio', 2019, null, 'petrol', '5W-30', null, '{Renault RN0710}', 4.4, 15000, '1.0T/1.3T (Mk5)'),
    ('Renault', 'Clio', 2019, null, 'diesel', '5W-30', null, '{Renault RN0710}', 4.9, 15000, '1.5 Blue dCi (Mk5)'),
    ('Renault', 'Clio', 2019, null, 'hybrid', '5W-30', null, '{Renault RN0710}', 4.4, 15000, 'E-Tech hybrid'),
    ('Renault', 'Captur', 2019, null, 'petrol', '5W-30', null, '{Renault RN0710}', 5.0, 15000, '1.0T/1.3T (Mk2)'),
    ('Renault', 'Captur', 2019, null, 'hybrid', '5W-30', null, '{Renault RN0710}', 5.0, 15000, 'E-Tech PHEV (Mk2)'),
    ('Peugeot', '208', 2019, null, 'petrol', '5W-30', null, '{PSA B71 2312}', 3.5, 15000, '1.2T PureTech (Mk2)'),
    ('Peugeot', '208', 2019, null, 'diesel', '5W-30', null, '{PSA B71 2312}', 3.8, 15000, '1.5 BlueHDi (Mk2)'),
    ('Peugeot', '3008', 2016, null, 'petrol', '5W-30', null, '{PSA B71 2312}', 4.5, 15000, '1.2T/1.6T PureTech'),
    ('Peugeot', '3008', 2016, null, 'diesel', '5W-30', null, '{PSA B71 2312}', 4.7, 15000, '2.0 BlueHDi'),
    ('Peugeot', '3008', 2016, null, 'hybrid', '5W-30', null, '{PSA B71 2312}', 4.5, 15000, '225/300e Hybrid PHEV'),
    ('Citroën', 'C3', 2016, null, 'petrol', '5W-30', null, '{PSA B71 2312}', 3.5, 15000, '1.2T PureTech (Mk3)'),
    ('Citroën', 'C5 Aircross', 2018, null, 'petrol', '5W-30', null, '{PSA B71 2312}', 4.5, 15000, '1.2T/1.6T PureTech'),
    ('Citroën', 'C5 Aircross', 2018, null, 'diesel', '5W-30', null, '{PSA B71 2312}', 4.7, 15000, '2.0 BlueHDi'),
    ('Fiat', '500', 2007, null, 'petrol', '5W-40', '5W-30', '{Fiat 9.55535-GS1}', 3.5, 15000, '1.2/1.4 Fire/TwinAir'),
    ('Fiat', 'Panda', 2012, null, 'petrol', '5W-40', '5W-30', '{Fiat 9.55535-GS1}', 3.5, 15000, '0.9 TwinAir/1.2 Fire'),
    ('Fiat', 'Tipo', 2015, null, 'petrol', '5W-40', '5W-30', '{Fiat 9.55535-GS1}', 4.4, 15000, '1.4T/1.6'),
    ('Fiat', 'Tipo', 2015, null, 'diesel', '5W-40', '5W-30', '{Fiat 9.55535-GS1}', 4.7, 15000, '1.3/1.6 MultiJet'),
    ('Alfa Romeo', 'Giulia', 2016, null, 'petrol', '5W-40', null, '{Fiat 9.55535-GS1}', 5.5, 10000, '2.0T/2.9 V6 Biturbo'),
    ('Alfa Romeo', 'Giulia', 2016, null, 'diesel', '5W-40', null, '{Fiat 9.55535-GS1}', 5.5, 10000, '2.2 MultiJet'),
    ('Alfa Romeo', 'Stelvio', 2016, null, 'petrol', '5W-40', null, '{Fiat 9.55535-GS1}', 5.5, 10000, '2.0T/2.9 V6 Biturbo'),
    ('Alfa Romeo', 'Stelvio', 2016, null, 'diesel', '5W-40', null, '{Fiat 9.55535-GS1}', 5.5, 10000, '2.2 MultiJet'),
    ('Mitsubishi', 'Outlander', 2021, null, 'petrol', '0W-20', '5W-30', '{ILSAC GF-6A}', 4.5, 10000, '2.5 MIVEC (PhIII)'),
    ('Mitsubishi', 'Outlander', 2021, null, 'hybrid', '0W-20', '5W-30', '{ILSAC GF-6A}', 4.5, 10000, 'PHEV 2.4 MIVEC'),
    ('Mitsubishi', 'Eclipse Cross', 2017, null, 'petrol', '0W-20', '5W-30', '{ILSAC GF-6A}', 4.2, 10000, '1.5T/2.0'),
    ('Mitsubishi', 'L200', 2015, null, 'diesel', '5W-30', null, '{ACEA A3/B4}', 7.1, 10000, '2.4D DiD'),
    ('Mitsubishi', 'Pajero', 2006, null, 'diesel', '5W-30', null, '{ACEA A3/B4}', 9.5, 10000, '3.2 DI-D V6'),
    ('Suzuki', 'Swift', 2017, null, 'petrol', '0W-20', '5W-30', '{ILSAC GF-6A}', 2.9, 10000, '1.0T BoosterJet / 1.2 DualJet'),
    ('Suzuki', 'Vitara', 2015, null, 'petrol', '0W-20', '5W-30', '{ILSAC GF-6A}', 3.9, 10000, '1.4T / 1.6 BoosterJet'),
    ('Suzuki', 'Jimny', 2018, null, 'petrol', '5W-30', null, '{ILSAC GF-6A}', 3.8, 10000, '1.5 K15B'),
    ('Suzuki', 'S-Cross', 2021, null, 'hybrid', '0W-20', '5W-30', '{ILSAC GF-6A}', 3.9, 10000, '1.4T mild hybrid'),
    ('Isuzu', 'D-Max', 2021, null, 'diesel', '5W-30', null, '{API CK-4}', 7.1, 10000, '1.9/3.0 DDi Turbo'),
    ('Isuzu', 'MU-X', 2021, null, 'diesel', '5W-30', null, '{API CK-4}', 7.1, 10000, '1.9/3.0 DDi Turbo')
) as v(make_name, model_name, year_from, year_to, engine_type, viscosity, viscosity_alt, required_specs, oil_capacity_liters, change_interval_km, notes)
  on ma.name = v.make_name and mo.name = v.model_name
where not exists (
  select 1
  from public.car_oil_fitment existing
  where existing.model_id = mo.id
    and existing.year_from is not distinct from v.year_from
    and existing.year_to is not distinct from v.year_to
    and existing.engine_type is not distinct from v.engine_type
    and existing.viscosity = v.viscosity
    and existing.viscosity_alt is not distinct from v.viscosity_alt
    and existing.oil_capacity_liters is not distinct from v.oil_capacity_liters
    and existing.notes is not distinct from v.notes
);

-- ============================================================
-- BRAKE DATABASE — CREATE TABLES
-- Run order: 1) this  2) brake_brands_seed.sql  3) car_brake_fitment_seed.sql
-- Unlike oil, EVs ARE included — they have brakes
-- (Regenerative braking means slower wear, but they still need brake parts)
-- ============================================================

create table if not exists public.brake_brands (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  country    text,
  website    text,
  tier       text,   -- premium / mid / budget
  active     boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Covers: discs, pads, shoes, drums, calipers
create table if not exists public.brake_products (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id             uuid references public.brake_brands(id) ON DELETE CASCADE,
  name                 text NOT NULL,
  type                 text NOT NULL,    -- disc / pad / shoe / drum / caliper
  position             text,             -- front / rear / universal
  -- DISC fields (null for pads)
  disc_diameter_mm     int,
  disc_thickness_mm    numeric(4,1),
  disc_min_thickness_mm numeric(4,1),
  disc_ventilated      boolean DEFAULT false,
  disc_drilled         boolean DEFAULT false,
  disc_slotted         boolean DEFAULT false,
  disc_coated          boolean DEFAULT false,
  -- PAD fields (null for discs)
  pad_height_mm        numeric(5,1),
  pad_width_mm         numeric(5,1),
  pad_thickness_mm     numeric(4,1),
  pad_material         text,             -- ceramic / semi-metallic / organic / carbon
  pad_with_sensor      boolean DEFAULT false,
  -- Common
  ean                  text,
  price_eur            numeric(10,2),
  stock                integer NOT NULL DEFAULT 0,
  image_url            text,
  marketing_description text,
  article_number       text,
  ean_code             text,
  delivery_time        text NOT NULL DEFAULT '2-5 days',
  features             jsonb NOT NULL DEFAULT '[]'::jsonb,
  reviews              jsonb NOT NULL DEFAULT '[]'::jsonb,
  specifications       jsonb NOT NULL DEFAULT '[]'::jsonb,
  active               boolean DEFAULT true,
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  constraint brake_products_stock_non_negative check (stock >= 0)
);

alter table public.brake_products
  add column if not exists stock integer not null default 0,
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists image_url text,
  add column if not exists marketing_description text,
  add column if not exists features jsonb not null default '[]'::jsonb,
  add column if not exists reviews jsonb not null default '[]'::jsonb,
  add column if not exists article_number text,
  add column if not exists ean_code text,
  add column if not exists delivery_time text not null default '2-5 days',
  add column if not exists specifications jsonb not null default '[]'::jsonb;

-- Per-model OEM brake specifications
-- Separate rows for front and rear
create table if not exists public.car_brake_fitment (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id              uuid references public.models(id) ON DELETE CASCADE,
  year_from             int,
  year_to               int,
  position              text NOT NULL,   -- front / rear
  brake_type            text NOT NULL,   -- disc / drum
  disc_diameter_mm      int,             -- null for drum
  disc_thickness_mm     numeric(4,1),
  disc_min_thickness_mm numeric(4,1),
  disc_ventilated       boolean DEFAULT false,
  drum_diameter_mm      int,             -- null for disc
  pad_height_mm         numeric(5,1),
  pad_width_mm          numeric(5,1),
  pad_thickness_mm      numeric(4,1),
  notes                 text,            -- e.g. 'M Sport', 'base trim'
  created_at            timestamptz DEFAULT now()
);

-- Indexes
create index if not exists idx_brake_products_type on public.brake_products(type);
create index if not exists idx_brake_products_disc on public.brake_products(disc_diameter_mm, disc_thickness_mm);
create index if not exists idx_brake_products_pad on public.brake_products(pad_height_mm, pad_width_mm);
create index if not exists idx_brake_fitment_model on public.car_brake_fitment(model_id);
create index if not exists idx_brake_fitment_disc on public.car_brake_fitment(disc_diameter_mm, disc_thickness_mm);

alter table public.brake_brands enable row level security;
alter table public.brake_products enable row level security;
alter table public.car_brake_fitment enable row level security;

drop policy if exists "Public read brake brands" on public.brake_brands;
create policy "Public read brake brands"
  on public.brake_brands
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read brake products" on public.brake_products;
create policy "Public read brake products"
  on public.brake_products
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read car brake fitment" on public.car_brake_fitment;
create policy "Public read car brake fitment"
  on public.car_brake_fitment
  for select
  to anon, authenticated
  using (true);

create unique index if not exists brake_brands_name_unique_idx
  on public.brake_brands (lower(name));

create unique index if not exists brake_products_brand_name_type_unique_idx
  on public.brake_products (brand_id, lower(name), type, coalesce(position, ''));

create unique index if not exists car_brake_fitment_model_specs_unique_idx
  on public.car_brake_fitment (
    model_id,
    coalesce(year_from, -1),
    coalesce(year_to, -1),
    position,
    brake_type,
    coalesce(disc_diameter_mm, -1),
    coalesce(disc_thickness_mm, -1),
    coalesce(drum_diameter_mm, -1),
    coalesce(pad_height_mm, -1),
    coalesce(pad_width_mm, -1),
    coalesce(pad_thickness_mm, -1),
    coalesce(notes, '')
  );


-- ============================================================
-- MAGIC QUERY 1 — find compatible DISCS for a car
-- ============================================================
-- SELECT
--   bb.name AS brand, bp.name, bp.disc_diameter_mm, bp.disc_thickness_mm,
--   bp.disc_drilled, bp.disc_slotted, bp.disc_coated, bp.price_eur
-- FROM car_brake_fitment cbf
-- join public.models mo ON cbf.model_id = mo.id
-- JOIN makes  ma ON mo.make_id   = ma.id
-- JOIN brake_products bp ON (
--   bp.type = 'disc'
--   AND bp.disc_diameter_mm    = cbf.disc_diameter_mm
--   AND bp.disc_thickness_mm   = cbf.disc_thickness_mm
--   AND bp.position            = cbf.position
-- )
-- JOIN brake_brands bb ON bp.brand_id = bb.id
-- WHERE ma.name = 'BMW' AND mo.name = '3 Series' AND cbf.position = 'front'
-- ORDER BY bb.name;

-- ============================================================
-- MAGIC QUERY 2 — find compatible PADS for a car
-- ============================================================
-- SELECT
--   bb.name AS brand, bp.name, bp.pad_material, bp.price_eur
-- FROM car_brake_fitment cbf
-- join public.models mo ON cbf.model_id = mo.id
-- JOIN makes  ma ON mo.make_id   = ma.id
-- JOIN brake_products bp ON (
--   bp.type = 'pad'
--   AND bp.pad_height_mm   = cbf.pad_height_mm
--   AND bp.pad_width_mm    = cbf.pad_width_mm
--   AND bp.position        = cbf.position
-- )
-- JOIN brake_brands bb ON bp.brand_id = bb.id
-- WHERE ma.name = 'BMW' AND mo.name = '3 Series' AND cbf.position = 'front'
-- ORDER BY bb.name;

-- ============================================================
-- BRAKE BRANDS + PRODUCTS SEED DATA
-- Run AFTER brake_schema.sql
-- All product names are real products that exist
-- Prices are estimates — update with your supplier prices
-- ============================================================

insert into public.brake_brands (name, country, website, tier, active)
select v.name, v.country, v.website, v.tier, v.active
from (values
('Brembo',       'Italy',          'brembo.com',        'premium', true),
('Ferodo',       'United Kingdom', 'ferodo.com',        'premium', true),
('ATE',          'Germany',        'ate.eu',            'premium', true),
('Bosch',        'Germany',        'bosch.com',         'premium', true),
('TRW',          'Germany',        'trwaftermarket.com','premium', true),
('Textar',       'Germany',        'textar.com',        'premium', true),
('Pagid',        'Germany',        'pagid.com',         'premium', true),
('EBC Brakes',   'United Kingdom', 'ebcbrakes.com',     'premium', true),
('Zimmermann',   'Germany',        'zimmermann-brakes.de','mid',   true),
('Delphi',       'United Kingdom', 'delphi.com',        'mid',    true),
('Mintex',       'United Kingdom', 'mintex.co.uk',      'mid',    true),
('Nisshinbo',    'Japan',          'nisshinbo.co.jp',   'mid',    true),
('Akebono',      'Japan',          'akebono-brake.com', 'premium', true),
('Hawk Performance','USA',          'hawkperformance.com','premium',true),
('PowerStop',    'USA',            'powerstop.com',     'mid',    true),
('DBA',          'Australia',      'dba.com.au',        'premium', true),
('Remsa',        'Spain',          'remsa.es',          'mid',    true),
('Jurid',        'Germany',        'jurid.com',         'mid',    true),
('Meyle',        'Germany',        'meyle.com',         'mid',    true),
('LPR',          'Italy',          'lpr.it',            'mid',    true),
('NK',           'Denmark',        'nk.dk',             'budget', true),
('Comline',      'United Kingdom', 'comlineauto.com',   'budget', true),
('Blueprint',    'United Kingdom', 'blueprintauto.co.uk','budget', true)
) as v(name, country, website, tier, active)
where not exists (
  select 1 from public.brake_brands existing
  where lower(existing.name) = lower(v.name)
);

-- ============================================================
-- BRAKE DISC PRODUCTS
-- ============================================================
insert into public.brake_products (id, brand_id, name, type, position,
  disc_diameter_mm, disc_thickness_mm, disc_min_thickness_mm,
  disc_ventilated, disc_drilled, disc_slotted, disc_coated,
  price_eur, active)
SELECT gen_random_uuid(), b.id, v.name, 'disc', v.position,
  v.disc_diameter_mm, v.disc_thickness_mm, v.disc_min_thickness_mm,
  v.disc_ventilated, v.disc_drilled, v.disc_slotted, v.disc_coated,
  v.price_eur, true
from public.brake_brands b
JOIN (VALUES

  -- ============================================================
  -- BREMBO DISCS
  -- ============================================================
  ('Brembo', 'Brembo Disc 280mm Front Standard',          'front', 280, 22.0, 20.0, true,  false, false, false, 38.99),
  ('Brembo', 'Brembo Disc 300mm Front Standard',          'front', 300, 28.0, 26.0, true,  false, false, false, 44.99),
  ('Brembo', 'Brembo Disc 312mm Front Vented',            'front', 312, 25.0, 23.0, true,  false, false, false, 46.99),
  ('Brembo', 'Brembo Disc 320mm Front Vented',            'front', 320, 28.0, 26.0, true,  false, false, false, 49.99),
  ('Brembo', 'Brembo Disc 330mm Front Vented',            'front', 330, 30.0, 28.0, true,  false, false, false, 54.99),
  ('Brembo', 'Brembo Disc 340mm Front Vented',            'front', 340, 30.0, 28.0, true,  false, false, false, 58.99),
  ('Brembo', 'Brembo Disc 348mm Front Vented',            'front', 348, 30.0, 28.0, true,  false, false, false, 62.99),
  ('Brembo', 'Brembo Disc 360mm Front Vented',            'front', 360, 30.0, 28.0, true,  false, false, false, 68.99),
  ('Brembo', 'Brembo Disc 374mm Front Vented',            'front', 374, 36.0, 34.0, true,  false, false, false, 79.99),
  ('Brembo', 'Brembo Disc 395mm Front Vented',            'front', 395, 36.0, 34.0, true,  false, false, false, 94.99),
  ('Brembo', 'Brembo Disc 272mm Rear Solid',              'rear',  272, 10.0,  8.0, false, false, false, false, 29.99),
  ('Brembo', 'Brembo Disc 286mm Rear Solid',              'rear',  286, 12.0, 10.0, false, false, false, false, 32.99),
  ('Brembo', 'Brembo Disc 300mm Rear Vented',             'rear',  300, 22.0, 20.0, true,  false, false, false, 41.99),
  ('Brembo', 'Brembo Disc 310mm Rear Vented',             'rear',  310, 22.0, 20.0, true,  false, false, false, 44.99),
  ('Brembo', 'Brembo Disc 320mm Rear Vented',             'rear',  320, 22.0, 20.0, true,  false, false, false, 46.99),
  ('Brembo', 'Brembo Disc 345mm Rear Vented',             'rear',  345, 24.0, 22.0, true,  false, false, false, 54.99),
  -- Sport cross-drilled
  ('Brembo', 'Brembo Sport Drilled 312mm Front',          'front', 312, 25.0, 23.0, true,  true,  false, false, 72.99),
  ('Brembo', 'Brembo Sport Drilled 330mm Front',          'front', 330, 30.0, 28.0, true,  true,  false, false, 84.99),
  ('Brembo', 'Brembo Sport Drilled 348mm Front',          'front', 348, 30.0, 28.0, true,  true,  false, false, 89.99),
  ('Brembo', 'Brembo Sport Drilled 360mm Front',          'front', 360, 30.0, 28.0, true,  true,  false, false, 96.99),

  -- ============================================================
  -- ATE DISCS (OEM supplier for many European brands)
  -- ============================================================
  ('ATE', 'ATE PowerDisc 280mm Front',                    'front', 280, 22.0, 20.0, true,  false, true,  false, 42.99),
  ('ATE', 'ATE PowerDisc 300mm Front',                    'front', 300, 28.0, 26.0, true,  false, true,  false, 47.99),
  ('ATE', 'ATE PowerDisc 312mm Front',                    'front', 312, 25.0, 23.0, true,  false, true,  false, 49.99),
  ('ATE', 'ATE PowerDisc 320mm Front',                    'front', 320, 28.0, 26.0, true,  false, true,  false, 52.99),
  ('ATE', 'ATE PowerDisc 330mm Front',                    'front', 330, 30.0, 28.0, true,  false, true,  false, 57.99),
  ('ATE', 'ATE PowerDisc 348mm Front',                    'front', 348, 30.0, 28.0, true,  false, true,  false, 64.99),
  ('ATE', 'ATE PowerDisc 360mm Front',                    'front', 360, 30.0, 28.0, true,  false, true,  false, 71.99),
  ('ATE', 'ATE Premium 272mm Rear',                       'rear',  272, 10.0,  8.0, false, false, false, false, 28.99),
  ('ATE', 'ATE Premium 300mm Rear',                       'rear',  300, 22.0, 20.0, true,  false, false, false, 38.99),
  ('ATE', 'ATE Premium 320mm Rear',                       'rear',  320, 22.0, 20.0, true,  false, false, false, 43.99),

  -- ============================================================
  -- ZIMMERMANN (coated discs — very popular)
  -- ============================================================
  ('Zimmermann', 'Zimmermann Coat Z 280mm Front',         'front', 280, 22.0, 20.0, true,  false, false, true,  44.99),
  ('Zimmermann', 'Zimmermann Coat Z 300mm Front',         'front', 300, 28.0, 26.0, true,  false, false, true,  49.99),
  ('Zimmermann', 'Zimmermann Coat Z 312mm Front',         'front', 312, 25.0, 23.0, true,  false, false, true,  51.99),
  ('Zimmermann', 'Zimmermann Coat Z 320mm Front',         'front', 320, 28.0, 26.0, true,  false, false, true,  54.99),
  ('Zimmermann', 'Zimmermann Coat Z 330mm Front',         'front', 330, 30.0, 28.0, true,  false, false, true,  59.99),
  ('Zimmermann', 'Zimmermann Coat Z 340mm Front',         'front', 340, 30.0, 28.0, true,  false, false, true,  63.99),
  ('Zimmermann', 'Zimmermann Coat Z 348mm Front',         'front', 348, 30.0, 28.0, true,  false, false, true,  67.99),
  ('Zimmermann', 'Zimmermann Coat Z 360mm Front',         'front', 360, 30.0, 28.0, true,  false, false, true,  74.99),
  ('Zimmermann', 'Zimmermann Coat Z 374mm Front',         'front', 374, 36.0, 34.0, true,  false, false, true,  86.99),
  ('Zimmermann', 'Zimmermann Coat Z 272mm Rear',          'rear',  272, 10.0,  8.0, false, false, false, true,  31.99),
  ('Zimmermann', 'Zimmermann Coat Z 286mm Rear',          'rear',  286, 12.0, 10.0, false, false, false, true,  34.99),
  ('Zimmermann', 'Zimmermann Coat Z 300mm Rear',          'rear',  300, 22.0, 20.0, true,  false, false, true,  42.99),
  ('Zimmermann', 'Zimmermann Coat Z 320mm Rear',          'rear',  320, 22.0, 20.0, true,  false, false, true,  46.99),
  ('Zimmermann', 'Zimmermann Coat Z 345mm Rear',          'rear',  345, 24.0, 22.0, true,  false, false, true,  56.99),
  -- Sport Z (drilled + slotted)
  ('Zimmermann', 'Zimmermann Sport Z 330mm Front',        'front', 330, 30.0, 28.0, true,  true,  true,  true,  84.99),
  ('Zimmermann', 'Zimmermann Sport Z 348mm Front',        'front', 348, 30.0, 28.0, true,  true,  true,  true,  91.99),
  ('Zimmermann', 'Zimmermann Sport Z 360mm Front',        'front', 360, 30.0, 28.0, true,  true,  true,  true,  99.99),

  -- ============================================================
  -- EBC BRAKES
  -- ============================================================
  ('EBC Brakes', 'EBC Standard 280mm Front',              'front', 280, 22.0, 20.0, true,  false, false, false, 39.99),
  ('EBC Brakes', 'EBC Standard 300mm Front',              'front', 300, 28.0, 26.0, true,  false, false, false, 44.99),
  ('EBC Brakes', 'EBC Standard 312mm Front',              'front', 312, 25.0, 23.0, true,  false, false, false, 47.99),
  ('EBC Brakes', 'EBC Standard 330mm Front',              'front', 330, 30.0, 28.0, true,  false, false, false, 54.99),
  ('EBC Brakes', 'EBC Standard 348mm Front',              'front', 348, 30.0, 28.0, true,  false, false, false, 61.99),
  ('EBC Brakes', 'EBC USR Slotted 312mm Front',           'front', 312, 25.0, 23.0, true,  false, true,  false, 62.99),
  ('EBC Brakes', 'EBC USR Slotted 330mm Front',           'front', 330, 30.0, 28.0, true,  false, true,  false, 71.99),
  ('EBC Brakes', 'EBC BSD Drilled 312mm Front',           'front', 312, 25.0, 23.0, true,  true,  false, false, 64.99),
  ('EBC Brakes', 'EBC BSD Drilled 348mm Front',           'front', 348, 30.0, 28.0, true,  true,  false, false, 79.99),
  ('EBC Brakes', 'EBC Standard 272mm Rear',               'rear',  272, 10.0,  8.0, false, false, false, false, 29.99),
  ('EBC Brakes', 'EBC Standard 300mm Rear',               'rear',  300, 22.0, 20.0, true,  false, false, false, 38.99),
  ('EBC Brakes', 'EBC Standard 320mm Rear',               'rear',  320, 22.0, 20.0, true,  false, false, false, 43.99),

  -- ============================================================
  -- BOSCH DISCS
  -- ============================================================
  ('Bosch', 'Bosch QuietCast 280mm Front',                'front', 280, 22.0, 20.0, true,  false, false, false, 36.99),
  ('Bosch', 'Bosch QuietCast 300mm Front',                'front', 300, 28.0, 26.0, true,  false, false, false, 41.99),
  ('Bosch', 'Bosch QuietCast 312mm Front',                'front', 312, 25.0, 23.0, true,  false, false, false, 43.99),
  ('Bosch', 'Bosch QuietCast 320mm Front',                'front', 320, 28.0, 26.0, true,  false, false, false, 46.99),
  ('Bosch', 'Bosch QuietCast 330mm Front',                'front', 330, 30.0, 28.0, true,  false, false, false, 51.99),
  ('Bosch', 'Bosch QuietCast 348mm Front',                'front', 348, 30.0, 28.0, true,  false, false, false, 57.99),
  ('Bosch', 'Bosch QuietCast 272mm Rear',                 'rear',  272, 10.0,  8.0, false, false, false, false, 27.99),
  ('Bosch', 'Bosch QuietCast 300mm Rear',                 'rear',  300, 22.0, 20.0, true,  false, false, false, 37.99),
  ('Bosch', 'Bosch QuietCast 320mm Rear',                 'rear',  320, 22.0, 20.0, true,  false, false, false, 41.99),

  -- ============================================================
  -- TRW / DBA / LPR
  -- ============================================================
  ('TRW', 'TRW Ultra 312mm Front',                        'front', 312, 25.0, 23.0, true,  false, false, false, 41.99),
  ('TRW', 'TRW Ultra 330mm Front',                        'front', 330, 30.0, 28.0, true,  false, false, false, 48.99),
  ('TRW', 'TRW Ultra 348mm Front',                        'front', 348, 30.0, 28.0, true,  false, false, false, 55.99),
  ('TRW', 'TRW Ultra 300mm Rear',                         'rear',  300, 22.0, 20.0, true,  false, false, false, 38.99),
  ('DBA', 'DBA 4000 Series 312mm Front',                  'front', 312, 25.0, 23.0, true,  false, true,  false, 74.99),
  ('DBA', 'DBA 4000 Series 348mm Front',                  'front', 348, 30.0, 28.0, true,  false, true,  false, 89.99),
  ('LPR', 'LPR Standard 280mm Front',                     'front', 280, 22.0, 20.0, true,  false, false, false, 29.99),
  ('LPR', 'LPR Standard 312mm Front',                     'front', 312, 25.0, 23.0, true,  false, false, false, 34.99),
  ('LPR', 'LPR Standard 272mm Rear',                      'rear',  272, 10.0,  8.0, false, false, false, false, 22.99)

) AS v(brand_name, name, position, disc_diameter_mm, disc_thickness_mm, disc_min_thickness_mm,
       disc_ventilated, disc_drilled, disc_slotted, disc_coated, price_eur)
on lower(b.name) = lower(v.brand_name)
where not exists (
  select 1 from public.brake_products existing
  where existing.brand_id = b.id
    and lower(existing.name) = lower(v.name)
    and existing.type = 'disc'
    and existing.position is not distinct from v.position
);

-- ============================================================
-- BRAKE PAD PRODUCTS
-- ============================================================
insert into public.brake_products (id, brand_id, name, type, position,
  pad_height_mm, pad_width_mm, pad_thickness_mm, pad_material, pad_with_sensor,
  price_eur, active)
SELECT gen_random_uuid(), b.id, v.name, 'pad', v.position,
  v.pad_height_mm, v.pad_width_mm, v.pad_thickness_mm,
  v.pad_material, v.pad_with_sensor, v.price_eur, true
from public.brake_brands b
JOIN (VALUES

  -- ============================================================
  -- FERODO PADS (OEM + Performance)
  -- ============================================================
  -- Common pad sizes — 63mm height (VW/Audi/Skoda group)
  ('Ferodo', 'Ferodo Premier FDB1284 Front',    'front', 63.0, 133.0, 17.5, 'semi-metallic', true,  24.99),
  ('Ferodo', 'Ferodo Premier FDB1640 Front',    'front', 65.6, 155.0, 17.0, 'semi-metallic', true,  27.99),
  -- BMW size
  ('Ferodo', 'Ferodo Premier FDB4453 Front',    'front', 67.1, 135.1, 17.5, 'semi-metallic', true,  29.99),
  ('Ferodo', 'Ferodo Premier FDB4454 Rear',     'rear',  55.0, 107.5, 17.0, 'semi-metallic', false, 22.99),
  -- Mercedes size
  ('Ferodo', 'Ferodo Premier FDB5040 Front',    'front', 74.1, 155.5, 19.7, 'semi-metallic', true,  31.99),
  ('Ferodo', 'Ferodo Premier FDB5041 Rear',     'rear',  64.3, 128.9, 17.5, 'semi-metallic', false, 24.99),
  -- DS Performance pads
  ('Ferodo', 'Ferodo DS2500 FCP1300H Front',    'front', 63.0, 133.0, 17.5, 'carbon',        false, 69.99),
  ('Ferodo', 'Ferodo DS2500 FCP1667H Front',    'front', 65.6, 155.0, 17.0, 'carbon',        false, 74.99),
  ('Ferodo', 'Ferodo DS3000 FCP1640R Front',    'front', 65.6, 155.0, 17.0, 'carbon',        false, 99.99),

  -- ============================================================
  -- BREMBO PADS
  -- ============================================================
  ('Brembo', 'Brembo OE P85020 Front',          'front', 63.0, 133.0, 17.5, 'semi-metallic', true,  28.99),
  ('Brembo', 'Brembo OE P23110 Front',          'front', 67.1, 135.1, 17.5, 'semi-metallic', true,  32.99),
  ('Brembo', 'Brembo OE P50075 Front',          'front', 74.1, 155.5, 19.7, 'semi-metallic', true,  34.99),
  ('Brembo', 'Brembo OE P85055 Rear',           'rear',  55.0, 107.5, 17.0, 'semi-metallic', false, 24.99),
  ('Brembo', 'Brembo Sport HP P85020SP Front',  'front', 63.0, 133.0, 17.5, 'semi-metallic', false, 54.99),
  ('Brembo', 'Brembo Sport HP P23110SP Front',  'front', 67.1, 135.1, 17.5, 'semi-metallic', false, 59.99),

  -- ============================================================
  -- EBC PADS (very popular — multiple compounds)
  -- ============================================================
  -- Greenstuff (street, low dust)
  ('EBC Brakes', 'EBC Greenstuff DP21284 Front', 'front', 63.0, 133.0, 17.5, 'organic',  false, 34.99),
  ('EBC Brakes', 'EBC Greenstuff DP21640 Front', 'front', 65.6, 155.0, 17.0, 'organic',  false, 37.99),
  ('EBC Brakes', 'EBC Greenstuff DP24453 Front', 'front', 67.1, 135.1, 17.5, 'organic',  false, 39.99),
  ('EBC Brakes', 'EBC Greenstuff DP25040 Front', 'front', 74.1, 155.5, 19.7, 'organic',  false, 42.99),
  ('EBC Brakes', 'EBC Greenstuff DP24454 Rear',  'rear',  55.0, 107.5, 17.0, 'organic',  false, 28.99),
  -- Yellowstuff (performance, track)
  ('EBC Brakes', 'EBC Yellowstuff DP41284R Front','front', 63.0, 133.0, 17.5, 'ceramic', false, 64.99),
  ('EBC Brakes', 'EBC Yellowstuff DP41640R Front','front', 65.6, 155.0, 17.0, 'ceramic', false, 69.99),
  ('EBC Brakes', 'EBC Yellowstuff DP44453R Front','front', 67.1, 135.1, 17.5, 'ceramic', false, 72.99),
  ('EBC Brakes', 'EBC Yellowstuff DP45040R Front','front', 74.1, 155.5, 19.7, 'ceramic', false, 78.99),
  -- Redstuff (premium street ceramic)
  ('EBC Brakes', 'EBC Redstuff DP31284C Front',  'front', 63.0, 133.0, 17.5, 'ceramic', false, 54.99),
  ('EBC Brakes', 'EBC Redstuff DP31640C Front',  'front', 65.6, 155.0, 17.0, 'ceramic', false, 58.99),
  ('EBC Brakes', 'EBC Ultimax DP1284 Front',     'front', 63.0, 133.0, 17.5, 'organic', true,  21.99),
  ('EBC Brakes', 'EBC Ultimax DP1640 Front',     'front', 65.6, 155.0, 17.0, 'organic', true,  23.99),

  -- ============================================================
  -- ATE PADS
  -- ============================================================
  ('ATE', 'ATE Ceramic 601248 Front',            'front', 63.0, 133.0, 17.5, 'ceramic',       true,  31.99),
  ('ATE', 'ATE Ceramic 601640 Front',            'front', 65.6, 155.0, 17.0, 'ceramic',       true,  34.99),
  ('ATE', 'ATE Ceramic 604453 Front',            'front', 67.1, 135.1, 17.5, 'ceramic',       true,  36.99),
  ('ATE', 'ATE Ceramic 605040 Front',            'front', 74.1, 155.5, 19.7, 'ceramic',       true,  39.99),
  ('ATE', 'ATE Ceramic 604454 Rear',             'rear',  55.0, 107.5, 17.0, 'ceramic',       false, 26.99),

  -- ============================================================
  -- BOSCH PADS
  -- ============================================================
  ('Bosch', 'Bosch Blue BC1284 Front',           'front', 63.0, 133.0, 17.5, 'semi-metallic', true,  22.99),
  ('Bosch', 'Bosch Blue BC1640 Front',           'front', 65.6, 155.0, 17.0, 'semi-metallic', true,  24.99),
  ('Bosch', 'Bosch Blue BC4453 Front',           'front', 67.1, 135.1, 17.5, 'semi-metallic', true,  26.99),
  ('Bosch', 'Bosch Blue BC5040 Front',           'front', 74.1, 155.5, 19.7, 'semi-metallic', true,  28.99),
  ('Bosch', 'Bosch Blue BC4454 Rear',            'rear',  55.0, 107.5, 17.0, 'semi-metallic', false, 19.99),

  -- ============================================================
  -- HAWK PERFORMANCE PADS
  -- ============================================================
  ('Hawk Performance', 'Hawk HPS HB453F Front',  'front', 63.0, 133.0, 17.5, 'semi-metallic', false, 74.99),
  ('Hawk Performance', 'Hawk HPS HB551F Front',  'front', 67.1, 135.1, 17.5, 'semi-metallic', false, 79.99),
  ('Hawk Performance', 'Hawk HP Plus HB453N Front','front',63.0, 133.0, 17.5, 'semi-metallic', false, 94.99),
  ('Hawk Performance', 'Hawk DTC-60 HB453G Front','front', 63.0, 133.0, 17.5, 'carbon',        false,119.99),

  -- ============================================================
  -- TEXTAR / PAGID / TRW PADS
  -- ============================================================
  ('Textar', 'Textar 2451101 Front',             'front', 63.0, 133.0, 17.5, 'semi-metallic', true,  23.99),
  ('Textar', 'Textar 2462001 Front',             'front', 65.6, 155.0, 17.0, 'semi-metallic', true,  25.99),
  ('Textar', 'Textar 2481001 Front',             'front', 67.1, 135.1, 17.5, 'semi-metallic', true,  27.99),
  ('Textar', 'Textar 2441501 Rear',              'rear',  55.0, 107.5, 17.0, 'semi-metallic', false, 20.99),
  ('Pagid', 'Pagid T1766 Front',                 'front', 63.0, 133.0, 17.5, 'semi-metallic', true,  22.99),
  ('Pagid', 'Pagid T8038 Front',                 'front', 74.1, 155.5, 19.7, 'semi-metallic', true,  29.99),
  ('TRW', 'TRW GDB1284 Front',                   'front', 63.0, 133.0, 17.5, 'semi-metallic', true,  21.99),
  ('TRW', 'TRW GDB4453 Front',                   'front', 67.1, 135.1, 17.5, 'semi-metallic', true,  25.99),

  -- ============================================================
  -- BUDGET — NK / COMLINE
  -- ============================================================
  ('NK', 'NK 224401 Front',                      'front', 63.0, 133.0, 17.5, 'semi-metallic', false, 14.99),
  ('NK', 'NK 224601 Front',                      'front', 65.6, 155.0, 17.0, 'semi-metallic', false, 15.99),
  ('NK', 'NK 224401 Rear',                       'rear',  55.0, 107.5, 17.0, 'semi-metallic', false, 11.99),
  ('Comline', 'Comline CB1284AF Front',           'front', 63.0, 133.0, 17.5, 'organic',       false, 12.99),
  ('Comline', 'Comline CB4453AF Front',           'front', 67.1, 135.1, 17.5, 'organic',       false, 14.99)

) AS v(brand_name, name, position, pad_height_mm, pad_width_mm, pad_thickness_mm, pad_material, pad_with_sensor, price_eur)
on lower(b.name) = lower(v.brand_name)
where not exists (
  select 1 from public.brake_products existing
  where existing.brand_id = b.id
    and lower(existing.name) = lower(v.name)
    and existing.type = 'pad'
    and existing.position is not distinct from v.position
);

-- ============================================================
-- CAR BRAKE FITMENT SEED DATA
-- Run AFTER: brake_schema.sql, car_makes_seed.sql, car_models_seed.sql
-- ============================================================
-- EVs ARE included (regenerative braking = slower wear, still needs parts)
-- Rear drum rows: disc_* = NULL, drum_diameter_mm = value, pad_* = NULL
-- Pad dimensions for Asian brands are approximate — add matching
-- brake_products with those exact dimensions for the magic query to work
-- ============================================================

insert into public.car_brake_fitment (
  id, model_id, year_from, year_to, position, brake_type,
  disc_diameter_mm, disc_thickness_mm, disc_min_thickness_mm, disc_ventilated,
  drum_diameter_mm, pad_height_mm, pad_width_mm, pad_thickness_mm, notes
)
SELECT
  gen_random_uuid(), mo.id,
  v.year_from, v.year_to,
  v.position, v.brake_type,
  v.disc_diameter_mm, v.disc_thickness_mm, v.disc_min_thickness_mm, v.disc_ventilated,
  v.drum_diameter_mm,
  v.pad_height_mm, v.pad_width_mm, v.pad_thickness_mm,
  v.notes
from public.makes ma
join public.models mo ON mo.make_id = ma.id
JOIN (VALUES

  -- ============================================================
  -- BMW
  -- ============================================================
  -- 1 Series F40 (2019-)
  ('BMW','1 Series',2019,NULL,'front','disc', 312,25.0,23.0,true, NULL,67.1,135.1,17.5,'F40 118i/120i standard'),
  ('BMW','1 Series',2019,NULL,'rear', 'disc', 286,12.0,10.0,false,NULL,55.0,107.5,17.0,'F40 standard'),
  ('BMW','1 Series',2019,NULL,'front','disc', 330,30.0,28.0,true, NULL,67.1,135.1,17.5,'F40 M135i xDrive'),
  ('BMW','1 Series',2019,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'F40 M135i xDrive'),

  -- 2 Series G42 Coupe (2021-)
  ('BMW','2 Series',2021,NULL,'front','disc', 330,30.0,28.0,true, NULL,67.1,135.1,17.5,'G42 220i/230i'),
  ('BMW','2 Series',2021,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'G42 standard'),
  ('BMW','2 Series',2021,NULL,'front','disc', 348,30.0,28.0,true, NULL,67.1,135.1,17.5,'G42 M240i xDrive'),
  ('BMW','2 Series',2021,NULL,'rear', 'disc', 345,24.0,22.0,true, NULL,55.0,107.5,17.0,'G42 M240i xDrive'),

  -- 3 Series G20 (2019-)
  ('BMW','3 Series',2019,NULL,'front','disc', 330,30.0,28.0,true, NULL,67.1,135.1,17.5,'G20 320i/330i standard'),
  ('BMW','3 Series',2019,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'G20 standard'),
  ('BMW','3 Series',2019,NULL,'front','disc', 348,30.0,28.0,true, NULL,67.1,135.1,17.5,'G20 M Sport/M340i/330e'),
  ('BMW','3 Series',2019,NULL,'rear', 'disc', 345,24.0,22.0,true, NULL,55.0,107.5,17.0,'G20 M Sport/M340i'),

  -- 4 Series G22 (2020-)
  ('BMW','4 Series',2020,NULL,'front','disc', 330,30.0,28.0,true, NULL,67.1,135.1,17.5,'G22 420i/430i standard'),
  ('BMW','4 Series',2020,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'G22 standard'),
  ('BMW','4 Series',2020,NULL,'front','disc', 374,36.0,34.0,true, NULL,67.1,135.1,17.5,'G22 M4 Competition'),
  ('BMW','4 Series',2020,NULL,'rear', 'disc', 345,24.0,22.0,true, NULL,55.0,107.5,17.0,'G22 M4 Competition'),

  -- 5 Series G30 (2017-)
  ('BMW','5 Series',2017,NULL,'front','disc', 348,30.0,28.0,true, NULL,67.1,135.1,17.5,'G30 520i/530i/520d standard'),
  ('BMW','5 Series',2017,NULL,'rear', 'disc', 345,24.0,22.0,true, NULL,55.0,107.5,17.0,'G30 standard'),
  ('BMW','5 Series',2017,NULL,'front','disc', 374,36.0,34.0,true, NULL,67.1,135.1,17.5,'G30 M550i/545e M Sport'),
  ('BMW','5 Series',2017,NULL,'rear', 'disc', 345,24.0,22.0,true, NULL,55.0,107.5,17.0,'G30 M Sport'),

  -- 7 Series G11/G12 (2015-)
  ('BMW','7 Series',2015,NULL,'front','disc', 374,36.0,34.0,true, NULL,67.1,135.1,17.5,'G11/G12 730i/740i'),
  ('BMW','7 Series',2015,NULL,'rear', 'disc', 345,24.0,22.0,true, NULL,55.0,107.5,17.0,'G11/G12 standard'),

  -- X1 U11 (2022-)
  ('BMW','X1',2022,NULL,'front','disc', 312,25.0,23.0,true, NULL,67.1,135.1,17.5,'U11 sDrive18i/xDrive23i'),
  ('BMW','X1',2022,NULL,'rear', 'disc', 286,12.0,10.0,false,NULL,55.0,107.5,17.0,'U11 standard'),
  ('BMW','X1',2022,NULL,'front','disc', 330,30.0,28.0,true, NULL,67.1,135.1,17.5,'U11 M35i xDrive'),
  ('BMW','X1',2022,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'U11 M35i xDrive'),

  -- X3 G01 (2017-)
  ('BMW','X3',2017,NULL,'front','disc', 330,30.0,28.0,true, NULL,67.1,135.1,17.5,'G01 xDrive20i/30i/20d'),
  ('BMW','X3',2017,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'G01 standard'),
  ('BMW','X3',2017,NULL,'front','disc', 348,30.0,28.0,true, NULL,67.1,135.1,17.5,'G01 M40i/X3 M'),
  ('BMW','X3',2017,NULL,'rear', 'disc', 345,24.0,22.0,true, NULL,55.0,107.5,17.0,'G01 M40i/X3 M'),

  -- X5 G05 (2018-)
  ('BMW','X5',2018,NULL,'front','disc', 374,36.0,34.0,true, NULL,67.1,135.1,17.5,'G05 xDrive40i/45e/M50i'),
  ('BMW','X5',2018,NULL,'rear', 'disc', 345,24.0,22.0,true, NULL,55.0,107.5,17.0,'G05 standard/M Sport'),
  ('BMW','X5',2018,NULL,'front','disc', 395,36.0,34.0,true, NULL,67.1,135.1,17.5,'G05 X5 M Competition'),
  ('BMW','X5',2018,NULL,'rear', 'disc', 345,24.0,22.0,true, NULL,55.0,107.5,17.0,'G05 X5 M Competition'),

  -- ============================================================
  -- MERCEDES-BENZ
  -- ============================================================
  -- A-Class W177 (2018-)
  ('Mercedes-Benz','A-Class',2018,NULL,'front','disc', 330,30.0,28.0,true, NULL,74.1,155.5,19.7,'W177 A180/A200/A250'),
  ('Mercedes-Benz','A-Class',2018,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,64.3,128.9,17.5,'W177 standard'),
  ('Mercedes-Benz','A-Class',2018,NULL,'front','disc', 360,30.0,28.0,true, NULL,74.1,155.5,19.7,'W177 A35 AMG'),
  ('Mercedes-Benz','A-Class',2018,NULL,'rear', 'disc', 320,22.0,20.0,true, NULL,64.3,128.9,17.5,'W177 A35/A45 AMG'),

  -- C-Class W206 (2021-)
  ('Mercedes-Benz','C-Class',2021,NULL,'front','disc', 360,30.0,28.0,true, NULL,74.1,155.5,19.7,'W206 C200/C300/C220d'),
  ('Mercedes-Benz','C-Class',2021,NULL,'rear', 'disc', 320,22.0,20.0,true, NULL,64.3,128.9,17.5,'W206 standard'),
  ('Mercedes-Benz','C-Class',2021,NULL,'front','disc', 374,36.0,34.0,true, NULL,74.1,155.5,19.7,'W206 C43 AMG'),
  ('Mercedes-Benz','C-Class',2021,NULL,'rear', 'disc', 345,24.0,22.0,true, NULL,64.3,128.9,17.5,'W206 C43/C63 AMG'),

  -- E-Class W213 (2016-)
  ('Mercedes-Benz','E-Class',2016,NULL,'front','disc', 360,30.0,28.0,true, NULL,74.1,155.5,19.7,'W213 E200/E220d/E300'),
  ('Mercedes-Benz','E-Class',2016,NULL,'rear', 'disc', 320,22.0,20.0,true, NULL,64.3,128.9,17.5,'W213 standard'),
  ('Mercedes-Benz','E-Class',2016,NULL,'front','disc', 374,36.0,34.0,true, NULL,74.1,155.5,19.7,'W213 E53/E63 AMG'),
  ('Mercedes-Benz','E-Class',2016,NULL,'rear', 'disc', 345,24.0,22.0,true, NULL,64.3,128.9,17.5,'W213 E53/E63 AMG'),

  -- GLC X254 (2022-)
  ('Mercedes-Benz','GLC',2022,NULL,'front','disc', 360,30.0,28.0,true, NULL,74.1,155.5,19.7,'X254 GLC200/300'),
  ('Mercedes-Benz','GLC',2022,NULL,'rear', 'disc', 320,22.0,20.0,true, NULL,64.3,128.9,17.5,'X254 standard'),

  -- GLE W167 (2019-)
  ('Mercedes-Benz','GLE',2019,NULL,'front','disc', 374,36.0,34.0,true, NULL,74.1,155.5,19.7,'W167 GLE350/450/53 AMG'),
  ('Mercedes-Benz','GLE',2019,NULL,'rear', 'disc', 345,24.0,22.0,true, NULL,64.3,128.9,17.5,'W167 standard'),

  -- ============================================================
  -- AUDI
  -- ============================================================
  -- A1 GB (2018-)
  ('Audi','A1',2018,NULL,'front','disc', 280,22.0,20.0,true, NULL,63.0,133.0,17.5,'GB 25/30/35 TFSI'),
  ('Audi','A1',2018,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'GB standard'),

  -- A3 8Y (2020-)
  ('Audi','A3',2020,NULL,'front','disc', 312,25.0,23.0,true, NULL,63.0,133.0,17.5,'8Y 35 TFSI/30 TDI'),
  ('Audi','A3',2020,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'8Y FWD standard'),
  ('Audi','A3',2020,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'8Y S3/45 TFSI quattro'),
  ('Audi','A3',2020,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'8Y S3 quattro'),

  -- A4 B9 (2015-)
  ('Audi','A4',2015,NULL,'front','disc', 312,25.0,23.0,true, NULL,63.0,133.0,17.5,'B9 FWD 30/35 TFSI/TDI'),
  ('Audi','A4',2015,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'B9 FWD standard'),
  ('Audi','A4',2015,NULL,'front','disc', 320,30.0,28.0,true, NULL,65.6,155.0,17.0,'B9 40 TDI/45 TFSI quattro'),
  ('Audi','A4',2015,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'B9 quattro'),

  -- A6 C8 (2018-)
  ('Audi','A6',2018,NULL,'front','disc', 348,30.0,28.0,true, NULL,65.6,155.0,17.0,'C8 40/45/50 TDI'),
  ('Audi','A6',2018,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'C8 standard'),
  ('Audi','A6',2018,NULL,'front','disc', 360,30.0,28.0,true, NULL,65.6,155.0,17.0,'C8 S6/RS6'),
  ('Audi','A6',2018,NULL,'rear', 'disc', 320,22.0,20.0,true, NULL,55.0,107.5,17.0,'C8 S6/RS6'),

  -- Q3 F3 (2018-)
  ('Audi','Q3',2018,NULL,'front','disc', 312,25.0,23.0,true, NULL,63.0,133.0,17.5,'F3 35 TFSI/TDI'),
  ('Audi','Q3',2018,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'F3 standard'),

  -- Q5 FY (2017-)
  ('Audi','Q5',2017,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'FY 40/45 TDI/TFSI quattro'),
  ('Audi','Q5',2017,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'FY standard'),
  ('Audi','Q5',2017,NULL,'front','disc', 360,30.0,28.0,true, NULL,65.6,155.0,17.0,'FY SQ5/RS Q5'),
  ('Audi','Q5',2017,NULL,'rear', 'disc', 320,22.0,20.0,true, NULL,55.0,107.5,17.0,'FY SQ5'),

  -- Q7 4M (2015-)
  ('Audi','Q7',2015,NULL,'front','disc', 360,30.0,28.0,true, NULL,65.6,155.0,17.0,'4M 45/55 TFSI/50 TDI'),
  ('Audi','Q7',2015,NULL,'rear', 'disc', 320,22.0,20.0,true, NULL,55.0,107.5,17.0,'4M standard'),

  -- ============================================================
  -- VOLKSWAGEN
  -- ============================================================
  -- Polo AW (2017-)
  ('Volkswagen','Polo',2017,NULL,'front','disc', 280,22.0,20.0,true, NULL,63.0,133.0,17.5,'AW 1.0 TSI/MPI standard'),
  ('Volkswagen','Polo',2017,NULL,'rear', 'drum', NULL,NULL,NULL,false,200,NULL,NULL,NULL,'AW base drum rear'),
  ('Volkswagen','Polo',2017,NULL,'front','disc', 312,25.0,23.0,true, NULL,63.0,133.0,17.5,'AW GTI'),
  ('Volkswagen','Polo',2017,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'AW GTI disc rear'),

  -- Golf 8 CD (2020-)
  ('Volkswagen','Golf',2020,NULL,'front','disc', 312,25.0,23.0,true, NULL,63.0,133.0,17.5,'CD 1.5 eTSI/2.0 TDI standard'),
  ('Volkswagen','Golf',2020,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'CD standard'),
  ('Volkswagen','Golf',2020,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'CD GTI 2.0 TSI'),
  ('Volkswagen','Golf',2020,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'CD GTI'),
  ('Volkswagen','Golf',2020,NULL,'front','disc', 348,30.0,28.0,true, NULL,65.6,155.0,17.0,'CD R 4Motion 320hp'),
  ('Volkswagen','Golf',2020,NULL,'rear', 'disc', 310,22.0,20.0,true, NULL,55.0,107.5,17.0,'CD R 4Motion'),

  -- Passat B8 (2015-)
  ('Volkswagen','Passat',2015,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'B8 2.0 TSI/TDI'),
  ('Volkswagen','Passat',2015,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'B8 standard'),

  -- Tiguan II (2016-)
  ('Volkswagen','Tiguan',2016,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'AD/BW 2.0 TSI/TDI all trims'),
  ('Volkswagen','Tiguan',2016,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'AD/BW 4Motion'),
  ('Volkswagen','Tiguan',2016,NULL,'rear', 'drum', NULL,NULL,NULL,false,230,NULL,NULL,NULL,'AD FWD base drum rear'),

  -- T-Roc (2017-)
  ('Volkswagen','T-Roc',2017,NULL,'front','disc', 312,25.0,23.0,true, NULL,63.0,133.0,17.5,'standard 1.0/1.5 TSI'),
  ('Volkswagen','T-Roc',2017,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'standard FWD'),
  ('Volkswagen','T-Roc',2017,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'R 2.0 TSI 300hp'),
  ('Volkswagen','T-Roc',2017,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'R 4Motion'),

  -- ID.4 (2021-) — EV, has brakes
  ('Volkswagen','ID.4',2021,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'EV all trims — regen means slower wear'),
  ('Volkswagen','ID.4',2021,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'EV standard'),

  -- ============================================================
  -- ŠKODA
  -- ============================================================
  -- Fabia IV (2021-)
  ('Škoda','Fabia',2021,NULL,'front','disc', 280,22.0,20.0,true, NULL,63.0,133.0,17.5,'NJ4 1.0 MPI/TSI'),
  ('Škoda','Fabia',2021,NULL,'rear', 'drum', NULL,NULL,NULL,false,200,NULL,NULL,NULL,'NJ4 drum rear'),

  -- Octavia IV (2020-)
  ('Škoda','Octavia',2020,NULL,'front','disc', 312,25.0,23.0,true, NULL,63.0,133.0,17.5,'NX5 1.5 TSI/2.0 TDI standard'),
  ('Škoda','Octavia',2020,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'NX5 standard'),
  ('Škoda','Octavia',2020,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'NX5 RS 2.0 TSI/TDI'),
  ('Škoda','Octavia',2020,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'NX5 RS'),

  -- Superb IV (2023-)
  ('Škoda','Superb',2023,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'BN standard 2.0 TSI/TDI'),
  ('Škoda','Superb',2023,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'BN standard'),

  -- Karoq (2017-)
  ('Škoda','Karoq',2017,NULL,'front','disc', 312,25.0,23.0,true, NULL,63.0,133.0,17.5,'NU7 standard FWD'),
  ('Škoda','Karoq',2017,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'NU7 FWD'),
  ('Škoda','Karoq',2017,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'NU7 4x4 Sportline'),
  ('Škoda','Karoq',2017,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'NU7 4x4'),

  -- Kodiaq (2016-)
  ('Škoda','Kodiaq',2016,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'NS7 standard'),
  ('Škoda','Kodiaq',2016,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'NS7 standard'),

  -- Enyaq (2021-) — EV
  ('Škoda','Enyaq',2021,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'iV 60/80/RS — EV regen'),
  ('Škoda','Enyaq',2021,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'iV standard'),

  -- ============================================================
  -- SEAT & CUPRA
  -- ============================================================
  -- Ibiza KJ1 (2017-)
  ('SEAT','Ibiza',2017,NULL,'front','disc', 280,22.0,20.0,true, NULL,63.0,133.0,17.5,'KJ1 1.0 TSI standard'),
  ('SEAT','Ibiza',2017,NULL,'rear', 'drum', NULL,NULL,NULL,false,200,NULL,NULL,NULL,'KJ1 drum rear'),

  -- Leon MK4 KL1 (2020-)
  ('SEAT','Leon',2020,NULL,'front','disc', 312,25.0,23.0,true, NULL,63.0,133.0,17.5,'KL1 1.0/1.5 eTSI standard'),
  ('SEAT','Leon',2020,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'KL1 FWD standard'),
  ('SEAT','Leon',2020,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'KL1 FR 2.0 TSI 190hp'),
  ('SEAT','Leon',2020,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'KL1 FR/4Drive'),

  -- Ateca KH7 (2016-)
  ('SEAT','Ateca',2016,NULL,'front','disc', 312,25.0,23.0,true, NULL,63.0,133.0,17.5,'KH7 standard FWD'),
  ('SEAT','Ateca',2016,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'KH7 FWD'),
  ('SEAT','Ateca',2016,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'KH7 Xcellence 4Drive'),
  ('SEAT','Ateca',2016,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'KH7 4Drive'),

  -- Cupra Formentor (2020-)
  ('Cupra','Formentor',2020,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'KM7 1.5/2.0 TSI 150-310hp'),
  ('Cupra','Formentor',2020,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'KM7 standard'),
  ('Cupra','Formentor',2020,NULL,'front','disc', 360,30.0,28.0,true, NULL,65.6,155.0,17.0,'KM7 VZ5 2.5 TSI 390hp'),
  ('Cupra','Formentor',2020,NULL,'rear', 'disc', 310,22.0,20.0,true, NULL,55.0,107.5,17.0,'KM7 VZ5'),

  -- Cupra Leon (2020-)
  ('Cupra','Leon',2020,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'standard 300/310hp'),
  ('Cupra','Leon',2020,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'standard'),

  -- Cupra Born (EV, 2021-)
  ('Cupra','Born',2021,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'EV 150/231hp — regen braking'),
  ('Cupra','Born',2021,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'EV standard'),

  -- ============================================================
  -- RENAULT
  -- ============================================================
  -- Clio V (2019-)
  ('Renault','Clio',2019,NULL,'front','disc', 280,22.0,20.0,true, NULL,63.0,133.0,17.5,'V 1.0 TCe/1.5 dCi standard'),
  ('Renault','Clio',2019,NULL,'rear', 'drum', NULL,NULL,NULL,false,180,NULL,NULL,NULL,'V base drum rear'),

  -- Megane IV (2016-)
  ('Renault','Megane',2016,NULL,'front','disc', 300,28.0,26.0,true, NULL,63.0,133.0,17.5,'IV 1.3 TCe/1.5 dCi standard'),
  ('Renault','Megane',2016,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'IV standard'),
  ('Renault','Megane',2016,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'IV RS Trophy 300hp'),
  ('Renault','Megane',2016,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'IV RS Trophy'),

  -- Austral (2022-)
  ('Renault','Austral',2022,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'JRB standard E-Tech/mild hybrid'),
  ('Renault','Austral',2022,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'JRB standard'),

  -- ============================================================
  -- DACIA
  -- ============================================================
  -- Sandero III (2020-)
  ('Dacia','Sandero',2020,NULL,'front','disc', 280,22.0,20.0,true, NULL,63.0,133.0,17.5,'DJF 1.0 SCe/TCe standard'),
  ('Dacia','Sandero',2020,NULL,'rear', 'drum', NULL,NULL,NULL,false,180,NULL,NULL,NULL,'DJF drum rear'),

  -- Duster II (2018-)
  ('Dacia','Duster',2018,NULL,'front','disc', 280,22.0,20.0,true, NULL,63.0,133.0,17.5,'HM FWD standard'),
  ('Dacia','Duster',2018,NULL,'rear', 'drum', NULL,NULL,NULL,false,200,NULL,NULL,NULL,'HM FWD drum rear'),
  ('Dacia','Duster',2018,NULL,'front','disc', 300,28.0,26.0,true, NULL,63.0,133.0,17.5,'HM 4x4 4WD'),
  ('Dacia','Duster',2018,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'HM 4x4'),

  -- Logan III (2020-)
  ('Dacia','Logan',2020,NULL,'front','disc', 280,22.0,20.0,true, NULL,63.0,133.0,17.5,'SD standard'),
  ('Dacia','Logan',2020,NULL,'rear', 'drum', NULL,NULL,NULL,false,180,NULL,NULL,NULL,'SD drum rear'),

  -- ============================================================
  -- PEUGEOT
  -- ============================================================
  -- 208 II (2019-)
  ('Peugeot','208',2019,NULL,'front','disc', 280,22.0,20.0,true, NULL,63.0,133.0,17.5,'A9 1.2 PureTech/e-208 EV'),
  ('Peugeot','208',2019,NULL,'rear', 'drum', NULL,NULL,NULL,false,200,NULL,NULL,NULL,'A9 base drum rear'),

  -- 308 III (2021-)
  ('Peugeot','308',2021,NULL,'front','disc', 312,25.0,23.0,true, NULL,63.0,133.0,17.5,'P5 1.2/1.5/1.6 standard'),
  ('Peugeot','308',2021,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'P5 standard'),

  -- 3008 II (2016-)
  ('Peugeot','3008',2016,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'M standard 1.6/2.0 diesel/hybrid'),
  ('Peugeot','3008',2016,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'M standard'),

  -- ============================================================
  -- CITROËN
  -- ============================================================
  -- C3 III (2016-)
  ('Citroën','C3',2016,NULL,'front','disc', 280,22.0,20.0,true, NULL,63.0,133.0,17.5,'SC standard 1.2 PureTech'),
  ('Citroën','C3',2016,NULL,'rear', 'drum', NULL,NULL,NULL,false,180,NULL,NULL,NULL,'SC drum rear'),

  -- C5 X (2021-)
  ('Citroën','C5 X',2021,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'standard 1.6 Hybrid/180hp'),
  ('Citroën','C5 X',2021,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'standard'),

  -- ============================================================
  -- FORD
  -- ============================================================
  -- Fiesta VII (2017-)
  ('Ford','Fiesta',2017,NULL,'front','disc', 280,22.0,20.0,true, NULL,63.0,133.0,17.5,'JHH 1.0 EcoBoost/1.5 TDCi'),
  ('Ford','Fiesta',2017,NULL,'rear', 'drum', NULL,NULL,NULL,false,203,NULL,NULL,NULL,'JHH drum rear'),
  ('Ford','Fiesta',2017,NULL,'front','disc', 312,25.0,23.0,true, NULL,63.0,133.0,17.5,'JHH ST 200hp'),
  ('Ford','Fiesta',2017,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'JHH ST disc rear'),

  -- Focus IV (2018-)
  ('Ford','Focus',2018,NULL,'front','disc', 300,28.0,26.0,true, NULL,63.0,133.0,17.5,'DEH 1.0/1.5 EcoBoost standard'),
  ('Ford','Focus',2018,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'DEH standard'),
  ('Ford','Focus',2018,NULL,'front','disc', 320,30.0,28.0,true, NULL,65.6,155.0,17.0,'DEH ST/ST-Line 2.3 EcoBoost'),
  ('Ford','Focus',2018,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'DEH ST'),

  -- Kuga III (2019-)
  ('Ford','Kuga',2019,NULL,'front','disc', 320,30.0,28.0,true, NULL,65.6,155.0,17.0,'CX482 1.5/2.0 EcoBoost PHEV'),
  ('Ford','Kuga',2019,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'CX482 standard'),

  -- Mustang Mach-E (EV, 2020-)
  ('Ford','Mustang Mach-E',2020,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'EV standard/GT — regen braking'),
  ('Ford','Mustang Mach-E',2020,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'EV standard'),

  -- ============================================================
  -- VOLVO
  -- ============================================================
  -- XC40 (2017-)
  ('Volvo','XC40',2017,NULL,'front','disc', 320,30.0,28.0,true, NULL,65.6,155.0,17.0,'XK T3/T4/D3 standard'),
  ('Volvo','XC40',2017,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'XK standard'),
  ('Volvo','XC40',2017,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'XK Recharge EV / T5 AWD'),
  ('Volvo','XC40',2017,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'XK Recharge/AWD'),

  -- V60/S60 III (2018-)
  ('Volvo','V60',2018,NULL,'front','disc', 320,30.0,28.0,true, NULL,65.6,155.0,17.0,'Z1 T4/T5/D3 standard'),
  ('Volvo','V60',2018,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'Z1 standard'),
  ('Volvo','V60',2018,NULL,'front','disc', 348,30.0,28.0,true, NULL,65.6,155.0,17.0,'Z1 Polestar Engineered/T6'),
  ('Volvo','V60',2018,NULL,'rear', 'disc', 320,22.0,20.0,true, NULL,55.0,107.5,17.0,'Z1 T8/Polestar'),

  -- XC60 II (2017-)
  ('Volvo','XC60',2017,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'SPA T5/T6/D4 standard'),
  ('Volvo','XC60',2017,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'SPA standard'),
  ('Volvo','XC60',2017,NULL,'front','disc', 348,30.0,28.0,true, NULL,65.6,155.0,17.0,'SPA T8 PHEV/Polestar'),
  ('Volvo','XC60',2017,NULL,'rear', 'disc', 320,22.0,20.0,true, NULL,55.0,107.5,17.0,'SPA T8/Polestar'),

  -- XC90 II (2015-)
  ('Volvo','XC90',2015,NULL,'front','disc', 348,30.0,28.0,true, NULL,65.6,155.0,17.0,'SPA T5/T6/D5 standard'),
  ('Volvo','XC90',2015,NULL,'rear', 'disc', 345,24.0,22.0,true, NULL,55.0,107.5,17.0,'SPA standard'),

  -- ============================================================
  -- PORSCHE
  -- ============================================================
  -- Macan I (2014-2022)
  ('Porsche','Macan',2014,2022,'front','disc', 360,30.0,28.0,true, NULL,74.1,155.5,19.7,'95B base/S/GTS'),
  ('Porsche','Macan',2014,2022,'rear', 'disc', 320,22.0,20.0,true, NULL,64.3,128.9,17.5,'95B standard'),
  ('Porsche','Macan',2014,2022,'front','disc', 374,36.0,34.0,true, NULL,74.1,155.5,19.7,'95B Turbo'),
  ('Porsche','Macan',2014,2022,'rear', 'disc', 345,24.0,22.0,true, NULL,64.3,128.9,17.5,'95B Turbo'),

  -- Cayenne III E3 (2017-)
  ('Porsche','Cayenne',2017,NULL,'front','disc', 374,36.0,34.0,true, NULL,74.1,155.5,19.7,'E3 base/S/E-Hybrid'),
  ('Porsche','Cayenne',2017,NULL,'rear', 'disc', 345,24.0,22.0,true, NULL,64.3,128.9,17.5,'E3 standard'),
  ('Porsche','Cayenne',2017,NULL,'front','disc', 395,36.0,34.0,true, NULL,74.1,155.5,19.7,'E3 Turbo/Turbo S'),
  ('Porsche','Cayenne',2017,NULL,'rear', 'disc', 345,24.0,22.0,true, NULL,64.3,128.9,17.5,'E3 Turbo'),

  -- 911 992 (2019-)
  ('Porsche','911',2019,NULL,'front','disc', 348,30.0,28.0,true, NULL,74.1,155.5,19.7,'992 Carrera/S base'),
  ('Porsche','911',2019,NULL,'rear', 'disc', 330,30.0,28.0,true, NULL,64.3,128.9,17.5,'992 Carrera standard'),
  ('Porsche','911',2019,NULL,'front','disc', 374,36.0,34.0,true, NULL,74.1,155.5,19.7,'992 Turbo/GT3/RS'),
  ('Porsche','911',2019,NULL,'rear', 'disc', 345,24.0,22.0,true, NULL,64.3,128.9,17.5,'992 Turbo/GT3'),

  -- Panamera II (2016-)
  ('Porsche','Panamera',2016,NULL,'front','disc', 360,30.0,28.0,true, NULL,74.1,155.5,19.7,'G2 base/4/4S'),
  ('Porsche','Panamera',2016,NULL,'rear', 'disc', 345,24.0,22.0,true, NULL,64.3,128.9,17.5,'G2 standard'),

  -- ============================================================
  -- ALFA ROMEO
  -- ============================================================
  -- Giulia (2016-)
  ('Alfa Romeo','Giulia',2016,NULL,'front','disc', 330,30.0,28.0,true, NULL,74.1,155.5,19.7,'952 standard 2.0 T/2.2 D'),
  ('Alfa Romeo','Giulia',2016,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,64.3,128.9,17.5,'952 standard'),
  ('Alfa Romeo','Giulia',2016,NULL,'front','disc', 360,30.0,28.0,true, NULL,74.1,155.5,19.7,'952 Quadrifoglio 510hp'),
  ('Alfa Romeo','Giulia',2016,NULL,'rear', 'disc', 345,24.0,22.0,true, NULL,64.3,128.9,17.5,'952 Quadrifoglio'),

  -- Stelvio (2017-)
  ('Alfa Romeo','Stelvio',2017,NULL,'front','disc', 330,30.0,28.0,true, NULL,74.1,155.5,19.7,'949 2.0 T/2.2 D standard'),
  ('Alfa Romeo','Stelvio',2017,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,64.3,128.9,17.5,'949 standard'),
  ('Alfa Romeo','Stelvio',2017,NULL,'front','disc', 374,36.0,34.0,true, NULL,74.1,155.5,19.7,'949 Quadrifoglio 510hp'),
  ('Alfa Romeo','Stelvio',2017,NULL,'rear', 'disc', 345,24.0,22.0,true, NULL,64.3,128.9,17.5,'949 Quadrifoglio'),

  -- Tonale (2022-)
  ('Alfa Romeo','Tonale',2022,NULL,'front','disc', 330,30.0,28.0,true, NULL,74.1,155.5,19.7,'965 1.5 MHEV/1.6 D/PHEV'),
  ('Alfa Romeo','Tonale',2022,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,64.3,128.9,17.5,'965 standard'),

  -- ============================================================
  -- FIAT
  -- ============================================================
  -- Fiat 500 (2007- / 500e EV 2020-)
  ('Fiat','500',2007,NULL,'front','disc', 280,22.0,20.0,true, NULL,63.0,133.0,17.5,'Type 312 all engines / 500e EV'),
  ('Fiat','500',2007,NULL,'rear', 'drum', NULL,NULL,NULL,false,200,NULL,NULL,NULL,'standard drum rear'),

  -- Fiat Panda (2012-)
  ('Fiat','Panda',2012,NULL,'front','disc', 280,22.0,20.0,true, NULL,63.0,133.0,17.5,'319 all engines'),
  ('Fiat','Panda',2012,NULL,'rear', 'drum', NULL,NULL,NULL,false,180,NULL,NULL,NULL,'319 drum rear'),

  -- Fiat Tipo (2015-)
  ('Fiat','Tipo',2015,NULL,'front','disc', 280,22.0,20.0,true, NULL,63.0,133.0,17.5,'356 1.4/1.6 standard'),
  ('Fiat','Tipo',2015,NULL,'rear', 'drum', NULL,NULL,NULL,false,230,NULL,NULL,NULL,'356 sedan/estate drum rear'),

  -- ============================================================
  -- TOYOTA
  -- ============================================================
  -- Yaris IV (2020-)
  ('Toyota','Yaris',2020,NULL,'front','disc', 280,22.0,20.0,true, NULL,63.0,116.0,17.5,'XP210 1.0/1.5 Hybrid'),
  ('Toyota','Yaris',2020,NULL,'rear', 'drum', NULL,NULL,NULL,false,180,NULL,NULL,NULL,'XP210 drum rear'),

  -- Corolla E210 (2018-)
  ('Toyota','Corolla',2018,NULL,'front','disc', 300,28.0,26.0,true, NULL,63.0,123.0,17.5,'E210 1.8/2.0 Hybrid hatch/wagon'),
  ('Toyota','Corolla',2018,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'E210 standard'),

  -- Camry XV70 (2017-)
  ('Toyota','Camry',2017,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'XV70 2.5 Hybrid standard'),
  ('Toyota','Camry',2017,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'XV70 standard'),

  -- RAV4 V (2018-)
  ('Toyota','RAV4',2018,NULL,'front','disc', 320,30.0,28.0,true, NULL,65.6,127.0,17.5,'XA50 2.0/2.5 Hybrid AWD'),
  ('Toyota','RAV4',2018,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'XA50 standard'),

  -- Land Cruiser 300 (2021-)
  ('Toyota','Land Cruiser',2021,NULL,'front','disc', 374,36.0,34.0,true, NULL,65.6,155.0,17.0,'J300 3.5 V6 Twin Turbo'),
  ('Toyota','Land Cruiser',2021,NULL,'rear', 'disc', 345,24.0,22.0,true, NULL,55.0,107.5,17.0,'J300 standard'),

  -- C-HR (2016-)
  ('Toyota','C-HR',2016,NULL,'front','disc', 300,28.0,26.0,true, NULL,63.0,123.0,17.5,'AX10 1.8/2.0 Hybrid'),
  ('Toyota','C-HR',2016,NULL,'rear', 'drum', NULL,NULL,NULL,false,200,NULL,NULL,NULL,'AX10 drum rear'),

  -- Prius IV (2015-)
  ('Toyota','Prius',2015,NULL,'front','disc', 300,28.0,26.0,true, NULL,63.0,123.0,17.5,'XW50 1.8 Hybrid — heavy regen'),
  ('Toyota','Prius',2015,NULL,'rear', 'drum', NULL,NULL,NULL,false,200,NULL,NULL,NULL,'XW50 drum rear — minimal wear'),

  -- ============================================================
  -- HONDA
  -- ============================================================
  -- Civic XI (2021-)
  ('Honda','Civic',2021,NULL,'front','disc', 320,30.0,28.0,true, NULL,64.3,123.0,17.5,'FE 1.5 VTEC Turbo/2.0 e:HEV'),
  ('Honda','Civic',2021,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'FE standard'),

  -- Accord X (2017-)
  ('Honda','Accord',2017,NULL,'front','disc', 320,30.0,28.0,true, NULL,64.3,136.4,17.5,'CV 1.5/2.0 VTEC Turbo'),
  ('Honda','Accord',2017,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'CV standard'),

  -- CR-V V (2016-)
  ('Honda','CR-V',2016,NULL,'front','disc', 320,30.0,28.0,true, NULL,64.3,136.4,17.5,'RW/RT 1.5T/2.0 e:HEV AWD'),
  ('Honda','CR-V',2016,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'RW/RT standard'),

  -- Jazz IV (2020-)
  ('Honda','Jazz',2020,NULL,'front','disc', 280,22.0,20.0,true, NULL,63.0,116.0,17.5,'GR 1.5 e:HEV Hybrid'),
  ('Honda','Jazz',2020,NULL,'rear', 'drum', NULL,NULL,NULL,false,180,NULL,NULL,NULL,'GR drum rear'),

  -- ============================================================
  -- NISSAN
  -- ============================================================
  -- Juke F16 (2019-)
  ('Nissan','Juke',2019,NULL,'front','disc', 300,28.0,26.0,true, NULL,63.0,116.0,17.5,'F16 1.0 DIG-T standard'),
  ('Nissan','Juke',2019,NULL,'rear', 'drum', NULL,NULL,NULL,false,203,NULL,NULL,NULL,'F16 drum rear'),

  -- Qashqai J12 (2021-)
  ('Nissan','Qashqai',2021,NULL,'front','disc', 320,30.0,28.0,true, NULL,65.6,127.0,17.5,'J12 1.3 MHEV/1.5 e-POWER'),
  ('Nissan','Qashqai',2021,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'J12 standard'),

  -- X-Trail T33 (2021-)
  ('Nissan','X-Trail',2021,NULL,'front','disc', 320,30.0,28.0,true, NULL,65.6,127.0,17.5,'T33 1.5 VC-Turbo e-POWER AWD'),
  ('Nissan','X-Trail',2021,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'T33 standard'),

  -- Leaf ZE1 (2017-)  — EV
  ('Nissan','Leaf',2017,NULL,'front','disc', 300,28.0,26.0,true, NULL,63.0,123.0,17.5,'ZE1 40/62kWh EV — strong regen'),
  ('Nissan','Leaf',2017,NULL,'rear', 'drum', NULL,NULL,NULL,false,203,NULL,NULL,NULL,'ZE1 drum rear — minimal wear'),

  -- ============================================================
  -- HYUNDAI
  -- ============================================================
  -- i20 BC3 (2020-)
  ('Hyundai','i20',2020,NULL,'front','disc', 280,22.0,20.0,true, NULL,63.0,116.0,17.5,'BC3 1.0 T-GDi/1.2 MPI'),
  ('Hyundai','i20',2020,NULL,'rear', 'drum', NULL,NULL,NULL,false,203,NULL,NULL,NULL,'BC3 drum rear'),

  -- i30 PD (2017-)
  ('Hyundai','i30',2017,NULL,'front','disc', 300,28.0,26.0,true, NULL,63.0,123.0,17.5,'PD 1.0/1.4 T-GDi/1.6 CRDi'),
  ('Hyundai','i30',2017,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'PD standard'),
  ('Hyundai','i30',2017,NULL,'front','disc', 320,30.0,28.0,true, NULL,65.6,127.0,17.5,'PD N 275hp'),
  ('Hyundai','i30',2017,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'PD N'),

  -- Tucson NX4 (2020-)
  ('Hyundai','Tucson',2020,NULL,'front','disc', 320,30.0,28.0,true, NULL,65.6,127.0,17.5,'NX4 1.6 T-GDi/PHEV AWD'),
  ('Hyundai','Tucson',2020,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'NX4 standard'),

  -- Santa Fe TM (2018-)
  ('Hyundai','Santa Fe',2018,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'TM 2.0/2.2 CRDi/PHEV AWD'),
  ('Hyundai','Santa Fe',2018,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'TM standard'),

  -- Ioniq 5 NE (2021-) — EV
  ('Hyundai','Ioniq 5',2021,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'NE RWD/AWD EV — heavy regen'),
  ('Hyundai','Ioniq 5',2021,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'NE EV standard'),

  -- Ioniq 6 CE (2022-) — EV
  ('Hyundai','Ioniq 6',2022,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'CE EV RWD/AWD — heavy regen'),
  ('Hyundai','Ioniq 6',2022,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'CE EV standard'),

  -- ============================================================
  -- KIA
  -- ============================================================
  -- Ceed CD (2018-)
  ('Kia','Ceed',2018,NULL,'front','disc', 300,28.0,26.0,true, NULL,63.0,123.0,17.5,'CD 1.0/1.4 T-GDi/1.6 CRDi'),
  ('Kia','Ceed',2018,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'CD standard'),

  -- Sportage NQ5 (2021-)
  ('Kia','Sportage',2021,NULL,'front','disc', 320,30.0,28.0,true, NULL,65.6,127.0,17.5,'NQ5 1.6 T-GDi/PHEV AWD'),
  ('Kia','Sportage',2021,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'NQ5 standard'),

  -- Sorento MQ4 (2020-)
  ('Kia','Sorento',2020,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'MQ4 2.2 CRDi/1.6 PHEV AWD'),
  ('Kia','Sorento',2020,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'MQ4 standard'),

  -- EV6 CV (2021-) — EV
  ('Kia','EV6',2021,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'CV RWD/AWD EV — heavy regen'),
  ('Kia','EV6',2021,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'CV EV standard'),

  -- EV9 MV (2023-) — EV
  ('Kia','EV9',2023,NULL,'front','disc', 360,30.0,28.0,true, NULL,65.6,155.0,17.0,'MV large SUV EV'),
  ('Kia','EV9',2023,NULL,'rear', 'disc', 320,22.0,20.0,true, NULL,55.0,107.5,17.0,'MV EV standard'),

  -- ============================================================
  -- SUBARU
  -- ============================================================
  -- Impreza GK (2016-)
  ('Subaru','Impreza',2016,NULL,'front','disc', 300,28.0,26.0,true, NULL,63.0,123.0,17.5,'GK 1.6/2.0 AWD standard'),
  ('Subaru','Impreza',2016,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'GK standard'),

  -- Forester SK (2018-)
  ('Subaru','Forester',2018,NULL,'front','disc', 320,30.0,28.0,true, NULL,65.6,127.0,17.5,'SK 2.0i/2.5i/e-Boxer AWD'),
  ('Subaru','Forester',2018,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'SK standard'),

  -- Outback B6 (2020-)
  ('Subaru','Outback',2020,NULL,'front','disc', 320,30.0,28.0,true, NULL,65.6,127.0,17.5,'B6 2.5i/2.4i Turbo AWD'),
  ('Subaru','Outback',2020,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'B6 standard'),

  -- WRX VB (2021-)
  ('Subaru','WRX',2021,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,127.0,17.5,'VB 2.4T AWD 271hp'),
  ('Subaru','WRX',2021,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'VB standard'),

  -- ============================================================
  -- MAZDA
  -- ============================================================
  -- Mazda3 BP (2019-)
  ('Mazda','Mazda3',2019,NULL,'front','disc', 320,30.0,28.0,true, NULL,65.6,127.0,17.5,'BP 2.0 Skyactiv-G/X/D'),
  ('Mazda','Mazda3',2019,NULL,'rear', 'disc', 286,12.0,10.0,false,NULL,55.0,107.5,17.0,'BP standard'),

  -- CX-5 KF (2017-)
  ('Mazda','CX-5',2017,NULL,'front','disc', 320,30.0,28.0,true, NULL,65.6,127.0,17.5,'KF 2.0/2.5 Skyactiv-G AWD'),
  ('Mazda','CX-5',2017,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'KF standard'),

  -- MX-5 ND (2015-)
  ('Mazda','MX-5',2015,NULL,'front','disc', 280,22.0,20.0,true, NULL,63.0,123.0,17.5,'ND 1.5/2.0 Skyactiv-G'),
  ('Mazda','MX-5',2015,NULL,'rear', 'disc', 280,22.0,20.0,true, NULL,63.0,123.0,17.5,'ND rear disc'),

  -- ============================================================
  -- MITSUBISHI
  -- ============================================================
  -- Outlander IV (2021-)
  ('Mitsubishi','Outlander',2021,NULL,'front','disc', 320,30.0,28.0,true, NULL,65.6,127.0,17.5,'GS9W 2.5 PHEV AWD'),
  ('Mitsubishi','Outlander',2021,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'GS9W standard'),

  -- Eclipse Cross GP (2021-)
  ('Mitsubishi','Eclipse Cross',2021,NULL,'front','disc', 320,30.0,28.0,true, NULL,65.6,127.0,17.5,'GP 1.5T/PHEV AWD'),
  ('Mitsubishi','Eclipse Cross',2021,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'GP standard'),

  -- ============================================================
  -- SUZUKI
  -- ============================================================
  -- Swift AZ (2017-)
  ('Suzuki','Swift',2017,NULL,'front','disc', 280,22.0,20.0,true, NULL,63.0,116.0,17.5,'AZ 1.0/1.2 BoosterJet/Hybrid'),
  ('Suzuki','Swift',2017,NULL,'rear', 'drum', NULL,NULL,NULL,false,200,NULL,NULL,NULL,'AZ drum rear'),

  -- Vitara LY (2015-)
  ('Suzuki','Vitara',2015,NULL,'front','disc', 300,28.0,26.0,true, NULL,63.0,123.0,17.5,'LY 1.0/1.4 BoosterJet/1.5 Hybrid'),
  ('Suzuki','Vitara',2015,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'LY standard'),

  -- ============================================================
  -- TESLA (all EV — strong regen, very slow brake wear)
  -- ============================================================
  -- Model 3 (2017-)
  ('Tesla','Model 3',2017,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'RWD/AWD standard range/long range'),
  ('Tesla','Model 3',2017,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'standard'),
  ('Tesla','Model 3',2017,NULL,'front','disc', 360,30.0,28.0,true, NULL,65.6,155.0,17.0,'Performance AWD'),
  ('Tesla','Model 3',2017,NULL,'rear', 'disc', 320,22.0,20.0,true, NULL,55.0,107.5,17.0,'Performance AWD'),

  -- Model Y (2020-)
  ('Tesla','Model Y',2020,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'RWD/AWD standard/long range'),
  ('Tesla','Model Y',2020,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'standard'),
  ('Tesla','Model Y',2020,NULL,'front','disc', 360,30.0,28.0,true, NULL,65.6,155.0,17.0,'Performance AWD'),
  ('Tesla','Model Y',2020,NULL,'rear', 'disc', 320,22.0,20.0,true, NULL,55.0,107.5,17.0,'Performance AWD'),

  -- Model S (2012-)
  ('Tesla','Model S',2012,NULL,'front','disc', 374,36.0,34.0,true, NULL,65.6,155.0,17.0,'all versions/Plaid'),
  ('Tesla','Model S',2012,NULL,'rear', 'disc', 345,24.0,22.0,true, NULL,55.0,107.5,17.0,'standard/Plaid'),

  -- Model X (2015-)
  ('Tesla','Model X',2015,NULL,'front','disc', 374,36.0,34.0,true, NULL,65.6,155.0,17.0,'AWD all trims/Plaid'),
  ('Tesla','Model X',2015,NULL,'rear', 'disc', 345,24.0,22.0,true, NULL,55.0,107.5,17.0,'standard'),

  -- ============================================================
  -- BYD (EV — regen braking, still needs brake parts)
  -- ============================================================
  -- Atto 3 (2022-)
  ('BYD','Atto 3',2022,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'EV AWD/RWD'),
  ('BYD','Atto 3',2022,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'EV standard'),

  -- Seal (2022-)
  ('BYD','Seal',2022,NULL,'front','disc', 330,30.0,28.0,true, NULL,65.6,155.0,17.0,'EV RWD/Performance AWD'),
  ('BYD','Seal',2022,NULL,'rear', 'disc', 300,22.0,20.0,true, NULL,55.0,107.5,17.0,'EV standard'),
  ('BYD','Seal',2022,NULL,'front','disc', 360,30.0,28.0,true, NULL,65.6,155.0,17.0,'Seal Performance AWD 530hp'),
  ('BYD','Seal',2022,NULL,'rear', 'disc', 320,22.0,20.0,true, NULL,55.0,107.5,17.0,'Performance AWD'),

  -- Dolphin (2021-)
  ('BYD','Dolphin',2021,NULL,'front','disc', 312,25.0,23.0,true, NULL,63.0,133.0,17.5,'EV standard 95/177hp'),
  ('BYD','Dolphin',2021,NULL,'rear', 'disc', 272,10.0, 8.0,false,NULL,55.0,107.5,17.0,'EV standard'),

  -- Han (2020-)
  ('BYD','Han',2020,NULL,'front','disc', 360,30.0,28.0,true, NULL,65.6,155.0,17.0,'EV/DM RWD/AWD sedan'),
  ('BYD','Han',2020,NULL,'rear', 'disc', 320,22.0,20.0,true, NULL,55.0,107.5,17.0,'standard'),

  -- Tang (2018-)
  ('BYD','Tang',2018,NULL,'front','disc', 374,36.0,34.0,true, NULL,65.6,155.0,17.0,'EV/DM SUV AWD 7-seat'),
  ('BYD','Tang',2018,NULL,'rear', 'disc', 345,24.0,22.0,true, NULL,55.0,107.5,17.0,'standard')

) AS v(make_name, model_name, year_from, year_to, position, brake_type,
       disc_diameter_mm, disc_thickness_mm, disc_min_thickness_mm, disc_ventilated,
       drum_diameter_mm, pad_height_mm, pad_width_mm, pad_thickness_mm, notes)
on lower(ma.name) = lower(v.make_name) and lower(mo.name) = lower(v.model_name)
where not exists (
  select 1 from public.car_brake_fitment existing
  where existing.model_id = mo.id
    and existing.year_from is not distinct from v.year_from
    and existing.year_to is not distinct from v.year_to
    and existing.position = v.position
    and existing.brake_type = v.brake_type
    and existing.disc_diameter_mm is not distinct from v.disc_diameter_mm
    and existing.disc_thickness_mm is not distinct from v.disc_thickness_mm
    and existing.drum_diameter_mm is not distinct from v.drum_diameter_mm
    and existing.pad_height_mm is not distinct from v.pad_height_mm
    and existing.pad_width_mm is not distinct from v.pad_width_mm
    and existing.pad_thickness_mm is not distinct from v.pad_thickness_mm
    and existing.notes is not distinct from v.notes
);
