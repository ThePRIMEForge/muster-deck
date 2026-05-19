create table public.fleet_event_messages (
  id uuid primary key default gen_random_uuid(),
  fleet_event_id uuid not null references public.fleet_events(id) on delete cascade,
  actor_member_id uuid references public.members(id) on delete set null,
  title text not null,
  body text not null default '',
  message_type text not null default 'order'
    check (message_type in ('order', 'assignment_change', 'request_status', 'ship_change', 'team_change', 'system')),
  created_at timestamptz not null default now()
);

create index fleet_event_messages_event_created_idx
on public.fleet_event_messages (fleet_event_id, created_at desc);

create table public.fleet_event_message_tags (
  id uuid primary key default gen_random_uuid(),
  fleet_event_message_id uuid not null references public.fleet_event_messages(id) on delete cascade,
  tag_type text not null
    check (tag_type in ('member', 'team', 'ship_request', 'position', 'fleet', 'command', 'custom')),
  tag_value text not null,
  member_id uuid references public.members(id) on delete cascade,
  team_id uuid references public.teams(id) on delete cascade,
  fleet_event_ship_request_id uuid references public.fleet_event_ship_requests(id) on delete cascade,
  fleet_event_position_id uuid references public.fleet_event_positions(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index fleet_event_message_tags_message_idx
on public.fleet_event_message_tags (fleet_event_message_id);

create index fleet_event_message_tags_lookup_idx
on public.fleet_event_message_tags (tag_type, tag_value);

create table public.fleet_event_message_acknowledgements (
  fleet_event_message_id uuid not null references public.fleet_event_messages(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  acknowledged_at timestamptz not null default now(),
  primary key (fleet_event_message_id, member_id)
);

alter table public.fleet_event_messages enable row level security;
alter table public.fleet_event_message_tags enable row level security;
alter table public.fleet_event_message_acknowledgements enable row level security;
