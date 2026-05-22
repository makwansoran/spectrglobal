-- ============================================================
-- PARTS CATEGORIES SEED DATA
-- Run AFTER categories_schema.sql
-- Consolidated 2-level hierarchy: section -> category group
-- ============================================================

begin;

-- The category table is self-contained, so replace the old sprawling
-- taxonomy instead of leaving stale sections behind after upserts.
delete from public.categories;

-- ============================================================
-- LEVEL 1 - TOP SECTIONS
-- ============================================================
insert into public.categories (id, parent_id, name, slug, level, icon, sort_order) values
  (gen_random_uuid(), null, 'Engine & Performance', 'engine-performance', 1, '🔧', 10),
  (gen_random_uuid(), null, 'Cooling System', 'cooling-system', 1, '🌡️', 20),
  (gen_random_uuid(), null, 'Fuel & Exhaust', 'fuel-exhaust', 1, '⛽', 30),
  (gen_random_uuid(), null, 'Transmission & Drive', 'transmission-drive', 1, '⚙️', 40),
  (gen_random_uuid(), null, 'Suspension & Steering', 'suspension-steering', 1, '🔩', 50),
  (gen_random_uuid(), null, 'Braking System', 'braking-system', 1, '🛑', 60),
  (gen_random_uuid(), null, 'Wheels & Tyres', 'wheels-tyres', 1, '🏎️', 70),
  (gen_random_uuid(), null, 'Electrical & Ignition', 'electrical-ignition', 1, '⚡', 80),
  (gen_random_uuid(), null, 'Lighting', 'lighting', 1, '💡', 90),
  (gen_random_uuid(), null, 'Body, Interior & Accessories', 'body-interior-accessories', 1, '🚗', 100),
  (gen_random_uuid(), null, 'Service & Maintenance', 'service-maintenance', 1, '🛠️', 110);

-- ============================================================
-- LEVEL 2 - SUBCATEGORIES
-- ============================================================
insert into public.categories (id, parent_id, name, slug, level, sort_order)
select gen_random_uuid(), p.id, v.name, v.slug, 2, v.sort_order
from public.categories p
join (values
  ('engine-performance', 'Lubrication & Filters', 'lubrication-filters', 10),
  ('engine-performance', 'Internal Engine', 'internal-engine', 20),
  ('engine-performance', 'Timing & Belts', 'timing-belts', 30),
  ('engine-performance', 'Turbo, Intake & EGR', 'turbo-intake-egr', 40),
  ('engine-performance', 'Engine Mounts', 'engine-mounts', 50),
  ('cooling-system', 'Radiators & Cooling Fans', 'radiators-cooling-fans', 10),
  ('cooling-system', 'Pumps, Thermostats & Hoses', 'pumps-thermostats-hoses', 20),
  ('cooling-system', 'Heater & Coolant Components', 'heater-coolant-components', 30),
  ('fuel-exhaust', 'Fuel Delivery', 'fuel-delivery', 10),
  ('fuel-exhaust', 'Exhaust & Emissions', 'exhaust-emissions', 20),
  ('fuel-exhaust', 'Exhaust Sensors & Mounting', 'exhaust-sensors-mounting', 30),
  ('transmission-drive', 'Clutch System', 'clutch-system', 10),
  ('transmission-drive', 'Manual & Automatic Transmission', 'manual-automatic-transmission', 20),
  ('transmission-drive', 'CV Joints, Driveshafts & Axles', 'cv-driveshafts-axles', 30),
  ('transmission-drive', 'Differentials & Prop Shafts', 'differentials-prop-shafts', 40),
  ('suspension-steering', 'Front Suspension', 'front-suspension', 10),
  ('suspension-steering', 'Rear Suspension', 'rear-suspension', 20),
  ('suspension-steering', 'Steering', 'steering', 30),
  ('suspension-steering', 'Linkage & Joints', 'linkage-joints', 40),
  ('braking-system', 'Brake Discs, Drums & Pads', 'brake-discs-drums-pads', 10),
  ('braking-system', 'Brake Hydraulics', 'brake-hydraulics', 20),
  ('braking-system', 'Parking Brake', 'parking-brake', 30),
  ('braking-system', 'ABS & Brake Sensors', 'abs-brake-sensors', 40),
  ('wheels-tyres', 'Tyres', 'tyres', 10),
  ('wheels-tyres', 'Rims', 'rims', 20),
  ('wheels-tyres', 'Other', 'wheels-tyres-other', 30),
  ('electrical-ignition', 'Ignition System', 'ignition-system', 10),
  ('electrical-ignition', 'Sensors', 'sensors', 20),
  ('electrical-ignition', 'Charging & Starting', 'charging-starting', 30),
  ('electrical-ignition', 'Wiring & Relays', 'wiring-relays', 40),
  ('electrical-ignition', 'Cameras & Driver Assistance', 'cameras-driver-assistance', 50),
  ('lighting', 'Headlights', 'headlights', 10),
  ('lighting', 'Rear Lights', 'rear-lights', 20),
  ('lighting', 'Interior Lighting', 'interior-lighting', 30),
  ('lighting', 'Bulbs & Controls', 'bulbs-controls', 40),
  ('body-interior-accessories', 'Exterior Trim & Panels', 'exterior-trim-panels', 10),
  ('body-interior-accessories', 'Glass, Seals & Wipers', 'glass-seals', 20),
  ('body-interior-accessories', 'Interior Trim', 'interior-trim', 30),
  ('body-interior-accessories', 'Comfort & Accessories', 'comfort-accessories', 40),
  ('body-interior-accessories', 'Air Conditioning', 'air-conditioning', 50),
  ('service-maintenance', 'Service Kits', 'service-kits', 10),
  ('service-maintenance', 'Oils & Fluids', 'oils-fluids', 20),
  ('service-maintenance', 'Greases, Additives & Treatments', 'greases-additives-treatments', 30),
  ('service-maintenance', 'Tools & Diagnostics', 'tools-diagnostics', 40)
) as v(parent_slug, name, slug, sort_order)
on p.slug = v.parent_slug;

update public.categories
set image_url = case slug
  when 'tyres' then 'assets/categories/tyres.png'
  when 'rims' then 'assets/categories/rims.png'
  when 'wheels-tyres-other' then 'assets/categories/wheels-other.png'
  else image_url
end
where slug in ('tyres', 'rims', 'wheels-tyres-other');

commit;
