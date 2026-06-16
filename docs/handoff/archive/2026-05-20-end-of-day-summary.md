# MusterDeck End-Of-Day Summary

Date: 2026-05-20  
Workspace: `/Users/christophmayer/Library/CloudStorage/GoogleDrive-prime.official.010@gmail.com/My Drive/SCFleet App`

## Current Product Direction

MusterDeck is now the platform name.

The app is planned as one Star Citizen operations platform with three connected pillars:

- Rally Point: event discovery, LFG, listings, applications, and ship/role offers.
- Fleet Command: planning, staffing, assigning, and running operations.
- S.P.O.I.L.S.: Settlement, Payouts, Operations, Inventory, Loot, and Shares.

The selected domain direction remains `www.muster-deck.com`.

## Major Decisions Made Today

### Site/App Scope

Decision: use a hybrid platform map.

Meaning:

- Plan the full platform now.
- Mark screens as Build Now, Draft Now, or Later.
- Build the shared foundation and Fleet Command foundation first.

Build Now includes:

- Public landing page.
- Signup/login.
- Logged-in hub.
- Profile/account settings.
- Admin portal foundation.
- Notification center.
- Footer/legal shell.
- Fleet Command event settings.
- Fleet Command templates/duplicate event.
- Fleet Setup.
- Operation View.
- Crew View.

Draft Now includes:

- Rally Point browse/listing/create/applicant screens.
- S.P.O.I.L.S. settlement/inventory/approval/payout screens.
- Profile modal.
- Activity chat.
- Legal pages and data/version status page.

Later includes:

- Public Rally Point stats.
- Calendar/share depth.
- Advanced live phase automation.
- S.P.O.I.L.S. item catalog/pricing depth.
- Cross-event reward history.
- Organization dashboard.
- Deep data source status tooling.

### Brand Voice

Decision: focus on brand voice now; visual brand guide will continue separately.

Voice formula:

> Operational command, light conscription, broad crew respect.

Tone rules:

- Pragmatic, concise, and operational.
- Inviting without sounding soft or generic.
- Military-adjacent without becoming parody drill-sergeant copy.
- In-universe flavored, but never official-sounding.
- Combat is one register, not the whole product voice.
- Logistics, industrial, medical, support, mining, salvage, and cargo players must feel first-class.

Voice registers:

- Combat: sharper command language such as strike group, objective, engage, extract.
- Industrial/logistics: steadier professional language such as run, route, haul, yield, manifest, convoy, recovery, supply.
- Neutral: account/admin/settings language such as save, review, confirm, status, access.

Important vocabulary decisions:

- Use `operation` as the universal unit.
- Use `crew` as the universal participant group.
- Use `station` as the broad role/position label.
- Use `the 'verse` sparingly as flavor, not filler.
- Use Star Citizen language carefully: citizen, org, mobiGlas, Comm-Link, Spectrum, aUEC, SCU, cargo grid, Stanton, Pyro, UEE.
- Avoid official-status phrases, guaranteed payout language, and copied RSI/CIG/CrewTerminal wording.

### Shared Foundation

Decision: shared foundation is the first implementation workstream.

Reason:

- It unlocks auth, profiles, navigation, admin visibility, notifications, legal/footer, and future Rally Point/S.P.O.I.L.S. flows.
- It lets Fleet Command keep evolving without staying trapped in a single prototype page.

### Project Organization

Decision: organize before implementation.

Actions:

- Moved loose icon references into `docs/mockups/assets/icon-references/`.
- Moved candidate display fonts into `docs/mockups/assets/fonts/`.
- Archived superseded icon proof V1 and V2 mockups under `docs/archive/mockups/`.
- Kept `docs/mockups/musterdeck-free-icon-candidates-v3.html` as the active icon source board.
- Updated `.gitignore` so generated outputs and full fan-kit source downloads do not create noisy status.
- Preserved tracked production-selected fan-kit assets used by the current app.

## Documents Created Or Updated

### Planning And Specs

- `docs/superpowers/specs/2026-05-20-musterdeck-shared-foundation-site-plan-copy-inventory.md`
  - Site/app map.
  - Build Now / Draft Now / Later screen inventory.
  - Screen-level copy inventory.

- `docs/superpowers/specs/2026-05-20-musterdeck-brand-voice-guide.md`
  - Brand voice rules.
  - Combat/industrial/neutral registers.
  - Vocabulary system.
  - Copy patterns and examples.
  - Legal/trust language boundaries.

- `docs/superpowers/plans/2026-05-20-shared-foundation-implementation.md`
  - Implementation plan for the first shared foundation build.
  - Covers route model, copy constants, Supabase foundation schema, demo data, foundation screens, app wiring, styling, and verification.

### Handoff / Organization Docs

