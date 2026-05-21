create policy "prototype read fleet events"
on public.fleet_events
for select
to anon, authenticated
using (true);

create policy "prototype read teams"
on public.teams
for select
to anon, authenticated
using (true);

create policy "prototype read fleet ship requests"
on public.fleet_event_ship_requests
for select
to anon, authenticated
using (true);

create policy "prototype read fleet positions"
on public.fleet_event_positions
for select
to anon, authenticated
using (true);

create policy "prototype read assignments"
on public.assignments
for select
to anon, authenticated
using (true);

create policy "prototype read ship suggestions"
on public.fleet_event_ship_suggestions
for select
to anon, authenticated
using (true);

create or replace function public.ensure_demo_fleet_event()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  demo_event_id uuid;
begin
  insert into public.fleet_events (code, name, description, status)
  values (
    'DEMO-DRAFT',
    'Tactical Strike Group',
    'Local draft operation used by the MusterDeck Fleet Command prototype.',
    'draft'
  )
  on conflict (code) do update
  set name = excluded.name,
      description = excluded.description,
      status = excluded.status,
      updated_at = now()
  returning id into demo_event_id;

  insert into public.teams (fleet_event_id, name, sort_order)
  values
    (demo_event_id, 'Unassigned', 0),
    (demo_event_id, 'Alpha', 10),
    (demo_event_id, 'Beta', 20),
    (demo_event_id, 'Charlie', 30),
    (demo_event_id, 'Delta', 40),
    (demo_event_id, 'Echo', 50),
    (demo_event_id, 'Foxtrot', 60),
    (demo_event_id, 'Golf', 70),
    (demo_event_id, 'Hotel', 80)
  on conflict (fleet_event_id, name) do update
  set sort_order = excluded.sort_order;

  return demo_event_id;
end;
$$;

comment on function public.ensure_demo_fleet_event() is
  'Creates or returns the prototype Fleet Command draft event and standard team rows.';

create or replace function public.create_demo_fleet_ship_request(
  target_ship_slug text default null,
  target_primary_category_key text default null,
  target_requested_count integer default 1,
  target_team_key text default null,
  target_staffing_profile_key text default 'standard',
  target_is_exact_ship_required boolean default false,
  target_notes text default ''
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  demo_event_id uuid;
  resolved_ship_id uuid;
  resolved_category_id uuid;
  resolved_team_id uuid;
begin
  demo_event_id := public.ensure_demo_fleet_event();

  if target_ship_slug is not null and btrim(target_ship_slug) <> '' then
    select id
    into resolved_ship_id
    from public.ships
    where slug = target_ship_slug;

    if resolved_ship_id is null then
      raise exception 'unknown ship slug: %', target_ship_slug;
    end if;
  end if;

  if target_primary_category_key is not null and btrim(target_primary_category_key) <> '' then
    select id
    into resolved_category_id
    from public.ship_primary_categories
    where key = target_primary_category_key;

    if resolved_category_id is null then
      raise exception 'unknown primary category key: %', target_primary_category_key;
    end if;
  end if;

  if resolved_ship_id is null and resolved_category_id is null then
    raise exception 'ship slug or primary category key is required';
  end if;

  if target_team_key is not null and btrim(target_team_key) <> '' then
    select id
    into resolved_team_id
    from public.teams
    where fleet_event_id = demo_event_id
      and lower(name) = lower(replace(target_team_key, '_', ' '));

    if resolved_team_id is null then
      raise exception 'unknown demo team key: %', target_team_key;
    end if;
  end if;

  return public.create_fleet_event_ship_request_with_positions(
    demo_event_id,
    resolved_ship_id,
    resolved_category_id,
    coalesce(target_requested_count, 1),
    resolved_team_id,
    coalesce(target_staffing_profile_key, 'standard'),
    coalesce(target_is_exact_ship_required, false),
    null,
    coalesce(target_notes, '')
  );
end;
$$;

comment on function public.create_demo_fleet_ship_request(
  text,
  text,
  integer,
  text,
  text,
  boolean,
  text
) is
  'Creates a prototype draft fleet line in the demo Fleet Command event and copies reviewed positions for non-custom ship requests.';

grant execute on function public.ensure_demo_fleet_event() to anon, authenticated;
grant execute on function public.create_demo_fleet_ship_request(text, text, integer, text, text, boolean, text) to anon, authenticated;
grant execute on function public.create_fleet_event_ship_request_with_positions(uuid, uuid, uuid, integer, uuid, text, boolean, text, text) to anon, authenticated;
grant execute on function public.replace_fleet_event_positions(uuid, jsonb) to anon, authenticated;
