# MusterDeck Start Here Next Chat

Date: 2026-05-20
Workspace: `/Users/christophmayer/Library/CloudStorage/GoogleDrive-prime.official.010@gmail.com/My Drive/SCFleet App`

## Why This File Exists

This is the clean restart point for the next chat. It consolidates the older transition notes, product reset brief, CrewTerminal research, S.P.O.I.L.S. notes, visual asset work, icon decisions, and current repo state so the next session does not need to re-read every prior chat.

Read this first tomorrow, then use the linked docs only when deeper detail is needed.

## Locked Product Direction

MusterDeck is a Star Citizen operations platform for players and larger organizations.

It has four connected but independently useful pillars:

- Rally Point: public/private LFG, event discovery, applications, ship offers, and role-based joining.
- Fleet Command: operation planning, ship requests, staffing, teams, assignments, live command, and officer tools.
- S.P.O.I.L.S.: Settlement, Payouts, Operations, Inventory, Loot, and Shares.
- Proving Ground: tournament signup, brackets, waves, standings, score reporting, and competitive event administration.

The S.P.O.I.L.S. manager role is Quartermaster.

The current domain direction is `www.muster-deck.com`.

The recommended architecture remains one shared identity, profile, permission, notification, and catalog foundation feeding all four pillars.

## Current Repo Baseline

The app is already a React/Vite/Supabase prototype.

Important app files:

- `src/App.tsx`
- `src/styles.css`
- `src/lib/types.ts`
- `src/lib/permissions.ts`
- `src/lib/fallbackData.ts`
- `src/lib/supabase.ts`
- `src/lib/fanKitAssets.ts`

Important backend folders:

- `supabase/migrations/`
- `supabase/generated/wiki-vehicles-sync/`
- `supabase/generated/staffing-templates/`
- `supabase/tests/`
- `supabase/verification/`

The frontend still mostly uses local/fallback state. Real authentication, persistent profiles, write policies, and live Supabase event wiring are not complete.

## Work Already Completed

Backend and data model:

- Supabase schema exists for source systems, ship catalog, ship media, categories/subcategories, staffing profiles, fleet events, teams, members, ship requests, positions, signups, roster locks, helper functions, read models, event messages, message tags, and acknowledgements.
- RLS is enabled and the schema includes protection for future public tables.
- Star Citizen Wiki is the primary ship data source. UEX is secondary enrichment only.
- Existing ship data baseline references Star Citizen patch `4.8.0-LIVE.11825000`.
- Human-reviewed staffing templates remain required before ship crew numbers are final.

Frontend prototype:

- Role-aware Fleet Setup, Operation View, and Crew View exist.
- Temporary `Viewing As` selector exists for permission testing.
- Fleet setup can add exact ships or ship/category requests.
- Crew rail, team filters, role invitations, assignment-change modal, and message history panel exist.
- Production app visual style is still older prototype styling and has not yet adopted the final MusterDeck industrial direction.

Position review outputs:

- Spreadsheet outputs are in `outputs/position-review/`.
- Best file for Google Sheets import: `outputs/position-review/star-citizen-ship-position-review-one-line-preserved.xlsx`.
- The next working session is expected to import this into Google Sheets and review ship staffing counts together.

## Major Product Decisions

Shared foundation should come first:

- Landing page.
- Signup/login.
- Account/profile settings.
- Admin portal foundation.
- Footer/legal/disclaimer.
- Logged-in pillar hub.
- Notification center.
- Header version/status strip.

Authentication model:

- Email/password should be available as the easiest baseline signup.
- Discord SSO should be first-class.
- Google SSO should be first-class.
- Users who start with email/password should be able to link Discord and Google later from account settings.
- One MusterDeck profile should survive across linked identities.
- Guest access should be allowed only when the event host permits it.

Trust model:

- Discord linked status is an account-continuity trust signal.
- RSI handle verification is optional but important for restricted events and leadership controls.
- Event creators can require Discord linked, RSI verified, both, or neither.
- Sensitive abuse/espionage reports should remain admin/private unless reviewed under a clear policy.

