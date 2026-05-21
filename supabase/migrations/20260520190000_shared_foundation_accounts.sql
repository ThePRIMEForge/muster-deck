create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  display_name text not null,
  bio text not null default '',
  primary_org text not null default '',
  avatar_url text,
  rsi_handle text,
  rsi_verification_status text not null default 'not_submitted'
    check (rsi_verification_status in ('not_submitted', 'pending', 'verified', 'failed', 'revoked')),
  account_status text not null default 'active'
    check (account_status in ('active', 'approval_required', 'restricted', 'banned', 'deleted')),
  terms_accepted_at timestamptz,
  privacy_accepted_at timestamptz,
  profile_completed_at timestamptz,
  last_active_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create table public.profile_identities (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null check (provider in ('email', 'discord', 'google')),
  provider_user_id text,
  provider_username text,
  provider_email text,
  linked_at timestamptz not null default now(),
  last_seen_at timestamptz,
  unique (provider, provider_user_id),
  unique (profile_id, provider)
);

create table public.notification_preferences (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  assignments_enabled boolean not null default true,
  applications_enabled boolean not null default true,
  settlements_enabled boolean not null default true,
  tournaments_enabled boolean not null default true,
  admin_enabled boolean not null default true,
  browser_push_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_notification_preferences_updated_at
before update on public.notification_preferences
for each row execute function public.set_updated_at();

create table public.profile_moderation_notes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  author_profile_id uuid references public.profiles(id) on delete set null,
  note text not null,
  created_at timestamptz not null default now()
);

create table public.profile_admin_actions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  action text not null check (action in ('restrict', 'unrestrict', 'ban', 'unban', 'require_approval', 'restore_access')),
  reason text not null default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.profile_identities enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.profile_moderation_notes enable row level security;
alter table public.profile_admin_actions enable row level security;
