# Crew Terminal Discovery Notes

Date: 2026-05-19

Source reviewed: https://crewterminal.io/discover

## Purpose

Crew Terminal is a public Star Citizen crew-finding app. It is narrower than our Fleet Manager, but it handles several product surfaces well: public discovery, account-backed posting, Discord sign-in, network statistics, legal pages, and fan-project disclaimers.

The useful idea is not to copy Crew Terminal. The useful idea is to fold its lightweight recruiting and account persistence model into our stronger fleet planning model.

## Observed Product Model

Crew Terminal exposes public crew listings with filters for:

- Activity class: mining, bounty hunting, exploration, logistics, security escort, salvage, mercenary, and piracy.
- Star system: Stanton, Pyro, and Nyx.
- Sort timing: latest, starting soon, and starting later.

The listing page was empty during review, but the empty state pushes users toward creating the first broadcast. Posting a listing and viewing personal activity both require authentication.

For our app, the equivalent should be event discovery and fleet signup:

- Public event page for a fleet operation.
- Filters by operation type, star system, start window, ship need, crew role need, and organization visibility.
- Empty states that push organizers toward creating a fleet request.
- Authenticated personal activity: events joined, ship offers made, crew slots claimed, and pending organizer decisions.

## Authentication And Persistence

Crew Terminal supports email/password login and signup, plus Discord social login. Its client bundle indicates it uses Better Auth on a Next.js app:

- Email login calls `signIn.email`.
- Email signup calls `signUp.email`.
- Discord login/signup calls `signIn.social` with provider `discord`.
- Login respects a `redirect` query parameter.
- Signup redirects Discord users to `/discover`.
- Email signup includes a verification-pending state.

Our app already uses Supabase, so the recommended implementation is Supabase Auth with Discord OAuth rather than adopting Better Auth.

Supabase's current JavaScript docs show Discord OAuth through:

