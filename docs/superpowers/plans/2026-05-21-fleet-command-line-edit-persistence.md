# Fleet Command Line Edit Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist basic edits to saved Fleet Setup lines so officers can move a saved line between teams or remove it without losing those changes on reload.

**Architecture:** Keep using the prototype `DEMO-DRAFT` event helpers while real authenticated event ownership is still pending. Add focused security-definer RPCs that only operate on demo-event ship requests, then wire the existing UI actions to call those helpers when persistence is active and fall back to local state when it is not.

**Tech Stack:** React, TypeScript, Supabase/Postgres, SQL migrations, pgTAP smoke tests, Vite, Node test runner.

---

## File Structure

- Modify `supabase/migrations/20260521220000_demo_fleet_setup_persistence.sql`: add demo helpers for moving a saved fleet line to a team and removing a saved fleet line.
- Modify `supabase/tests/fleet_request_helpers_smoke.sql`: verify move and remove helper behavior inside the demo event.
- Modify `src/lib/supabase.ts`: add client helpers for the new RPCs.
- Modify `src/App.tsx`: call the persistence helpers from team-change and remove-confirm workflows when the demo persistence path is active.
- Modify `docs/handoff/project-change-log.md`: log the product/architecture decision.

## Tasks

### Task 1: Database Helper Tests

- [ ] Add smoke checks to `supabase/tests/fleet_request_helpers_smoke.sql` that move a demo Scorpius request from Alpha to Beta and confirm `fleet_event_ship_request_summary.team_name = 'Beta'`.
- [ ] Add smoke checks that remove a second demo request and confirm it no longer appears in `fleet_event_ship_request_summary`.
- [ ] Run `npm run db:test` and confirm it fails because `move_demo_fleet_ship_request_to_team` and `remove_demo_fleet_ship_request` do not exist.

### Task 2: Database Helper Implementation

- [ ] Add `move_demo_fleet_ship_request_to_team(target_fleet_event_ship_request_id uuid, target_team_key text)` in the demo migration.
- [ ] Add `remove_demo_fleet_ship_request(target_fleet_event_ship_request_id uuid)` in the demo migration.
- [ ] Grant execute on both helpers to `anon` and `authenticated`.
- [ ] Run `npm run db:test` and confirm the new smoke checks pass.

### Task 3: Frontend Wiring

- [ ] Add `moveDemoFleetShipRequestToTeam` and `removeDemoFleetShipRequest` in `src/lib/supabase.ts`.
- [ ] Update `moveRequestToTeam` in `src/App.tsx` to persist and reload when `persistedFleetSetupActive` is true, with local fallback on error.
- [ ] Update `confirmRemoveFleetLine` in `src/App.tsx` to remove the saved request and reload when `persistedFleetSetupActive` is true, with local fallback on error.
- [ ] Run `npm test` and `npm run build`.

### Task 4: Browser Smoke

- [ ] Start the local Vite app against the local Supabase stack.
- [ ] Ensure at least one saved fleet line exists.
- [ ] Move a saved setup row to another team, reload, and confirm the team sticks.
- [ ] Remove a saved setup row, reload, and confirm it stays removed.
- [ ] Stop the Vite dev server.

### Task 5: Commit

- [ ] Add the change-log entry.
- [ ] Run final `npm test`, `npm run build`, and `npm run db:test`.
- [ ] Stage only this slice and commit with `feat: persist demo fleet line edits`.
