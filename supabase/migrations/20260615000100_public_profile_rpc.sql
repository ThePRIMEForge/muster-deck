-- get_public_profile: returns display-safe profile data for any visitor.
-- Intentionally excludes email, auth_user_id, internal IDs, and account status.
-- Restricted to profiles with an RSI handle that are not banned or deleted.

create or replace function public.get_public_profile(p_rsi_handle text)
returns table (
  display_name          text,
  rsi_handle            text,
  rsi_verification_status text,
  primary_org           text,
  patreon_tier          text
)
language sql
security definer
set search_path = public
stable
as $$
  select
    display_name,
    rsi_handle,
    rsi_verification_status,
    primary_org,
    patreon_tier::text
  from public.profiles
  where
    lower(rsi_handle) = lower(p_rsi_handle)
    and account_status not in ('banned', 'deleted')
  limit 1;
$$;
