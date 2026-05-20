# Future Feature Requests

Date: 2026-05-19

## Goal

Fold a Crew Terminal-style looking-for-group layer into the Star Citizen Fleet Manager so organizers can publish operations, recruit pilots and crew, protect private fleet activity, verify player identity, and preserve each member's progress across sessions.

This should become one app, not two disconnected tools. Fleet Manager handles composition, ship requests, staffing, teams, assignments, and roster locks. Crew Terminal-style features handle discovery, invitation, authentication, identity trust, and player safety.

## Crew Terminal Module

Add a public/private operation discovery layer modeled after Crew Terminal.

Core requests:

- Browse available operations.
- Filter by activity type, star system, start time, ship need, crew role need, verification requirement, and visibility.
- Create an operation listing from a Fleet Manager event.
- Invite people into an operation from the looking-for-group interface.
- Let returning users view their joined operations, ship offers, position claims, team assignments, and pending approvals.
- Keep the legal/trust surfaces visible: network status, privacy policy, terms of service, Discord/community link, and CIG/RSI fan-project disclaimer.

## Sharing And Joining

Each fleet event should support multiple join methods:

- Copyable share link.
- Discord-friendly share action or message template.
- Short 8-digit unique join code.
- Direct invite from the Crew Terminal-style operation listing.

Join links and codes should route to the same event gate, where the app can enforce the event's access rules.

Desired behavior:

- Organizer creates a fleet event.
- App generates a unique URL and an 8-digit join code.
- Organizer can copy either the URL, the code, or a Discord-formatted invite message.
- Invited users land on the event join page.
- Users authenticate or continue as guests depending on event permissions.
- If a password is required, the join page asks for it before revealing private operation details.

## Saved Operations And Duplication

Signed-in users should have a menu area for their own fleet composition events and activities.

This should not expose every event in the system. A user should see:

- Events they created.
- Events they are assigned to manage.
- Events where they have organizer, fleet commander, officer, or other granted management permissions.
- Their own joined activity history in a lower-permission view.

Management actions:

- View previous fleet compositions and activities.
- Delete events they own or are permitted to delete.
- Modify upcoming or reusable events.
- Rerun a prior event.
- Duplicate and modify a prior event.

Duplicate-and-modify should ask what to copy instead of blindly cloning everything.

Copy options:

- Event title, description, activity type, star system, start/duration settings.
- Visibility, password/access settings, and join approval settings.
- Ship roster requests.
- Exact ship requirements.
- Staffing profile selections.
- Custom event-level crew positions.
- Teams.
- Team-to-ship embark assignments.
- Leadership/officer assignments.
- Ship captain assignments.
- Crew member assignments.
- Member ship offers.
- Notes and briefing content.
- Roster lock settings.

Recommended default:

- Copy event structure, ship requests, staffing profiles, teams, and briefing notes.
- Do not copy ordinary crew member assignments by default.
- Do not copy guest members by default.
- Do not copy passwords directly; require the organizer to set a new password or explicitly keep access settings with a fresh secret.
- Do not copy reports, moderation actions, audit logs, or old join applications.

The duplication UI should show a checklist grouped by event setup, fleet composition, teams, people, access, and notes. After duplication, the new event should open in edit mode before it is published.

## Event Access Protection

Fleet leaders need control over who can enter an activity.

Per-event access settings should include:

- Public discovery.
- Unlisted link/code access.
- Private invite-only access.
- Password-protected access.
- Discord login required.
- Guest access allowed or blocked.
- RSI-verified handle required or optional.
- Manual approval required before a user can claim positions or submit ships.

Password-protected events should store only a secure password hash, never the plain password.

## Authentication

Discord login should become the primary persistent identity path.

Requirements:

- Users can sign in with Discord.
- User progress persists across sessions.
- A Discord account maps to one app profile.
- Profiles can be tied to event-specific member records.
- Event organizers can require Discord authentication before joining, claiming crew positions, or offering ships.

Guest access should be explicitly limited:

- Guest users can be allowed for low-security events.
- Guest users should not have broad permissions.
- Guest users should be easy for organizers to approve, restrict, or remove.
- Guest activity should not overwrite a verified user's persistent profile.

