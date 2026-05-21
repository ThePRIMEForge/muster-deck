# MusterDeck Project Change Log

Use this file for concise product, architecture, naming, visual, and organization decisions.

## 2026-05-21 - Local Supabase Verification

- Decision: Use Docker Desktop plus the Supabase CLI as the local database verification path.
- Decision: Keep generated Wiki vehicle and staffing-template data outside the normal `supabase/seed.sql` reset seed, but provide `npm run db:test` to reset, load generated local data, and run database smoke tests in one repeatable command.
- Decision: Make SQL smoke files emit pgTAP output so `supabase test db` can report pass/fail correctly.
- Reason: The app needs lightweight resets for schema work, while Fleet Command smoke tests require the larger generated ship catalog and staffing data.
- Files affected: `package.json`, `scripts/supabase/load-generated-local-data.sh`, `supabase/tests/fleet_request_helpers_smoke.sql`, `supabase/tests/read_models_smoke.sql`, `supabase/tests/shared_foundation_accounts_smoke.sql`, `docs/handoff/project-change-log.md`.
- Follow-up: If generated catalog data becomes required for every local reset, consider splitting seed paths into a small default seed and an explicit full-catalog seed profile.

## 2026-05-21 - Global Messages And Ship Position Baseline

- Decision: Rename the shared notification surface to `Messages and Notifications`.
- Decision: Include general MusterDeck messages, player-to-player direct messages, and personal group messages in the shared notification window.
- Decision: Keep Fleet Command fleet-wide, team, ship, and command message threads inside the Fleet Command pillar.
- Decision: Allow future non-chat Fleet Command alerts, such as assignment or roster changes, to appear in the shared notification window without exposing the Fleet Command message thread.
- Decision: Treat the Ship Position Review Spreadsheet as locked for this patch.
- Reason: The shared shell needs a place for platform-wide and social messages, but Fleet Command chat depends on live event context and should stay with the active roster and command tools.
- Files affected: `src/lib/foundationCopy.ts`, `src/lib/foundationData.ts`, `src/components/foundation/NotificationCenter.tsx`, `supabase/migrations/20260520190000_shared_foundation_accounts.sql`, `docs/superpowers/specs/2026-05-20-account-access-notifications-chat-design.md`, `docs/superpowers/specs/2026-05-20-musterdeck-shared-foundation-site-plan-copy-inventory.md`, `docs/handoff/2026-05-21-day-3-plan.md`, `docs/handoff/project-change-log.md`.
- Follow-up: Build persistent direct/group messaging and chat channel storage in a dedicated messaging slice after shared account/auth behavior is ready.

## 2026-05-21 - Confirmed Shared Foundation Direction

- Decision: Save the public investor/collaborator summary as reusable external-facing project material.
- Decision: Keep `Proving Ground` as the fourth top-level pillar name for now.
- Decision: Keep `Operations Hub` as the logged-in home that routes to the four pillars, admin panels, and account panels.
- Decision: Treat Proving Ground as a fourth top-level pillar, not a Rally Point/Event Management sub-module.
- Decision: Limit first-version Proving Ground score reporting to admins only.
- Reason: These decisions stabilize the shared foundation navigation and prevent the first app shell from being built around unresolved module names or tournament permissions.
- Files affected: `docs/marketing/2026-05-21-musterdeck-public-summary.md`, `docs/handoff/project-change-log.md`.
- Follow-up: Carry these decisions into the shared foundation implementation branch.

## 2026-05-21 - Tournament Prize S.P.O.I.L.S.

- Decision: Extend S.P.O.I.L.S. with a tournament prize settlement variant connected to Proving Ground.
- Decision: Track cash prizes, physical prizes, in-game items, hangar-attributed equipment, hangar-attributed ships, claim status, and fulfillment status as organizer-managed award records.
- Decision: Do not imply custody, escrow, prize delivery guarantee, official Star Citizen support, or Cloud Imperium Games involvement.
- Decision: Do not store sensitive payment details, tax data, bank data, private addresses, or government IDs in the first version.
- Reason: Proving Ground tournaments may award real-world and Star Citizen-related prizes, but prize tracking needs stronger legal/privacy boundaries than normal operation loot.
- Files affected: `docs/superpowers/specs/2026-05-21-musterdeck-tournament-pillar-design.md`, `docs/superpowers/specs/2026-05-20-spoils-rewards-module-notes.md`, `docs/handoff/2026-05-20-musterdeck-product-backlog.md`, `docs/handoff/2026-05-20-start-here-next-chat.md`, `docs/handoff/project-change-log.md`.
- Follow-up: Decide whether cash and physical prize tracking is private-admin-only at first or visible to participants, and define the minimum safe claim/contact data policy.

