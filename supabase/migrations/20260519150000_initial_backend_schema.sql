create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.rls_auto_enable()
returns event_trigger
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  cmd record;
begin
  for cmd in
    select *
    from pg_event_trigger_ddl_commands()
    where command_tag in ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      and object_type in ('table', 'partitioned table')
  loop
    if cmd.schema_name = 'public' then
      begin
        execute format('alter table if exists %s enable row level security', cmd.object_identity);
      exception
        when others then
          raise log 'rls_auto_enable failed for %', cmd.object_identity;
      end;
    end if;
  end loop;
end;
$$;

drop event trigger if exists ensure_rls;
create event trigger ensure_rls
on ddl_command_end
when tag in ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
execute function public.rls_auto_enable();

create table public.source_systems (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  base_url text not null,
  current_patch text,
  trust_level text not null default 'secondary'
    check (trust_level in ('primary', 'secondary', 'manual')),
  last_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_source_systems_updated_at
before update on public.source_systems
for each row execute function public.set_updated_at();

create table public.source_snapshots (
  id uuid primary key default gen_random_uuid(),
  source_system_id uuid not null references public.source_systems(id) on delete cascade,
  external_id text,
  external_slug text,
  payload jsonb not null,
  source_patch text,
  fetched_at timestamptz not null default now()
);

create index source_snapshots_source_external_idx
on public.source_snapshots (source_system_id, external_id);

create table public.ship_primary_categories (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null unique,
  sort_order integer not null,
  created_at timestamptz not null default now()
);

create table public.ship_subcategories (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null unique,
  description text not null default '',
  sort_order integer not null,
  created_at timestamptz not null default now()
);

create table public.ships (
  id uuid primary key default gen_random_uuid(),
  wiki_uuid text unique,
  uex_uuid text unique,
  name text not null,
  slug text not null unique,
  manufacturer text,
  size_class text,
  career text,
  role text,
  crew_min integer,
  crew_max integer,
  cargo_scu numeric,
  medical_tier text,
  is_ship boolean not null default true,
  is_ground_vehicle boolean not null default false,
  primary_category_id uuid references public.ship_primary_categories(id),
  source_confidence text not null default 'unreviewed'
    check (source_confidence in ('unreviewed', 'wiki_primary', 'manual_reviewed', 'conflict')),
  review_status text not null default 'needs_review'
    check (review_status in ('needs_review', 'reviewed', 'conflict')),
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ships_crew_range_check check (
    crew_min is null
    or crew_max is null
    or crew_min <= crew_max
  )
);

create index ships_primary_category_idx on public.ships (primary_category_id);
create index ships_name_idx on public.ships (name);

create trigger set_ships_updated_at
before update on public.ships
for each row execute function public.set_updated_at();

create table public.ship_subcategory_assignments (
  ship_id uuid not null references public.ships(id) on delete cascade,
  subcategory_id uuid not null references public.ship_subcategories(id) on delete cascade,
  source text not null default 'manual'
    check (source in ('wiki', 'uex', 'manual')),
  is_manual_override boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (ship_id, subcategory_id)
);

create table public.ship_media (
  id uuid primary key default gen_random_uuid(),
  ship_id uuid not null references public.ships(id) on delete cascade,
  source_system_id uuid references public.source_systems(id) on delete set null,
  source text not null default 'manual'
    check (source in ('wiki', 'uex', 'ccu_game', 'manual')),
  original_url text,
  thumbnail_url text,
  width integer,
  height integer,
  thumbnail_width integer,
  thumbnail_height integer,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  fetched_at timestamptz not null default now(),
  constraint ship_media_has_url_check check (
    original_url is not null
    or thumbnail_url is not null
  )
);

create index ship_media_ship_idx on public.ship_media (ship_id, sort_order);
create unique index ship_media_one_primary_per_ship_idx
on public.ship_media (ship_id)
where is_primary;

create table public.ship_source_conflicts (
  id uuid primary key default gen_random_uuid(),
  ship_id uuid not null references public.ships(id) on delete cascade,
  field_name text not null,
  wiki_value jsonb,
  uex_value jsonb,
  status text not null default 'open'
    check (status in ('open', 'resolved', 'ignored')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index ship_source_conflicts_ship_status_idx
on public.ship_source_conflicts (ship_id, status);

create table public.staffing_profiles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null unique,
  color text not null,
  sort_order integer not null,
  created_at timestamptz not null default now()
);

create table public.ship_position_templates (
  id uuid primary key default gen_random_uuid(),
  ship_id uuid not null references public.ships(id) on delete cascade,
  staffing_profile_id uuid not null references public.staffing_profiles(id) on delete cascade,
  role_type text not null,
  label text not null,
  required boolean not null default true,
  min_count integer not null default 1 check (min_count >= 0),
  max_count integer check (max_count is null or max_count >= min_count),
  can_transition_to_fps boolean not null default false,
  sort_order integer not null default 0,
  source text not null default 'manual'
    check (source in ('wiki_suggested', 'uex_suggested', 'manual')),
  review_status text not null default 'needs_review'
    check (review_status in ('needs_review', 'reviewed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index ship_position_templates_ship_profile_idx
on public.ship_position_templates (ship_id, staffing_profile_id);

create trigger set_ship_position_templates_updated_at
before update on public.ship_position_templates
for each row execute function public.set_updated_at();

create table public.fleet_events (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text not null default '',
  created_by uuid,
  status text not null default 'draft'
    check (status in ('draft', 'active', 'closed', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_fleet_events_updated_at
before update on public.fleet_events
for each row execute function public.set_updated_at();

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  fleet_event_id uuid not null references public.fleet_events(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  parent_team_id uuid references public.teams(id) on delete set null,
  embarked_ship_request_id uuid,
  created_at timestamptz not null default now(),
  unique (fleet_event_id, name)
);

create table public.fleet_event_ship_requests (
  id uuid primary key default gen_random_uuid(),
  fleet_event_id uuid not null references public.fleet_events(id) on delete cascade,
  ship_id uuid references public.ships(id) on delete set null,
  primary_category_id uuid references public.ship_primary_categories(id),
  requested_count integer not null default 1 check (requested_count > 0),
  team_id uuid references public.teams(id) on delete set null,
  staffing_profile_id uuid references public.staffing_profiles(id),
  is_exact_ship_required boolean not null default false,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint fleet_event_ship_requests_ship_or_category_check check (
    ship_id is not null
    or primary_category_id is not null
  )
);

create index fleet_event_ship_requests_event_idx
on public.fleet_event_ship_requests (fleet_event_id);

create trigger set_fleet_event_ship_requests_updated_at
before update on public.fleet_event_ship_requests
for each row execute function public.set_updated_at();

alter table public.teams
add constraint teams_embarked_ship_request_fk
foreign key (embarked_ship_request_id)
references public.fleet_event_ship_requests(id)
on delete set null;

create table public.fleet_event_positions (
  id uuid primary key default gen_random_uuid(),
  fleet_event_ship_request_id uuid not null references public.fleet_event_ship_requests(id) on delete cascade,
  role_type text not null,
  label text not null,
  required boolean not null default true,
  min_count integer not null default 1 check (min_count >= 0),
  max_count integer check (max_count is null or max_count >= min_count),
  can_transition_to_fps boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index fleet_event_positions_request_idx
on public.fleet_event_positions (fleet_event_ship_request_id);

create table public.members (
  id uuid primary key default gen_random_uuid(),
  fleet_event_id uuid not null references public.fleet_events(id) on delete cascade,
  display_name text not null,
  discord_id text,
  public_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  last_active_at timestamptz not null default now(),
  unique (fleet_event_id, display_name)
);

create unique index members_public_token_idx on public.members (public_token);

create table public.member_ship_offers (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  ship_id uuid references public.ships(id) on delete set null,
  custom_ship_name text,
  notes text not null default '',
  created_at timestamptz not null default now(),
  constraint member_ship_offers_ship_or_custom_check check (
    ship_id is not null
    or custom_ship_name is not null
  )
);

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  fleet_event_id uuid not null references public.fleet_events(id) on delete cascade,
  member_id uuid references public.members(id) on delete cascade,
  fleet_event_ship_request_id uuid references public.fleet_event_ship_requests(id) on delete cascade,
  fleet_event_position_id uuid references public.fleet_event_positions(id) on delete cascade,
  team_id uuid references public.teams(id) on delete cascade,
  assignment_type text not null
    check (assignment_type in ('ship_position', 'team', 'ship_offer', 'command')),
  status text not null default 'requested'
    check (status in ('requested', 'assigned', 'declined', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index assignments_event_idx on public.assignments (fleet_event_id);
create index assignments_member_idx on public.assignments (member_id);

create trigger set_assignments_updated_at
before update on public.assignments
for each row execute function public.set_updated_at();

create table public.mission_phases (
  id uuid primary key default gen_random_uuid(),
  fleet_event_id uuid not null references public.fleet_events(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  phase_type text not null default 'custom'
    check (phase_type in ('fleet_prep', 'fleet_movement', 'fleet_engagement', 'external_strike', 'precision_strike', 'boarding_ground', 'extraction', 'custom')),
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  unique (fleet_event_id, name)
);

create table public.phase_assignments (
  id uuid primary key default gen_random_uuid(),
  mission_phase_id uuid not null references public.mission_phases(id) on delete cascade,
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  phase_state text not null
    check (phase_state in ('aboard_ship', 'deployed', 'extracting', 'recovered', 'continuing_fleet_defense')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  unique (mission_phase_id, assignment_id)
);

alter table public.source_systems enable row level security;
alter table public.source_snapshots enable row level security;
alter table public.ship_primary_categories enable row level security;
alter table public.ship_subcategories enable row level security;
alter table public.ships enable row level security;
alter table public.ship_subcategory_assignments enable row level security;
alter table public.ship_media enable row level security;
alter table public.ship_source_conflicts enable row level security;
alter table public.staffing_profiles enable row level security;
alter table public.ship_position_templates enable row level security;
alter table public.fleet_events enable row level security;
alter table public.teams enable row level security;
alter table public.fleet_event_ship_requests enable row level security;
alter table public.fleet_event_positions enable row level security;
alter table public.members enable row level security;
alter table public.member_ship_offers enable row level security;
alter table public.assignments enable row level security;
alter table public.mission_phases enable row level security;
alter table public.phase_assignments enable row level security;

create policy "catalog read ship primary categories"
on public.ship_primary_categories
for select
to anon, authenticated
using (true);

create policy "catalog read ship subcategories"
on public.ship_subcategories
for select
to anon, authenticated
using (true);

create policy "catalog read ships"
on public.ships
for select
to anon, authenticated
using (true);

create policy "catalog read ship subcategory assignments"
on public.ship_subcategory_assignments
for select
to anon, authenticated
using (true);

create policy "catalog read ship media"
on public.ship_media
for select
to anon, authenticated
using (true);

create policy "catalog read staffing profiles"
on public.staffing_profiles
for select
to anon, authenticated
using (true);

create policy "catalog read reviewed position templates"
on public.ship_position_templates
for select
to anon, authenticated
using (review_status = 'reviewed');

insert into public.source_systems (key, name, base_url, current_patch, trust_level)
values
  ('star_citizen_wiki', 'Star Citizen Wiki API', 'https://api.star-citizen.wiki', '4.8.0-LIVE.11825000', 'primary'),
  ('uex', 'UEX Corp API', 'https://uexcorp.space/api', '4.7.1', 'secondary'),
  ('ccu_game', 'CCU Game', 'https://ccugame.app', null, 'secondary')
on conflict (key) do update
set
  name = excluded.name,
  base_url = excluded.base_url,
  current_patch = excluded.current_patch,
  trust_level = excluded.trust_level,
  updated_at = now();

insert into public.ship_primary_categories (key, name, sort_order)
values
  ('capital', 'Capital', 10),
  ('subcapital', 'Subcapital', 20),
  ('large', 'Large', 30),
  ('medium', 'Medium', 40),
  ('small', 'Small', 50),
  ('light_fighter', 'Light Fighter', 60),
  ('medium_fighter', 'Medium Fighter', 70),
  ('heavy_fighter', 'Heavy Fighter', 80),
  ('snub_fighter', 'Snub Fighter', 90),
  ('ground_vehicle', 'Ground Vehicle', 100)
on conflict (key) do update
set name = excluded.name, sort_order = excluded.sort_order;

insert into public.ship_subcategories (key, name, description, sort_order)
values
  ('repair', 'Repair', 'Repair support ship or vehicle.', 10),
  ('rearm', 'Rearm', 'Rearm support ship or vehicle.', 20),
  ('refuel', 'Refuel', 'Refuel support ship or vehicle.', 30),
  ('anti_fighter', 'Anti-fighter', 'Built or commonly used against fighters.', 40),
  ('anti_capital', 'Anti-capital', 'Built or commonly used against capital ships.', 50),
  ('stealth', 'Stealth', 'Low-signature or stealth-focused platform.', 60),
  ('bomber', 'Bomber', 'Bomb or heavy strike platform.', 70),
  ('torpedo', 'Torpedo', 'Torpedo-focused strike platform.', 80),
  ('scanning', 'Scanning', 'Scanning, recon, or sensor platform.', 90),
  ('carrier', 'Carrier', 'Can carry ships or vehicles as part of fleet operations.', 100),
  ('troop_transport', 'Troop transport', 'Moves Marines, boarding teams, or ground teams.', 110),
  ('cargo_transport', 'Cargo transport', 'Moves cargo or mission loot.', 120),
  ('reclamation', 'Reclamation', 'Reclamation or cleanup role.', 130),
  ('ground_vehicle_transport', 'Ground vehicle transport', 'Moves ground vehicles.', 140),
  ('medical', 'Medical', 'Medical bed or medical support role.', 150),
  ('mining', 'Mining', 'Mining role.', 160),
  ('salvage', 'Salvage', 'Salvage role.', 170),
  ('interdiction', 'Interdiction', 'Quantum interdiction or snare role.', 180),
  ('emp_qed', 'EMP / QED', 'EMP or quantum enforcement device role.', 190),
  ('exploration', 'Exploration', 'Exploration role.', 200),
  ('data_runner', 'Data runner', 'Data transport or data-running role.', 210)
on conflict (key) do update
set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.staffing_profiles (key, name, color, sort_order)
values
  ('skeleton', 'Skeleton', '#ef4444', 10),
  ('standard', 'Standard', '#eab308', 20),
  ('full_crew', 'Full Crew', '#22c55e', 30),
  ('custom', 'Custom', '#a1a1aa', 40)
on conflict (key) do update
set
  name = excluded.name,
  color = excluded.color,
  sort_order = excluded.sort_order;
