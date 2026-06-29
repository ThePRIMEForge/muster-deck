-- delete_my_account(): anonymize profile data and flag the row for hard deletion.
-- The auth.users row must be removed by an admin action or a scheduled cleanup job
-- because the Supabase client API does not expose user self-deletion.

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set
    display_name   = 'Deleted User',
    primary_org    = null,
    rsi_handle     = null,
    rsi_verification_status = 'unverified',
    account_status = 'deleted'
  where auth_user_id = auth.uid();
end;
$$;
