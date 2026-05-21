# Fleet Command Draft Setup Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Save Fleet Setup ship lines to a Supabase-backed draft operation while preserving the current local fallback behavior.

**Architecture:** Add a small demo draft-event API layer in Supabase for this prototype slice, then load the draft setup through the existing read models. The frontend keeps fallback data when Supabase is unavailable, but when live data is available it calls RPC helpers to add ship/category requests and reloads the persisted setup table.

**Tech Stack:** React, TypeScript, Supabase JS, PostgreSQL security-definer functions, pgTAP smoke tests, Node test runner.

---

### Task 1: Database Draft Setup Helpers

**Files:**
- Create: `supabase/migrations/20260521220000_demo_fleet_setup_persistence.sql`
- Modify: `supabase/tests/fleet_request_helpers_smoke.sql`

- [ ] Write a failing smoke assertion for a demo draft event helper and persisted request creation.
- [ ] Add `ensure_demo_fleet_event()` to create or reuse one draft event and the standard team rows.
- [ ] Add `create_demo_fleet_ship_request(...)` to resolve ship/category/team/profile input and call `create_fleet_event_ship_request_with_positions`.
- [ ] Add read policies needed for anon/authenticated prototype reads of fleet setup summaries.
- [ ] Run `npm run db:test`.

### Task 2: Frontend Persistence Mapping

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/lib/supabase.ts`
- Modify: `src/lib/fleetSetup.ts`
- Modify: `scripts/fleet-command/fleetSetup.test.ts`

- [ ] Add TypeScript row and command types for persisted fleet setup.
- [ ] Add loaders for the demo event, teams, fleet request summaries, and request positions.
- [ ] Add a tested mapper from persisted request summaries plus position rows into `FleetShipRequest`.
- [ ] Keep fallback behavior when Supabase is not configured or load fails.

### Task 3: Wire Add Fleet Line To Supabase

**Files:**
- Modify: `src/App.tsx`

- [ ] Load persisted Fleet Setup when Supabase is live.
- [ ] Make `addFleetLine` call the persistence helper for live setup.
- [ ] For Custom profile, call `replace_fleet_event_positions` after the request is created.
- [ ] Reload persisted Fleet Setup after add.
- [ ] Keep the existing local add behavior when Supabase is unavailable.

### Task 4: Verification And Commit

**Files:**
- Modify: `docs/handoff/project-change-log.md`

- [ ] Add a project change-log entry.
- [ ] Run `npm test`.
- [ ] Run `npm run db:test`.
- [ ] Run `npm run build`.
- [ ] Browser-smoke Fleet Setup against local Supabase by adding a reviewed ship line.
- [ ] Commit with `feat: persist draft fleet setup lines`.