Footer and legal:

- Every public and authenticated page needs a compact fan-project disclaimer area.
- Required disclaimer:

MusterDeck is an independent fan-made tool for Star Citizen players and organizations. It is not affiliated with, endorsed by, sponsored by, or officially connected to Cloud Imperium Games, Roberts Space Industries, or their affiliates. Star Citizen and related names, marks, and assets belong to their respective owners.

Header/version strip:

- Show Rally Point version.
- Show Fleet Command version.
- Show S.P.O.I.L.S. version.
- Show Proving Ground version.
- Show Star Citizen patch/data version.
- Later, show ship catalog sync timestamp and S.P.O.I.L.S. item/catalog sync timestamp.

Notifications:

- Treat notifications as a first-class product system for phone/tablet use during live events.
- Targets: individual, team, ship, role group, officers/command, entire event.
- Channels: in-app notification center, PWA/mobile push, event message feed, optional Discord bridge later, email only for account/security events.
- Tournament prize claim and fulfillment notifications should be added when Proving Ground connects to S.P.O.I.L.S.

## Pillar Notes

### Rally Point

Purpose: daily return surface for finding or publishing operations.

Keep from CrewTerminal:

- Browse listings.
- Filter by activity, system, start time, role need, ship need, verification requirement, and visibility.
- Account-backed posting and personal activity.
- Discord sign-on.
- Optional RSI handle verification.
- Network/legal/trust surfaces.

Do not copy CrewTerminal wording, visual language, brand, or page structure.

Initial listing fields should include title, activity type, mission group/reference, system, location, start time, duration, region/time zone, language, risk, reward model, visibility, identity requirements, manual approval, comms, briefing, required ships, requested roles, crew cap, applicants, accepted roster, calendar export, share link, and join code.

### Fleet Command

Purpose: primary organization tool for planning and running operations.

Core direction:

- Create and duplicate operations.
- Use event templates.
- Request exact ships, ship categories, or a mix.
- Define required and optional crew positions.
- Assign teams, ship captains, officers, embarked FPS teams, and support roles.
- Lock ship rosters without freezing crew movement.
- Send orders/status updates to people, teams, ships, officers, or everyone.
- Track operation status/phase changes.

Current next needs:

- Wire fleet events to Supabase.
- Replace local fallback role selector with real current user.
- Add access settings, join links, join codes, applicant approval, officer workflows, event duplication, templates, and S.P.O.I.L.S. handoff.

### S.P.O.I.L.S.

Purpose: fairness/accounting surface for loot, sale proceeds, mission rewards, and payouts.

Initial scope:

- Mineables.
- Ship components.
- Ship weapons.
- Specialty items.
- Valakar/Yormandi-style harvestables and rewards.
- Metals and pristine metals.
- Wicklow favors and similar special reward items.
- Sale proceeds from mining, salvage, cargo, contraband, or mixed activity.
- Tournament winnings from Proving Ground, including cash prizes, physical prizes, in-game items, hangar equipment, and hangar ships as organizer-managed award records.

Out of initial scope:

- FPS weapons.
- FPS armor.
- Full general inventory tracking.

Core flows:

- Create standalone or from a Fleet Command event.
- Pull event participants.
- Add org bank as a virtual participant.
- Add items, quantities, estimated values, sale values, notes, contributor/source, and approval status.
- Crew can submit items for Quartermaster approval.
- Crew can request specific items.
- Quartermaster can approve item rewards and payout shares.
- Support equal split, org-bank reserve, percent adjustments, fixed aUEC overrides, preview, finalize, lock/version, and payout history.
- Support tournament prize settlements with placement-based awards, custom awards, claim status, and fulfillment status.

Open pricing direction:

- Use both a shared default catalog and per-list overrides.

### Proving Ground

Purpose: tournament and competitive event management for Discord-hosted, in-person, hybrid, and community events.

Initial scope:

