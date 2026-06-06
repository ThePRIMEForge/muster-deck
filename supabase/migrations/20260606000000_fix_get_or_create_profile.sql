-- Fix ambiguous column reference in get_or_create_profile.
-- The original PL/pgSQL version had RETURNS TABLE(id uuid, ...) which creates
-- implicit output variables that conflict with the SELECT column names,
-- causing PostgreSQL error 42702. Rewritten in SQL language to avoid this,
-- and extended to include is_site_admin in the return type.
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
  is_site_admin boolean
)
language sql
security definer
set search_path = public
as $$
  insert into public.profiles (auth_user_id, display_name)
  values (
    auth.uid(),
    coalesce(
      nullif(split_part((select email from auth.users where id = auth.uid()), '@', 1), ''),
      'Pilot'
    )
  )
  on conflict (auth_user_id) do nothing;

  select
    prof.id,
    prof.auth_user_id,
    prof.display_name,
    prof.primary_org,
    prof.rsi_handle,
    prof.rsi_verification_status,
    prof.account_status,
    prof.is_site_admin
  from public.profiles prof
  where prof.auth_user_id = auth.uid();
$$;
