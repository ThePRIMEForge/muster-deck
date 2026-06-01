create or replace function public.create_fleet_event_ship_request_with_positions(
  target_fleet_event_id uuid,
  target_ship_id uuid default null,
  target_primary_category_id uuid default null,
  target_requested_count integer default 1,
  target_team_id uuid default null,
  target_staffing_profile_key text default 'standard',
  target_is_exact_ship_required boolean default false,
  target_substitution_policy text default null,
  target_notes text default ''
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved_staffing_profile_id uuid;
  resolved_substitution_policy text;
  created_request_id uuid;
begin
  if target_fleet_event_id is null then
    raise exception 'fleet event id is required';
  end if;

  if target_ship_id is null and target_primary_category_id is null then
    raise exception 'ship id or primary category id is required';
  end if;

  if target_requested_count is null or target_requested_count < 1 then
    raise exception 'requested count must be greater than zero';
  end if;

  select id
  into resolved_staffing_profile_id
  from public.staffing_profiles
  where key = coalesce(target_staffing_profile_key, 'standard');

  if resolved_staffing_profile_id is null then
    raise exception 'unknown staffing profile: %', target_staffing_profile_key;
  end if;

  if target_team_id is not null and not exists (
    select 1
    from public.teams
    where id = target_team_id
      and fleet_event_id = target_fleet_event_id
  ) then
    raise exception 'team does not belong to fleet event';
  end if;

  resolved_substitution_policy := coalesce(
    target_substitution_policy,
    case
      when target_is_exact_ship_required then 'exact_only'
      else 'allow_alternatives'
    end
  );

  if resolved_substitution_policy not in ('allow_alternatives', 'exact_only', 'locked') then
    raise exception 'unknown substitution policy: %', resolved_substitution_policy;
  end if;

  insert into public.fleet_event_ship_requests (
    fleet_event_id,
    ship_id,
    primary_category_id,
    requested_count,
    team_id,
    staffing_profile_id,
    is_exact_ship_required,
    substitution_policy,
    notes
  )
  values (
    target_fleet_event_id,
    target_ship_id,
    target_primary_category_id,
    target_requested_count,
    target_team_id,
    resolved_staffing_profile_id,
    target_is_exact_ship_required,
    resolved_substitution_policy,
    coalesce(target_notes, '')
  )
  returning id into created_request_id;

  if target_ship_id is not null and coalesce(target_staffing_profile_key, 'standard') <> 'custom' then
    insert into public.fleet_event_positions (
      fleet_event_ship_request_id,
      role_type,
      label,
      required,
      min_count,
      max_count,
      can_transition_to_fps,
      sort_order
    )
    select
      created_request_id,
      template.role_type,
      template.label,
      template.required,
      template.min_count * target_requested_count,
      case
        when template.max_count is null then null
        else template.max_count * target_requested_count
      end,
      template.can_transition_to_fps,
      template.sort_order
    from public.ship_position_templates as template
    where template.ship_id = target_ship_id
      and template.staffing_profile_id = resolved_staffing_profile_id
    order by template.sort_order, template.label;
  end if;

  return created_request_id;
end;
$$;

comment on function public.create_fleet_event_ship_request_with_positions(
  uuid,
  uuid,
  uuid,
  integer,
  uuid,
  text,
  boolean,
  text,
  text
) is
  'Creates a fleet ship/category request and copies matching ship staffing templates into event-level position slots. Ship counts multiply position counts.';

create or replace function public.replace_fleet_event_positions(
  target_fleet_event_ship_request_id uuid,
  target_positions jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  custom_staffing_profile_id uuid;
begin
  if target_fleet_event_ship_request_id is null then
    raise exception 'fleet event ship request id is required';
  end if;

  if target_positions is null or jsonb_typeof(target_positions) <> 'array' then
    raise exception 'positions must be a JSON array';
  end if;

  if not exists (
    select 1
    from public.fleet_event_ship_requests
    where id = target_fleet_event_ship_request_id
  ) then
    raise exception 'fleet event ship request not found';
  end if;

  select id
  into custom_staffing_profile_id
  from public.staffing_profiles
  where key = 'custom';

  if custom_staffing_profile_id is null then
    raise exception 'custom staffing profile not found';
  end if;

  delete from public.fleet_event_positions
  where fleet_event_ship_request_id = target_fleet_event_ship_request_id;

  insert into public.fleet_event_positions (
    fleet_event_ship_request_id,
    role_type,
    label,
    required,
    min_count,
    max_count,
    can_transition_to_fps,
    sort_order
  )
  select
    target_fleet_event_ship_request_id,
    position.role_type,
    position.label,
    position.required,
    position.min_count,
    position.max_count,
    position.can_transition_to_fps,
    position.sort_order
  from jsonb_to_recordset(target_positions) as position(
    role_type text,
    label text,
    required boolean,
    min_count integer,
    max_count integer,
    can_transition_to_fps boolean,
    sort_order integer
  );

  update public.fleet_event_ship_requests
  set staffing_profile_id = custom_staffing_profile_id,
      updated_at = now()
  where id = target_fleet_event_ship_request_id;
end;
$$;

comment on function public.replace_fleet_event_positions(uuid, jsonb) is
  'Replaces copied event-level positions for Custom staffing without changing ship roster locks or existing crew assignment flexibility.';

create or replace function public.reject_ship_suggestion_when_roster_locked()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  event_locked boolean;
  request_locked boolean;
  team_locked boolean;
begin
  select coalesce(ship_roster_locked, false)
  into event_locked
  from public.fleet_events
  where id = new.fleet_event_id;

  if event_locked then
    raise exception 'ship roster is locked for this fleet event';
  end if;

  if new.fleet_event_ship_request_id is not null then
    select
      request.substitution_policy = 'locked',
      coalesce(team.ship_roster_locked, false)
    into request_locked, team_locked
    from public.fleet_event_ship_requests as request
    left join public.teams as team
      on team.id = request.team_id
    where request.id = new.fleet_event_ship_request_id;

    if request_locked then
      raise exception 'ship roster is locked for this request';
    end if;

    if team_locked then
      raise exception 'ship roster is locked for this team';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists reject_ship_suggestion_when_roster_locked
on public.fleet_event_ship_suggestions;

create trigger reject_ship_suggestion_when_roster_locked
before insert on public.fleet_event_ship_suggestions
for each row execute function public.reject_ship_suggestion_when_roster_locked();

comment on trigger reject_ship_suggestion_when_roster_locked
on public.fleet_event_ship_suggestions is
  'Ship roster locks block new ship suggestions and substitutions only. Crew assignments are unaffected.';
