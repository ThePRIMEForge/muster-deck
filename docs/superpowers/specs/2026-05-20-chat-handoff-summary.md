# Chat Handoff Summary

Date: 2026-05-20

## Purpose

This note closes out the current planning chat before moving the Star Citizen Fleet App folder from OneDrive to Google Drive. It records the decisions made, documents created, and next work to resume on another computer.

## Workspace Context

Current folder during this session:

`/Users/christophmayer/Library/CloudStorage/OneDrive-Personal/CIG Fleet App`

The user plans to move the working folder to Google Drive for cross-computer work. After moving, reopen the new Google Drive folder and verify the project still builds from that location.

## Work Completed In This Chat

Created and updated these planning documents:

- `docs/superpowers/specs/2026-05-19-crewterminal-discovery-notes.md`
- `docs/superpowers/specs/2026-05-19-future-feature-requests.md`
- `docs/superpowers/specs/2026-05-20-chat-handoff-summary.md`

Reviewed Crew Terminal at:

- https://crewterminal.io/discover
- https://crewterminal.io/login
- https://crewterminal.io/signup
- https://crewterminal.io/stats
- https://crewterminal.io/legal/privacy
- https://crewterminal.io/legal/terms

Also checked current Supabase documentation for Discord OAuth.

## Key Decisions

Crew Terminal should be folded into the Fleet Manager as one app, not built as a separate product.

Fleet Manager remains the source of truth for:

- Ship catalog.
- Fleet event ship requests.
- Staffing profiles.
- Position templates.
- Teams and embarked groups.
- Roster locks and substitutions.
- Fleet composition and assignment planning.

Crew Terminal-style features should add:

- Public/private operation discovery.
- Looking-for-group listings.
- Invite and join flows.
- Authenticated personal activity history.
- Discord SSO.
- Optional RSI handle verification.
- Network status/statistics.
- Privacy policy, terms of service, community/moderation policy, and CIG/RSI fan-project disclaimer.

## Feature Requests Captured

### Crew Terminal Module

Add a discovery layer where users can browse and join operations. Filters should include activity type, star system, start time, ship need, crew role need, verification requirement, and visibility.

Operation listings should be created from Fleet Manager events, so the looking-for-group layer feeds the same fleet composition data instead of duplicating it.

### Sharing And Joining

Each event should support:

- Copyable event URL.
- Discord-friendly invite message or share action.
- Short 8-digit unique join code.
- Direct invite from the Crew Terminal-style app.

All join paths should lead through the same event gate so event access rules are enforced consistently.

### Event Access Protection

Per-event access settings should include:

- Public discovery.
- Unlisted link/code access.
- Private invite-only access.
- Password-protected access.
- Discord login required.
- Guest access allowed or blocked.
- RSI-verified handle required or optional.
- Manual approval before claiming roles or submitting ships.

Event passwords must be stored as hashes, never plain text.

### Discord Login

Discord login should become the primary persistent identity path.

The implementation should use Supabase Auth with Discord OAuth because the current app already uses Supabase. Crew Terminal appears to use Better Auth, but we should copy the product behavior, not their stack.

Discord login should allow users to return later and see their progress, joined operations, ship offers, claimed positions, team assignments, and owned/managed events.

### Guest Access

Guest access should be explicitly controlled per event.

Guests can support low-security events, but they should have limited permissions and should not overwrite or replace verified profile records.

### RSI Handle Verification

Add optional Star Citizen/RSI handle verification.

Preferred flow:

- User enters RSI handle.
- App generates a short-lived verification token.
- User places the token somewhere visible on their public RSI citizen profile.
- Backend checks the public RSI profile page for the token.
- App stores verification status and timestamp.

Discord proves account continuity. RSI verification proves in-game identity ownership.

Verification should run server-side only, ideally via Supabase Edge Function or trusted backend job, with rate limits and no unnecessary storage of scraped RSI profile HTML.

### Leadership And Permissions

The app needs global and per-event permissions.

Global roles:

- Site admin.
- Organization admin.
- Fleet admiral.
- Officer.
- Member.
- Guest.

Per-event roles:

- Event owner.
- Fleet commander.
- Officer.
- Team lead.
- Ship captain.
- Crew member.
- Applicant/viewer.

Permissions should be event-scoped by default. Global roles are for trusted site or organization leadership.

### Saved Operations And Duplication

Signed-in users should have a menu for their own fleet composition events and activities.

Users should see:

- Events they created.
- Events they are assigned to manage.
- Events where they have granted management permissions.
- Their own joined activity history in a lower-permission view.

Management actions:

- View previous fleet compositions and activities.
- Delete owned or permitted events.
- Modify upcoming/reusable events.
- Rerun prior events.
- Duplicate and modify prior events.