## 2026-05-21 - Tournament Pillar Draft

- Decision: Draft a fourth MusterDeck pillar for tournament and competitive event management.
- Decision: Use `Proving Ground` as the recommended working name pending review.
- Decision: Scope the pillar around tournament signup, individual/team registration, 1v1 through 5v5 and custom team sizes, single elimination, double elimination, round robin, Swiss, leaderboard scoring, match waves, standings, and admin score/progression tools.
- Reason: Tournament management complements Rally Point, Fleet Command, and S.P.O.I.L.S. by covering structured competitive events, Discord-hosted brackets, in-person events, and leaderboard-driven competitions.
- Files affected: `docs/superpowers/specs/2026-05-21-musterdeck-tournament-pillar-design.md`, `docs/handoff/2026-05-20-start-here-next-chat.md`, `docs/handoff/2026-05-20-musterdeck-product-backlog.md`, `docs/handoff/2026-05-21-day-3-plan.md`, `docs/handoff/project-change-log.md`.
- Follow-up: Confirm the pillar name and whether Proving Ground is a top-level pillar or an Event Management sub-module before adding it to the implementation plan.

## 2026-05-21 - Project Operating Rules

- Decision: Add operating rules for anti-AI copy review, documentation folder discipline, version-history hygiene, archive/reference handling, chat handoffs, periodic context review, major decision logging, and deployable package cleanliness.
- Reason: MusterDeck now spans product strategy, brand voice, mockups, generated assets, backend schema, frontend implementation, and deployment planning. The project needs durable process rules so future chats can continue without relying on memory or accumulating stale context.
- Files affected: `docs/handoff/project-operating-rules.md`, `docs/handoff/2026-05-20-project-organization-guide.md`, `docs/handoff/project-change-log.md`.
- Follow-up: Use these rules before writing user-facing copy, starting new workstreams, archiving material, or creating deployable packages.

## 2026-05-20 - Platform And Pillar Names

- Decision: Overall platform is MusterDeck, with public domain direction `www.muster-deck.com`.
- Decision: The three pillars are Rally Point, Fleet Command, and S.P.O.I.L.S.
- Decision: S.P.O.I.L.S. means Settlement, Payouts, Operations, Inventory, Loot, and Shares.
- Decision: Quartermaster is the role title for the person managing S.P.O.I.L.S.
- Reason: These names are clear, memorable, and map well to the intended user flows.
- Files affected: `docs/handoff/2026-05-20-project-reset-brief.md`, `docs/handoff/2026-05-20-musterdeck-product-backlog.md`.
- Follow-up: Use these names consistently in future specs, UI copy, mockups, and implementation.

## 2026-05-20 - Auth Model Direction

- Decision: Support email/password signup as the baseline, plus Discord SSO and Google SSO.
- Decision: Users who start with email/password should be able to link Discord and Google from account settings.
- Decision: RSI handle verification remains separate from login and proves in-game identity ownership.
- Reason: Email/password is the easiest default path, while Discord and Google SSO improve convenience and trust.
- Files affected: `docs/handoff/2026-05-20-project-reset-brief.md`, `docs/handoff/2026-05-20-musterdeck-product-backlog.md`.
- Follow-up: Formalize profiles, linked identities, RSI verification, and admin controls in the auth/account spec.

## 2026-05-20 - Fan-Project Footer Requirement

- Decision: Every public and signed-in page should include a compact footer with legal links and a fan-project disclaimer.
- Reason: Star Citizen fan tools should clearly avoid implying official affiliation and should keep legal/privacy surfaces easy to find.
- Files affected: `docs/handoff/2026-05-20-project-reset-brief.md`, `docs/handoff/2026-05-20-musterdeck-product-backlog.md`.
- Follow-up: Implement a reusable footer component when the app shell is built.

## 2026-05-20 - Header Version Status Requirement

