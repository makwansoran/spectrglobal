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
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint oil_products_name_len check (char_length(trim(name)) between 1 and 180),
  constraint oil_products_viscosity_len check (char_length(trim(viscosity)) between 3 and 20),
  constraint oil_products_volume_positive check (volume_liters is null or volume_liters > 0),
  constraint oil_products_price_non_negative check (price_eur is null or price_eur >= 0)
);

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
