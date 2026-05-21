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
