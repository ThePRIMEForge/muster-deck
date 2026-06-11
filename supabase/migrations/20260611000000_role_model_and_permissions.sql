-- Role model and permissions (#112)
-- Replaces the flat is_site_admin boolean with a proper role ladder and
-- adds Patreon tier badge tracking. Super Admin is not grantable via any
-- user-facing function; it is assigned at profile creation by checking
-- the super_admin_emails table (populated manually / via restricted migration).

-- -------------------------------------------------------------------------
-- 1. Enums
-- -------------------------------------------------------------------------

create type public.app_site_role as enum (
  'registered_user',
  'moderator',
  'admin',
  'super_admin'
);

create type public.app_patreon_tier as enum (
  'none',
  'captain',
  'admiral',
  'praetorian'
);

-- -------------------------------------------------------------------------
-- 2. New columns on profiles
-- -------------------------------------------------------------------------

alter table public.profiles
  add column site_role public.app_site_role not null default 'registered_user',
  add column patreon_tier public.app_patreon_tier not null default 'none';

-- -------------------------------------------------------------------------
-- 3. Migrate is_site_admin -> admin role, then drop old column
-- -------------------------------------------------------------------------

update public.profiles
  set site_role = 'admin'
  where is_site_admin = true;

alter table public.profiles drop column is_site_admin;

-- -------------------------------------------------------------------------
-- 4. Super admin email table
-- Hard-code super admins by email. Only gets checked at profile
-- creation/login. No user-facing function can insert into this table.
-- Populate via a separate restricted migration or directly in the dashboard.
-- -------------------------------------------------------------------------

create table public.super_admin_emails (
  email text primary key
);

-- RLS: no one can read or write this table via client APIs
alter table public.super_admin_emails enable row level security;

-- -------------------------------------------------------------------------
-- 5. Helper functions (security definer, no client access needed)
-- -------------------------------------------------------------------------

create or replace function public.current_site_role()
returns public.app_site_role
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select site_role from public.profiles where auth_user_id = auth.uid()),
    'registered_user'
  );
$$;

create or replace function public.is_site_admin_or_above()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select site_role in ('admin', 'super_admin')
     from public.profiles where auth_user_id = auth.uid()),
    false
  );
$$;

create or replace function public.is_moderator_or_above()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select site_role in ('moderator', 'admin', 'super_admin')
     from public.profiles where auth_user_id = auth.uid()),
    false
  );
$$;

-- -------------------------------------------------------------------------
-- 6. Updated get_or_create_profile
-- Returns site_role and patreon_tier; assigns super_admin on first login
-- if the user's email is in super_admin_emails.
-- -------------------------------------------------------------------------

drop function if exists public.get_or_create_profile();

