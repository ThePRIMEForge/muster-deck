# Rally Point — Foundation (data model + domain logic) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Rally Point backend foundation — Postgres schema + RLS + read-model view, and a fully-tested pure-TypeScript domain module (status derivation, crew progress, Patreon entitlement, draft validation, row→domain mapping) — so the data-access layer and UI sub-projects have a typed, tested base to build on.

**Architecture:** Mirrors existing pillars. A single Supabase migration adds Rally Point tables, auto-enabled RLS policies, and a `rally_listing_summary` read view. A single focused module `src/lib/rallyPoint.ts` holds Rally Point's domain types and pure functions (no I/O), unit-tested with Node's native test runner under `scripts/rally-point/`. Supabase queries and React screens are **separate sub-project plans** (see Roadmap).

**Tech Stack:** Supabase (Postgres + RLS), TypeScript, Node `node:test` (`--experimental-strip-types`), Vite/React (later sub-projects).

---

## Scope & decomposition

Rally Point is too large for one plan. It splits into sub-projects, each its own spec→plan→build cycle (this plan is ①):

1. **① Foundation — data model + domain logic** ← *this plan*. Schema, RLS, view, pure typed helpers + tests.
2. **② Data-access layer** — `src/lib/rallyPointApi.ts`: load/post/join/leave/kick/message queries + RPCs, mapped through ①'s types.
3. **③ Discover + Listing (read)** — rust `.rally-point-shell` CSS skin, immersive frame, browse board + listing detail rendering real data.
4. **④ Post an Op + Join/Leave/Kick (write)** — creation form, instant-claim, host moderation.
5. **⑤ Op Channel + status updates** — in-app messaging + auto system messages on edits; emits to Notifications epic.
6. **⑥ Tier-2/3 features** — Patreon entitlement wiring: synced Discord event + custom header-image upload (Tier 2, storage + moderation); **cross-module handoff** to Fleet Command / S.P.O.I.L.S. / Proving Ground (Tier 3 — one seeding slice per target module).

Source spec: [`2026-06-15-rally-point-design-update.md`](../specs/2026-06-15-rally-point-design-update.md) (+ the 2026-06-10 draft it extends).

**Patreon tier mapping (reconciled with existing `app_patreon_tier` enum):** `captain` = Tier 1 (badge only), `admiral` = Tier 2 (feature unlocks — the value tier), `praetorian` = Tier 3 (tournaments + cross-module handoff). Tier-2 features (Discord event, custom image) require rank ≥ `admiral`; the **Tier-3 cross-module handoff** requires `praetorian`.

**Known dependencies deferred (documented, not built here):** friends-only / org-only listing visibility depend on the Friends & Presence epic's `friendships` table and RSI/org verification — this plan ships **public + owner** read policies and leaves friends/org visibility for when those epics land. System (author-null) op-messages are inserted via a security-definer RPC built in sub-project ⑤.

---

## File Structure

- **Create** `supabase/migrations/20260615120000_rally_point_schema.sql` — tables, enums, RLS policies, `rally_listing_summary` view, `current_profile_id()` helper. One migration, one responsibility (Rally Point persistence).
- **Create** `supabase/tests/rally_point_smoke.sql` — pgTAP smoke test (tables exist, RLS on, view returns rows), run by the existing `npm run db:test`.
- **Create** `src/lib/rallyPoint.ts` — Rally Point domain types + pure functions. No Supabase imports, no I/O — pure and unit-testable, mirroring `src/lib/fleetSetup.ts`.
- **Create** `scripts/rally-point/rallyPoint.test.ts` — Node `node:test` unit tests for the module.
- **Modify** `package.json` — add `scripts/rally-point/*.test.ts` to the `test` script glob.

No other files change in this plan. (`src/lib/foundationTypes.ts` already declares the `rally_point` module key and `rally-browse` route — no edit needed.)

---

## Task 1: Patreon entitlement helpers + wire the test runner

