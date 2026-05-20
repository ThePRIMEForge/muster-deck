# Star Citizen Fleet Manager Handoff

Date: 2026-05-20  
Current branch: `main`  
Latest app implementation commit at handoff: `b6f9eda feat: add role-aware fleet views`  
Supabase project ref: `brqrztrfeivrpywtummz`

## Purpose

This project is a Star Citizen fleet planning and signup app. The goal is to let a Fleet Admiral or officer pre-plan a fleet, request exact ships or ship categories, define required crew positions, share the operation with members, and let members sign up to bring ships or fill positions.

The current app is a working prototype backed by a Supabase schema and generated catalog SQL. The frontend is still mostly local/fallback state, but it is already shaped around the backend concepts we plan to wire in.

## Product Decisions

- The app should support combat and non-combat fleet planning.
- Ship catalog records use one primary category:
  - Capital
  - Subcapital
  - Large
  - Medium
  - Small
  - Light Fighter
  - Medium Fighter
  - Heavy Fighter
  - Snub Fighter
  - Ground Vehicle
- Ships can have multiple subcategories:
  - Repair
  - Rearm
  - Refuel
  - Anti-fighter
  - Anti-capital
  - Stealth
  - Bomber
  - Torpedo
  - Scanning
  - Carrier
  - Troop transport
  - Cargo transport
  - Reclamation
  - Ground vehicle transport
  - Medical
  - Mining
  - Salvage
  - Interdiction
  - EMP / QED
  - Exploration
  - Data runner
  - Tractor Beam
- Staffing profiles apply to ships:
  - Skeleton: red indicator.
  - Standard: yellow indicator.
  - Full Crew: green indicator.
  - Custom: exact event positions chosen manually.
- Marines/FPS are not called boarding teams in the main UI because boarding is mission-specific. The label is `Marines/FPS`.
- Ship indicators:
  - Marines aboard: white chevron above the staffing dot.
  - Fleet Admiral aboard: solid gold star centered behind the staffing dot.
- Ship roster locks only lock which ships are being taken. They do not lock crew into positions.
- Fleet planning supports exact ships, category/type requests, or a mix:
  - Example: one Idris, one Polaris, three heavy fighters.
  - Crew can only bring or request specific ships; they do not design category requests.
- The app needs three role-based views:
  - Fleet Setup: Fleet Admiral only.
  - Operation View: Fleet Admiral and officers.
  - Crew View: everyone.
- Fleet Admiral can create/edit/delete fleet rows, manage requests, and assign command roles.
- Officers can move people around and assign people or ships to teams.
- Crew can join/fill roles, bring a ship, and request changes.
- Role promotions and assignment changes should appear as centered modals for the affected user to accept or acknowledge.
- Future mission phases are important but intentionally deferred. The data model reserves room for phases without putting phase tabs in the first UI pass.

## Backend Decisions

- Supabase/Postgres is the backend.
- Postgres type: standard/default Postgres, not OrioleDB.
- Data API and automatic table exposure are enabled.
- RLS should be enabled. The schema also includes an event trigger that auto-enables RLS on future public tables.
- Star Citizen Wiki API is the primary source for ship data because it was current for patch `4.8.0-LIVE.11825000` during discovery.
- UEX is secondary enrichment only. It can suggest operational tags, but it should not override newer Wiki data automatically.
- CCU Game was investigated for ship media, but no stable public full-catalog image API was identified. Wiki media is the first sync source for ship images.
- Raw source API payloads are stored before normalization so source changes and conflicts can be reviewed later.
- Human-reviewed staffing templates are the source of truth for crew positions. API data can suggest positions, but syncs should not overwrite doctrine templates.

## Database Work Completed

Supabase migrations exist under `supabase/migrations/`:

- `20260519150000_initial_backend_schema.sql`
  - Source systems and snapshots.
  - Ship primary categories and subcategories.
  - Ships and ship media.
  - Staffing profiles and position templates.
  - Fleet events, teams, members, ship requests, positions, and signups.
  - RLS enabled.
- `20260519172500_roster_locks_and_ship_suggestions.sql`
  - Ship roster lock and suggestion support.
