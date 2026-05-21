# Fleet Command Reviewed Staffing Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Fleet Setup use reviewed ship-position templates and let officers customize all reviewed positions before adding a fleet line.

**Architecture:** Add a Supabase read model for reviewed templates, load it through `src/lib/supabase.ts`, and isolate preset/customization mapping in `src/lib/fleetSetup.ts`. Keep `src/App.tsx` responsible for state and rendering only, with existing fallback data preserved when live data is missing.

**Tech Stack:** React, TypeScript, Supabase, PostgreSQL views, Node test runner, Vite.

---

### Task 1: Reviewed Staffing Mapping

**Files:**
- Create: `src/lib/fleetSetup.ts`
- Test: `scripts/fleet-command/fleetSetup.test.ts`

- [ ] Write failing tests for profile mapping, customization rows, and fallback behavior.
- [ ] Run `node --test --experimental-strip-types scripts/fleet-command/fleetSetup.test.ts` and confirm the tests fail because the module does not exist.
- [ ] Implement `src/lib/fleetSetup.ts` with typed helpers for reviewed template rows, position rows, profile totals, and custom modal seeding.
- [ ] Run the focused test and confirm it passes.

### Task 2: Supabase Read Model And Loader

**Files:**
- Create: `supabase/migrations/20260521210000_ship_staffing_template_summary.sql`
- Modify: `src/lib/types.ts`
- Modify: `src/lib/supabase.ts`
- Modify: `supabase/tests/read_models_smoke.sql`

- [ ] Write a database smoke assertion that verifies reviewed Scorpius Standard exposes Pilot and Turret Gunner through the new read model.
- [ ] Run `npm run db:test` and confirm it fails because the view does not exist.
- [ ] Add the `ship_staffing_template_summary` view and grant read access.
- [ ] Add the TypeScript row type and frontend loader.
- [ ] Run `npm run db:test` and the focused frontend tests.

### Task 3: Fleet Setup UI Wiring

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css` only if spacing is needed for the changed labels.

- [ ] Wire reviewed template rows into setup state.
- [ ] Update ship selection and profile selection so reviewed presets drive crew target and generated positions.
- [ ] Change the Custom control to a clear `Customize` action that opens all reviewed positions for the selected ship.
- [ ] Applying the modal should switch the active setup profile to `custom` and use the edited quantities for the next fleet line.
- [ ] Preserve Ship Type fallback behavior.

### Task 4: Verification And Commit

**Files:**
- Modify: `docs/handoff/project-change-log.md`

- [ ] Add a change-log entry for reviewed staffing-driven Fleet Setup.
- [ ] Run `npm test`.
- [ ] Run `npm run db:test`.
- [ ] Run `npm run build`.
- [ ] Start the app and smoke check Fleet Setup with a reviewed ship.
- [ ] Commit with `feat: use reviewed staffing in fleet setup`.