**Files:**
- Modify: `package.json` (the `test` script)
- Create: `src/lib/rallyPoint.ts`
- Test: `scripts/rally-point/rallyPoint.test.ts`

- [ ] **Step 1: Point the test runner at the new test folder**

In `package.json`, the `test` script currently is:

```
"test": "node --test --experimental-strip-types scripts/permissions/*.test.ts scripts/foundation/*.test.ts scripts/fleet-command/*.test.ts scripts/staffing-templates/*.test.mjs scripts/wiki-sync/*.test.mjs",
```

Change it to add the rally-point glob (immediately after the fleet-command glob):

```
"test": "node --test --experimental-strip-types scripts/permissions/*.test.ts scripts/foundation/*.test.ts scripts/fleet-command/*.test.ts scripts/rally-point/*.test.ts scripts/staffing-templates/*.test.mjs scripts/wiki-sync/*.test.mjs",
```

- [ ] **Step 2: Write the failing test**

Create `scripts/rally-point/rallyPoint.test.ts`:

```typescript
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  patreonRank,
  canAttachDiscordEvent,
  canUploadCustomImage,
  canHandoffToModule,
} from '../../src/lib/rallyPoint.ts';

test('patreonRank orders the tiers none < captain < admiral < praetorian', () => {
  assert.equal(patreonRank('none'), 0);
  assert.equal(patreonRank('captain'), 1);
  assert.equal(patreonRank('admiral'), 2);
  assert.equal(patreonRank('praetorian'), 3);
});

test('Tier-2 features unlock at admiral and above only', () => {
  assert.equal(canAttachDiscordEvent('none'), false);
  assert.equal(canAttachDiscordEvent('captain'), false);
  assert.equal(canAttachDiscordEvent('admiral'), true);
  assert.equal(canAttachDiscordEvent('praetorian'), true);

  assert.equal(canUploadCustomImage('captain'), false);
  assert.equal(canUploadCustomImage('admiral'), true);
});

test('Tier-3 cross-module handoff unlocks at praetorian only', () => {
  assert.equal(canHandoffToModule('admiral'), false);
  assert.equal(canHandoffToModule('praetorian'), true);
});
```

- [ ] **Step 3: Run the test, verify it fails**

Run: `node --test --experimental-strip-types scripts/rally-point/rallyPoint.test.ts`
Expected: FAIL — cannot find module `../../src/lib/rallyPoint.ts`.

- [ ] **Step 4: Create the module with types + entitlement helpers**

Create `src/lib/rallyPoint.ts`:

```typescript
// Rally Point — pure domain types & logic. No I/O; unit-tested.

export type PatreonTier = 'none' | 'captain' | 'admiral' | 'praetorian';
export type CrewShape = 'open_group' | 'roles';
export type Visibility = 'public' | 'friends' | 'org';
export type RiskLevel = 'low' | 'medium' | 'high';
export type ListingStatus = 'recruiting' | 'full';

export const PATREON_TIER_RANK: Record<PatreonTier, number> = {
  none: 0,
  captain: 1,
  admiral: 2,
  praetorian: 3,
};

export function patreonRank(tier: PatreonTier): number {
  return PATREON_TIER_RANK[tier] ?? 0;
}

/** Tier-2 (admiral) and above unlock the synced Discord event. */
export function canAttachDiscordEvent(tier: PatreonTier): boolean {
  return patreonRank(tier) >= PATREON_TIER_RANK.admiral;
}

/** Tier-2 (admiral) and above can upload a custom header image (free = presets). */
export function canUploadCustomImage(tier: PatreonTier): boolean {
  return patreonRank(tier) >= PATREON_TIER_RANK.admiral;
}

/** Tier-3 (praetorian) only: port a live op into Fleet Command / S.P.O.I.L.S. / Proving Ground. */
export function canHandoffToModule(tier: PatreonTier): boolean {
  return patreonRank(tier) >= PATREON_TIER_RANK.praetorian;
}
```

- [ ] **Step 5: Run the test, verify it passes**

