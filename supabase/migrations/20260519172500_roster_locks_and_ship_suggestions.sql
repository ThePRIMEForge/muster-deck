alter table public.fleet_events
add column roster_locked boolean not null default false;

alter table public.teams
add column roster_locked boolean not null default false;

alter table public.fleet_event_ship_requests
add column substitution_policy text not null default 'allow_alternatives'
  check (substitution_policy in ('allow_alternatives', 'exact_only', 'locked'));

update public.fleet_event_ship_requests
set substitution_policy = 'exact_only'
where is_exact_ship_required = true;

create table public.fleet_event_ship_suggestions (
  id uuid primary key default gen_random_uuid(),
  fleet_event_id uuid not null references public.fleet_events(id) on delete cascade,
  fleet_event_ship_request_id uuid references public.fleet_event_ship_requests(id) on delete cascade,
  member_id uuid references public.members(id) on delete set null,
  suggested_ship_id uuid references public.ships(id) on delete set null,
  custom_ship_name text,
  suggestion_type text not null default 'substitution'
    check (suggestion_type in ('substitution', 'ship_offer', 'category_fill')),
  notes text not null default '',
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  constraint fleet_event_ship_suggestions_ship_or_custom_check check (
    suggested_ship_id is not null
    or custom_ship_name is not null
  )
);

create index fleet_event_ship_suggestions_event_status_idx
on public.fleet_event_ship_suggestions (fleet_event_id, status);

create index fleet_event_ship_suggestions_request_idx
on public.fleet_event_ship_suggestions (fleet_event_ship_request_id);

alter table public.fleet_event_ship_suggestions enable row level security;

create or replace function public.unlock_all_fleet_rosters(target_fleet_event_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.fleet_events
  set roster_locked = false,
      updated_at = now()
  where id = target_fleet_event_id;

  update public.teams
  set roster_locked = false
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