- Decision: Every primary page should show Rally Point, Fleet Command, S.P.O.I.L.S., and Star Citizen data/patch versions in a compact header area.
- Reason: Users need to know how current each tool and catalog dataset is.
- Files affected: `docs/handoff/2026-05-20-project-reset-brief.md`, `docs/handoff/2026-05-20-musterdeck-product-backlog.md`.
- Follow-up: Decide exact module versioning format during app shell design.

## 2026-05-20 - Visual Direction Exploration

- Decision: Explore a worn space-industrial direction with mustard/yellow paint, caution markers, analog controls, scuffed panels, and a subtle WWII/industrial motif.
- Reason: The previous mockups felt too similar and too much like generic AI-generated dashboards.
- Files affected: `docs/mockups/musterdeck-visual-lanes.html`.
- Follow-up: Choose or refine one visual lane before converting it into production UI components.

## 2026-05-20 - Project Organization Rules

- Decision: Add a project organization guide and change log.
- Decision: Archive meaningful old work instead of deleting it.
- Decision: Keep production source, mockups, research, generated outputs, specs, plans, and archives in separate folders.
- Reason: The project is growing across product design, research, generated assets, backend schema, and mockups. Clear folder rules reduce confusion and prevent stale ideas from being reintroduced accidentally.
- Files affected: `docs/handoff/2026-05-20-project-organization-guide.md`, `docs/handoff/project-change-log.md`.
- Follow-up: Create `docs/archive/` subfolders when the first meaningful artifact is archived.

## 2026-05-20 - Visual Asset Planning Rule

- Decision: The generated industrial texture board is reference-only and should not be used as a full-page background.
- Decision: Future visual work should create individual assets: button surfaces, panel surfaces, texture tiles, caution/flare pieces, icon plates, and vector-first functional icons.
- Decision: Capture it and Take Cover are approved as candidate display fonts pending local download and license-file retention.
- Reason: The app needs a rugged, analog, worn-in interface without sacrificing readable, editable, responsive UI text.
- Files affected: `docs/handoff/2026-05-20-musterdeck-visual-asset-plan.md`, `docs/handoff/project-change-log.md`.
- Follow-up: Review the asset inventory, then generate a small button-surface proof batch before expanding the whole asset library.

## 2026-05-20 - Expanded UI Kit Asset Scope

- Decision: Expand the first visual asset plan beyond a small button sample into a reusable UI kit proof batch.
- Decision: Include button families, mustard hazard overlays, stretchable panel parts, loose knobs/greebles, and physical-control details.
- Decision: Large panels should be assembled from center textures, edge strips, corner caps, bolts, scratches, and optional overlays so they can stretch responsively.
- Reason: MusterDeck needs reusable visual parts that can adapt to real app sections and mobile/tablet layouts, not static dashboard paintings.
- Files affected: `docs/handoff/2026-05-20-musterdeck-visual-asset-plan.md`, `docs/mockups/assets/ASSET-MANIFEST.md`, `docs/handoff/project-change-log.md`.
- Follow-up: Generate a contact sheet proof batch that demonstrates both individual assets and how layered panels/buttons compose in HTML/CSS.

## 2026-05-20 - Icon Inventory Direction

- Decision: Create a dedicated MusterDeck icon inventory covering app shell, Rally Point, Fleet Command roles, ship systems/components, S.P.O.I.L.S. settlement/item states, account trust, admin, notifications, and version/data status.
- Decision: Use vector-first functional symbols, with generated/raster plates and worn frames for visual treatment.
- Reason: The app will need many icons, and separating symbols from rugged styling keeps them readable and maintainable.
- Files affected: `docs/handoff/2026-05-20-musterdeck-icon-inventory.md`, `docs/handoff/2026-05-20-musterdeck-visual-asset-plan.md`, `docs/mockups/assets/ASSET-MANIFEST.md`, `docs/handoff/project-change-log.md`.
- Follow-up: Review the first icon proof batch list before drawing/generating icon plates and symbols.

## 2026-05-20 - First Vector Icon Proof Sheet

- Decision: Create a self-contained HTML proof sheet for the first 21 MusterDeck vector stencil icons.
- Decision: Show each icon on mustard, olive, graphite, and caution plates, plus small-size checks.
- Reason: Reviewing shape language and small-size readability before building the full icon library reduces rework.
- Files affected: `docs/mockups/musterdeck-icon-proof-batch.html`, `docs/mockups/assets/ASSET-MANIFEST.md`, `docs/handoff/project-change-log.md`.
- Follow-up: Review which icons read well, which need more literal shapes, and whether the stencil cuts should be stronger or subtler.

