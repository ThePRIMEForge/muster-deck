# S.P.O.I.L.S. Slice 1: Ledger Spine (Design)

**Date:** 2026-06-16
**Status:** active
**Author:** Christoph (product) with Claude; for Blair (tech owner)
**Parent spec:** [S.P.O.I.L.S. Design](./2026-06-10-spoils-design.md) (#133)
**Epic:** [#107 S.P.O.I.L.S.](https://github.com/ThePRIMEForge/muster-deck/issues/107) · accent: **oxblood**

> First buildable slice of the S.P.O.I.L.S. module. Builds the structural foundation that
> every later slice hangs off: the Ledger object, its 5-state lifecycle, and the roster. No
> items, claims, valuation, or distribution math yet.

---

## 1 · Why this slice first

The parent spec describes a large module (roughly 14 in-scope capabilities plus a backlog).
It is too big for one implementation plan, so we are building it in slices. The **Ledger
Spine** is slice 1 because every other capability (intake, claims, adjudication, payouts, My
War Chest) attaches to a Ledger that already exists, already has a lifecycle, and already has
a roster. Building the spine first de-risks the rest and gives us a real screen to grow into.

**Build approach for this slice:** UI-first against typed in-memory / fallback data. No
Supabase migrations and no RLS yet. The in-memory store is written as the single seam we later
swap for real `supabase.ts`-style data access, so the UI does not change when the database
lands.

## 2 · Scope

### In
- New `spoils` module that replaces the "Draft Now" placeholder at `src/App.tsx` (the
  `rally-browse | spoils | proving-ground` branch).
- **Ledger list** (the route landing): a list of the viewer's ledgers, each showing its
  lifecycle state, plus an **Open a new Ledger** action.
- **Ledger detail** in **Layout A** (chosen during brainstorming): a horizontal 5-state
  stepper across the top, a body that splits into a working area plus a roster rail on the
  right, and an **Advance** control in the header.
- **5-state lifecycle**: STANDING UP → INTAKE → REQUISITION → ADJUDICATION → SETTLED. The QM
  can advance and revert along the order (no skipping). State drives the header tag and which
  controls show. Only STANDING UP has a real working area this slice; the other four render a
  labeled placeholder ("built in a later slice").
- **Roster**, three ways to populate:
  - **Manual add** (type a handle).
  - **Join code** (generated at create, displayed, copyable, with an open/closed indicator;
    auto-closes when the ledger advances into ADJUDICATION; QM can reopen).
  - **Import from event** (mocked source participant list this slice).
  - A demo-only **Simulate join** button next to the join code so the code-join flow can be
    felt before the backend exists. (Removed when real joins land.)
- **Per-ledger roles**: quartermaster, officer, member. Exactly one QM per ledger;
  reassigning moves the badge.
- **Moderation**: **kick** = remove the member and ban them from rejoining *this* ledger.
  Banned ids cannot be re-added or simulate-joined.
- **Confirmations** on destructive actions: kick/ban and state revert both go through a
  confirm dialog.

### Out (later slices)
Items / INTAKE, ranked claims, the adjudication board, valuation and UEX price sync, weighted
cash split, bank slots, SETTLED output and delivery note, CSV export, My War Chest, real
Supabase tables and RLS, live cross-pillar on-ramps (the Rally Point and Fleet Command "Start
a Spoils Ledger" buttons), and lifecycle notifications. The detail view leaves clearly labeled
placeholders where these land.

## 3 · Architecture

To avoid growing the 3000-plus-line `src/App.tsx`, SPOILS gets its own isolated module tree,
mirroring how `src/components/foundation/` is organized.

```
src/components/spoils/
  SpoilsModule.tsx      module root; owns view state (list <-> detail), renders the right screen
  LedgerList.tsx        landing: list of ledgers + "Open a new Ledger"
  LedgerDetail.tsx      layout A shell: header + stepper + body + roster rail
  LifecycleStepper.tsx  the 5-state horizontal tracker + Advance / revert control
  RosterRail.tsx        roster list, roles, kick/ban
  StandingUpPanel.tsx   the only live working area this slice (name, source, roster methods)
  ConfirmDialog.tsx     thin confirm wrapper for destructive actions (or reuse a foundation one if present)
src/lib/
  spoilsTypes.ts        Ledger, LedgerState, RosterMember, role/status enums
  spoilsData.ts         in-memory store + fallback seed (create / advance / roster mutations)
```

The `spoils` branch in `App.tsx` shrinks to mounting `<SpoilsModule viewer={foundationViewer} />`.
Components read and mutate only through `spoilsData.ts`; that module is the seam we later
replace with live data-access functions in the `src/lib/supabase.ts` pattern (query when
configured, fallback otherwise).

## 4 · Data shapes

```
LedgerState = 'standing_up' | 'intake' | 'requisition' | 'adjudication' | 'settled'
RosterRole  = 'quartermaster' | 'officer' | 'member'
MemberStatus = 'active' | 'removed'

Ledger = {
  id: string,
  name: string,
  state: LedgerState,
  source: 'scratch' | 'rally' | 'fleet',
  sourceEventId?: string,
  joinCode: string,        // generated at create
  joinOpen: boolean,       // true until adjudication; QM can toggle
  roster: RosterMember[],
  bannedUserIds: string[], // per-ledger banlist
  createdAt: string,
}

RosterMember = {
  userId: string,
  handle: string,
  role: RosterRole,
  status: MemberStatus,
}
```

## 5 · Store operations (`spoilsData.ts`)

Pure functions over the in-memory list; each returns new state so React re-renders.

- `createLedger(name, source)` seeds a join code, sets the creator as `quartermaster`, state
  `standing_up`, `joinOpen = true`.
- `advanceState(id)` / `revertState(id)` step along the 5-state order; cannot skip states or
  run off either end. Advancing **into** `adjudication` sets `joinOpen = false`.
- `addMember(id, handle)` / `importMembers(id, fromEvent)` / `simulateJoin(id)` add members;
  all three reject banned ids, and the join-based ones also respect `joinOpen`.
- `setRole(id, userId, role)` reassigns roles; keeps exactly one QM (promoting a new QM demotes
  the old one to officer).
- `kickMember(id, userId)` sets `status = 'removed'` and adds the id to `bannedUserIds`.
- `regenerateJoinCode(id)` / `setJoinOpen(id, bool)`.

**Interaction rules:** Advance/revert and all roster mutations are QM-only; those controls are
hidden for officer and member viewers. The QM cannot be kicked (reassign first). Kick/ban and
state revert require a confirm dialog.

## 6 · Screens (confirmed via visual companion)

**Screen 1, the route landing:** header "S.P.O.I.L.S. LEDGERS" plus "Open a new Ledger"; a
list of ledger cards, each with name, a one-line meta (roster count, source, settled date), and
a lifecycle state tag.

**Screen 2, the ledger detail (Layout A):** header with ledger name and the Advance control;
the horizontal 5-state stepper; a body split into the working area (left, wider) and the roster
rail (right). In STANDING UP the working area holds the name field, the source picker, and the
three roster methods; the roster rail lists members with role dropdowns and a kick action.

## 7 · Testing

Repo uses Vitest (see `scripts/foundation/foundationCopy.test.ts`). The spine's logic lives in
the pure store functions, so they are the main test target.

- **`spoilsData.test.ts`** (unit): `createLedger` seeds a QM and a join code; `advanceState`
  and `revertState` respect order and refuse to skip or overrun; advancing into adjudication
  sets `joinOpen = false`; `kickMember` both removes and bans; a banned id cannot be re-added or
  simulate-joined; `simulateJoin` and import respect `joinOpen` and the banlist; role
  reassignment keeps exactly one QM.
- **Component smoke tests** (light): `LedgerList` renders ledgers with state tags and the create
  action; `StandingUpPanel` shows the three roster methods; the Advance control is hidden for
  non-QM viewers.

Confirm dialogs are exercised at the store level (the destructive op sits behind a callback the
dialog triggers). No database or integration tests this slice, since there is no database yet.

## 8 · Open for Blair (not blocking this slice)

These are deferred to the slice that introduces real persistence; the in-memory store is shaped
to match so the swap is mechanical.

- Mapping the in-memory `Ledger` / `RosterMember` shapes onto the `spoils_ledgers` and
  `spoils_members` tables from the parent spec §12, and the RLS for QM/officer writes plus
  banlist-enforced joins.
- Real join-code generation and uniqueness, and the join endpoint that replaces `simulateJoin`.
- Where the data-access functions live relative to `src/lib/supabase.ts`.

## 9 · Next slices (indicative order)

1. **Ledger Spine** (this doc).
2. Real DB + RLS for the spine (swap the in-memory store).
3. INTAKE: item logging, keep / sell, manual valuation (UEX still deferred).
4. REQUISITION: ranked claims.
5. ADJUDICATION board with fairness view, approve / deny, orphans.
6. Distribution math (weighted split, bank slots) and SETTLED output.
7. My War Chest.
8. UEX price sync (can run in parallel once Blair scopes it).
9. Cross-pillar on-ramps and notifications.
