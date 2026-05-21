# Fleet Command Assignment Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist officer crew assignments for the prototype Fleet Command operation so assigned members survive reloads.

**Architecture:** Keep the existing local drag-and-drop behavior as fallback. Add prototype Supabase helpers for the `DEMO-DRAFT` operation that ensure demo members exist, assign a member to an available position on a saved fleet line, and expose persisted assignments through the existing setup loader. Keep this scoped to ship-position assignments only.

**Tech Stack:** React, TypeScript, Supabase/Postgres, SQL migrations, pgTAP smoke tests, Node test runner, Vite.

---

## File Structure

- Modify `supabase/migrations/20260521220000_demo_fleet_setup_persistence.sql`: add prototype demo-member and assignment helper functions.
- Modify `supabase/tests/fleet_request_helpers_smoke.sql`: verify the assignment helper creates a member assignment and the request summary counts it.
- Modify `src/lib/fleetSetup.ts`: map persisted assignment rows plus member names into the visible crew list.
- Modify `scripts/fleet-command/fleetSetup.test.ts`: cover assigned crew overlay and remaining open slots.
- Modify `src/lib/supabase.ts`: load assignments and members for the demo event, and add a helper to assign demo members.
- Modify `src/App.tsx`: call the persistence helper from the member-drop workflow when Supabase is active, with local fallback on error.
- Modify `docs/handoff/project-change-log.md`: record the implementation decision and follow-up.

## Tasks

### Task 1: Mapping Test

- [ ] Add a failing test in `scripts/fleet-command/fleetSetup.test.ts` showing that `mapPersistedFleetRequests` renders an assigned member name for a persisted assignment and leaves the remaining position slot open.
- [ ] Run `node --test --experimental-strip-types scripts/fleet-command/fleetSetup.test.ts` and confirm it fails because assignment rows are not mapped yet.
- [ ] Update `src/lib/fleetSetup.ts` to accept assignment/member rows and overlay assigned crew onto position slots.
- [ ] Rerun the focused test and confirm it passes.

### Task 2: Database Helper Test

- [ ] Add a failing smoke check in `supabase/tests/fleet_request_helpers_smoke.sql` that calls `assign_demo_member_to_fleet_position` for the demo Scorpius line.
- [ ] Run `npm run db:test` and confirm it fails because the helper does not exist yet.
- [ ] Update `supabase/migrations/20260521220000_demo_fleet_setup_persistence.sql` with `ensure_demo_fleet_member` and `assign_demo_member_to_fleet_position`.
- [ ] Rerun `npm run db:test` and confirm the demo assignment appears in `assignments` and increments `assigned_position_count`.

### Task 3: Frontend Persistence Wiring

- [ ] Update `src/lib/supabase.ts` so `loadDemoFleetSetup` fetches assigned ship-position rows and member display names for the demo event.
- [ ] Add `assignDemoMemberToFleetPosition` in `src/lib/supabase.ts`.
- [ ] Update `src/App.tsx` so `handleMemberDrop` uses the persistence helper when the demo setup is active, reloads the saved setup afterward, and falls back to the existing local behavior if persistence fails.
- [ ] Run `npm test` and `npm run build`.

### Task 4: Browser Smoke

- [ ] Start the Vite app against the local Supabase stack.
- [ ] Add a saved fleet line if the demo operation is empty.
- [ ] Drag a member onto the saved fleet line.
- [ ] Reload the page and confirm the member assignment remains visible.
- [ ] Stop the Vite dev server.

### Task 5: Commit

- [ ] Run `git status --short`.
- [ ] Stage only the assignment persistence files.
- [ ] Commit with `feat: persist demo crew assignments`.