Run: `node --test --experimental-strip-types scripts/rally-point/rallyPoint.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add package.json src/lib/rallyPoint.ts scripts/rally-point/rallyPoint.test.ts
git commit -m "feat(rally-point): patreon entitlement helpers + test runner wiring"
```

---

## Task 2: Crew progress + status derivation

**Files:**
- Modify: `src/lib/rallyPoint.ts`
- Test: `scripts/rally-point/rallyPoint.test.ts`

- [ ] **Step 1: Add the failing tests**

Append to `scripts/rally-point/rallyPoint.test.ts`:

```typescript
import {
  totalSlots,
  crewProgress,
  deriveStatus,
  type RallyListing,
} from '../../src/lib/rallyPoint.ts';

function listing(partial: Partial<RallyListing>): RallyListing {
  return {
    id: 'l1', hostProfileId: 'h1', title: 'Op', description: '',
    crewShape: 'open_group', capacity: null, roles: [],
    activities: ['mining'], starSystems: ['stanton'], region: 'EU',
    startTime: '2026-06-20T20:00:00Z', timeCommitment: 'open_ended',
    risk: 'low', visibility: 'public', comePrepared: false, rsiVerifiedOnly: false,
    voiceLink: null, headerImage: { kind: 'preset', ref: 'preset-07' },
    discordEvent: null, languages: ['english'],
    vibe: { intensity: null, style: [], welcome: [], flags: [] },
    ...partial,
  };
}

test('totalSlots: roles sums slot counts; open group uses capacity (null = open-ended)', () => {
  assert.equal(totalSlots(listing({ crewShape: 'roles', roles: [
    { label: 'Pilot', slotCount: 1, ship: 'Scorpius' },
    { label: 'Gunner', slotCount: 1, ship: 'Scorpius' },
  ] })), 2);
  assert.equal(totalSlots(listing({ crewShape: 'open_group', capacity: 8 })), 8);
  assert.equal(totalSlots(listing({ crewShape: 'open_group', capacity: null })), null);
});

test('crewProgress reports filled/total and open-ended flag', () => {
  assert.deepEqual(crewProgress(listing({ crewShape: 'open_group', capacity: 8 }), 5),
    { filled: 5, total: 8, openEnded: false });
  assert.deepEqual(crewProgress(listing({ crewShape: 'open_group', capacity: null }), 3),
    { filled: 3, total: null, openEnded: true });
});

test('deriveStatus: full only when a finite total is reached; open-ended never full', () => {
  assert.equal(deriveStatus({ filled: 4, total: 4, openEnded: false }), 'full');
  assert.equal(deriveStatus({ filled: 3, total: 4, openEnded: false }), 'recruiting');
  assert.equal(deriveStatus({ filled: 99, total: null, openEnded: true }), 'recruiting');
});
```

- [ ] **Step 2: Run, verify failure**

Run: `node --test --experimental-strip-types scripts/rally-point/rallyPoint.test.ts`
Expected: FAIL — `totalSlots`/`crewProgress`/`deriveStatus`/`RallyListing` not exported.

- [ ] **Step 3: Implement the types + functions**

Append to `src/lib/rallyPoint.ts`:

