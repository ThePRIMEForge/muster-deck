# Fleet Command Ship Roster Lock Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist prototype Fleet Command ship roster locks so the master lock and team locks survive reloads and affect saved fleet line summaries.

**Architecture:** Reuse existing `fleet_events.ship_roster_locked`, `teams.ship_roster_locked`, and `unlock_all_ship_rosters`. Add demo-only RPCs for loading and setting lock state on the `DEMO-DRAFT` event, then wire the existing lock buttons to those helpers when persistence is active. Keep locks scoped to ship roster suggestions/substitutions, not crew assignment.

**Tech Stack:** React, TypeScript, Supabase/Postgres, SQL migrations, pgTAP smoke tests, Vite, Node test runner.

---

## File Structure

- Modify `supabase/migrations/20260521220000_demo_fleet_setup_persistence.sql`: add demo lock state, master lock, team lock, and unlock-all helpers.
- Modify `supabase/tests/fleet_request_helpers_smoke.sql`: verify demo master and team locks affect request summary state and can be cleared.
- Modify `src/lib/supabase.ts`: add `loadDemoFleetLockState`, `setDemoFleetMasterLock`, `setDemoFleetTeamLock`, and `unlockAllDemoFleetShipRosters`.
- Modify `src/App.tsx`: load persisted locks and wire master/team/unlock-all buttons to Supabase with local fallback.
- Modify `docs/handoff/project-change-log.md`: record the decision and follow-up.

## Tasks

### Task 1: Database Helper Tests

- [ ] Add smoke checks to `supabase/tests/fleet_request_helpers_smoke.sql` proving that `set_demo_fleet_master_lock(true)` marks a demo request as effectively locked.
- [ ] Add smoke checks proving `set_demo_fleet_team_lock('beta', true)` locks a Beta request while the master lock is off.
- [ ] Add smoke checks proving `unlock_all_demo_ship_rosters()` clears master and team locks.
- [ ] Run `npm run db:test` and confirm failure because the new demo lock helpers do not exist.

### Task 2: Database Helper Implementation

- [ ] Add `set_demo_fleet_master_lock(target_locked boolean)`.
- [ ] Add `set_demo_fleet_team_lock(target_team_key text, target_locked boolean)`.
- [ ] Add `unlock_all_demo_ship_rosters()`.
- [ ] Add `demo_fleet_lock_state` read helper returning master lock plus team rows.
- [ ] Grant execute to `anon` and `authenticated`.
- [ ] Run `npm run db:test` and confirm the smoke checks pass.

### Task 3: Frontend Wiring

- [ ] Add lock helper functions in `src/lib/supabase.ts`.
- [ ] Update the initial Supabase load in `src/App.tsx` to hydrate `masterLocked` and `lockedTeams`.
- [ ] Wire the master lock button, team lock buttons, and Unlock All action to the persistence helpers when active.
- [ ] Keep the existing local lock behavior when Supabase is unavailable.
- [ ] Run `npm test` and `npm run build`.

### Task 4: Browser Smoke

- [ ] Start the local Vite app against the local Supabase stack.
- [ ] Ensure a saved fleet line exists.
- [ ] Toggle the master ship roster lock, reload, and confirm it remains locked.
- [ ] Toggle a team lock, reload, and confirm it remains locked.
- [ ] Use Unlock All, reload, and confirm locks clear.
- [ ] Stop the Vite dev server.

### Task 5: Commit

- [ ] Add the change-log entry.
- [ ] Run final `npm test`, `npm run build`, and `npm run db:test`.
- [ ] Stage only this slice and commit with `feat: persist demo roster locks`.