## RSI Handle Verification

Add optional Star Citizen/RSI handle verification.

The preferred model:

- User enters an RSI handle.
- App generates a short-lived verification token.
- User places the token on their public RSI citizen profile.
- Backend checks the public RSI profile page for that token.
- App marks the RSI handle as verified once confirmed.

Verification should support event-level policies:

- Not required.
- Required to join.
- Required to claim sensitive roles.
- Required for leadership/officer permissions.
- Required for public operation listings.

This gives organizers a better way to reduce impersonation and espionage risk without making every casual signup impossible.

## Leadership And Permissions

The app needs both global and per-event permissions.

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

Permission examples:

- Fleet admiral can create events, edit fleet composition, lock rosters, assign officers, and remove users.
- Officers can manage assigned teams, approve applicants, resolve ship suggestions, and move crew within their scope.
- Team leads can manage their team assignments.
- Ship captains can manage crew positions on their assigned ship if allowed by event settings.
- Crew members can claim available roles, offer ships, and update their own availability.
- Guests can only do what the event explicitly allows.

Permissions should be event-scoped by default, with global roles reserved for trusted site or organization leadership.

## Player Reporting And Moderation

Add a reporting and moderation system for abusive users, suspected bad-faith participation, known hostile actors, cheating accusations, piracy risk, or espionage concerns.

Because public accusations can be sensitive, moderation should distinguish between private admin records and public-visible status.

Reporting flow:

- Any authenticated user can report another profile.
- Reports require a reason, category, description, and optional evidence links or screenshots.
- Reports are visible to site admins and authorized organization leadership.
- Reports have statuses: submitted, under review, actioned, dismissed, duplicate.
- Reported users are not automatically publicly labeled.

Moderation actions:

- Warning.
- Event removal.
- Temporary event ban.
- Organization ban.
- Site-wide ban.
- Require manual approval for future joins.
- Require Discord login.
- Require verified RSI handle.
- Mark account as restricted.

Admin capabilities:

- Review reports.
- Add internal notes.
- Link reports to profiles, Discord IDs, RSI handles, and event IDs.
- Ban or restrict users.
- Unban users.
- View audit history for moderation decisions.

Public visibility should be conservative:

- Other users can see that an account is banned, restricted, or not eligible for a specific event if needed.
- Accusation categories such as espionage, cheating, or abusive behavior should remain admin-only unless reviewed and intentionally published under clear site policy.
- The app should avoid irreversible public labels based only on unreviewed reports.

## Trust And Safety Signals

Profiles and event applications should show useful trust signals:

- Discord authenticated.
- RSI handle verified.
- Member since date.
- Joined/completed operation count.
- Organizer/officer endorsement if added later.
- Restricted or banned status where relevant.
- Manual approval required.

These signals should help organizers decide who can enter sensitive operations without turning the app into an uncontrolled public accusation board.

## Legal And Policy Requirements

The app should include:

- Privacy policy.
- Terms of service.
- Community/moderation policy.
- Fan-project disclaimer.
- Data deletion/account deletion flow.
- Clear explanation of Discord and RSI handle data usage.
- Clear explanation that RSI verification reads public profile pages and is not affiliated with CIG or RSI.

Required footer/disclaimer language should include:

> Not affiliated with Cloud Imperium Games or Roberts Space Industries. Star Citizen is a trademark of Cloud Imperium Games.

## Data Model Concepts

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

These should connect to the existing fleet event, ship request, member, team, assignment, and ship offer tables.

## Open Product Questions

- Should Discord login be mandatory for all persistent accounts, or should email/password remain available?
- Should guests be allowed only for private events, only for public events, or controlled per event?
- Should RSI verification be mandatory for officers and organizers?
- Should bans be global across the whole app, scoped by organization, scoped by event, or all three?
- Should public operation listings expose full fleet composition before a user is approved?
- Should 8-digit join codes be numeric only, alphanumeric, or human-friendly grouped text?
- Should Discord sharing be a copyable message template first, with deeper Discord integration later?
- Should duplicated events be created as drafts every time, or should organizers be allowed to duplicate directly into published/unlisted status?
- Which items should be selected by default when duplicating: structure only, structure plus teams, or structure plus leadership?