- Tournament signup page.
- Individual and team registration.
- Team sizes: 1v1, 2v2, 3v3, 4v4, 5v5, and custom.
- Formats: single elimination, double elimination, round robin, Swiss, leaderboard, and later two-stage group-to-finals.
- Admin score desk for reporting, confirming, correcting, and disputing scores.
- Match waves for scheduling groups of matches.
- Random, manual, and seeded pairings.
- Optional losers bracket through double elimination.
- Standings and tie-break rules.
- Discord and physical venue fields.

Current design spec:

- `docs/superpowers/specs/2026-05-21-musterdeck-tournament-pillar-design.md`

Recommended naming direction:

- Use `Proving Ground` unless a later review chooses a stronger fourth-pillar name.

## Visual Direction

Current direction: rugged industrial tactical console.

Use:

- Dark graphite and charcoal base.
- Mustard hazard yellow as the signature color.
- Olive drab and rust/orange as supporting colors.
- Worn paint, scratched metal, caution striping, stenciled labels, analog buttons, physical panels, bolts, and greeble.
- Thick, touch-capable controls.
- Dense but readable layouts.

Avoid:

- Thin hologram-only UI.
- Purple/blue gradient sci-fi.
- Generic AI dashboard panels.
- Decorative orbs/blobs.
- Full-page generated image backgrounds.
- Baked-in button text in images.

Font direction:

- Capture it for rugged display/stencil text.
- Take Cover for reverse/knockout accent labels.
- Use a clean readable UI font for normal text, tables, settings, admin, and mobile.

Asset rules:

- Mockup assets stay in `docs/mockups/assets/`.
- Production candidates later move to `src/assets/...` only after approval.
- Keep source/license notes in `docs/mockups/assets/ASSET-MANIFEST.md`.
- Archive superseded mockups instead of deleting them.

## Icon Decisions

Active proof sheet:

- `docs/mockups/musterdeck-free-icon-candidates-v3.html`

Latest rendered screenshot:

- `outputs/mockup-checks/musterdeck-free-icon-candidates-v3-5-full.png`

Locked or current approved icon choices:

- Salvage: locked to the patched MusterDeck edit of `mdi:hammer-wrench`; original MDI glyph remains backup.
- Rifleman / FPS Combat: locked to uploaded rifle SVG, recolored and rotated 45 degrees counterclockwise.
- Piracy: locked to uploaded pirate skull SVG.
- Refuel: Phosphor gas can.
- Repair: Lucide wrench.
- Mining: Lucide pickaxe.
- Logistics: Game-icons forklift, with CC BY attribution required.
- Ship Combat: V2-style custom spaceship with the target-overlay reticle.
- Turret: Game-icons turret, with CC BY attribution required.
- Quartermaster: custom V2 chevrons/bars.
- Accept / Deny / Lock / Unlock: Lucide.
- Broadcast: Remix Icon broadcast.

Important lesson from the salvage loop:

Do not combine two separate icons into a small crossed-tool symbol unless the rendered screenshot proves it reads clearly. At small sizes, those composites collapse into visual noise.

Next icon work:

- Vendor approved SVGs locally.
- Create a license/attribution register.
- Build a final icon sprite/proof sheet from locked assets only.
- Stop revisiting rejected salvage composites.

## Project Organization Rules

Use:

- `src/` for production frontend code.
- `supabase/` for production backend database/project files.
- `scripts/` for repeatable tooling.
- `docs/handoff/` for concise project context and decision records.
- `docs/superpowers/specs/` for formal specs.
- `docs/superpowers/plans/` for implementation plans.
- `docs/mockups/` for static mockups and visual exploration.
- `docs/archive/` for superseded work.
- `outputs/` for generated workbooks, screenshots, and previews.

Keep:

- Meaningful old work archived, not deleted.
- Mockups separate from production app code.
- Major decisions in `docs/handoff/project-change-log.md`.
- Mockup asset inventory in `docs/mockups/assets/ASSET-MANIFEST.md`.

## Current Git State