```typescript
export type RallyRole = { label: string; slotCount: number; ship: string | null };

export type RallyVibe = {
  intensity: string | null;
  style: string[];
  welcome: string[];
  flags: string[];
};

export type RallyDiscordEvent = { title: string; when: string; going: number };

export type RallyListing = {
  id: string;
  hostProfileId: string;
  title: string;
  description: string;
  crewShape: CrewShape;
  capacity: number | null;        // open_group; null = open-ended (no cap)
  roles: RallyRole[];             // roles shape only
  activities: string[];
  starSystems: string[];
  region: string;
  startTime: string;              // ISO 8601 (UTC)
  timeCommitment: string;
  risk: RiskLevel;
  visibility: Visibility;
  comePrepared: boolean;          // true = "come prepared"; false = "we'll provide all you need"
  rsiVerifiedOnly: boolean;
  voiceLink: string | null;
  headerImage: { kind: 'preset' | 'custom'; ref: string };
  discordEvent: RallyDiscordEvent | null;
  languages: string[];
  vibe: RallyVibe;
};

export type CrewProgress = { filled: number; total: number | null; openEnded: boolean };

/** Total slots to fill: sum of role counts (roles) or capacity (open group; null = open-ended). */
export function totalSlots(listing: RallyListing): number | null {
  if (listing.crewShape === 'roles') {
    return listing.roles.reduce((sum, role) => sum + role.slotCount, 0);
  }
  return listing.capacity;
}

/** filled counts joined participants (host is tracked separately, not a participant row). */
export function crewProgress(listing: RallyListing, participantCount: number): CrewProgress {
  const total = totalSlots(listing);
  const openEnded = listing.crewShape === 'open_group' && listing.capacity === null;
  return { filled: participantCount, total, openEnded };
}

export function deriveStatus(progress: CrewProgress): ListingStatus {
  if (progress.openEnded || progress.total === null) return 'recruiting';
  return progress.filled >= progress.total ? 'full' : 'recruiting';
}
```

- [ ] **Step 4: Run, verify pass**

Run: `node --test --experimental-strip-types scripts/rally-point/rallyPoint.test.ts`
Expected: PASS (6 tests total).

- [ ] **Step 5: Commit**

```bash
git add src/lib/rallyPoint.ts scripts/rally-point/rallyPoint.test.ts
git commit -m "feat(rally-point): crew progress + status derivation (two crew shapes)"
```

---

## Task 3: Required-field validation for posting

**Files:**
- Modify: `src/lib/rallyPoint.ts`
- Test: `scripts/rally-point/rallyPoint.test.ts`

- [ ] **Step 1: Add the failing tests**

Append to `scripts/rally-point/rallyPoint.test.ts`:

```typescript
import { validateListingDraft, type ListingDraft } from '../../src/lib/rallyPoint.ts';

const completeDraft: ListingDraft = {
  activities: ['mining'],
  title: 'Org mining night',
  startTime: '2026-06-20T20:00:00Z',
  region: 'EU',
  timeCommitment: 'open_ended',
};

test('validateListingDraft: complete draft has no missing fields', () => {
  assert.deepEqual(validateListingDraft(completeDraft), []);
});

test('validateListingDraft: reports each missing required field by label', () => {
  assert.deepEqual(
    validateListingDraft({ activities: [], title: '  ', startTime: null, region: null, timeCommitment: null }),
    ['an activity', 'title', 'start time', 'region', 'time commitment']
  );
});

test('validateListingDraft: crew count is NOT required (open-ended allowed)', () => {
  // a draft with everything required but no crew/capacity is valid
  assert.deepEqual(validateListingDraft(completeDraft), []);
});
```

- [ ] **Step 2: Run, verify failure**

Run: `node --test --experimental-strip-types scripts/rally-point/rallyPoint.test.ts`
Expected: FAIL — `validateListingDraft`/`ListingDraft` not exported.

- [ ] **Step 3: Implement**

Append to `src/lib/rallyPoint.ts`:

```typescript
export type ListingDraft = {
  activities: string[];
  title: string;
  startTime: string | null;
  region: string | null;
  timeCommitment: string | null;
};

/** Required to post (spec §4.4). Crew count is intentionally optional / open-ended. */
export function validateListingDraft(draft: ListingDraft): string[] {
  const missing: string[] = [];
  if (!draft.activities || draft.activities.length === 0) missing.push('an activity');
  if (!draft.title || !draft.title.trim()) missing.push('title');
  if (!draft.startTime) missing.push('start time');
  if (!draft.region) missing.push('region');
  if (!draft.timeCommitment) missing.push('time commitment');
  return missing;
}
```

- [ ] **Step 4: Run, verify pass**

Run: `node --test --experimental-strip-types scripts/rally-point/rallyPoint.test.ts`
Expected: PASS (9 tests total).

- [ ] **Step 5: Commit**

