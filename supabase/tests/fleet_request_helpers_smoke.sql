begin;

do $$
declare
  test_event_id uuid;
  test_team_id uuid;
  test_request_id uuid;
  test_position_id uuid;
  test_member_id uuid;
  scorpius_id uuid;
  position_count integer;
  profile_key text;
  event_lock_blocked boolean := false;
  team_lock_blocked boolean := false;
  request_lock_blocked boolean := false;
begin
  select id
  into scorpius_id
  from public.ships
  where slug = 'rsi-scorpius';

  if scorpius_id is null then
    raise exception 'expected rsi-scorpius in synced ship catalog';
  end if;

  insert into public.fleet_events (code, name, description)
  values ('HELPER-SMOKE-' || replace(gen_random_uuid()::text, '-', ''), 'Helper Smoke Test', 'rolled back')
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

  select count(*)
  into position_count
  from public.fleet_event_positions
  where fleet_event_ship_request_id = test_request_id;

  if position_count <> 2 then
    raise exception 'expected 2 copied Scorpius positions, found %', position_count;
  end if;

  if not exists (
    select 1
    from public.fleet_event_positions
    where fleet_event_ship_request_id = test_request_id
      and role_type = 'pilot'
      and min_count = 2
      and max_count = 2
      and required = true
  ) then
    raise exception 'expected two required Scorpius pilots after count multiplier';
  end if;

  if not exists (
    select 1
    from public.fleet_event_positions
    where fleet_event_ship_request_id = test_request_id
      and role_type = 'remote_turret_gunner'
      and min_count = 2
      and max_count = 2
      and required = true
  ) then
    raise exception 'expected two required Scorpius turret gunners after count multiplier';
  end if;

  perform public.replace_fleet_event_positions(
    test_request_id,
    '[
      {
        "role_type": "pilot",
        "label": "Lead Pilot",
        "required": true,
        "min_count": 1,
        "max_count": 1,
        "can_transition_to_fps": false,
        "sort_order": 10
      },
      {
        "role_type": "marine",
        "label": "Boarding Team",
        "required": false,
        "min_count": 0,
        "max_count": 6,
        "can_transition_to_fps": true,
        "sort_order": 20
      }
    ]'::jsonb
  );

  select profile.key
  into profile_key
  from public.fleet_event_ship_requests as request
  join public.staffing_profiles as profile
    on profile.id = request.staffing_profile_id
  where request.id = test_request_id;

  if profile_key <> 'custom' then
    raise exception 'expected request profile to switch to custom, found %', profile_key;
  end if;

  if not exists (
    select 1
    from public.fleet_event_positions
    where fleet_event_ship_request_id = test_request_id
      and role_type = 'marine'
      and label = 'Boarding Team'
      and max_count = 6
      and can_transition_to_fps = true
  ) then
    raise exception 'expected custom marine boarding team position';
  end if;

  insert into public.members (fleet_event_id, display_name)
  values (test_event_id, 'Smoke Tester')
  returning id into test_member_id;

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
    'unlocked suggestion should be accepted'
  );

  update public.teams
  set ship_roster_locked = true
  where id = test_team_id;

  begin
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
      'team lock should block'
    );
  exception
    when others then
      team_lock_blocked := true;
  end;

  if team_lock_blocked is not true then
    raise exception 'expected locked team ship roster to block ship suggestion';
  end if;

  update public.teams
  set ship_roster_locked = false
  where id = test_team_id;

  update public.fleet_event_ship_requests
  set substitution_policy = 'locked'
  where id = test_request_id;

  begin
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
      'request lock should block'
    );
  exception
    when others then
      request_lock_blocked := true;
  end;

  if request_lock_blocked is not true then
    raise exception 'expected locked ship request to block ship suggestion';
  end if;

  update public.fleet_event_ship_requests
  set substitution_policy = 'allow_alternatives'
  where id = test_request_id;

  update public.fleet_events
  set ship_roster_locked = true
  where id = test_event_id;

  begin
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
      'should be blocked'
    );
  exception
    when others then
      event_lock_blocked := true;
  end;

  if event_lock_blocked is not true then
    raise exception 'expected locked ship roster to block ship suggestion';
  end if;

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

  if not exists (
    select 1
    from public.assignments
    where fleet_event_id = test_event_id
      and member_id = test_member_id
      and assignment_type = 'ship_position'
  ) then
    raise exception 'expected crew assignment to remain allowed while ship roster is locked';
  end if;
end;
$$;

rollback;
