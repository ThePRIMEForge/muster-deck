alter table public.fleet_events
rename column roster_locked to ship_roster_locked;

alter table public.teams
rename column roster_locked to ship_roster_locked;

comment on column public.fleet_events.ship_roster_locked is
  'Locks ship suggestions and substitutions only. Crew and position assignments remain flexible.';

comment on column public.teams.ship_roster_locked is
  'Locks ship suggestions and substitutions for this team only. Crew and position assignments remain flexible.';

drop function if exists public.unlock_all_fleet_rosters(uuid);

create or replace function public.unlock_all_ship_rosters(target_fleet_event_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.fleet_events
  set ship_roster_locked = false,
      updated_at = now()
  where id = target_fleet_event_id;

  update public.teams
  set ship_roster_locked = false
  where fleet_event_id = target_fleet_event_id;

  update public.fleet_event_ship_requests
  set substitution_policy = case
      when is_exact_ship_required then 'exact_only'
      else 'allow_alternatives'
    end,
      updated_at = now()
  where fleet_event_id = target_fleet_event_id
    and substitution_policy = 'locked';
end;
$$;