- `docs/handoff/2026-05-20-project-organization-guide.md`
  - Folder roles and archive rules.

- `docs/handoff/project-change-log.md`
  - Running decision log.

- `docs/handoff/2026-05-20-musterdeck-product-backlog.md`
  - Product backlog and recommended work order.

- `docs/handoff/2026-05-20-project-reset-brief.md`
  - Reset brief for the three-pillar platform direction.

- `docs/handoff/2026-05-20-musterdeck-visual-asset-plan.md`
  - Visual asset planning rules.

- `docs/handoff/2026-05-20-musterdeck-icon-inventory.md`
  - Icon inventory and priority tiers.

- `docs/handoff/2026-05-20-musterdeck-free-icon-sourcing-plan.md`
  - Free/open-source icon sourcing strategy.

- `docs/handoff/2026-05-20-start-here-next-chat.md`
  - Consolidated next-chat handoff that merges reset brief, transition notes, product decisions, visual direction, icon decisions, and next steps.

### Mockups And Assets

Active:

- `docs/mockups/musterdeck-free-icon-candidates-v3.html`
- `docs/mockups/musterdeck-stencil-command.html`
- `docs/mockups/musterdeck-visual-lanes.html`
- `docs/mockups/assets/ASSET-MANIFEST.md`
- `docs/mockups/assets/icon-references/`
- `docs/mockups/assets/fonts/`
- `docs/handoff/2026-05-20-start-here-next-chat.md`

Archived:

- `docs/archive/mockups/2026-05-20-icon-proof-v1/`
- `docs/archive/mockups/2026-05-20-icon-proof-v2/`

## Commits Created In This Chat

- `784f741 docs: add shared foundation site plan`
- `edba288 docs: add musterdeck brand voice guide`
- `93f4f8c docs: add shared foundation implementation plan`
- `62b8b0a docs: organize project assets and archives`

Recent prior context commits:

- `5e065b9 docs: add account access notification chat design`
- `fca4432 docs: add project transition handoff`
- `b6f9eda feat: add role-aware fleet views`

## Current Git State At Closeout

There are uncommitted visual/icon-board edits in the workspace after the organization commit.

Modified files at closeout:

- `docs/handoff/2026-05-20-musterdeck-free-icon-sourcing-plan.md`
- `docs/handoff/project-change-log.md`
- `docs/mockups/assets/ASSET-MANIFEST.md`
- `docs/mockups/musterdeck-free-icon-candidates-v3.html`
- `docs/handoff/2026-05-20-start-here-next-chat.md`

Summary of those uncommitted edits:

- V3.4 and V3.5 icon source decision notes were added.
- Salvage is now locked to the patched `mdi:hammer-wrench` edit.
- The active V3 icon board now references moved asset paths under `docs/mockups/assets/icon-references/`.
- The V3 icon board title/version was updated to V3.5.
- A consolidated next-chat handoff was added.

These changes appear related to active visual identity/iconography work and should be reviewed tomorrow before committing or revising.

## Browser Companion State

The visual companion was used during planning.

Last known local URL:

- `http://localhost:60207/`

Last useful browser screen:

- Project folder organization complete.

The `.superpowers/` browser artifacts are ignored and should not be committed.

## Recommended Restart Tomorrow

Start tomorrow by reviewing `docs/handoff/2026-05-20-start-here-next-chat.md` first.

Then do this sequence:

1. Import `outputs/position-review/star-citizen-ship-position-review-one-line-preserved.xlsx` into Google Sheets for ship staffing review.
2. Review and commit the closeout documentation and V3.5 icon-board changes if they still look right.
3. Vendor the approved icon SVGs locally and add attribution tracking.
4. Decide whether the next visual mockup should be the logged-in hub, S.P.O.I.L.S. settlement screen, or Rally Point listing detail.
5. When ready to implement, create an isolated worktree for the shared foundation build.
6. Execute `docs/superpowers/plans/2026-05-20-shared-foundation-implementation.md` using subagent-driven development.

Recommended first implementation branch:

- `codex/shared-foundation`

Before implementation:

- Keep production app work separate from visual mockup work.
- Do not move current specs/plans into archive.
- Do not commit full fan-kit source downloads unless a production asset policy is finalized.
- Keep generated workbook and screenshot outputs under ignored `outputs/`.

## Open Decisions For Tomorrow

- Whether `Operations Hub` or `Command Deck` becomes the logged-in home label.
- Whether `Report in` is a signup CTA or reserved for authenticated app actions.
- Whether public landing copy should lead with `Star Citizen operations` or `operations across the 'verse`.
- Whether fan-kit source folders remain local references or become tracked source assets.
- Whether the shared foundation implementation should proceed immediately or wait for visual brand guide integration.
