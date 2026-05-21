create extension if not exists pgtap with schema extensions;

select extensions.plan(1);

begin;

do $$
declare
  test_event_id uuid;
  test_team_id uuid;
  test_request_id uuid;
  test_member_id uuid;
  test_position_id uuid;
  scorpius_id uuid;
  catalog_count integer;
  required_min integer;
  required_max integer;
  assigned_count integer;
  pending_suggestion_count integer;
  locked_state boolean;
begin
  select count(*)
  into catalog_count
  from public.ship_catalog_summary;

  if catalog_count < 250 then
    raise exception 'expected populated ship catalog summary, found % rows', catalog_count;
  end if;

  select id
  into scorpius_id
  from public.ship_catalog_summary
  where slug = 'rsi-scorpius'
    and primary_category_key = 'heavy_fighter';

  if scorpius_id is null then
    raise exception 'expected Scorpius as heavy fighter in catalog summary';
  end if;

  insert into public.fleet_events (code, name, description)
  values ('READMODEL-SMOKE-' || replace(gen_random_uuid()::text, '-', ''), 'Read Model Smoke Test', 'rolled back')
  returning id into test_event_id;

  insert into public.teams (fleet_event_id, name, sort_order)
  values (test_event_id, 'Alpha', 10)
  returning id into test_team_id;

  test_request_id := public.create_fleet_event_ship_request_with_positions(
    test_event_id,
    scorpius_id,
    null,
    2,
    test_team_id,
    'standard',
    false,
    null,
    'two Scorpius fighters'
  );

  insert into public.members (fleet_event_id, display_name)
  values (test_event_id, 'Read Model Tester')
  returning id into test_member_id;

  select id
  into test_position_id
  from public.fleet_event_positions
  where fleet_event_ship_request_id = test_request_id
    and role_type = 'pilot'
  limit 1;

  insert into public.assignments (
    fleet_event_id,
    member_id,
    fleet_event_ship_request_id,
    fleet_event_position_id,
    assignment_type,
    status
  )
  values (
    test_event_id,
    test_member_id,
    test_request_id,
    test_position_id,
    'ship_position',
    'assigned'
  );

  insert into public.fleet_event_ship_suggestions (
    fleet_event_id,
    fleet_event_ship_request_id,
    member_id,
    suggested_ship_id,
    suggestion_type,
    notes
  )
  values (
    test_event_id,
    test_request_id,
    test_member_id,
    scorpius_id,
    'substitution',
    'pending read model suggestion'
  );

  select
    summary.required_positions_min,
    summary.required_positions_max,
    summary.assigned_position_count,
    summary.pending_ship_suggestion_count,
    summary.effective_ship_roster_locked
  into
    required_min,
    required_max,
    assigned_count,
    pending_suggestion_count,
    locked_state
  from public.fleet_event_ship_request_summary as summary
  where summary.id = test_request_id;

  if required_min <> 4 or required_max <> 4 then
    raise exception 'expected four required Scorpius positions in summary, found min %, max %', required_min, required_max;
  end if;

  if assigned_count <> 1 then
    raise exception 'expected one assigned position in summary, found %', assigned_count;
  end if;

  if pending_suggestion_count <> 1 then
    raise exception 'expected one pending ship suggestion in summary, found %', pending_suggestion_count;
  end if;

  if locked_state is not false then
    raise exception 'expected unlocked request summary before locking';
  end if;

  update public.teams
  set ship_roster_locked = true
  where id = test_team_id;

  select summary.effective_ship_roster_locked
  into locked_state
  from public.fleet_event_ship_request_summary as summary
  where summary.id = test_request_id;

  if locked_state is not true then
    raise exception 'expected team ship lock to mark request summary as effectively locked';
  end if;
end;
$$;

rollback;

select extensions.pass('read model smoke checks passed');
select * from extensions.finish();
