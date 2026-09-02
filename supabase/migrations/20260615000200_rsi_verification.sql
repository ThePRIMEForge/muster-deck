-- RSI handle verification flow (#12)
-- Adds a short verification token to profiles and RPCs to drive the challenge flow.
-- Actual RSI profile scraping is deferred to a future Supabase Edge Function.

-- -------------------------------------------------------------------------
-- 1. New column
-- -------------------------------------------------------------------------

alter table public.profiles
  add column if not exists rsi_verification_token text;

-- -------------------------------------------------------------------------
-- 2. generate_rsi_verification_token()
-- Creates a new token and sets status to 'token_generated'.
-- Only succeeds when the profile has a non-empty RSI handle.
-- Calling again while a token already exists replaces it (re-trigger support).
-- -------------------------------------------------------------------------

create or replace function public.generate_rsi_verification_token()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_token text;
begin
  v_token := 'MUSTER-' || upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 8));

  update public.profiles
  set
    rsi_verification_token  = v_token,
    rsi_verification_status = 'token_generated'
  where
    auth_user_id = auth.uid()
    and rsi_handle is not null
    and rsi_handle != '';

  if not found then
    raise exception 'Save an RSI handle before generating a verification token.';
  end if;

  return v_token;
end;
$$;

-- -------------------------------------------------------------------------
-- 3. submit_rsi_verification()
-- User confirms they placed the token in their RSI bio.
-- Sets status to 'submitted'; admin or Edge Function will move it to 'verified'.
-- -------------------------------------------------------------------------

create or replace function public.submit_rsi_verification()
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles
  set rsi_verification_status = 'submitted'
  where
    auth_user_id            = auth.uid()
    and rsi_verification_token is not null
    and rsi_handle             is not null;
$$;

-- -------------------------------------------------------------------------
-- 4. Update update_my_profile to reset verification when handle changes
-- -------------------------------------------------------------------------

create or replace function public.update_my_profile(
  p_display_name text default null,
  p_primary_org  text default null,
  p_rsi_handle   text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set
    display_name = coalesce(nullif(trim(p_display_name), ''), display_name),
    primary_org  = case when p_primary_org is not null then nullif(trim(p_primary_org), '') else primary_org end,
    rsi_handle   = case when p_rsi_handle is not null then nullif(trim(p_rsi_handle), '') else rsi_handle end,
    -- Reset verification when the handle actually changes
    rsi_verification_status = case
      when p_rsi_handle is not null
        and nullif(trim(p_rsi_handle), '') is distinct from rsi_handle
        then 'unverified'
      else rsi_verification_status
    end,
    rsi_verification_token = case
      when p_rsi_handle is not null
        and nullif(trim(p_rsi_handle), '') is distinct from rsi_handle
        then null
      else rsi_verification_token
    end
  where auth_user_id = auth.uid();
end;
$$;

-- -------------------------------------------------------------------------
-- 5. Extend get_or_create_profile to return verification token
-- (the user needs their own token to display to themselves)
-- -------------------------------------------------------------------------

drop function if exists public.get_or_create_profile();

create function public.get_or_create_profile()
returns table (
  id uuid,
  auth_user_id uuid,
  display_name text,
  primary_org text,
  rsi_handle text,
  rsi_verification_token text,
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
    prof.rsi_verification_token,
    prof.rsi_verification_status,
    prof.account_status,
    prof.site_role::text,
    prof.patreon_tier::text
  from public.profiles prof
  where prof.auth_user_id = auth.uid();
end;
$$;
