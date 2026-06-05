-- Add is_site_admin column to profiles
alter table public.profiles add column if not exists is_site_admin boolean not null default false;

-- Admins can read all profiles (own profile covered by existing users_read_own_profile policy)
create policy "admins_read_all_profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles admin_p
      where admin_p.auth_user_id = auth.uid()
        and admin_p.is_site_admin = true
    )
  );

-- list_profiles_for_admin: returns all profiles for site admins only
create or replace function public.list_profiles_for_admin()
returns table (
  id uuid,
  display_name text,
  account_status text,
  rsi_handle text,
  rsi_verification_status text,
  is_site_admin boolean,
  last_active_at timestamptz,
  created_at timestamptz,
  discord_linked boolean,
  google_linked boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_is_admin boolean;
begin
  select is_site_admin into v_is_admin
  from public.profiles
  where auth_user_id = auth.uid();

  if not coalesce(v_is_admin, false) then
    raise exception 'Forbidden: site admin access required';
  end if;

  return query
  select
    p.id,
    p.display_name,
    p.account_status,
    p.rsi_handle,
    p.rsi_verification_status,
    p.is_site_admin,
    p.last_active_at,
    p.created_at,
    exists(select 1 from public.profile_identities pi2 where pi2.profile_id = p.id and pi2.provider = 'discord') as discord_linked,
    exists(select 1 from public.profile_identities pi2 where pi2.profile_id = p.id and pi2.provider = 'google') as google_linked
  from public.profiles p
  order by p.created_at desc;
end;
$$;

-- admin_set_account_status: ban, restrict, or restore a user
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
  v_is_admin boolean;
  v_new_status text;
begin
  select id, is_site_admin into v_actor_profile_id, v_is_admin
  from public.profiles
  where auth_user_id = auth.uid();

  if not coalesce(v_is_admin, false) then
    raise exception 'Forbidden: site admin access required';
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

  update public.profiles
  set account_status = v_new_status
  where id = p_profile_id;

  insert into public.profile_admin_actions (profile_id, actor_profile_id, action, reason)
  values (p_profile_id, v_actor_profile_id, p_action, p_reason);
end;
$$;
