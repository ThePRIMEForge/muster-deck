# Fleet Command Member Assignment Hydration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hydrate the member rail from persisted demo crew assignments so saved assignments are visible in both ship rosters and member groups after reload.

**Architecture:** Keep fallback members as the prototype member list, but clear stale local assignment ids when the persisted demo event is active. Load assigned demo member display names and request metadata from Supabase, then map those assignments back onto matching fallback members by display name.

**Tech Stack:** React, TypeScript, Supabase/Postgres, Node test runner, Vite.

---

## File Structure

- Create `src/lib/fleetMembers.ts`: member-assignment hydration helper.
- Create `scripts/fleet-command/fleetMembers.test.ts`: focused test coverage for the helper.
- Modify `src/lib/supabase.ts`: add `loadDemoMemberAssignments`.
- Modify `src/App.tsx`: hydrate members on initial load and after persisted assignment reloads.
- Modify `docs/handoff/project-change-log.md`: record the decision and follow-up.

## Tasks

### Task 1: Mapping Test

- [ ] Add a failing test proving persisted assignment rows map display names to fallback members and clear stale fallback assignment ids.
- [ ] Run `node --test --experimental-strip-types scripts/fleet-command/fleetMembers.test.ts` and confirm it fails because the helper does not exist.
- [ ] Implement `hydrateMembersFromPersistedAssignments`.
- [ ] Rerun the focused test.

### Task 2: Supabase Loader

- [ ] Add `loadDemoMemberAssignments` to `src/lib/supabase.ts`.
- [ ] Return display name, request id, team name, ship name, and category key for active assigned ship-position assignments.

### Task 3: App Wiring

- [ ] Use the loader during initial Supabase load to hydrate members.
- [ ] Use the loader after successful persisted member assignment.
- [ ] Keep local fallback behavior when Supabase is unavailable or errors.

### Task 4: Verification

- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Browser smoke: assign a member, reload, confirm the member appears under the assigned ship group in the member rail.

### Task 5: Commit

- [ ] Add the change-log entry without staging unrelated visual identity changes.
- [ ] Stage only this slice and commit with `feat: hydrate persisted member assignments`.
