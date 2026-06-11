# Fleet Command — Pillar Design

**Date:** 2026-06-11
**Status:** Approved design (spec only — no implementation in this pass)
**Epic:** [#106 Fleet Command — plan and run organization operations](https://github.com/ThePRIMEForge/muster-deck/issues/106)
**Related specs:** Information Architecture (2026-06-09), Visual Identity System (2026-06-09), Notifications & Push (2026-06-10)

---

## 1. Purpose & Positioning

Fleet Command is MusterDeck's working board for hosts and officers to **plan and run large group operations** in the game. It is the companion tool the game itself lacks: when dozens of players coordinate, in-game social tools and a single chaotic Discord call break down. Fleet Command gives one shared surface to build a roster, assign crew and ships, track who's ready, and fire clear orders from setup through launch to stand-down.

**Positioning rules:**

- The pillar is named **Fleet Command** everywhere. The current in-app label "Fleet Manager" is retired.
- The word **"Star Citizen" does not appear on this page.** (CIG fan-content disclaimer is handled site-wide in a separate ticket.)
- Account-required. The pillar accent is **radar/terminal green** (scanlines) per the visual identity system.
- New IA actions: **Join Operation** (enter operation code) and **Set Up Fleet Operation**.

**The core loop:** someone sets up an event → shares a join code → people arrive and claim positions or offer ships → officers organize teams and lock the roster → the Admiral runs the operation with live orders → the event ends and (optionally) hands off to S.P.O.I.L.S. for settlement.

---

## 2. Roles & Permissions

Fleet Command uses **four operation roles**, scoped by reach. This replaces today's single `officer` role.

| Role | Reach | Can do | Cannot |
|---|---|---|---|
| **Fleet Admiral** | Whole fleet | Everything: setup, objectives, move anyone, approve requests, fire orders, **change ranks**, **end deployment** | — (cannot leave the fleet; only ends deployment) |
| **Fleet Officer** | Whole fleet | Same as Admiral **except** changing ranks and ending deployment | Promote/demote others; end deployment |
| **Team Officer** | **One team** | Run their team: move crew within/into their team, set their **team status**, approve their team's requests **when their team's Approval Control is ON** | Touch other teams; change ranks |
| **Crew** | Self | Claim open positions (when unlocked), request to move to any open position fleet-wide, suggest alternative ships, leave the fleet | Manage others |

**Role assignment:** The person who creates the event is the **Fleet Admiral**. The Admiral assigns and unassigns **Fleet Officers** and **Team Officers** at any point. Officer changes are notification-triggering.

### 2.1 Control toggles (invert defaults)

- **Team Request Approval Control** — per team, default **OFF**. When a Team Officer flips it ON, their team's ship-suggestion and move-request approvals route to that Team Officer and **lock out** Admiral/Fleet Officers **for that team only**. Default OFF means Admiral/Fleet Officers always hold approval.
- **Claim lock** — per team or whole roster, controls whether crew can self-claim positions. Held by Admiral/Fleet Officers, or by a Team Officer for their own team. (Distinct from the existing **ship roster lock**, which freezes ship suggestions/substitutions.)

### 2.2 Type change

`OperationRole` becomes `fleet_admiral | fleet_officer | team_officer | crew`. `team_officer` carries a reference to the team it governs. Permission helpers (`canManageFleetSetup`, `canManageOperation`, `canAccessPage`) are refactored to the four-role model, and a new set of team-scoped checks is added (e.g. `canManageTeam(role, teamKey)`, `canApproveRequestFor(team, viewer)`).

---

## 3. Domain Model

Bold = net-new records/fields. Others extend tables that already exist.

### 3.1 Event (fleet operation) — *new top-level record*

- Identity: **event name**, **fleet name**, **operation join code**
- **Objectives:** muster point (**system + station**), **destination**, free-text **overall objectives**
- **Lifecycle state:** `draft → open → active → ended`
  - `draft` — being set up, code not yet shared
  - `open` — join code live; people can join and claim/offer while the board is built
  - `active` — deployment started; live orders in use
  - `ended` — Admiral ended deployment; optional deep link to S.P.O.I.L.S.
- Roster lock state (exists), claim-lock state (new)

### 3.2 Teams — extend existing

- Name, assigned ships, **Team Officer** (optional), **Team Status**, **Approval Control toggle**, **claim-lock**
- **Team Status** (new): one of `ready` · `not_ready` · `delayed` · `need_assistance` · `idle`, each color-coded with a signifier surfaced on the Admiral and Fleet Officer screens and on the team's left-rail tab. Set by the Team Officer (Admiral/Fleet Officers may override).

### 3.3 Ships (requests) — mostly exists

- Category, preferred ship, requested count, staffing profile, team, positions, ship-roster lock, substitution policy (`allow_alternatives | exact_only | locked`)

### 3.4 Positions — exists

- Per-ship slots derived from staffing templates. Staffing profiles: `skeleton | standard | full_crew | custom`.
- **Custom** opens the full position list for the ship plus extra position types (e.g. **Marines, medics**), and may set counts **above or below** the preset complements.

### 3.5 Crew members — extend existing

- Identity, operation role, team, assigned position, ship offer
- **Presence (online/offline):** consumed from the shared Presence service (epic #121) — **not stored in Fleet Command.**
- Membership **persists until the member leaves** (disconnect ≠ removal). A member is removed only by an explicit **Leave Fleet** action. The **Admiral cannot leave**; the Admiral closes the operation with **End Deployment (for all)**.

### 3.6 Requests & approvals

Two crew-initiated, approval-gated request types. Neither takes effect until approved; the board does not change while a request is pending.

- **Alternative-ship suggestion** — *backend exists* (`fleet_event_ship_suggestions`, types `substitution | ship_offer | category_fill`, status `pending → approved/denied`; new suggestions auto-rejected when the ship roster is locked). A crew member who has a similar-but-different ship (e.g. requested Scorpius, owns Hurricane) offers it; an authority approves or denies.
- **Move Request** — *new*. A crew member clicks **any** ship anywhere in the fleet and requests to move into an open position there (across teams, not just their own ship). Pending until approved.

**Approval routing (both types):** Admiral/Fleet Officers by default. If the **relevant team** (the target team for a move; the request's team for a suggestion) has **Approval Control ON**, the request routes to that **Team Officer** and Admiral/Fleet Officers are locked out for that team. All routing decisions emit notifications.

### 3.7 Orders — `fleet_event_messages` table exists

- Lifecycle/order broadcasts fired by the Admiral (and Fleet Officers).
- **Two-step Stand-by → Go** per order: the first click arms **"Stand-by [Order]"**; a second confirming action fires **"[Order] Go"**. Applies across the order set (Attack, Defend, Retreat, Return to Base, Muster, etc.). *(Exact interaction to be workshopped during sub-project ④ — see §6.)*
- **Attack / Defend** carry an optional **sticky target/note field** (fire bare or with a target; field persists for fast re-fire). Attack renders high-emphasis.
- **Targeting:** all crew / specific team(s) / specific ship(s) / specific user(s).

---

## 4. Screen Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│  [View switcher: rank-gated]   Event name · join code · lifecycle    │  top bar
├───────────┬─────────────────────────────────────────┬───────────────┤
│  TEAMS     │           SHIPS (center)                 │   CREW         │
│ (left)     │                                          │  (right)       │
│            │  ┌─ Team Alpha ──────────────┐           │ [search______] │
│ ▸ All Teams│  │ [ship] [ship] [ship]      │           │ ● Name  Online │
│ ▸ Alpha  ● │  │                            │           │ ● Name  Online │
│ ▸ Echo   ⚠ │  └────────────────────────────┘          │ ○ Name  Offline│
│ ▸ Bravo  ● │  ┌─ Team Echo ───────────────┐           │ ...            │
│            │  │ [ship] [ship]              │           │                │
│ (team-     │  └────────────────────────────┘          │ [Leave Fleet]  │
│  status    │   ⇅ list view / button view              │  /[End Deploy] │
│  colors)   │                                          │                │
└───────────┴─────────────────────────────────────────┴───────────────┘
```

- **Top bar — view switcher (rank-gated):** Admiral Control Panel / Operation / Crew views. The **Admiral Control Panel** is a distinct view surfacing all comms, every team's status, and moderation. Also shows event name, join code, and lifecycle state.
- **Left rail — Team tabs:** "All Teams" + one tab per team; selecting a team re-filters the center. Each tab shows the **team's status color/signifier**. This replaces today's ship-category filter rail; **ship-category filtering demotes to a secondary control.**
- **Center — Ships:** grouped by team, filterable by team, with **two display modes: list view and button view**. **Drag-drop** ships → teams; **drag a crew name from the right onto a ship → position-picker modal** opens → drop into a slot. Space-aware auto-sizing (continues the prior field-sizing work).
- **Right rail — Crew list:** **searchable** at top; online/offline dot per person (from #121); persists until **Leave Fleet**. Crew can also **claim** open positions (when unlocked) and initiate **move requests** from here. Admiral sees **End Deployment** in place of Leave Fleet.

---

## 5. Cross-cutting Decisions

| Concern | Decision | Owner |
|---|---|---|
| **Presence (online/offline)** | **Consume** the shared Presence service from the Friends & Presence epic (#121). Fleet Command stores no presence; it reads it. | #121 builds; Fleet consumes |
| **Notification delivery** | Fleet Command emits triggers and order broadcasts; delivery (in-app + web push) is owned by the Notifications & Push epic (#126). | #126 builds; Fleet emits |
| **Join-by-code** | Design **one shared operation-code system** (format, generation, redemption) usable by Fleet / S.P.O.I.L.S. / Proving Ground; implement the **Fleet slice first**. | Shared design; Fleet builds first |

---

## 6. Sub-project Decomposition & Sequencing

The pillar is decomposed into four sub-projects. **Each gets its own spec → plan → build cycle.** Build order: **① → ② → ③ → ④** (approved).

### ① Foundation & Rebrand Spine — *builds first*

- Rename Fleet Manager → **Fleet Command**; strip all "Star Citizen" wording; apply radar-green pillar identity.
- **4-role model** refactor (Admiral / Fleet Officer / Team Officer / Crew) + permissions.
- **Event + Objectives** record and setup flow (event/fleet name, muster system+station, destination, overall objectives).
- **Operation join code** — design the shared code system; build the Fleet redemption slice (*Join Operation* / *Set Up Fleet Operation*). Code can be shared once basic details exist, even before ships are selected.
- **Membership lifecycle** — Leave Fleet (everyone but Admiral) + End Deployment (Admiral).

### ② Requests & Approvals Layer

- Alternative-ship suggestion UI (backend exists) — approve/deny.
- **Move Request** (any crew → any open position fleet-wide) — approve/deny.
- **Team Request Approval Control** toggle (per team, inverts routing).
- Assignment-change indicators on ship crew slots + notification triggers.

### ③ Interaction Overhaul

- Team-first left tabs (All Teams + per team).
- Ships **list view + button view**.
- **Drag-drop** ships → teams and crew → ship → position modal.
- Claim positions + claim-lock (roster / per-team); space-aware sizing.

### ④ Command & Team-Status Layer

- Per-team **Status** (5 states, colors, signifiers) set by Team Officer.
- **Admiral Control Panel** view (comms overview, all team statuses, moderation).
- **Live orders** tool — two-step **Stand-by → Go** per order, Attack/Defend sticky target, targeting all/team/ship/user, hotkeys.
- **Reopens the Notifications ticket** to add the two-step Stand-by/Go variant to each order (the current notifications spec has single-click order buttons).
- **Event-ended → S.P.O.I.L.S.** deep link on transition to settlement.

**Sequencing rationale:** ① is the spine everything hangs on. ② leverages backend that already exists (cheap, high-value — the realistic "people show up with different ships/positions" workflow). ③ is the heavy drag-drop UX work. ④ (orders) lands best after notification delivery (#126) is ready, since it depends on it.

---

## 7. What Already Exists (reuse, don't rebuild)

| Capability | Where |
|---|---|
| Staffing profiles + reviewed staffing templates | `src/lib/fleetSetup.ts`, staffing template tables |
| Ship requests, positions, crew assignment, check-in | `src/App.tsx`, `src/lib/fleetSetup.ts` |
| Ship roster lock (master + per-team) | migrations `…roster_locks…`; #33 (closed) |
| **Alternative-ship suggestion backend** (table, types, status flow, lock-aware trigger) | `…roster_locks_and_ship_suggestions.sql`, `…fleet_request_helpers.sql` |
| Fleet event messages (orders + targeting + acknowledgements) | `…fleet_event_messages.sql` |
| Read models (assigned counts, pending suggestion counts, lock state) | `…read_models.sql` |
| Demo + persisted fleet setup | `…demo_fleet_setup_persistence.sql`, `src/lib/fleetMembers.ts` |

**Net-new records/fields introduced by this design:** Event + Objectives, Team Status, Move Request, the four-role split (Fleet Officer / Team Officer), Team Approval Control toggle, claim-lock, and membership-lifecycle (Leave Fleet / End Deployment).

---

## 8. Out of Scope

- Other pillars (own epics).
- Shared foundation (auth, account, notifications delivery, admin).
- Post-op settlement (S.P.O.I.L.S. — #107); Fleet Command only deep-links into it at event end.
- The CIG fan-content disclaimer (site-wide, separate ticket).

---

## 9. Open Items to Workshop Later

- Exact **Stand-by → Go** interaction (paired buttons vs. arm-then-confirm on one button vs. hotkey modifier) — settled during sub-project ④.
- **Operation-code format** and whether redemption is fully shared across pillars at the data layer — settled when the shared code system is specced in ①.
- Where the **Leave Fleet** action physically sits on the crew rail (placement TBD).
- Marines "riding with" cross-team logistics (a Marine team transported by another team) — modeled as normal team assignment for now; revisit if it needs first-class support.
