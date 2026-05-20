# Account, Access, Notifications, And Chat Design

Date: 2026-05-20

## Goal

Build the shared backend foundation for MusterDeck accounts across the three product pillars:

- Rally Point: looking for group, activity discovery, recruiting, and applications.
- Fleet Command: operations events, fleet setup, crew assignments, and live command tools.
- S.P.O.I.L.S.: Settlement, Payouts, Operations, Inventory, Loot, and Shares.

This design covers the first implementation slice for account identity, profile trust tags, activity access rules, blocked players, notifications, browser/device push, and lightweight chat. It extends the existing Supabase fleet schema instead of replacing it.

## Approved Scope

The approved first slice is option A: shared account foundation plus activity access, notifications, and lightweight chat.

Included now:

- Profiles and account settings.
- Email/password, Google SSO, and Discord SSO identity support.
- Terms and privacy consent during signup.
- Discord-linked trust tag.
- RSI handle verification.
- Activity-level Discord and RSI join requirements.
- Blocked-player enforcement and unblock management.
- Direct profile invites.
- In-app notifications.
- Browser/device push notifications.
- Notification preferences by category.
- Lightweight chat for direct, group, Fleet Command global, team, and ship channels.
- Message retention by channel count caps.

Reserved for later:

- Friend requests and friend lists.
- Personal group management UI.
- Group membership management.
- Group-targeted invite drawer.
- Fleet Admiral quick-command buttons and hotkeys.
- Discord server membership verification.
- Deep Discord bot workflows.

## User Flow

Logged-out users land on the public page with a hero image, the message `Rally, command, settle`, and `Log in` / `Sign up` controls.

Signup supports:

- Email and password.
- Google SSO.
- Discord SSO.

Users must acknowledge the privacy policy and terms of service during signup. Email/password accounts require email verification.

Logged-in users who visit the root route go directly to the three-pillar hub unless the frontend is explicitly showing the public landing page for a logged-out session. Profile completion is encouraged but not a hard gate.

First-time users should be guided toward account settings to complete:

- Display name.
- Bio.
- Primary organization.
- Game-loop interests.
- Linked Google or Discord identities.
- RSI handle verification.

These fields are useful for trust and matchmaking, but only Discord-linked and RSI-verified status can block activity joins when an activity host requires them.

## Profile Display Rules

Name surfaces should stay compact:

- Display name.
- RSI-verified badge when present.
- Discord-linked indicator where useful.

Clicking a player opens a read-only profile modal. The modal can show:

- Display name.
- Bio.
- Primary organization.
- Game-loop interests.
- Discord-linked state.
- RSI handle and RSI-verified state.

The exact game-loop checklist is intentionally deferred to the Rally Point filter design. The first backend slice should support a controlled list of game-loop values without locking the implementation into a final taxonomy.

## Database Model

### profiles

Persistent user profile for one Supabase auth user.

Recommended fields:

- `id`
- `auth_user_id`
- `display_name`
- `bio`
- `primary_org`
- `avatar_url`
- `terms_accepted_at`
- `privacy_accepted_at`
- `profile_completed_at`
- `created_at`
- `updated_at`
- `last_active_at`

### profile_identities

Stores linked identity providers for a profile.

Recommended fields:

- `id`
- `profile_id`
- `provider`
- `provider_user_id`
- `provider_username`
- `provider_email`
- `linked_at`
- `last_seen_at`

Allowed providers for the first slice:

- `email`
- `google`
- `discord`

Discord verification means Discord SSO is linked. It does not mean the user belongs to a specific Discord server.

### rsi_verification_challenges

Stores RSI handle verification attempts.

Recommended fields:

- `id`
- `profile_id`
- `rsi_handle`
- `challenge_token`
- `status`
- `expires_at`
- `verified_at`
- `failed_at`
- `created_at`
- `updated_at`

Allowed statuses:

- `pending`
- `verified`
- `expired`
- `failed`
- `revoked`

RSI verification must run server-side. The app should store the handle, challenge state, and verification timestamps, but not store scraped RSI profile HTML.

### profile_game_loops

Stores optional game-loop interests.

Recommended fields:

- `profile_id`
- `game_loop_key`
- `created_at`

The allowed game-loop values should be controlled by application constants or a lookup table when Rally Point filtering is designed.

### activity_access_rules

Reusable access requirements for Rally Point, Fleet Command, and S.P.O.I.L.S. activities.

Recommended fields:

- `id`
- `activity_type`
- `activity_id`
- `host_profile_id`
- `require_discord_linked`
- `require_rsi_verified`
- `created_at`
- `updated_at`

Allowed activity types for this slice:

