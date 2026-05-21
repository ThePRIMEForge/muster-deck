create extension if not exists pgtap with schema extensions;

select extensions.plan(1);

begin;

insert into public.profiles (display_name, primary_org, rsi_handle, rsi_verification_status)
values ('Deck Tester', 'MusterDeck', 'DeckTester', 'pending');

insert into public.profiles (display_name, account_status)
values ('Restricted Tester', 'restricted');

insert into public.profile_identities (profile_id, provider, provider_user_id, provider_username)
select id, 'discord', '12345', 'decktester'
from public.profiles
where display_name = 'Deck Tester';

insert into public.notification_preferences (
  profile_id,
  browser_push_enabled,
  general_messages_enabled,
  direct_messages_enabled,
  group_messages_enabled,
  tournaments_enabled
)
select id, true, true, true, true, true
from public.profiles
where display_name = 'Deck Tester';

insert into public.profile_moderation_notes (profile_id, note)
select id, 'Smoke test note'
from public.profiles
where display_name = 'Deck Tester';

select
  p.display_name,
  p.rsi_verification_status,
  i.provider,
  n.browser_push_enabled,
  n.general_messages_enabled,
  n.direct_messages_enabled,
  n.group_messages_enabled,
  n.tournaments_enabled
from public.profiles p
join public.profile_identities i on i.profile_id = p.id
join public.notification_preferences n on n.profile_id = p.id
where p.display_name = 'Deck Tester';

do $$
begin
  if not exists (
    select 1
    from public.profiles p
    join public.profile_identities i on i.profile_id = p.id
    join public.notification_preferences n on n.profile_id = p.id
    where p.display_name = 'Deck Tester'
      and p.rsi_verification_status = 'pending'
      and i.provider = 'discord'
      and n.general_messages_enabled = true
      and n.direct_messages_enabled = true
      and n.group_messages_enabled = true
      and n.tournaments_enabled = true
  ) then
    raise exception 'expected shared foundation account, identity, and notification preferences';
  end if;
end;
$$;

rollback;

select extensions.pass('shared foundation account smoke checks passed');
select * from extensions.finish();