```ts
await supabase.auth.signInWithOAuth({
  provider: 'discord',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

Implementation requirements for our app:

- Enable Discord as a Supabase Auth provider.
- Add `/auth/callback` and production/staging URLs to the Supabase redirect allow list.
- Store Supabase user IDs in member/profile tables.
- Store Discord account metadata separately from event-specific membership.
- Preserve a returning user's progress: joined fleet events, ship offers, position claims, team assignments, and organizer-owned events.
- Keep invite-link access for unauthenticated viewers, but require sign-in before persistent claims or organizer actions.

## RSI Handle Verification

Crew Terminal's public privacy page confirms an optional RSI handle verification flow. The visible legal text says the server fetches the public Roberts Space Industries citizen profile page and checks for a verification token. It also states that no data is sent to RSI; the request is a read-only fetch of a public page.

The authenticated profile UI is not publicly visible, so exact UI details were not confirmed. The product pattern is still clear and worth adopting:

- User enters an RSI handle in their profile.
- App generates a short-lived verification token or phrase.
- User places that token somewhere visible on their public RSI citizen profile.
- Server fetches the public RSI profile page and confirms the token is present.
- App stores `rsi_handle`, `rsi_verified_at`, and verification status.
- App lets verified handles display a trust badge on fleet signups, organizer screens, and member profiles.

Recommended constraints for our app:

- Verification must run server-side only, through a Supabase Edge Function or trusted backend job.
- Store only the handle, verification status, timestamps, and audit metadata; do not store full scraped RSI profile HTML unless there is a clear abuse-review need.
- Make verification optional. Discord SSO proves account continuity; RSI verification proves in-game identity ownership.
- Add retry/rate-limit protection so users cannot hammer RSI profile pages.
- Treat failed verification as non-destructive. Users should be able to update the handle, regenerate a token, and try again.

## Legal And Trust Surfaces

Crew Terminal includes legal and trust links in its persistent footer/navigation:

- Network Stats.
- Discord community link.
- Privacy Policy.
- Terms of Service.
- Fan-project disclaimer.
- Made-by-community badge.

Observed disclaimer pattern:

> Not affiliated with Cloud Imperium Games or Roberts Space Industries.

Their terms page repeats the fan-project status and adds that Star Citizen is a Cloud Imperium Games trademark.

Our app should add the same class of surfaces:

- `/stats`: fleet app network status and aggregate usage.
- `/legal/privacy`: data collected, why it is collected, retention, third parties, account deletion, and contact path.
- `/legal/terms`: acceptable use, account responsibility, in-game transaction disclaimer, uptime/data disclaimer, and terms update policy.
- Footer disclaimer on public and authenticated pages.
- Discord/community link if we operate a support server.

## Privacy Policy Content To Cover

Crew Terminal's privacy page is practical and scoped to app operation. It lists callsign/display name, email, optional RSI handle, listings, applications, and session data.

For our app, privacy coverage should include:

- Display name/callsign.
- Email address if email auth is enabled.
- Discord user ID, username, avatar, and OAuth provider metadata when Discord SSO is used.
- Optional RSI handle, verification status, verification timestamps, and token-check metadata.
- Fleet events created by the user.
- Ship offers, crew position claims, team assignments, and notes.
- Session/auth records managed by Supabase.
- Source sync data for public ship catalogs, separated from personal data.
- Account deletion behavior, including what happens to historical fleet events and anonymized assignments.

## Terms Content To Cover

Crew Terminal's terms include acceptable-use rules, account responsibility, and disclaimers for in-game payouts and uptime.

For our app, terms should cover:

- No spam, duplicate, misleading, abusive, or unauthorized automation behavior.
- No impersonation of other players or organizations.
- Organizers are responsible for event accuracy.
- In-game UEC, rewards, logistics plans, and attendance are not guaranteed by the app.
- The app is provided without uptime or data-availability guarantees.
- Account suspension/removal rights for abuse.
- Fan-project and trademark disclaimer.

## Network Status

Crew Terminal exposes aggregate stats such as registered pilots, launched missions, completed missions, crew placements, total contracted UEC, active operations, and success rate.

For our Fleet Manager, network status should be operational rather than vanity-only:

- Public uptime/status badge for catalog sync and backend availability.
- Aggregate counts: registered users, active operations, completed operations, ship slots requested, positions filled, pending ship suggestions.
- Current data version: Star Citizen patch, last Wiki sync, last UEX enrichment sync.
- Optional org/private stats only visible to signed-in admins.

## Feature Fold-In Recommendation

Recommended direction: integrate a "crew terminal" layer into Fleet Manager rather than building a separate app.

The Fleet Manager remains the source of truth for:

- Ship catalog.
- Fleet event ship requests.
- Staffing profiles.
- Position templates.
- Teams and embarked groups.
- Roster locks and substitutions.

The Crew Terminal-inspired layer adds:

- Public discovery.
- Auth-backed personal activity.
- Discord SSO.
- Optional RSI handle verification.
- Legal/trust pages.
- Network stats.
- Operation filters and empty states.

## Data Model Additions To Consider

The current backend design already has `members.discord_id`, invite-code access, fleet events, ship offers, and assignments. To support the Crew Terminal-style behavior cleanly, add or confirm these concepts:

- `profiles`: one row per authenticated Supabase user.
- `profile_id` on event-specific members.
- Discord provider fields on profile metadata or a linked identities table.
- RSI handle fields on profiles: handle, verification status, verified timestamp, token hash or active challenge metadata.
- Event visibility: private invite, unlisted link, public discovery.
- Operation classification: activity class, star system, start time, status, and organizer.
- Personal activity query/read model for returning users.
- Legal document version tracking if users must accept terms.

## Open Questions

- Should public discovery be available to everyone, or only to organization members?
- Should Discord SSO be the primary sign-in path, with email/password as a fallback, or Discord-only for the first release?
- Where should verified RSI identity be required: organizer accounts only, all persistent signups, or optional for everyone?
- Should network stats be global across the app, per organization, or both?
- Do we want public crew listings independent of fleet events, or should every listing map to a Fleet Manager event?

## Sources

- Crew Terminal Discover: https://crewterminal.io/discover
- Crew Terminal Login: https://crewterminal.io/login
- Crew Terminal Signup: https://crewterminal.io/signup
- Crew Terminal Network Stats: https://crewterminal.io/stats
- Crew Terminal Privacy Policy: https://crewterminal.io/legal/privacy
- Crew Terminal Terms of Service: https://crewterminal.io/legal/terms
- Supabase Discord OAuth docs: https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/auth/social-login/auth-discord.mdx
