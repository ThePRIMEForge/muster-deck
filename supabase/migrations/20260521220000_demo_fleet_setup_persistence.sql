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

create policy "prototype read members"
on public.members
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

create or replace function public.ensure_demo_fleet_member(target_display_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  demo_event_id uuid;
  resolved_display_name text;
  demo_member_id uuid;
begin
  demo_event_id := public.ensure_demo_fleet_event();
  resolved_display_name := nullif(btrim(coalesce(target_display_name, '')), '');

  if resolved_display_name is null then
    raise exception 'demo member display name is required';
  end if;

  insert into public.members (fleet_event_id, display_name)
  values (demo_event_id, resolved_display_name)
  on conflict (fleet_event_id, display_name) do update
  set last_active_at = now()
  returning id into demo_member_id;

  return demo_member_id;
end;
$$;

comment on function public.ensure_demo_fleet_member(text) is
  'Creates or refreshes a member row for the prototype Fleet Command draft event.';

create or replace function public.assign_demo_member_to_fleet_position(
  target_fleet_event_ship_request_id uuid,
  target_display_name text,
  target_primary_role text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  demo_event_id uuid;
  request_event_id uuid;
  request_team_id uuid;
  demo_member_id uuid;
  target_position_id uuid;
  created_assignment_id uuid;
begin
  demo_event_id := public.ensure_demo_fleet_event();

  select request.fleet_event_id, request.team_id
  into request_event_id, request_team_id
  from public.fleet_event_ship_requests as request
  where request.id = target_fleet_event_ship_request_id;

  if request_event_id is null then
    raise exception 'unknown fleet ship request: %', target_fleet_event_ship_request_id;
  end if;

  if request_event_id <> demo_event_id then
    raise exception 'request % does not belong to the demo draft event', target_fleet_event_ship_request_id;
  end if;

  demo_member_id := public.ensure_demo_fleet_member(target_display_name);

  update public.assignments
  set status = 'removed'
  where fleet_event_id = demo_event_id
    and member_id = demo_member_id
    and assignment_type = 'ship_position'
    and status = 'assigned';

  select position.id
  into target_position_id
  from public.fleet_event_positions as position
  left join public.assignments as assignment
    on assignment.fleet_event_position_id = position.id
    and assignment.assignment_type = 'ship_position'
    and assignment.status = 'assigned'
  where position.fleet_event_ship_request_id = target_fleet_event_ship_request_id
  group by position.id
  having count(assignment.id) < greatest(coalesce(position.max_count, position.min_count), 0)
  order by
    case
      when nullif(btrim(coalesce(target_primary_role, '')), '') is null then 1
      when lower(target_primary_role) like '%' || lower(position.label) || '%' then 0
      when lower(target_primary_role) like '%' || lower(replace(position.role_type, '_', ' ')) || '%' then 0
      else 1
    end,
    position.sort_order,
    position.label
  limit 1;

  if target_position_id is null then
    raise exception 'no open positions remain for fleet ship request %', target_fleet_event_ship_request_id;
  end if;

  insert into public.assignments (
    fleet_event_id,
    member_id,
    fleet_event_ship_request_id,
    fleet_event_position_id,
    team_id,
    assignment_type,
    status
  )
  values (
    demo_event_id,
    demo_member_id,
    target_fleet_event_ship_request_id,
    target_position_id,
    request_team_id,
    'ship_position',
    'assigned'
  )
  returning id into created_assignment_id;

  return created_assignment_id;
end;
$$;

comment on function public.assign_demo_member_to_fleet_position(uuid, text, text) is
  'Assigns a demo member to the first matching open position on a prototype Fleet Command request.';

create or replace function public.move_demo_fleet_ship_request_to_team(
  target_fleet_event_ship_request_id uuid,
  target_team_key text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  demo_event_id uuid;
  request_event_id uuid;
  resolved_team_id uuid;
begin
  demo_event_id := public.ensure_demo_fleet_event();

  select request.fleet_event_id
  into request_event_id
  from public.fleet_event_ship_requests as request
  where request.id = target_fleet_event_ship_request_id;

  if request_event_id is null then
    raise exception 'unknown fleet ship request: %', target_fleet_event_ship_request_id;
  end if;

  if request_event_id <> demo_event_id then
    raise exception 'request % does not belong to the demo draft event', target_fleet_event_ship_request_id;
  end if;

  select id
  into resolved_team_id
  from public.teams
  where fleet_event_id = demo_event_id
    and lower(name) = lower(replace(coalesce(target_team_key, 'Unassigned'), '_', ' '));

  if resolved_team_id is null then
    raise exception 'unknown demo team key: %', target_team_key;
  end if;

  update public.fleet_event_ship_requests
  set team_id = resolved_team_id,
      updated_at = now()
  where id = target_fleet_event_ship_request_id;

  update public.assignments
  set team_id = resolved_team_id
  where fleet_event_id = demo_event_id
    and fleet_event_ship_request_id = target_fleet_event_ship_request_id
    and status = 'assigned';
end;
$$;

comment on function public.move_demo_fleet_ship_request_to_team(uuid, text) is
  'Moves a prototype Fleet Command request to another standard demo team and keeps assigned crew team references aligned.';

create or replace function public.remove_demo_fleet_ship_request(target_fleet_event_ship_request_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  demo_event_id uuid;
  request_event_id uuid;
begin
  demo_event_id := public.ensure_demo_fleet_event();

  select request.fleet_event_id
  into request_event_id
  from public.fleet_event_ship_requests as request
  where request.id = target_fleet_event_ship_request_id;

  if request_event_id is null then
    raise exception 'unknown fleet ship request: %', target_fleet_event_ship_request_id;
  end if;

  if request_event_id <> demo_event_id then
    raise exception 'request % does not belong to the demo draft event', target_fleet_event_ship_request_id;
  end if;

  delete from public.fleet_event_ship_requests
  where id = target_fleet_event_ship_request_id;
end;
$$;

comment on function public.remove_demo_fleet_ship_request(uuid) is
  'Removes a prototype Fleet Command request from the demo draft event.';

grant execute on function public.ensure_demo_fleet_event() to anon, authenticated;
grant execute on function public.create_demo_fleet_ship_request(text, text, integer, text, text, boolean, text) to anon, authenticated;
grant execute on function public.ensure_demo_fleet_member(text) to anon, authenticated;
grant execute on function public.assign_demo_member_to_fleet_position(uuid, text, text) to anon, authenticated;
grant execute on function public.move_demo_fleet_ship_request_to_team(uuid, text) to anon, authenticated;
grant execute on function public.remove_demo_fleet_ship_request(uuid) to anon, authenticated;
grant execute on function public.create_fleet_event_ship_request_with_positions(uuid, uuid, uuid, integer, uuid, text, boolean, text, text) to anon, authenticated;
grant execute on function public.replace_fleet_event_positions(uuid, jsonb) to anon, authenticated;