## 2026-05-20 - Icon Proof V1 Rejected, V2 Brief Added

- Decision: Reject the V1 icon symbols as production direction while keeping the rugged plate/vibe direction.
- Decision: Redraw V2 as outline-first stencil icons with clearer literal metaphors, starting with mining as a pickaxe and salvage as a wrench/cutter.
- Reason: The V1 icons were too filled-in and ambiguous; they did not reliably read as useful operational symbols.
- Files affected: `docs/handoff/2026-05-20-musterdeck-icon-inventory.md`, `docs/mockups/assets/ASSET-MANIFEST.md`, `docs/handoff/project-change-log.md`.
- Follow-up: Build `docs/mockups/musterdeck-icon-proof-batch-v2.html` from the V2 visual brief.

## 2026-05-20 - Icon Proof V2 Draft

- Decision: Create a separate V2 icon proof sheet with outline-first stencil SVG symbols.
- Decision: Change broadcast from speaker/megaphone to an antenna mast with curved signal arcs.
- Reason: V2 should test clearer literal icon metaphors while preserving the rugged MusterDeck plate treatment.
- Files affected: `docs/mockups/musterdeck-icon-proof-batch-v2.html`, `docs/mockups/assets/ASSET-MANIFEST.md`, `docs/handoff/project-change-log.md`.
- Follow-up: Review V2 for whether each symbol reads without its label at 24px and whether the outline/stencil style feels better than V1.

## 2026-05-20 - Icon Proof V2.1 Revisions

- Decision: Revise weak V2 icons while preserving the icons that read well.
- Decision: Change logistics toward a forklift, medic to a solid cross, turret to paired angled barrels, credits to a cleaner coin stack, and broadcast to a round antenna head with better arc spacing.
- Decision: Add an unlock icon and make lock/unlock shackles more prominent.
- Reason: The first V2 pass improved the style, but several symbols still did not read clearly enough.
- Files affected: `docs/mockups/musterdeck-icon-proof-batch-v2.html`, `docs/mockups/assets/ASSET-MANIFEST.md`, `docs/handoff/project-change-log.md`.
- Follow-up: Review V2.1 and decide which icons need a V2.2 redraw before expanding the icon library.

## 2026-05-20 - Icon Proof V2.2 Reference-Based Redraw

- Decision: Redraw the weakest proof icons using the local `icon examples/` references and established icon geometry.
- Decision: Use proper pickaxe, wrench, and forklift shapes; change Quartermaster to three chevrons with three bars; simplify Fleet Commander to the star only; redraw Capital Pilot and Turret closer to provided references.
- Reason: Several V2.1 symbols still did not read as their intended objects, so the next pass should follow supplied references more closely.
- Files affected: `docs/mockups/musterdeck-icon-proof-batch-v2.html`, `docs/mockups/assets/ASSET-MANIFEST.md`, `docs/handoff/project-change-log.md`.
- Follow-up: Review V2.2 and decide whether to keep using reference-backed vector geometry for the rest of the icon library.

## 2026-05-20 - Icon Proof V2.3 Focused Revisions

- Decision: Keep the accepted mining, salvage, logistics, and capital pilot directions.
- Decision: Revise rifleman using the supplied rifle reference, tilt the turret cannon upward, normalize Quartermaster chevron/bar width, and open the unlock shackle gap more clearly.
- Reason: The remaining problem icons needed targeted fixes without disturbing symbols that were now reading well enough.
- Files affected: `docs/mockups/musterdeck-icon-proof-batch-v2.html`, `docs/mockups/assets/ASSET-MANIFEST.md`, `docs/handoff/project-change-log.md`.
- Follow-up: Review V2.3 and decide whether these four icons are acceptable before adding new icon categories.

## 2026-05-20 - Icon Proof V2.4 And Additional Game Loops

- Decision: Revise rifleman, turret, unlock, broadcast, and check/X weight based on review feedback.
- Decision: Add early concepts for ship combat, FPS combat, piracy, refuel, and repair game-loop icons.
- Reason: The current proof batch is close enough to start expanding adjacent activity icons while continuing to refine the remaining weak symbols.
- Files affected: `docs/mockups/musterdeck-icon-proof-batch-v2.html`, `docs/mockups/assets/ASSET-MANIFEST.md`, `docs/handoff/project-change-log.md`.
- Follow-up: Review whether ship combat and FPS combat should remain combined icons or become distinct standalone category symbols.

