begin;

insert into public.profiles (display_name, primary_org, rsi_handle, rsi_verification_status)
values ('Deck Tester', 'MusterDeck', 'DeckTester', 'pending');

insert into public.profiles (display_name, account_status)
values ('Restricted Tester', 'restricted');

insert into public.profile_identities (profile_id, provider, provider_user_id, provider_username)
select id, 'discord', '12345', 'decktester'
from public.profiles
where display_name = 'Deck Tester';

insert into public.notification_preferences (profile_id, browser_push_enabled, tournaments_enabled)
select id, true, true
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
  n.tournaments_enabled
from public.profiles p
join public.profile_identities i on i.profile_id = p.id
join public.notification_preferences n on n.profile_id = p.id
where p.display_name = 'Deck Tester';

rollback;