- `20260519173500_rename_roster_locks_to_ship_roster_locks.sql`
  - Clarified that locks affect ship roster only, not crew assignment.
- `20260519181500_fleet_request_helpers.sql`
  - Helper functions for fleet requests.
- `20260519183500_read_models.sql`
  - Read models for the frontend.
- `20260519190000_add_tractor_beam_subcategory.sql`
  - Adds Tractor Beam as a ship subcategory.
- `20260519203000_fleet_event_messages.sql`
  - Adds event messages, message tags, and acknowledgements for assignment/change workflows.

Generated SQL exists under:

- `supabase/generated/wiki-vehicles-sync.sql`
- `supabase/generated/wiki-vehicles-sync/`
- `supabase/generated/staffing-templates/`

Smoke/verification SQL exists under:

- `supabase/tests/`
- `supabase/verification/`

## Sync And Data Tooling Completed

Scripts exist under:

- `scripts/wiki-sync/`
  - Normalize Wiki vehicle data.
  - Build SQL for ship, category, media, and subcategory records.
  - Generate Wiki vehicle sync SQL.
- `scripts/staffing-templates/`
  - Derive initial staffing templates.
  - Generate staffing template SQL.
  - Keep single-seat fighters pilot-only.
  - Add turret gunner requirements for multi-seat fighters.
  - Keep Perseus standard lean and full crew broader.
- `scripts/permissions/`
  - Tests role/page permission rules.

Important current limitation: the ship position templates still need human review. The user wanted a spreadsheet/workbook workflow to check every ship, whether it should be included, and the quantities for Skeleton, Standard, and Full Crew.

## Frontend Work Completed

The frontend is a React/Vite app.

Main files:

- `src/App.tsx`
- `src/styles.css`
- `src/lib/types.ts`
- `src/lib/fallbackData.ts`
- `src/lib/supabase.ts`
- `src/lib/fanKitAssets.ts`
- `src/lib/permissions.ts`

Implemented frontend features:

- Dark Star Citizen-style UI using black/dark gray with red, orange, and gold highlights.
- No purple/blue theme direction.
- Fan kit manufacturer logos beside ship names.
- Fan kit fonts wired into the UI.
- Smaller ship images and denser roster layout.
- List/island-style fleet cards.
- Ship category filter rail.
- `All` now lives under the `Ship Category` section, above `Capital`.
- Team filters for Unassigned, Alpha, Beta, Charlie, Delta, Echo, Foxtrot, Golf, Hotel.
- Fleet Setup page for compact fleet design.
- Fleet setup can add exact ships or category/type requests.
- Fleet setup rows show ship/request, team, profile, crew count, position summary, edit, and remove.
- Fleet setup rows can be removed with confirmation.
- Fleet setup position edit modal exists.
- Crew/member rail on the right with search.
- Members can be grouped by availability or assigned ship/group.
- Role-aware top-left navigation:
  - Fleet Setup
  - Operation View
  - Crew View
- Temporary `Viewing As` selector exists for testing role permissions before auth is connected.
- Fleet Admiral can invite another member to become Fleet Admiral or officer.
- Role invitation modal appears for the affected member.
- Accepting a role refreshes the browser so the available screens update.
- Assignment change modal exists for moved crew members to acknowledge orders or request a change.
- Message history panel exists for recent operational changes.

## Visual And UX Decisions

- The app should feel like an operational fleet tool, not a marketing page.
- Cards and rows should be compact enough for real events with 20+ ships.
- Grid view should respond to screen width:
  - One column on phone/vertical narrow screens.
  - More columns as space allows.
  - About four wide on normal 16:9.
  - Up to five wide only on wide screens.
- Crew names and positions should be tight and scan-friendly.
- Crew should not need to understand Fleet Admiral setup controls.
- Fleet Admiral/officer management screens should eventually be cleaner and separate from crew signup screens.

## Position Taxonomy Under Review

The current requested role list for future spreadsheet/template review:

- Commander
- Pilot
- Copilot
- Chief engineer
- Engineering assistant
- Primary turret gunner
- Turret gunner
- Remote turret gunner
- Marine Lead
- Marine Rifleman
- Marine Medic
- Tractor Beam Operator
- Mining/salvage Operator
- Cargo hold logistics
- Scanning operator
- Torpedo operator
- Hangar Operations
- Doctor (Infirmary)

