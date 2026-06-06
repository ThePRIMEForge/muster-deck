-- Fix ambiguous column references in list_profiles_for_admin.
-- Same root cause as get_or_create_profile: RETURNS TABLE creates implicit
-- output variables that conflict with unqualified column references inside
-- the function body. Fix: use explicit table aliases on all references.
drop function if exists public.list_profiles_for_admin();

create function public.list_profiles_for_admin()
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
  select adm.is_site_admin into v_is_admin
  from public.profiles adm
  where adm.auth_user_id = auth.uid();

  if not coalesce(v_is_admin, false) then
    raise exception 'Forbidden: site admin access required';
  end if;

  return query
  select
    prof.id,
    prof.display_name,
    prof.account_status,
    prof.rsi_handle,
    prof.rsi_verification_status,
    prof.is_site_admin,
    prof.last_active_at,
    prof.created_at,
    exists(
      select 1 from public.profile_identities pi2
      where pi2.profile_id = prof.id and pi2.provider = 'discord'
    ) as discord_linked,
    exists(
      select 1 from public.profile_identities pi2
      where pi2.profile_id = prof.id and pi2.provider = 'google'
    ) as google_linked
  from public.profiles prof
  order by prof.created_at desc;
end;
$$;
