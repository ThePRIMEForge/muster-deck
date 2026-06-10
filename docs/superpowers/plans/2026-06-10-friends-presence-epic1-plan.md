# Friends & Presence (Epic 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **For Blair (tech owner):** This is a sequenced, file-level plan for GitHub epic **#116**. It makes concrete recommendations for the items the spec left open (§9) and flags each one as **🔵 DECISION** so you can confirm or override before that task starts. Three of these gate the first migration — please weigh in on them first.

**Goal:** Ship the social foundation — friends, online presence, the two presence surfaces, and the privacy/safety controls — as a standalone release that works before any messaging exists.

**Architecture:** A new `social` domain. Friend relationships + blocks live in one Postgres table with RLS; presence is event-driven via Supabase Realtime Presence (no polling); two React surfaces (global Friends-Online panel, per-activity "Who's here" roster) consume a shared presence hook and the friend graph. Privacy/safety (who-can-DM-me, relationship gate, rate limits) are defined now so they exist before Epic 2.

**Tech Stack:** React 19 + Vite + TypeScript, Supabase (Postgres + RLS + Realtime), pgTAP DB smoke tests (`supabase/tests/*.sql`), `node --test` unit tests (`scripts/social/*.test.ts`), Playwright E2E (per #77, when available).

**Source spec:** `docs/superpowers/specs/2026-06-10-friends-presence-messaging-design.md`

---

## 🔵 Decisions to confirm before coding (spec §9)

These are recommendations; Blair confirms or overrides. The first three block Task 2's migration.

1. **Relationship-gate default** — default `dm_policy` for a new user. **Recommendation:** `org_and_activity` (org-mates + people in a shared activity can DM; strangers cannot). Alternatives: `everyone`, `friends`, `none`.
2. **Relationships schema shape** — store friend state + block on one `social_relationships` table (recommended, keeps the gate one query) vs. separate `friendships` + `blocks` tables.
3. **Realtime topology** — channel naming for presence (recommended: one global `presence:online` channel for the Friends-Online panel + one `presence:activity:<activityId>` channel per open activity for rosters). Confirms Task 1.
4. **Block-signal direction** — confirm a block is a mod/admin-facing signal only, not surfaced to the blocked user (assumed throughout).

---

## File Structure

**New files**
- `supabase/migrations/<ts>_social_relationships.sql` — friends + blocks table, RLS, helper functions.
- `supabase/migrations/<ts>_dm_policy_and_gate.sql` — `dm_policy` column + relationship-gate + rate-limit helpers.
- `supabase/tests/social_relationships_smoke.sql` — pgTAP smoke test for the friend graph + block.
- `supabase/tests/dm_gate_smoke.sql` — pgTAP smoke test for the gate + rate limits.
- `src/lib/social.ts` — client DB functions (send/accept/decline/remove/block/report) + types.
- `src/lib/usePresence.ts` — Realtime Presence hook (online + activity context).
- `src/components/social/FriendsOnlinePanel.tsx` — global panel (Crossroads + Rally Point browse).
- `src/components/social/ActivityRoster.tsx` — per-activity "Who's here" roster.
- `src/components/social/PersonActions.tsx` — reusable block/report (+ add/remove) menu for any person row.
- `scripts/social/relationships.test.ts` — unit tests for pure logic in `social.ts` (gate predicate, grouping).

**Modified files**
- `src/lib/supabase.ts` — export the new client functions (follow existing function-export pattern).
- `src/components/foundation/AccountSettings.tsx` — add the "Who can DM me" control.
- `src/components/foundation/AdminPortal.tsx` + the Moderator page — surface block signals + reports.
- `src/App.tsx` — mount `FriendsOnlinePanel` in Crossroads + Rally Point browse; replace the `{members.length} online` mockup (~L1714) with `ActivityRoster` in Fleet/S.P.O.I.L.S.; **not** in Proving Ground.
- `package.json` — add `scripts/social/*.test.ts` to the `test` glob.

**Pattern references (read before starting):**
- Migration + RLS: `supabase/migrations/20260603000000_profile_rls_and_helpers.sql`
- pgTAP smoke test: `supabase/tests/shared_foundation_accounts_smoke.sql`
- Client DB functions: `src/lib/supabase.ts`; auth/viewer: `src/lib/useAuth.ts`; RBAC: `src/lib/permissions.ts`
- Existing anchors: `notification_preferences` (has `direct_messages_enabled`, `group_messages_enabled`), `profiles.primary_org`, `profiles.account_status`, `profiles.last_seen_at`.

---

## Task 1 — Realtime foundation (#118)

**Files:** Create `src/lib/usePresence.ts`. No migration (presence state is ephemeral in Realtime; `last_seen_at` already exists).

🔵 Confirms Decision 3 (channel topology).

- [ ] **Step 1 — Document the channel convention.** At the top of `usePresence.ts`, a comment block defining: `presence:online` (global, all signed-in users; payload `{ profileId, displayName, activity }`), and `presence:activity:<activityId>` (joined only while viewing that activity). `activity` is one of `crossroads | rally_browse | fleet:<id> | spoils:<id>` (never `proving_ground`).
- [ ] **Step 2 — Implement the hook.** `usePresence(activity: ActivityContext)` subscribes to `presence:online`, `track()`s the local user with current `activity`, updates the tracked payload when `activity` changes (event-driven — no `setInterval`), and `untrack`s/unsubscribes on unmount. Returns `{ onlineByProfileId: Map<string, PresencePayload> }`.
- [ ] **Step 3 — Write `last_seen_at` on disconnect.** On unmount/`beforeunload`, call a `touch_last_seen()` RPC (add to the Task 2 migration). Tolerate failure silently.
- [ ] **Step 4 — Manual verification.** Run `npm run dev`, open two browsers signed in as two accounts; confirm each appears in the other's `presence:online` set within ~2s and disappears on tab close. Document the check in the PR.
- [ ] **Step 5 — Commit.** `git add src/lib/usePresence.ts && git commit -m "feat(social): realtime presence hook + channel conventions (#118)"`

> No automated test here — Realtime presence is integration-level; Task 4 adds the consuming UI and Playwright covers it once #77 lands. Note this explicitly in the PR rather than faking a unit test.

---

## Task 2 — Friend graph + block (#119, #120 data layer)

**Files:** Create `supabase/migrations/<ts>_social_relationships.sql`, `supabase/tests/social_relationships_smoke.sql`. Modify `src/lib/social.ts`, `src/lib/supabase.ts`.

🔵 Confirms Decisions 2 (schema) and 4 (block direction). Recommended schema below assumes Decision 2 = single table.

- [ ] **Step 1 — Write the migration (single-table relationships + RLS).**

```sql
-- supabase/migrations/<ts>_social_relationships.sql
create type public.relationship_state as enum ('pending', 'accepted', 'blocked');

create table public.social_relationships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  state public.relationship_state not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint no_self_relationship check (requester_id <> addressee_id),
  constraint unique_pair unique (requester_id, addressee_id)
);

alter table public.social_relationships enable row level security;

-- A user can see rows they're part of.
create policy "see own relationships" on public.social_relationships
  for select using (auth.uid() in (
    (select user_id from public.profiles where id = requester_id),
    (select user_id from public.profiles where id = addressee_id)));

-- Only the requester creates a request; only the addressee can move pending->accepted;
-- either party can delete (remove/decline); either party can create a 'blocked' row.
-- (Full policy bodies follow the pattern in 20260603000000_profile_rls_and_helpers.sql.)

create or replace function public.touch_last_seen() returns void
  language sql security definer as $$
  update public.profiles set last_seen_at = now()
  where user_id = auth.uid(); $$;
```

- [ ] **Step 2 — Write the pgTAP smoke test.** In `supabase/tests/social_relationships_smoke.sql`, following `shared_foundation_accounts_smoke.sql`: plan(N); insert two profiles; assert request creates a `pending` row; accept flips to `accepted`; remove deletes it; a `blocked` row prevents a new request (assert via the helper from Step 4). Wrap in `begin; … rollback;`.
- [ ] **Step 3 — Run the DB test, expect pass.** `npm run db:test`. Expected: all `social_relationships_smoke` assertions pass.
- [ ] **Step 4 — Add helper RPCs** in the same migration: `send_friend_request(addressee)`, `respond_to_request(id, accept boolean)`, `remove_relationship(other)`, `block_user(other)`, `unblock_user(other)`, `are_blocked(a,b) returns boolean`. Re-run `npm run db:test`.
- [ ] **Step 5 — Client functions.** In `src/lib/social.ts`, typed wrappers calling the RPCs via the Supabase client (mirror `src/lib/supabase.ts` style). Export a `Relationship` type and a `groupRelationships(rows, presence)` pure function (used by the panel; unit-tested in Task 5).
- [ ] **Step 6 — Commit.** `git add supabase/migrations supabase/tests/social_relationships_smoke.sql src/lib/social.ts src/lib/supabase.ts && git commit -m "feat(social): friend graph + block table, RLS, RPCs (#119, #120)"`

---

## Task 3 — Block + Report UI (#120)

**Files:** Create `src/components/social/PersonActions.tsx`. Modify the Admin Portal + Moderator page to show block signals + reports; add a `social_reports` table to a migration.

- [ ] **Step 1 — Reports table migration.** Add `public.social_reports (id, reporter_id, reported_id, reason text, created_at, resolved boolean default false)` with RLS: a user inserts their own report; mods/admins select all. Use the admin-check helper from `20260603000100_admin_portal_rls_and_helpers.sql`.
- [ ] **Step 2 — `PersonActions` component.** A small menu taking `{ profileId, context }` rendering Add/Remove friend (state-aware), **Block**, **Report**. Block → `block_user` RPC; Report → opens a reason prompt then inserts a `social_reports` row. Reused by panel + roster.
- [ ] **Step 3 — Mod/admin surfacing.** In `AdminPortal.tsx` and the Moderator page, add a "Reports" list (open `social_reports`) and a passive "recent blocks" signal (count of `blocked` rows per user). Read-only for mods per existing role rules in `permissions.ts`.
- [ ] **Step 4 — Manual verification.** Account A blocks B → `are_blocked(A,B)` true and B no longer appears actionable to A; A reports B → the report shows in the Admin Portal. Document in PR.
- [ ] **Step 5 — Commit.** `git commit -m "feat(social): block + report actions and mod/admin surfacing (#120)"`

> The full **report-from-chat** flow with a link to the last thread is Epic 2 (#117) — it needs conversation threads. This task delivers the entry points + the report record + the block signal.

---

## Task 4 — Presence service consumed (#121)

**Files:** Modify `src/lib/usePresence.ts` (finalize the public shape) and add `ActivityContext` typing. No new test (integration-level; covered in Tasks 5–6 + Playwright).

- [ ] **Step 1 — Finalize `ActivityContext` type** (`crossroads | rally_browse | fleet:<id> | spoils:<id>`) exported from `usePresence.ts`.
- [ ] **Step 2 — Expose a selector** `useOnlineFriends(relationships)` that joins the friend list against `onlineByProfileId` and returns `{ online: Friend[], offline: Friend[] }`, each online friend carrying its `activity`.
- [ ] **Step 3 — Manual verification** as Task 1 Step 4, now asserting the activity label changes when the other account navigates Crossroads → Rally Point.
- [ ] **Step 4 — Commit.** `git commit -m "feat(social): presence selectors for friends + activity context (#121)"`

---

## Task 5 — Friends Online panel (#122)

**Files:** Create `src/components/social/FriendsOnlinePanel.tsx`, `scripts/social/relationships.test.ts`. Modify `src/App.tsx`, `package.json`.

- [ ] **Step 1 — Unit-test the pure grouping logic first.** In `scripts/social/relationships.test.ts` (node:test, strip-types — match `scripts/permissions/*.test.ts`):

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { groupRelationships } from '../../src/lib/social.ts';

test('groups accepted friends into online/offline by presence', () => {
  const rels = [{ otherId: 'a', state: 'accepted' }, { otherId: 'b', state: 'accepted' }];
  const presence = new Map([['a', { activity: 'rally_browse' }]]);
  const { online, offline } = groupRelationships(rels, presence);
  assert.equal(online.length, 1);
  assert.equal(online[0].otherId, 'a');
  assert.equal(offline.length, 1);
});
```

- [ ] **Step 2 — Add the test glob + run, expect fail.** Add `scripts/social/*.test.ts` to the `test` script in `package.json`. Run `npm test`. Expected: FAIL (`groupRelationships` not implemented / wrong shape).
- [ ] **Step 3 — Implement `groupRelationships`** in `src/lib/social.ts` to pass. Run `npm test`. Expected: PASS.
- [ ] **Step 4 — Build the panel.** `FriendsOnlinePanel` uses `useOnlineFriends`, renders online friends with activity label + `PersonActions`, offline collapsed. Visual treatment aligns to the rebrand where landed (don't block on it).
- [ ] **Step 5 — Mount it.** In `App.tsx`, render the panel in Crossroads and in Rally Point browse only. Confirm it does not appear in Proving Ground.
- [ ] **Step 6 — Typecheck + commit.** `npm run typecheck && git commit -m "feat(social): Friends Online panel in Crossroads + Rally Point (#122)"`

---

## Task 6 — "Who's here" roster (#124)

**Files:** Create `src/components/social/ActivityRoster.tsx`. Modify `src/App.tsx` (replace the `{members.length} online` mockup ~L1714).

- [ ] **Step 1 — Component.** `ActivityRoster({ activityId, participants })` subscribes to `presence:activity:<activityId>`, lists participants (present + signed-up), highlights those who are accepted friends, each row with `PersonActions`. `participants` comes from the activity's existing signup data (Fleet op crew; S.P.O.I.L.S. settlement members where available).
- [ ] **Step 2 — Wire into Fleet + S.P.O.I.L.S.** Replace the mockup member rail in `App.tsx` with `ActivityRoster` for Fleet operations and S.P.O.I.L.S. settlements. **Do not** mount it in Proving Ground.
- [ ] **Step 3 — Manual verification.** In a Fleet op with two signed-up accounts, both appear; the one who is a friend is highlighted; presence dot reflects online state.
- [ ] **Step 4 — Typecheck + commit.** `npm run typecheck && git commit -m "feat(social): Who's here roster in Fleet + S.P.O.I.L.S. (#124)"`

> S.P.O.I.L.S. is still draft — wire to whatever participant list exists; where it doesn't yet, the roster renders presence-only and the signup wiring lands with the S.P.O.I.L.S. pillar (#107 acceptance criterion).

---

## Task 7 — Privacy & safety (#123)

**Files:** Create `supabase/migrations/<ts>_dm_policy_and_gate.sql`, `supabase/tests/dm_gate_smoke.sql`. Modify `AccountSettings.tsx`, `src/lib/social.ts`.

🔵 Confirms Decision 1 (default policy).

- [ ] **Step 1 — Migration.** Add `dm_policy` enum (`everyone | org | friends | none`) — recommend storing on `notification_preferences` (it already holds the per-user messaging toggles) or `profiles`; default per Decision 1. Add `can_open_thread(initiator, target) returns boolean` enforcing: blocked → false; else policy + relationship gate (friend OR shared `primary_org` OR shared activity). Add a `dm_rate_ok(initiator, target) returns boolean` using a lightweight counter (friend requests 20/day; cold DMs 5/hr).
- [ ] **Step 2 — pgTAP smoke test.** `supabase/tests/dm_gate_smoke.sql`: a stranger with no shared org/activity → `can_open_thread` false; same-org → true; blocked → false. Run `npm run db:test`, expect pass.
- [ ] **Step 3 — Settings UI.** In `AccountSettings.tsx`, a "Who can DM me" select bound to `dm_policy`. (No-op visible effect until Epic 2, but the setting persists and the gate is live for the relationship checks.)
- [ ] **Step 4 — Commit.** `git commit -m "feat(social): dm policy, relationship gate + rate-limit helpers (#123)"`

> The gate functions are consumed by Epic 2 when threads are created; shipping them now means messaging cannot launch without them.

---

## Self-Review

**Spec coverage:** §2 two lists → Tasks 5 (panel) + 6 (roster); Proving Ground exclusion → Tasks 5/6 explicit. §4 realtime + cadence → Task 1. §5.1 friend graph → Task 2. §5.2 presence + panels → Tasks 1/4/5/6. §5.3 privacy/safety (policy, gate, rate limit, block, block-signal) → Tasks 2/3/7. §6.3 report entry point → Task 3 (full chat-report flow correctly deferred to Epic 2). §6.4 pillar maturity → Task 6 note + #107/#108 criteria. All Epic-1 spec sections map to a task.

**Placeholder scan:** No "TBD"/"handle edge cases"/"write tests for the above" — RLS policy bodies point at the exact existing migration to copy, which is a concrete instruction, not a placeholder. Decision points are explicit recommendations, not blanks.

**Type consistency:** `ActivityContext` (Task 4) used identically in Tasks 1/5/6; `groupRelationships` / `useOnlineFriends` names consistent across `social.ts`, Task 5, Task 6; `can_open_thread` / `are_blocked` / `dm_rate_ok` named consistently across Tasks 2 and 7.

---

## Sequencing & dependencies

```
Task 2 (friend graph) ──┬── Task 3 (block/report UI)
Task 1 (realtime)    ───┼── Task 4 (presence selectors) ── Task 5 (panel)
                        │                                └─ Task 6 (roster)
Task 2 ─────────────────┴── Task 7 (gate, needs relationships + org data)
```

Critical path: **Decisions 1–4 → Task 2 → Tasks 4/5 → Task 6**. Tasks 1 and 2 can start in parallel once the realtime decision is made.