## 2026-05-20 - Icon Proof V2.5 Combat And Support Revisions

- Decision: Change salvage to a crossed wrench and hammer mark.
- Decision: Move the combat target mark to the top-left corner for both ship combat and FPS combat.
- Decision: Revise FPS combat and Rifleman using the new rifle SVG as layout inspiration.
- Decision: Change refuel to a fuel can with a vertical wrench, lower the broadcast antenna, and increase the unlock shackle gap.
- Reason: The added references clarified the intended silhouettes and spacing for these symbols.
- Files affected: `docs/mockups/musterdeck-icon-proof-batch-v2.html`, `docs/mockups/assets/ASSET-MANIFEST.md`, `docs/handoff/project-change-log.md`.
- Follow-up: Review V2.5 for whether the combined combat icons and revised support icons now read clearly enough.

## 2026-05-20 - Icon Proof V2.6 Piracy Reference Update

- Decision: Replace the simple piracy placeholder with a cleaner pirate skull mark based on the supplied SVG reference.
- Reason: The uploaded skull reference gives the piracy icon a stronger, more recognizable silhouette than the first generic skull/crossbones draft.
- Files affected: `docs/mockups/musterdeck-icon-proof-batch-v2.html`, `docs/mockups/assets/ASSET-MANIFEST.md`, `docs/handoff/project-change-log.md`.
- Follow-up: Review the piracy mark at small size and decide whether it should keep crossed bones or move toward a skull-only stencil badge.

## 2026-05-20 - Free Icon Sourcing Pivot

- Decision: Stop hand-drawing the broad icon library and switch to a free/open-source source-first process.
- Decision: Create a V3 candidate sheet comparing Lucide, Tabler, Material Design Icons, Phosphor, Iconoir, Remix Icon, Game-icons.net, and user-supplied references.
- Reason: Several custom sketches were not reading clearly, and sourced icons provide better fidelity while keeping costs at zero for a fan project.
- Files affected: `docs/mockups/musterdeck-free-icon-candidates-v3.html`, `docs/handoff/2026-05-20-musterdeck-free-icon-sourcing-plan.md`, `docs/mockups/assets/ASSET-MANIFEST.md`, `docs/handoff/project-change-log.md`.
- Follow-up: Review the V3 candidate sheet and pick preferred source families before any final styling or asset extraction.

## 2026-05-20 - Icon Source Decisions V3.1

- Decision: Mark user-approved icon choices as locked, acceptable fallbacks as backups, and weak candidates as rejected or unresolved.
- Decision: Keep custom MusterDeck SVGs where they already read well, including the V2 Quartermaster mark.
- Decision: Leave Salvage and Ship Combat unresolved at this stage instead of forcing poor candidates.
- Reason: The review clarified which free/open-source and local-reference assets are strong enough to carry forward.
- Files affected: `docs/mockups/musterdeck-free-icon-candidates-v3.html`, `docs/handoff/2026-05-20-musterdeck-free-icon-sourcing-plan.md`, `docs/mockups/assets/ASSET-MANIFEST.md`, `docs/handoff/project-change-log.md`.
- Follow-up: Extract locked SVGs locally, create attribution tracking for CC BY icons, and run focused searches for Salvage and Ship Combat.

## 2026-05-20 - Icon Source Decisions V3.2

- Decision: Add a custom Salvage rebuild candidate based on the uploaded hammer/wrench reference and keep the scrambled library combos rejected.
- Decision: Rotate the uploaded rifle SVG 45 degrees counterclockwise for Rifleman/FPS usage.
- Decision: Lock Ship Combat back to the V2 custom spaceship mark with a larger target reticle.
- Reason: The review confirmed most locked icons are good, but Salvage, Rifleman orientation, and Ship Combat needed focused correction.
- Files affected: `docs/mockups/musterdeck-free-icon-candidates-v3.html`, `docs/handoff/2026-05-20-musterdeck-free-icon-sourcing-plan.md`, `docs/mockups/assets/ASSET-MANIFEST.md`, `docs/handoff/project-change-log.md`.
- Follow-up: Resolved by V3.5. The patched `mdi:hammer-wrench` is now the approved Salvage direction.