```bash
git add src/lib/rallyPoint.ts scripts/rally-point/rallyPoint.test.ts
git commit -m "feat(rally-point): required-field validation for posting"
```

---

## Task 4: DB row → domain mapping

**Files:**
- Modify: `src/lib/rallyPoint.ts`
- Test: `scripts/rally-point/rallyPoint.test.ts`

- [ ] **Step 1: Add the failing test**

Append to `scripts/rally-point/rallyPoint.test.ts`:

```typescript
import { mapListingRow, type RallyListingRow, type RallyRoleRow } from '../../src/lib/rallyPoint.ts';

test('mapListingRow maps snake_case row + role rows into a RallyListing', () => {
  const row: RallyListingRow = {
    id: 'l1', created_by: 'host1', title: 'New Scorpius — gunner', description: 'merc bounty runs',
    crew_shape: 'roles', capacity: null,
    activities: ['bounty', 'ship_combat'], star_systems: ['pyro'], region: 'NA',
    start_time: '2026-06-20T21:00:00Z', time_commitment: '2h', risk: 'high',
    visibility: 'public', come_prepared: true, rsi_verified_only: true,
    voice_link: 'https://discord.gg/x', header_image_kind: 'custom', header_image_ref: 'https://img/x.png',
    discord_event: { title: 'ERT Sweep', when: 'Sat 21:00', going: 12 },
    languages: ['english', 'deutsch'],
    vibe_intensity: 'serious', vibe_style: ['mil_sim'], vibe_welcome: ['experienced'], vibe_flags: ['mic'],
  };
  const roleRows: RallyRoleRow[] = [
    { id: 'r2', listing_id: 'l1', label: 'Gunner', slot_count: 1, ship: 'Scorpius', sort_order: 1 },
    { id: 'r1', listing_id: 'l1', label: 'Pilot', slot_count: 1, ship: 'Scorpius', sort_order: 0 },
  ];

  const result = mapListingRow(row, roleRows);

  assert.equal(result.id, 'l1');
  assert.equal(result.hostProfileId, 'host1');
  assert.equal(result.crewShape, 'roles');
  assert.equal(result.comePrepared, true);
  assert.equal(result.headerImage.kind, 'custom');
  assert.deepEqual(result.activities, ['bounty', 'ship_combat']);
  assert.deepEqual(result.vibe, { intensity: 'serious', style: ['mil_sim'], welcome: ['experienced'], flags: ['mic'] });
  // roles sorted by sort_order
  assert.deepEqual(result.roles.map(r => r.label), ['Pilot', 'Gunner']);
  assert.equal(result.discordEvent?.going, 12);
});

test('mapListingRow tolerates null/absent optionals', () => {
  const row: RallyListingRow = {
    id: 'l2', created_by: 'host2', title: 'Mining night', description: '',
    crew_shape: 'open_group', capacity: 8,
    activities: ['mining'], star_systems: ['stanton'], region: 'EU',
    start_time: '2026-06-20T20:00:00Z', time_commitment: 'open_ended', risk: 'low',
    visibility: 'public', come_prepared: false, rsi_verified_only: false,
    voice_link: null, header_image_kind: 'preset', header_image_ref: 'preset-07',
    discord_event: null, languages: ['english'],
    vibe_intensity: null, vibe_style: [], vibe_welcome: [], vibe_flags: [],
  };
  const result = mapListingRow(row, []);
  assert.equal(result.voiceLink, null);
  assert.equal(result.discordEvent, null);
  assert.equal(result.capacity, 8);
  assert.deepEqual(result.roles, []);
});
```

- [ ] **Step 2: Run, verify failure**

Run: `node --test --experimental-strip-types scripts/rally-point/rallyPoint.test.ts`
Expected: FAIL — `mapListingRow`/`RallyListingRow`/`RallyRoleRow` not exported.

- [ ] **Step 3: Implement**

Append to `src/lib/rallyPoint.ts`:

```typescript
export type RallyListingRow = {
  id: string;
  created_by: string;
  title: string;
  description: string;
  crew_shape: CrewShape;
  capacity: number | null;
  activities: string[];
  star_systems: string[];
  region: string;
  start_time: string;
  time_commitment: string;
  risk: RiskLevel;
  visibility: Visibility;
  come_prepared: boolean;
  rsi_verified_only: boolean;
  voice_link: string | null;
  header_image_kind: 'preset' | 'custom';
  header_image_ref: string;
  discord_event: RallyDiscordEvent | null;
  languages: string[];
  vibe_intensity: string | null;
  vibe_style: string[];
  vibe_welcome: string[];
  vibe_flags: string[];
};

export type RallyRoleRow = {
  id: string;
  listing_id: string;
  label: string;
  slot_count: number;
  ship: string | null;
  sort_order: number;
};

export function mapListingRow(row: RallyListingRow, roleRows: RallyRoleRow[] = []): RallyListing {
  return {
    id: row.id,
    hostProfileId: row.created_by,
    title: row.title,
    description: row.description,
    crewShape: row.crew_shape,
    capacity: row.capacity,
    roles: roleRows
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((r) => ({ label: r.label, slotCount: r.slot_count, ship: r.ship })),
    activities: row.activities ?? [],
    starSystems: row.star_systems ?? [],
    region: row.region,
    startTime: row.start_time,
    timeCommitment: row.time_commitment,
    risk: row.risk,
    visibility: row.visibility,
    comePrepared: row.come_prepared,
    rsiVerifiedOnly: row.rsi_verified_only,
    voiceLink: row.voice_link,
    headerImage: { kind: row.header_image_kind, ref: row.header_image_ref },
    discordEvent: row.discord_event,
    languages: row.languages ?? [],
    vibe: {
      intensity: row.vibe_intensity,
      style: row.vibe_style ?? [],
      welcome: row.vibe_welcome ?? [],
      flags: row.vibe_flags ?? [],
    },
  };
}
```

- [ ] **Step 4: Run, verify pass**

Run: `node --test --experimental-strip-types scripts/rally-point/rallyPoint.test.ts`
Expected: PASS (11 tests total).

- [ ] **Step 5: Commit**

```bash
git add src/lib/rallyPoint.ts scripts/rally-point/rallyPoint.test.ts
git commit -m "feat(rally-point): map DB listing row + roles into domain type"
```

---

## Task 5: Migration — schema, RLS, read view

**Files:**
- Create: `supabase/migrations/20260615120000_rally_point_schema.sql`
- Create: `supabase/tests/rally_point_smoke.sql`

> Column names in this migration MUST match `RallyListingRow` / `RallyRoleRow` in Task 4 exactly (snake_case), so the data-access layer (sub-project ②) maps cleanly.

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/20260615120000_rally_point_schema.sql`:

```sql
-- Rally Point — LFG listings, participants, op channel.
-- RLS is auto-enabled by the global ensure_rls event trigger; policies added below.

-- Helper: resolve the current auth user's profile id (idempotent).
create or replace function public.current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.profiles where auth_user_id = auth.uid();
$$;

-- Enums
create type public.rally_crew_shape as enum ('open_group', 'roles');
create type public.rally_visibility as enum ('public', 'friends', 'org');
create type public.rally_risk as enum ('low', 'medium', 'high');
create type public.rally_message_kind as enum ('message', 'system');
create type public.rally_header_image_kind as enum ('preset', 'custom');

-- Listings
create table public.rally_listings (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 140),
  description text not null default '',
  crew_shape public.rally_crew_shape not null default 'open_group',
  capacity integer check (capacity is null or capacity > 0),
  activities text[] not null default '{}',
  star_systems text[] not null default '{}',
  region text not null,
  start_time timestamptz not null,
  time_commitment text not null,
  risk public.rally_risk not null default 'medium',
  visibility public.rally_visibility not null default 'public',
  come_prepared boolean not null default true,
  rsi_verified_only boolean not null default false,
  voice_link text,
  header_image_kind public.rally_header_image_kind not null default 'preset',
  header_image_ref text not null default 'preset-01',
  discord_event jsonb,
  languages text[] not null default '{}',
  vibe_intensity text,
  vibe_style text[] not null default '{}',
  vibe_welcome text[] not null default '{}',
  vibe_flags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rally_listings_activities_not_empty check (cardinality(activities) > 0)
);