Duplication should be selective. The organizer should choose what to copy:

- Event details.
- Visibility/access settings.
- Ship roster requests.
- Exact ship requirements.
- Staffing profiles.
- Custom crew positions.
- Teams.
- Team-to-ship embark assignments.
- Leadership/officer assignments.
- Ship captain assignments.
- Crew assignments.
- Member ship offers.
- Notes and briefing content.
- Roster lock settings.

Default copy behavior should include event structure, ship requests, staffing profiles, teams, and briefing notes. It should not copy ordinary crew assignments, guest members, old passwords, reports, moderation actions, audit logs, or old join applications by default.

New duplicates should open in edit mode before publishing.

### Reporting And Moderation

Add player reporting and admin moderation.

Reporting should support abuse, bad-faith participation, hostile actors, cheating accusations, piracy risk, and espionage concerns. Because these claims can be sensitive, unreviewed reports should remain private to admins and authorized leadership.

Reports should require reason, category, description, and optional evidence links/screenshots.

Report statuses:

- Submitted.
- Under review.
- Actioned.
- Dismissed.
- Duplicate.

Moderation actions:

- Warning.
- Event removal.
- Temporary event ban.
- Organization ban.
- Site-wide ban.
- Require manual approval.
- Require Discord login.
- Require verified RSI handle.
- Mark account as restricted.

Site admins should be able to review reports, add internal notes, link reports to profiles/Discord IDs/RSI handles/events, ban or unban users, and view audit history.

Public labels should be conservative. Users can see that an account is banned or restricted where relevant, but accusations such as espionage, cheating, or abuse should not be publicly displayed unless reviewed and intentionally published under a clear policy.

### Legal And Trust Surfaces

The app should include:

- Privacy policy.
- Terms of service.
- Community/moderation policy.
- Network status/statistics page.
- Discord/community link.
- Data deletion/account deletion flow.
- Fan-project disclaimer.

Required disclaimer direction:

> Not affiliated with Cloud Imperium Games or Roberts Space Industries. Star Citizen is a trademark of Cloud Imperium Games.

## Existing Related Project Docs

Earlier project docs already exist and should remain part of the working context:

- `docs/superpowers/specs/2026-05-19-backend-data-model-design.md`
- `docs/superpowers/plans/2026-05-19-backend-data-model-implementation.md`
- `docs/superpowers/specs/2026-05-19-ship-sync-notes.md`

The backend data model already includes fleet events, members, Discord ID field, ship offers, teams, assignments, roster locks, and future phase tables. The new future-feature work should extend that design rather than replace it.

## Data Model Concepts To Add Later

Future schema work should consider:

- `profiles`
- `profile_identities`
- `rsi_verification_challenges`
- `event_access_settings`
- `event_invites`
- `event_join_codes`
- `event_passwords`
- `event_templates`
- `event_clone_jobs`
- `event_members`
- `event_roles`
- `event_permissions`
- `reports`
- `report_evidence`
- `moderation_actions`
- `profile_restrictions`
- `audit_log`

These should connect to existing fleet events, ship requests, members, teams, assignments, and ship offers.

## Open Product Questions

- Should Discord login be mandatory for all persistent accounts, or should email/password remain available?
- Should guest access be allowed only for low-security/private events, or controlled per event for all event types?
- Should RSI verification be mandatory for organizers and officers?
- Should bans be global, organization-scoped, event-scoped, or support all three?
- Should public operation listings expose full fleet composition before a user is approved?
- Should 8-digit join codes be numeric only, alphanumeric, or human-friendly grouped text?
- Should Discord sharing start as a copyable message template, with deeper Discord integration later?
- Should duplicated events always start as drafts?
- Which duplication options should be selected by default: structure only, structure plus teams, or structure plus leadership?

## Current Workspace State Notes

At closeout, the workspace had untracked files, including:

- `docs/superpowers/specs/2026-05-19-crewterminal-discovery-notes.md`
- `docs/superpowers/specs/2026-05-19-future-feature-requests.md`
- `docs/superpowers/specs/2026-05-20-chat-handoff-summary.md`
- Fan kit asset folders.
- `outputs/`

Before moving or committing, review what should be kept in source control. The new planning docs should be kept. Large fan kit assets may need special handling depending on repository size and sync behavior.

## Suggested Resume Steps After Move

1. Open the project from the new Google Drive path.
2. Check the working tree and confirm the planning docs moved with the folder.
3. Install dependencies if needed.
4. Run the app build/test commands from `package.json`.
5. Decide whether to commit the new planning docs before continuing implementation.
6. Convert the future feature requests into a proper implementation design and plan, starting with identity/profile/event access foundations.

