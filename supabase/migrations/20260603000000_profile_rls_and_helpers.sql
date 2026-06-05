-- RLS policies: users can read and update their own profile
create policy "users_read_own_profile"
  on public.profiles for select
  using (auth_user_id = auth.uid());

create policy "users_update_own_profile"
  on public.profiles for update
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());

-- get_or_create_profile: called after sign-in to ensure a profile row exists
create or replace function public.get_or_create_profile()
returns table (
  id uuid,
  auth_user_id uuid,
  display_name text,
  primary_org text,
  rsi_handle text,
  rsi_verification_status text,
  account_status text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_email text;
  v_display_name text;
begin
  select email into v_email from auth.users where id = v_uid;
  v_display_name := coalesce(nullif(split_part(v_email, '@', 1), ''), 'Pilot');

  insert into public.profiles (auth_user_id, display_name)
  values (v_uid, v_display_name)
  on conflict (auth_user_id) do nothing;

  return query
  select p.id, p.auth_user_id, p.display_name, p.primary_org,
         p.rsi_handle, p.rsi_verification_status, p.account_status
  from public.profiles p
  where p.auth_user_id = v_uid;
end;
$$;

-- update_my_profile: save callsign, org, and RSI handle from AccountSettings
create or replace function public.update_my_profile(
  p_display_name text default null,
  p_primary_org text default null,
  p_rsi_handle text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set
    display_name = coalesce(p_display_name, display_name),
    primary_org  = coalesce(p_primary_org,  primary_org),
    rsi_handle   = coalesce(p_rsi_handle,   rsi_handle)
  where auth_user_id = auth.uid();
end;
$$;