- `rally_point`
- `fleet_command`
- `spoils`

Default behavior:

- Any signed-in account can join, including a basic email-only account.
- Hosts may require Discord linked.
- Hosts may require RSI verified.
- Hosts may require both.

### activity_invites

Stores direct invitations to profiles from any pillar or activity.

Recommended fields:

- `id`
- `activity_type`
- `activity_id`
- `sender_profile_id`
- `target_profile_id`
- `status`
- `message`
- `created_at`
- `responded_at`

Allowed statuses:

- `sent`
- `accepted`
- `declined`
- `expired`
- `cancelled`

Invites target stable profile IDs now. Friend and group-targeted invites can build on this later.

### profile_blocks

Stores player blocks.

Recommended fields:

- `blocker_profile_id`
- `blocked_profile_id`
- `note`
- `created_at`

Blocking rules:

- A blocked profile cannot direct-message the blocker.
- A blocked profile cannot join activities hosted by the blocker.
- Blocks are visible to the blocker in account settings.
- Blocks can be removed from account settings.

### notifications

Stores in-app notification records.

Recommended fields:

- `id`
- `recipient_profile_id`
- `actor_profile_id`
- `category`
- `title`
- `body`
- `activity_type`
- `activity_id`
- `chat_channel_id`
- `status`
- `created_at`
- `read_at`
- `clicked_at`
- `dismissed_at`

First categories:

- `messages`
- `activity_invitations`
- `fleet_command`
- `spoils`

`activity_invitations` covers invitations to any activity in any pillar.

### notification_preferences

Stores per-profile notification category preferences.

Recommended fields:

- `profile_id`
- `category`
- `in_app_enabled`
- `push_enabled`
- `updated_at`

Each category has separate in-app and push toggles. This prevents users from disabling all notifications just to reduce message noise.

Recommended default behavior:

- Important operational notifications should default to enabled once browser/device permission is granted.
- Message push should be separately controllable.
- In-app notification records should be created for important account and activity events unless the user has explicitly disabled that category.

### push_subscriptions

Stores browser/device push subscriptions.

Recommended fields:

- `id`
- `profile_id`
- `endpoint`
- `p256dh_key`
- `auth_key`
- `user_agent`
- `last_success_at`
- `last_failure_at`
- `disabled_at`
- `created_at`
- `updated_at`

Push delivery should check notification preferences before sending. Failed push delivery should not delete the in-app notification record.

### chat_channels

Stores chat channel definitions.

Recommended fields:

- `id`
- `channel_type`
- `activity_type`
- `activity_id`
- `fleet_event_id`
- `team_id`
- `fleet_event_ship_request_id`
- `created_by_profile_id`
- `name`
- `created_at`
- `closed_at`

Allowed channel types for the first slice:

- `direct`
- `personal_group`
- `fleet_global`
- `fleet_team`
- `fleet_ship`

### chat_channel_members

Stores explicit channel membership for direct and personal group channels and optional denormalized membership for event channels.

Recommended fields:

- `chat_channel_id`
- `profile_id`
- `role`
- `joined_at`
- `left_at`

### chat_messages

Stores chat messages.

Recommended fields:

- `id`
- `chat_channel_id`
- `sender_profile_id`
- `body`
- `created_at`
- `deleted_at`

Message caps:

- Direct chats keep the latest 100 messages per thread.
- Personal group chats keep the latest 100 messages per group thread.
- Fleet Command ship channels keep the latest 50 messages per ship channel.
- Fleet Command team channels keep the latest 50 messages per team channel.
- Fleet Command global channels keep the latest 100 messages per event.

When a channel exceeds its cap, the oldest messages should be deleted as new messages are added.

Fleet Command chat is event-scoped. When a Fleet Command event is closed and no members are active inside it, event chat history can be cleared.

## Activity Access Rules

All pillars must use one shared join-eligibility function so access rules behave consistently.

Join eligibility checks:

1. User is signed in.
2. Host has not blocked the user.
3. Discord is linked if the activity requires Discord.
4. RSI handle is verified if the activity requires RSI.
5. The user can join/apply, or the UI shows the missing account step.

Activity cards should show access requirements before the user tries to join.

Default access is open to any signed-in account, including a basic email-only account.

## Chat Visibility Rules

Fleet Command channel visibility:

- Fleet Chat is visible to every member inside the Fleet Command event.
- Team Chat is visible only to members assigned to that team.
- Ship Chat is visible only to members assigned to that ship.
- Direct and personal group chat are visible only to channel participants.

Example:

- A Team A member on Ship 1 sees Fleet Chat, Team A Chat, and Ship 1 Chat.
- A Team A member on Ship 2 sees Fleet Chat, Team A Chat, and Ship 2 Chat.
- A Team B member sees Fleet Chat, Team B Chat, and their assigned ship chat.
- Team A members do not see Team B Chat.
- Ship 1 members do not see Ship 2 Chat unless both ships share a team channel they are allowed to see.

The chat window should support:

- All available channels visible together.
- A focused modal or solo view for one channel.
- Later Fleet Admiral quick-command buttons and hotkeys.

## Integration With Existing Fleet Schema

The existing Fleet Command schema remains intact:

- `fleet_events`
- `members`
- `teams`
- `fleet_event_ship_requests`
- `fleet_event_positions`
- `assignments`
- `fleet_event_messages`
- `fleet_event_message_tags`
- `fleet_event_message_acknowledgements`

The new profile layer should connect to event member records instead of replacing them immediately. This lets the current Fleet Command prototype keep its event-specific member model while persistent user identity becomes available across sessions and pillars.

Future schema work can migrate or supplement `members` with profile-backed event membership once the auth layer is stable.

## Error Handling And Edge Cases

Signup:

- If terms or privacy consent is missing, signup is blocked.
- If email verification is pending, email/password login should explain the pending state.

Identity linking:

- If a Google or Discord identity is already linked to another profile, linking should fail with a clear message.
- If Discord linking is required for an activity, the UI should offer a `Link Discord` action.

RSI verification:

- Expired challenges should require a new token.
- Failed checks should keep the profile unverified and explain the next action.
- Verification checks should be rate-limited server-side.

Activity join:

- Ineligible users should see why they cannot join.
- Blocked users should not see direct host messaging paths.
- Activity access should be checked again server-side when accepting an invite or submitting a join request.

Notifications:

- Failed push delivery should not remove the notification.
- Disabled push subscriptions should stop future push attempts.
- Category preferences should be checked before sending push.

Chat:

- Sending a message should verify channel membership.
- Direct messages should verify neither side blocks the other in the relevant direction.
- Message caps should be enforced consistently after message creation.
- Event chat cleanup should only apply to closed and inactive events.

## Security And RLS

RLS should be enabled for all new tables.

Required access rules:

- Users can read and update their own profile fields.
- Users can read public profile modal fields for other profiles.
- Users can manage their own linked identity metadata only through trusted auth flows.
- Users can read and manage their own notification preferences.
- Users can read their own notifications.
- Users can mark their own notifications read, clicked, dismissed.
- Users can create and remove their own blocks.
- Blocked users cannot use direct-message insert paths toward the blocker.
- Activity join operations must run through server-side eligibility checks.
- Chat message reads must be limited by channel membership and event assignment visibility.
- Push subscription secrets are only readable by the owning profile and trusted server-side delivery code.

Service role credentials must never be exposed in the browser.

## Testing Plan

Database and RLS tests:

- Profile owner can update own profile.
- Profile owner cannot update another profile.
- Public profile modal fields are readable.
- Private push subscription fields are not broadly readable.
- Users can manage their own notification preferences.
- Users can read and update their own notification state.
- Users can create and remove their own blocks.

Join eligibility tests:

- Basic signed-in email account can join default open activity.
- Discord-required activity rejects a profile without Discord linked.
- RSI-required activity rejects a profile without verified RSI handle.
- Both-required activity rejects users missing either requirement.
- Blocked user cannot join an activity hosted by the blocker.

Chat tests:

- Direct chat blocks prevent blocked direct messages.
- Team A member cannot read Team B channel.
- Ship 1 member cannot read Ship 2 channel.
- Event member can read Fleet Chat.
- Team members on different ships can read the shared Team Chat.
- Message caps prune oldest messages at 100 for direct/group channels.
- Message caps prune oldest messages at 50 for team/ship channels.
- Fleet global channel prunes at 100 messages.

Notification tests:

- Activity invite creates in-app notification.
- Activity invite category applies to any pillar.
- Push delivery is skipped when push preference is disabled.
- Push delivery is skipped when no active subscription exists.
- Fleet Command notification category is separate from message notification category.

Build verification:

- Existing data tests still pass.
- Existing permission tests still pass.
- Frontend build still passes.

## Implementation Boundary

This spec does not implement the full friend/group social layer. It reserves profile-based hooks so the later system can add:

- Friend requests.
- Friend lists.
- Block-aware friend discovery.
- User-created groups.
- Group membership.
- Group invite targeting.
- Group chat UI.

This spec also does not define Fleet Admiral quick-command buttons or hotkeys. That should be a separate Fleet Command brainstorm focused on command message content and urgency.