create function public.get_or_create_profile()
returns table (
  id uuid,
  auth_user_id uuid,
  display_name text,
  primary_org text,
  rsi_handle text,
  rsi_verification_status text,
  account_status text,
  site_role text,
  patreon_tier text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
  v_initial_role public.app_site_role;
begin
  select email into v_email from auth.users where id = auth.uid();

  if exists (select 1 from public.super_admin_emails where email = v_email) then
    v_initial_role := 'super_admin';
  else
    v_initial_role := 'registered_user';
  end if;

  insert into public.profiles (auth_user_id, display_name, site_role)
  values (
    auth.uid(),
    coalesce(nullif(split_part(v_email, '@', 1), ''), 'Pilot'),
    v_initial_role
  )
  on conflict (auth_user_id) do update
    -- Promote to super_admin if newly added to the list; never demote.
    set site_role = case
      when v_initial_role = 'super_admin' then 'super_admin'
      else profiles.site_role
    end;

  return query
  select
    prof.id,
    prof.auth_user_id,
    prof.display_name,
    prof.primary_org,
    prof.rsi_handle,
    prof.rsi_verification_status,
    prof.account_status,
    prof.site_role::text,
    prof.patreon_tier::text
  from public.profiles prof
  where prof.auth_user_id = auth.uid();
end;
$$;

-- -------------------------------------------------------------------------
-- 7. Update RLS policies that referenced is_site_admin
-- -------------------------------------------------------------------------

drop policy if exists "admins_read_all_profiles" on public.profiles;

create policy "admins_read_all_profiles"
  on public.profiles for select
  using (public.is_site_admin_or_above());

-- -------------------------------------------------------------------------
-- 8. Updated admin helper functions
-- -------------------------------------------------------------------------

drop function if exists public.list_profiles_for_admin();

create function public.list_profiles_for_admin()
returns table (
  id uuid,
  display_name text,
  account_status text,
  rsi_handle text,
  rsi_verification_status text,
  site_role text,
  patreon_tier text,
  last_active_at timestamptz,
  created_at timestamptz,
  discord_linked boolean,
  google_linked boolean
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_site_admin_or_above() then
    raise exception 'Forbidden: admin access required';
  end if;

  return query
  select
    p.id,
    p.display_name,
    p.account_status,
    p.rsi_handle,
    p.rsi_verification_status,
    p.site_role::text,
    p.patreon_tier::text,
    p.last_active_at,
    p.created_at,
    exists(select 1 from public.profile_identities pi2
           where pi2.profile_id = p.id and pi2.provider = 'discord') as discord_linked,
    exists(select 1 from public.profile_identities pi2
           where pi2.profile_id = p.id and pi2.provider = 'google') as google_linked
  from public.profiles p
  order by p.created_at desc;
end;
$$;

create or replace function public.admin_set_account_status(
  p_profile_id uuid,
  p_action text,
  p_reason text default ''
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_profile_id uuid;
  v_actor_role public.app_site_role;
  v_new_status text;
begin
  select id, site_role into v_actor_profile_id, v_actor_role
  from public.profiles where auth_user_id = auth.uid();

  if not (v_actor_role in ('admin', 'super_admin')) then
    raise exception 'Forbidden: admin access required';
  end if;

  if p_action not in ('ban', 'unban', 'restrict', 'unrestrict', 'require_approval', 'restore_access') then
    raise exception 'Unknown action: %', p_action;
  end if;

  v_new_status := case p_action
    when 'ban'              then 'banned'
    when 'unban'            then 'active'
    when 'restrict'         then 'restricted'
    when 'unrestrict'       then 'active'
    when 'require_approval' then 'approval_required'
    when 'restore_access'   then 'active'
  end;

  update public.profiles set account_status = v_new_status where id = p_profile_id;

  insert into public.profile_admin_actions (profile_id, actor_profile_id, action, reason)
  values (p_profile_id, v_actor_profile_id, p_action, p_reason);
end;
$$;

-- admin_set_site_role: super_admin can grant/revoke admin; admin can grant/revoke moderator.
-- super_admin cannot be granted via this function.
create or replace function public.admin_set_site_role(
  p_profile_id uuid,
  p_role text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_role public.app_site_role;
  v_target_role public.app_site_role;
  v_new_role public.app_site_role;
begin
  select site_role into v_actor_role
  from public.profiles where auth_user_id = auth.uid();

  if p_role not in ('registered_user', 'moderator', 'admin') then
    raise exception 'Invalid role: %. super_admin cannot be granted via this function.', p_role;
  end if;

  v_new_role := p_role::public.app_site_role;

  select site_role into v_target_role
  from public.profiles where id = p_profile_id;

  if v_target_role = 'super_admin' then
    raise exception 'Forbidden: super_admin role cannot be changed';
  end if;

  -- Granting or revoking admin requires super_admin
  if v_new_role = 'admin' or v_target_role = 'admin' then
    if v_actor_role != 'super_admin' then
      raise exception 'Forbidden: only super_admin can grant or revoke admin role';
    end if;
  end if;

  if not (v_actor_role in ('admin', 'super_admin')) then
    raise exception 'Forbidden: admin access required to change roles';
  end if;

  update public.profiles set site_role = v_new_role where id = p_profile_id;
end;
$$;
