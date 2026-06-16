# SC Fleet Management Project Reset Brief

Date: 2026-05-20

## Purpose

Restart the MusterDeck web app around three connected but independently useful product pillars:

1. Rally Point: event discovery and LFG, inspired by CrewTerminal but not copied.
2. Fleet Command: fleet command and organization event management, evolved from the scfleets.space planning idea.
3. S.P.O.I.L.S.: post-event settlement, rewards, loot, and payout management.

The goal is one cohesive Star Citizen operations platform for large organizations, while still letting each pillar stand alone.

The selected public site/domain direction is `www.muster-deck.com`.

Project organization references:

- Current folder and archive rules live in `docs/handoff/2026-05-20-project-organization-guide.md`.
- Major decisions should be summarized in `docs/handoff/project-change-log.md`.

## Existing Project Baseline

The current repo is already a React/Vite/Supabase prototype.

Important local assets:

- Frontend prototype: `src/App.tsx`, `src/styles.css`
- Domain types and role permissions: `src/lib/types.ts`, `src/lib/permissions.ts`
- Fallback demo fleet data: `src/lib/fallbackData.ts`
- Supabase schema and migrations: `supabase/migrations/`
- Generated ship sync SQL: `supabase/generated/wiki-vehicles-sync/`
- Generated staffing templates: `supabase/generated/staffing-templates/`
- Position review workbook output: `outputs/position-review/`
- Project transition summary: `docs/handoff/2026-05-20-project-transition-summary.md`
- CrewTerminal notes: `docs/superpowers/specs/2026-05-19-crewterminal-discovery-notes.md`
- Future feature requests: `docs/superpowers/specs/2026-05-19-future-feature-requests.md`
- Spoils/rewards notes: `docs/superpowers/specs/2026-05-20-spoils-rewards-module-notes.md`

Current app state:

- The backend has strong early schema work for ship catalog, fleet events, teams, ship requests, assignments, roster locks, messages, and future mission phases.
- The frontend is still mostly local React state seeded from fallback data.
- Real authentication, profiles, event roles, write policies, and live Supabase event wiring are not done yet.
- Ship position templates still need human review through the workbook/Google Sheets workflow.

## Pillar 1: Rally Point

Locked name:

- Rally Point

Recommended product role:

This is the daily return surface: what can players join now, tonight, or this weekend?

Core behavior:

- Browse public, unlisted, private, and org-only operations.
- Filter by activity, star system, start time, language/region, risk, reward model, ship need, role need, verification requirement, and visibility.
- Join as a role, not just RSVP.
- Apply with a ship that matches requested fleet needs.
- Track joined operations, pending applications, accepted roles, offered ships, and past activity.
- Create a discovery listing from a Fleet Command event.

CrewTerminal inspiration to keep:

- Lightweight event discovery.
- Activity filters and starting-soon sorting.
- Role-based joining.
- Discord sign-on.
- Optional RSI handle verification.
- Per-listing chat or coordination.
- Calendar handoff.
- Public legal/trust surfaces and network stats.

Avoid:

- Copying CrewTerminal's visual language, wording, brand, or page structure.
- Making this only a public LFG board.
- Treating stated payout/reward promises as guaranteed.

Sources reviewed:

- https://crewterminal.io/
- https://crewterminal.io/discover
- https://crewterminal.io/stats
- https://crewterminal.io/legal/privacy
- https://crewterminal.io/legal/terms

## Pillar 2: Fleet Command

Locked name:

- Fleet Command

Recommended product role:

This is the main organization tool: plan, staff, run, and adapt large operations.

Core behavior:

- Create an operation.
- Select operation type/template: combat, mining, salvage, cargo, convoy, training, org meeting, mixed operation.
- Set objectives, rally point, voice/comms channel, start time, duration, visibility, and risk.
- Request exact ships, ship categories, or a mix.
- Define required and optional crew positions.
- Assign teams, ship captains, officers, embarked FPS teams, and support roles.
- Lock ship rosters without freezing crew movement.
- Send orders and status updates to individuals, teams, ships, officers, or the full event.
- Track phase/status changes such as forming, briefing, deployed, engaged, extracting, completed.

scfleets.space inspiration to keep:

- Fast code/link based fleet setup.
- Realtime ship and seat claiming.
- Card and compact table views.
- Sidebar roster and online/role visibility.
- No-friction participation for low-security events.

Where this app should go further:

- Persistent org accounts.
- Permission-scoped officer tools.
- Discord/RSI trust controls.
- Ship staffing templates.
- Event duplication/templates.
- Notifications.
- Post-event settlement handoff.

