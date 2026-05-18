-- Run once if you previously created public.people (replaced by company_people only)
drop table if exists public.company_people cascade;
drop table if exists public.people cascade;

-- Then run supabase/schema.sql (company_people section) or the full schema file.