Priority order for active fleet planning:

1. Pilot
2. Turrets
3. Engineering
4. Everything else

Comms and scanning were deprioritized for the current event workflow.

## Planned Future Work

- Wire frontend state to Supabase instead of fallback data.
- Add real authentication and real current-user roles.
- Replace the temporary `Viewing As` selector with login/auth context.
- Build the position review spreadsheet into the real data workflow.
- Finish all ship position templates with human-reviewed Skeleton, Standard, and Full Crew counts.
- Add a clean Fleet Admiral command screen for approving/denying change requests.
- Add officer workflow for moving crew and ships between teams.
- Add crew-facing request workflow:
  - Bring ship.
  - Fill position.
  - Request team/ship/role change.
  - Receive approval/denial messaging.
- Persist message history and acknowledgements in Supabase.
- Add tagged messages by member, team, ship request, position, fleet, and command.
- Add live online/presence indicators.
- Add real-time updates for role changes, assignments, and messages.
- Later: add mission phase tabs using the reserved schema concepts.
- Later: connect to a separate crew terminal-style app.

## Current Verification

Most recent checks run successfully:

```bash
/Users/christophmayer/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test --experimental-strip-types scripts/permissions/permissions.test.ts
npm run test:data
npm run build
```

Results:

- Permission tests: 3 passing.
- Data tests: 13 passing.
- Production build: passing.

Browser checks were also performed at:

```text
http://127.0.0.1:5173/
```

Verified in browser:

- Fleet Admiral sees Fleet Setup, Operation View, and Crew View.
- Crew only sees Crew View.
- Fleet Admiral promotion modal appears for the promoted member.
- Fleet Setup edit-position modal opens from setup rows.

## Current Git State At Handoff

Committed app/database history at the time this handoff note was written includes:

```text
b6f9eda feat: add role-aware fleet views
71743cb feat: add dedicated fleet setup page
737384d feat: add catalog fleet setup and message history
eb7944b feat: add roster removal and position quantities
49155c9 feat: add fleet setup and check-in workflow
8d67216 fix: scale fleet grid by screen width
533fb40 feat: sharpen fleet roster signup UI
8a6a301 feat: compact fleet crew roster UI
cd4dcfa feat: use fan kit fleet visuals
313977d feat: add tractor beam ship subcategory
cdaad1d feat: scaffold fleet planner app shell
b172d5c feat: add fleet read models
67a3365 feat: add fleet request helper functions
884b3f5 feat: generate suggested staffing templates
92827a6 refactor: clarify ship roster locks
8bc1d54 feat: add fleet roster locks and ship suggestions
41c1290 feat: add Wiki vehicle sync tooling
8064cca docs: define first ship sync rules
428c3b6 test: add backend schema verification queries
807a8bc feat: add backend database schema
```

Untracked local items at handoff include downloaded fan kit folders, notes, and output artifacts. They were intentionally not committed unless needed later:

- `Fankit_2025_11_19/`
- `RSI Star Citizen Fankit_2025_06_03/`
- `docs/superpowers/specs/2026-05-19-crewterminal-discovery-notes.md`
- `docs/superpowers/specs/2026-05-19-future-feature-requests.md`
- `outputs/`

## Restart Steps After Moving Folder

After moving to Google Drive, keep the hidden `.git` directory with the project.

Recommended restart:

```bash
cd "/path/to/CIG Fleet App"
npm install
npm run dev
```

Then open:

```text
http://127.0.0.1:5173/
```

For Supabase-linked work:

```bash
supabase login
supabase link --project-ref brqrztrfeivrpywtummz
```

Do not commit `.env` files or Supabase `.temp` files. Recreate local environment variables on each computer as needed:

```text
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

## Caution For Google Drive

Syncing `node_modules`, `dist`, and hidden Git internals through cloud drive software can be noisy. The repository ignores `node_modules` and `dist`, so the preferred approach on each computer is to sync the source files and run `npm install` locally.

If Git starts acting strangely after the move, verify that the `.git` folder copied completely and that Google Drive is not still mid-sync.