Source reviewed:

- https://scfleets.space/
- https://www.reddit.com/r/starcitizen/comments/1th5rip/no_social_tools_yet_so_here_is_a_simple_fleet/

## Pillar 3: S.P.O.I.L.S.

Locked name:

- S.P.O.I.L.S.

Acronym:

- Settlement
- Payouts
- Operations
- Inventory
- Loot
- Shares

Role title:

- Quartermaster: the leader or manager responsible for this section.

Recommended product role:

This is the fairness/accounting surface for loot, sale proceeds, mission rewards, and post-event payouts.

Core behavior:

- Work standalone or attach to a Fleet Command event.
- Pull participants from event attendance when attached.
- Add ship components, ship weapons, rare items, sale proceeds, mining/salvage/cargo totals, contraband proceeds, and manual aUEC values.
- Let crew submit proposed additions without directly altering the official list.
- Route submissions to owner/officer/quartermaster approval.
- Maintain shared default item/pricing catalog plus per-list value overrides.
- Allow reward requests for specific items.
- Track approval, denial, payout history, and item allocation history.
- Calculate payout splits with org-bank percentage, equal split, contribution weighting, role weighting, ship-owner bonus, or officer override.
- Lock/version finalized settlements.

Open pricing decision:

Recommended direction is both:

- Shared catalog for default item metadata and value estimates.
- Per-list overrides for subjective, special, or one-off leadership decisions.

## How The Pillars Interconnect

Shared foundation:

- Profiles
- Discord identities
- Optional RSI handle verification
- Organizations
- Event roles
- Permissions
- Notifications
- Audit/history
- Ship catalog
- Staffing templates

Rally Point to Fleet Command:

- A discovery listing can be created from a command event.
- Applicants from discovery become event members/applicants.
- Accepted applicants can claim roles, offer ships, and appear in command views.

Command to Settlement:

- Completed events can open a settlement.
- Event attendance feeds the participant list.
- Assignments provide role, ship, team, and contribution context.
- Event messages and notes can support after-action review.

Settlement back to Profiles:

- Payouts and item rewards add history to a profile.
- Leadership can see prior rewards before approving future allocations.
- Trust/reliability signals can reflect completed operations and settled participation.

Standalone behavior:

- Rally Point can host simple LFG events without deep fleet planning.
- Command can run private org operations without public discovery.
- Quartermaster can settle loot for events that happened outside the app.

## User Management And Trust

Recommended identity model:

- Email/password as the easiest baseline signup path.
- Discord SSO as a first-class login and linked identity option.
- Google SSO as a first-class login and linked identity option.
- Users who start with email/password should be able to link Discord and Google from account settings.
- Guest access allowed per event for low-security operations.
- Optional RSI handle verification for trust and role eligibility.
- Event settings decide which identity level is required.

Suggested account states:

- Guest
- Email/password account
- Discord authenticated
- Google authenticated
- Discord linked
- Google linked
- RSI handle submitted
- RSI verified
- Restricted
- Banned or blocked for a scope

Suggested permission scopes:

- Global/site permissions
- Organization permissions
- Event permissions
- Team/ship scoped permissions
- Quartermaster/settlement permissions

Important schema gap:

The database has event-specific `members.discord_id`, but it still needs persistent `profiles`, profile identity records, event roles, event permissions, access settings, invites, join codes, and moderation/audit tables.

## Footer And Fan-Project Disclaimer

Every public and signed-in page should include a compact footer area for trust, legal, and fan-project context.

Required footer links:

- Privacy Policy
- Terms of Service
- Discord or community support link, once available
- Network/status page, once available
- Optional Made by the Community badge if used under the relevant fan-kit rules

Required footer disclaimer:

MusterDeck is an independent fan-made tool for Star Citizen players and organizations. It is not affiliated with, endorsed by, sponsored by, or officially connected to Cloud Imperium Games, Roberts Space Industries, or their affiliates. Star Citizen and related names, marks, and assets belong to their respective owners.

Footer behavior:

- Keep the disclaimer small but readable.
- Show it on public pages, auth pages, event join pages, and authenticated app pages.
- Do not hide it only inside Terms or Privacy.
- Avoid implying official status through logos, wording, metadata, page titles, or social preview text.
- Keep legal links accessible without requiring login.

Legal pages should eventually cover:

- What profile, Discord, RSI handle, event, application, assignment, notification, and S.P.O.I.L.S. data is collected.
- How optional RSI verification works as a read-only check of a public RSI profile page.
- Account deletion and what happens to historical event records.
- Acceptable use, no impersonation, no abuse, no unauthorized automation, and organizer responsibility.
- In-game reward, payout, loot, attendance, and uptime disclaimers.

## Header Version Status

Every primary page should include a compact header status area that tells users what version and Star Citizen data patch they are using.

Header status fields:

- Rally Point version.
- Fleet Command version.
- S.P.O.I.L.S. version.
- Star Citizen patch/data version.
- Optional ship catalog sync timestamp.
- Optional item/loot catalog sync timestamp once S.P.O.I.L.S. has external data.

Current known data baseline:

- The existing ship sync notes and source system seed reference Star Citizen Wiki data aligned with patch `4.8.0-LIVE.11825000`.

Behavior:

- Keep this visible but compact.
- On mobile, collapse it into a status button or small popover.
- If a module uses stale data, show a clear stale/outdated state.
- The status page should eventually explain what each version means.

## Notifications

This should be designed as a first-class product system, especially for phone/tablet use during events.

Notification channels:

- In-app notification center.
- PWA/mobile push notifications.
- Event message feed.
- Optional Discord bridge later.
- Email only for low-frequency account/security events.

Notification targets:

- Individual player.
- Team.
- Ship.
- Role group.
- Officers/command.
- Entire event.

Core notification types:

- Role assignment.
- Team reassignment.
- Ship reassignment.
- Event phase/status change.
- Briefing updated.
- Applicant approved/denied.
- Ship offer accepted/denied.
- Roster locked/unlocked.
- Settlement created.
- Payout approved/finalized.

Data model implication:

Existing `fleet_event_messages`, tags, and acknowledgements are a good start, but push delivery needs subscriptions/devices, delivery logs, read/ack states, and user notification preferences.

## Visual Direction

The app should move away from fragile thin-line sci-fi UI.

Recommended direction:

- Robust tactical console.
- Dense but readable operational layout.
- Filled buttons and segmented controls.
- Strong active states.
- Touch-capable controls for tablet/phone use.
- 8px or smaller card radius.
- Fewer hairline borders as structure.
- More contrast blocks, inset panels, thicker dividers, and clear grouping.
- Compact typography that officers can scan quickly.

Suggested palette direction:

- Near-black graphite background.
- Charcoal/gunmetal panels.
- Hardened amber, steel blue, or signal green for primary actions.
- Muted red/orange for danger.
- Off-white text with clear secondary gray.

Avoid:

- Thin hologram-only styling.
- Purple-heavy or blue-purple gradients.
- Marketing-card layouts.
- Decorative orb/background effects.
- Oversized hero-page treatment for the actual app.

## Locked Naming

Platform:

- MusterDeck

Domain direction:

- `www.muster-deck.com`

Primary pillars:

- Rally Point
- Fleet Command
- S.P.O.I.L.S.

Operational role title:

- Quartermaster manages S.P.O.I.L.S.

## Questions To Answer Next

1. Should the product center on an organization dashboard first, or on the member-facing Rally Point board first?
2. Should RSI verification be required for officers and restricted events, or only available as a trust signal?
3. Should public event discovery include non-org community events, or only approved org-hosted listings?
4. For spoils/rewards, should the first build support equal split only, or equal split plus org-bank percentage and manual overrides?
5. Should Quartermaster be available to any event owner, or only to users with a special quartermaster/officer permission?
6. Should push notifications be implemented early as a PWA requirement, or after the core event flows are wired to Supabase?
7. Should the next UI pass redesign the whole shell, or first redesign one key screen as a visual direction test?
8. Should event duplication/templates come before public discovery, so officers can rapidly repeat weekly operations?
9. When importing the ship position workbook to Google Sheets, should `Quantity Detail` stay visible or be hidden until needed?

## Recommended Next Work Order

1. Import `outputs/position-review/star-citizen-ship-position-review-one-line-preserved.xlsx` into Google Sheets for live ship staffing review.
2. Approve the product architecture direction: recommended default is an Operations Hub with Rally Point, Fleet Command, and S.P.O.I.L.S. sharing one identity/permission layer.
3. Create a formal design spec for profiles/auth/access control, because it unlocks all three pillars.
4. Create a focused visual redesign mockup for one screen before rewriting the whole UI.
5. Wire the current frontend to Supabase event/read models after the permission model is agreed.

## Verification Notes

An attempt to start the local Vite dev server and build the project during this reset hung before Vite reported a ready URL or build output. No frontend code was changed in this brief. This should be checked separately before the next implementation session.