Recent important commits:

- `8743e1b docs: add end of day musterdeck handoff`
- `62b8b0a docs: organize project assets and archives`
- `93f4f8c docs: add shared foundation implementation plan`
- `edba288 docs: add musterdeck brand voice guide`
- `784f741 docs: add shared foundation site plan`
- `5e065b9 docs: add account access notification chat design`
- `fca4432 docs: add project transition handoff`
- `b6f9eda feat: add role-aware fleet views`

Uncommitted closeout changes at the time this file was written:

- `docs/handoff/2026-05-20-musterdeck-free-icon-sourcing-plan.md`
- `docs/handoff/project-change-log.md`
- `docs/mockups/assets/ASSET-MANIFEST.md`
- `docs/mockups/musterdeck-free-icon-candidates-v3.html`
- `docs/handoff/2026-05-20-start-here-next-chat.md`

These changes are related to the final V3.5 icon decisions and this consolidated handoff. Review and commit them early in the next session if they still look right.

## Recommended First Tasks Tomorrow

1. Import `outputs/position-review/star-citizen-ship-position-review-one-line-preserved.xlsx` into Google Sheets and start ship staffing review.
2. Commit the closeout documentation and approved V3.5 icon-board changes if the working tree still matches this handoff.
3. Vendor the locked icon SVGs locally and add attribution tracking.
4. Decide whether the next visual mockup should be the logged-in hub, S.P.O.I.L.S. settlement screen, or Rally Point listing detail.
5. Continue toward the shared foundation implementation plan in `docs/superpowers/plans/2026-05-20-shared-foundation-implementation.md`.

Recommended implementation branch when coding starts:

- `codex/shared-foundation`

## Open Decisions To Keep

- Should the logged-in home be called Operations Hub or Command Deck?
- Should the tournament pillar name be Proving Ground, The Circuit, Arena Deck, or another name?
- Should tournaments be a fourth top-level pillar or a sub-module under Rally Point/Event Management?
- Should the first app shell mockup focus on the hub, Rally Point listing detail, or S.P.O.I.L.S. settlement screen?
- Should public Rally Point listings support non-org community events immediately, or only approved org-hosted listings at first?
- Should RSI verification be required for officers and restricted events, or only available as a trust signal?
- Should S.P.O.I.L.S. first build support equal split plus org bank only, or include per-user percentage/fixed adjustments immediately?
- Should Quartermaster be available to any event owner, or only to users with special Quartermaster/officer permission?
- Should push notifications be implemented early as a PWA requirement, or after core event flows are wired to Supabase?
- Should first-version tournament score reporting be admin-only or allow participant self-reporting with admin confirmation?

## Source Docs For Deeper Detail

- `docs/handoff/2026-05-20-project-reset-brief.md`
- `docs/handoff/2026-05-20-project-transition-summary.md`
- `docs/handoff/2026-05-20-end-of-day-summary.md`
- `docs/handoff/2026-05-20-musterdeck-product-backlog.md`
- `docs/handoff/2026-05-20-project-organization-guide.md`
- `docs/handoff/2026-05-20-musterdeck-visual-asset-plan.md`
- `docs/handoff/2026-05-20-musterdeck-icon-inventory.md`
- `docs/handoff/2026-05-20-musterdeck-free-icon-sourcing-plan.md`
- `docs/superpowers/specs/2026-05-19-crewterminal-discovery-notes.md`
- `docs/superpowers/specs/2026-05-20-spoils-rewards-module-notes.md`
- `docs/superpowers/specs/2026-05-20-account-access-notifications-chat-design.md`
- `docs/superpowers/specs/2026-05-20-musterdeck-shared-foundation-site-plan-copy-inventory.md`
- `docs/superpowers/specs/2026-05-20-musterdeck-brand-voice-guide.md`
- `docs/superpowers/specs/2026-05-21-musterdeck-tournament-pillar-design.md`
- `docs/superpowers/plans/2026-05-20-shared-foundation-implementation.md`
