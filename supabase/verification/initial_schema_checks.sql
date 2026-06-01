select 'ship_primary_categories' as table_name, count(*) as row_count
from public.ship_primary_categories
union all
select 'ship_subcategories' as table_name, count(*) as row_count
from public.ship_subcategories
union all
select 'staffing_profiles' as table_name, count(*) as row_count
from public.staffing_profiles
union all
select 'source_systems' as table_name, count(*) as row_count
from public.source_systems;

select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'ships',
    'ship_media',
    'fleet_events',
    'members',
    'assignments',
    'ship_position_templates'
  )
order by tablename;

select schemaname, tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