create index rally_listings_start_time_idx on public.rally_listings (start_time);
create index rally_listings_activities_idx on public.rally_listings using gin (activities);
create index rally_listings_visibility_idx on public.rally_listings (visibility);

create trigger set_rally_listings_updated_at
before update on public.rally_listings
for each row execute function public.set_updated_at();

-- Role definitions (roles crew shape)
create table public.rally_listing_roles (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.rally_listings(id) on delete cascade,
  label text not null,
  slot_count integer not null default 1 check (slot_count > 0),
  ship text,
  sort_order integer not null default 0
);
create index rally_listing_roles_listing_idx on public.rally_listing_roles (listing_id);

-- Participants (joined crew; host is the listing.created_by, not a participant row)
create table public.rally_participants (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.rally_listings(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role_label text,
  ship_bringing text,
  joined_at timestamptz not null default now(),
  unique (listing_id, profile_id)
);
create index rally_participants_listing_idx on public.rally_participants (listing_id);

-- Op channel messages (system messages have null author_profile_id)
create table public.rally_op_messages (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.rally_listings(id) on delete cascade,
  author_profile_id uuid references public.profiles(id) on delete set null,
  kind public.rally_message_kind not null default 'message',
  body text not null,
  created_at timestamptz not null default now()
);
create index rally_op_messages_listing_idx on public.rally_op_messages (listing_id, created_at);

-- ---------- RLS policies ----------
-- Listings: public are world-readable; owner has full access.
-- NOTE: friends-only / org-only visibility depend on the Friends & Presence epic
-- (friendships table) and RSI/org verification; those policies are added when
-- those epics land. Until then, non-public listings are visible to their owner only.
create policy "rally_listings_read_public"
  on public.rally_listings for select to anon, authenticated
  using (visibility = 'public');

create policy "rally_listings_read_own"
  on public.rally_listings for select to authenticated
  using (created_by = public.current_profile_id());

create policy "rally_listings_insert_own"
  on public.rally_listings for insert to authenticated
  with check (created_by = public.current_profile_id());

create policy "rally_listings_update_own"
  on public.rally_listings for update to authenticated
  using (created_by = public.current_profile_id())
  with check (created_by = public.current_profile_id());

create policy "rally_listings_delete_own"
  on public.rally_listings for delete to authenticated
  using (created_by = public.current_profile_id());

-- Role definitions follow their listing's read; host writes.
create policy "rally_roles_read"
  on public.rally_listing_roles for select to anon, authenticated
  using (exists (
    select 1 from public.rally_listings l
    where l.id = listing_id
      and (l.visibility = 'public' or l.created_by = public.current_profile_id())
  ));

create policy "rally_roles_write_host"
  on public.rally_listing_roles for all to authenticated
  using (exists (select 1 from public.rally_listings l where l.id = listing_id and l.created_by = public.current_profile_id()))
  with check (exists (select 1 from public.rally_listings l where l.id = listing_id and l.created_by = public.current_profile_id()));

-- Participants: visible with the listing; self-join; self-leave or host-kick.
create policy "rally_participants_read"
  on public.rally_participants for select to anon, authenticated
  using (exists (
    select 1 from public.rally_listings l
    where l.id = listing_id
      and (l.visibility = 'public' or l.created_by = public.current_profile_id())
  ));

create policy "rally_participants_join_self"
  on public.rally_participants for insert to authenticated
  with check (profile_id = public.current_profile_id());

create policy "rally_participants_leave_or_kick"
  on public.rally_participants for delete to authenticated
  using (
    profile_id = public.current_profile_id()
    or exists (select 1 from public.rally_listings l where l.id = listing_id and l.created_by = public.current_profile_id())
  );

-- Op channel: crew-gated (host or participant) read + post.
create policy "rally_messages_read_crew"
  on public.rally_op_messages for select to authenticated
  using (
    exists (select 1 from public.rally_listings l where l.id = listing_id and l.created_by = public.current_profile_id())
    or exists (select 1 from public.rally_participants p where p.listing_id = listing_id and p.profile_id = public.current_profile_id())
  );

create policy "rally_messages_post_crew"
  on public.rally_op_messages for insert to authenticated
  with check (
    author_profile_id = public.current_profile_id()
    and (
      exists (select 1 from public.rally_listings l where l.id = listing_id and l.created_by = public.current_profile_id())
      or exists (select 1 from public.rally_participants p where p.listing_id = listing_id and p.profile_id = public.current_profile_id())
    )
  );

-- ---------- Read model ----------
create or replace view public.rally_listing_summary
with (security_invoker = true)
as
select
  l.*,
  coalesce(p.participant_count, 0)::integer as participant_count,
  case
    when l.crew_shape = 'roles'
      then coalesce((select sum(r.slot_count) from public.rally_listing_roles r where r.listing_id = l.id), 0)::integer
    else l.capacity
  end as total_slots
from public.rally_listings l
left join lateral (
  select count(*)::integer as participant_count
  from public.rally_participants pp
  where pp.listing_id = l.id
) p on true;
```

- [ ] **Step 2: Write the pgTAP smoke test**

Create `supabase/tests/rally_point_smoke.sql`:

```sql
begin;
select plan(6);

select has_table('public', 'rally_listings', 'rally_listings table exists');
select has_table('public', 'rally_listing_roles', 'rally_listing_roles table exists');
select has_table('public', 'rally_participants', 'rally_participants table exists');
select has_table('public', 'rally_op_messages', 'rally_op_messages table exists');

-- RLS is enabled on listings (auto-enabled by ensure_rls trigger)
select is(
  (select relrowsecurity from pg_class where oid = 'public.rally_listings'::regclass),
  true,
  'RLS enabled on rally_listings'
);

-- The read view exists and is queryable
select lives_ok(
  $$ select count(*) from public.rally_listing_summary $$,
  'rally_listing_summary view is queryable'
);

select * from finish();
rollback;
```

- [ ] **Step 3: Apply migrations and run the SQL test suite**

Run: `npm run db:test`
(Equivalent to `supabase db reset && npm run db:load-generated && supabase test db` — requires the local Supabase stack running via `supabase start`.)
Expected: migration `20260615120000_rally_point_schema.sql` applies cleanly and the 6 smoke assertions pass.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260615120000_rally_point_schema.sql supabase/tests/rally_point_smoke.sql
git commit -m "feat(rally-point): schema, RLS policies, and read-model view"
```

---

## Task 6: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Typecheck**

Run: `npm run typecheck`
Expected: PASS (no errors). `src/lib/rallyPoint.ts` is fully typed.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: PASS for `src/` (fix any reported issues in `rallyPoint.ts`).

- [ ] **Step 3: Full test suite**

Run: `npm test`
Expected: PASS — existing suites plus the 11 new `scripts/rally-point` tests.

- [ ] **Step 4: Final commit (if lint produced fixes)**

```bash
git add -A
git commit -m "chore(rally-point): lint + typecheck clean for foundation"
```

---

## Done criteria

- `npm test` passes including 11 new Rally Point unit tests.
- `npm run typecheck` and `npm run lint` clean.
- `npm run db:test` applies the migration and passes the smoke test.
- `src/lib/rallyPoint.ts` exports the domain types + pure functions the data-access layer (sub-project ②) and screens (③–⑥) will consume.

**Next sub-project:** ② Data-access layer (`src/lib/rallyPointApi.ts`) — needs its own short spec + plan, building Supabase load/post/join/leave/kick/message functions on top of these types and the migration. Friends/org visibility policies and the system-message RPC are picked up when their epics land.