## 2026-05-20 - Icon Source Decisions V3.3

- Decision: Reject the custom hand-built Salvage rebuild and lock the uploaded hammer/wrench reference as the visual standard.
- Decision: Change Ship Combat to use the target-overlay reticle style instead of the small circular reticle.
- Reason: The rendered screenshot showed the Salvage custom rebuild was still not recognizable, while the uploaded reference read clearly.
- Files affected: `docs/mockups/musterdeck-free-icon-candidates-v3.html`, `docs/handoff/2026-05-20-musterdeck-free-icon-sourcing-plan.md`, `docs/mockups/assets/ASSET-MANIFEST.md`, `docs/handoff/project-change-log.md`.
- Follow-up: Superseded by V3.5. Use the patched `mdi:hammer-wrench` instead of tracing the reference image.

## 2026-05-20 - Icon Source Decisions V3.4

- Decision: Stop treating crossed hammer/wrench composites as viable Salvage candidates; add true single-purpose glyphs for comparison.
- Decision: Keep the uploaded hammer/wrench reference as the preferred Salvage visual, with `mdi:hammer-wrench` as the strongest free library fallback.
- Reason: The rendered proof sheet showed the purpose-built glyphs read clearly, while separate icon composites still collapse into visual noise.
- Files affected: `docs/mockups/musterdeck-free-icon-candidates-v3.html`, `docs/handoff/2026-05-20-musterdeck-free-icon-sourcing-plan.md`, `docs/mockups/assets/ASSET-MANIFEST.md`, `docs/handoff/project-change-log.md`.
- Verification: Rendered `outputs/mockup-checks/musterdeck-free-icon-candidates-v3-4-full.png` and inspected the Salvage row.

## 2026-05-20 - Icon Source Decisions V3.5

- Decision: Add a MusterDeck-patched version of `mdi:hammer-wrench` for Salvage, closing the awkward break in the handle area while retaining the original glyph as backup.
- Decision: Lock the patched `mdi:hammer-wrench` as the approved Salvage icon direction.
- Reason: The single MDI glyph reads correctly for Salvage; only the handle junction needed cleanup.
- Files affected: `docs/mockups/musterdeck-free-icon-candidates-v3.html`, `docs/handoff/2026-05-20-musterdeck-free-icon-sourcing-plan.md`, `docs/mockups/assets/ASSET-MANIFEST.md`, `docs/handoff/project-change-log.md`.
- Verification: Rendered `outputs/mockup-checks/musterdeck-free-icon-candidates-v3-5-full.png` and inspected the Salvage row.

## 2026-05-20 - Consolidated Next-Chat Handoff

- Decision: Create one clean start-here handoff for the next chat that consolidates the reset brief, transition notes, CrewTerminal research, S.P.O.I.L.S. notes, visual direction, icon decisions, and current repo state.
- Reason: The project now has enough parallel planning history that the next session needs a concise entry point instead of rereading every prior note.
- Files affected: `docs/handoff/2026-05-20-start-here-next-chat.md`, `docs/handoff/project-change-log.md`.
- Follow-up: Start the next chat by reading `docs/handoff/2026-05-20-start-here-next-chat.md`, then review and commit the closeout changes if still approved.

## 2026-05-20 - Project Folder Organization Pass

- Decision: Move loose icon reference files into `docs/mockups/assets/icon-references/`.
- Decision: Move candidate display fonts into `docs/mockups/assets/fonts/`.
- Decision: Archive superseded icon proof V1 and V2 mockups, including review screenshots, under `docs/archive/mockups/`.
- Decision: Keep `docs/mockups/musterdeck-free-icon-candidates-v3.html` as the active icon source decision board.
- Reason: The project needed clear separation between active mockups, source references, candidate fonts, archived mockups, generated outputs, and production code before shared foundation implementation begins.
- Files affected: `docs/mockups/assets/icon-references/`, `docs/mockups/assets/fonts/`, `docs/archive/mockups/`, `docs/mockups/assets/ASSET-MANIFEST.md`, `docs/handoff/2026-05-20-musterdeck-free-icon-sourcing-plan.md`.
- Follow-up: Decide whether fan-kit source folders should remain untracked local references or be committed as repository assets after production asset policy is finalized.
