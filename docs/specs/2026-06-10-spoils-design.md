# S.P.O.I.L.S. — Design

**Date:** 2026-06-10
**Status:** active
**Author:** Christoph (product) with Claude; for Blair (tech owner)
**Epic:** [#107 S.P.O.I.L.S.](https://github.com/ThePRIMEForge/muster-deck/issues/107) · accent: **oxblood**

> **S.P.O.I.L.S. = Settlement · Payouts · Operations · Inventory · Loot · Shares.**

**Naming:** the object is **The S.P.O.I.L.S. Ledger** (informally **"the Ledger"**). The word
**"Settlement"** is reserved for the **closing act** — the **SETTLED** state, when the Ledger is
finalized and distributed. So: you *open a Ledger* and later *settle it*.

---

## 1 · Goal & framing

The third pillar. S.P.O.I.L.S. helps a group **fairly distribute everything collected during an
operation** — physical in-game items *and* the aUEC from selling materials — through a clear,
human-judged review flow run by a **Quartermaster**.

A single loot event is one **S.P.O.I.L.S. Ledger** ("the Ledger"). Inside it run **two parallel
tracks** that both feed one **fairness ledger**:

- 🎁 **Item track** — physical things members claim and the QM awards (ship components, FPS gear,
  rare/leftover items).
- 💰 **Cash track** — items marked "sell" are summed into an aUEC pool that is split among
  participants by weight.

This builds on existing scaffolding (nav route `spoils`, module key `spoils`, the `settlement`
notification category, the Operations Hub "active settlements" slot) and ties the three operational
pillars together: a Ledger can be spun up from **The Hub**, from **Rally Point**, or from a live
**Fleet Command** event.

## 2 · The hybrid fairness ledger (the core idea)

Items are **claimed freely** (not hard-deducted from cash), **but** the QM always sees each person's
**running total value received** — *awarded items (at their ledger value) + cash share* — so
approvals can be kept fair without rigid accounting. This visibility is the fairness engine:

- Getting an item does **not** reduce your cash payout.
- The QM can see, at a glance, that one player keeps getting top-tier gear and adjust accordingly.
- Every value (items + cash) rolls up into one comparable per-person number.

(Considered and rejected for v1: a fully unified value ledger that deducts item value from cash —
too rigid and over-dependent on perfect pricing. Also rejected: two fully separate tracks with no
shared visibility — loses the fairness signal.)

## 3 · Roles

**Quartermaster (QM)** — owner of one Ledger. Per-Ledger role, not org-wide. Three on-ramps:

| On-ramp | Who becomes QM |
|---|---|
| **The Hub** (main menu) — create from scratch | the creator |
| **Rally Point** activity — "Start a Spoils Ledger" | the activity's host |
| **Fleet Command** event — "Start a Spoils Ledger" | the Admiral **promotes an Officer to QM** (who can build it *live during the event*), **or** takes QM himself (Admiral + QM simultaneously), during or at wrap-up |

**Spoils Officers** — the QM can appoint any number of deputies *for that Ledger* who can also log
items and approve/deny claims.

**Members** — everyone on the roster; they lay claims.

*Future:* an **org-level standing Quartermaster** once Organizations exist in MusterDeck (§9).

## 4 · Roster

Three ways onto a Ledger's roster:
1. **Manual add** by the QM.
2. **Import** from the linked Rally/Fleet event (pulls the participant list across).
3. **Self-serve join code** — Supabase generates and stores a **unique code per Ledger**; anyone
   with it can join the roster.

**Code window (default):** accepts joins while the Ledger is open (STANDING UP → REQUISITION) and
auto-closes at ADJUDICATION; the QM can reopen.

**Moderation:** the QM can **remove** anyone from the roster **and block them from ever rejoining
*that specific Ledger*** (a per-Ledger banlist; their code stops working). Stops freeloaders who jump
in for free gear.

## 5 · Lifecycle (5 states)

Renamed into a quartermaster/logistics flow. **One ability is continuous, not a phase:** the QM can
**keep adding items right through ADJUDICATION** ("we find things last-minute, or convert items to
cash"). A late add simply reopens REQUISITION **for that item only**.

| # | State | What happens |
|---|---|---|
| 1 | **STANDING UP** | QM creates the Ledger, names it, sets the roster (manual / import / code) |
| 2 | **INTAKE** | Loot logged; each item marked **keep** (claimable) or **sell** (→ cash pool). Members may be allowed to add too |
| 3 | **REQUISITION** | Members lay claims — each builds a **ranked** wishlist; may claim multiple in priority order |
| 4 | **ADJUDICATION** | Claims freeze; QM/officers approve/deny, resolve orphans, set weights & bank slots |
| 5 | **SETTLED** | The **Settlement** — finalized; payouts + awarded items published, "**ready for distribution**" announced |

*(Mapping to Christoph's original 6 steps: "creation" → STANDING UP; "open for others to add" →
INTAKE; "putting names on items" → REQUISITION; "lock & wait for approvals" → ADJUDICATION;
"ratified/finished" → SETTLED; "equipment can always be added to the end" → the continuous INTAKE
ability above.)*

## 6 · Requisition & Adjudication (the heart of it)

### 6.1 Member side — the requisition slip
In REQUISITION each member browses claimable items and lays claim. They can claim **multiple items
in their own ranked order** (#1 most-wanted, #2, #3…). Rank is a signal, not a guarantee.

### 6.2 QM side — the Adjudication board
The QM's main screen. For each item:
- All **claimants listed**, **quantity-aware** (3× FR-66 → award up to 3 people).
- **Fairness mouseover:** hovering a claimant shows their **award history** (this Ledger *and* past
  Ledgers, ordered by what they've received) **plus their running total aUEC value** from the hybrid
  ledger.
- **Approve / Deny** per claim. Approve → awards the item and books its **lowest-buy value** to that
  person's ledger total. Deny → frees the item; the claimant's lower-ranked alternates stay live.

### 6.3 Contested single items
Two people want the one FR-66: the QM sees both claimants side-by-side with fairness data and
**picks** — human judgment, informed by history. **No silent first-come-first-served.**

### 6.4 Orphans (unclaimed / leftover)
On any unclaimed or leftover item the QM can:
- **Drag-and-drop a player** onto it to award directly, **or**
- **→ Org Bank** (with a quantity picker for multiples), **or**
- **→ Sell** — convert to its sell value and drop it into the cash pool.

### 6.5 Auto fair-allocation — explicitly OUT of v1
An engine that *proposes* who-gets-what is parked. v1 is **QM-manual with great fairness info** —
simpler and keeps the human in control where trust matters. Backlog ticket required (§9).

## 7 · Distribution math (cash split & bank)

### 7.1 Cash split — weighted shares (0–100)
- Every participant starts at **50**. The QM slides each person **0–100**. It is *relative*: the
  pool divides by the **sum of all weights**, so each person's take = `their weight ÷ total weight ×
  distributable pool`.
- **Live feedback is a hard requirement:** as the QM moves a slider, **everyone's take-home %
  updates in real time**.
- Worked example (Christoph's): 10 players, default 50 each → late arrival → 10; two early-prep →
  100 each; two who brought fuelled ships → 80 each; one who left halfway → 30; rest stay 50. The
  pot redistributes across those weights.

### 7.2 Bank slots (off the top)
- The QM can add one or more **named** slots that come off the top **before** the player split, each
  either a **flat aUEC amount** or a **% of the cash pool** (e.g., a slot labeled "Org Bank" at
  20%). Labels are free-text.
- The bank also takes **physical items**: a one-click **"→ Org Bank"** on any item, with a
  **quantity** picker for multiples.
- **Order of operations:** `gross cash pool − bank slots = distributable pool → split by weights`.
- v1 treats a bank slot as a **labeled set-aside recorded on the Ledger** only. Actual org-treasury
  management is future (§9).

### 7.3 SETTLED output (the Settlement)
When the QM settles, the Ledger publishes a final, read-only record:
- **Per person:** awarded items (each at ledger value) + cash payout + **total take-home value**.
- **Bank slots:** cash amounts + any items routed there.
- **"Ready for distribution"** announcement fires (notification hook — see §10).
- **Delivery note:** since handoff happens **in-game**, the QM gets a free-text delivery note
  (e.g., "collect at A18 hangar after the op") shown on each member's award. The app records *who
  gets what*; it does **not** move items in-game.
- **Reopen:** the QM can reopen a settled Ledger to fix a mistake, with an audit note.
- **CSV export** of the final record (carries existing child #44).

## 8 · Pricing & valuation (UEX integration)

**Source:** the **official UEX API** (`uexcorp.space/api`) — free app key, ~172,800 requests/day,
Bearer-token auth. The community "Data Runner" apps push data *into* UEX and are **not** used here.
A community-published **OpenAPI spec** exists for generating a typed client.

**Data used:** data-mined in-game terminal prices (not player trading), via the
`commodities`/`commodities_prices` endpoints (mineables/ores/commodities) and `items`/`items_prices`
endpoints (ship components & FPS gear), joined to `terminals` for per-location prices.

**Value rules:**
| Situation | Value used |
|---|---|
| Item **kept/awarded** → ledger value | **lowest in-game *buy* price** across terminals (conservative — minimum cost to acquire) |
| Item **sold** → cash pool | in-game ***sell* price** (realistic proceeds; default best-terminal sell, adjustable) |
| **No in-game price** (military/Class-A components) | UEX **player-marketplace** price, **most conservative** (lowest), flagged "estimated" — or QM manual entry |
| Any item, per Ledger | **QM can override** the value |

**Sync model:** a **scheduled daily sync** pulls UEX commodities + items + their prices into our own
tables. A Ledger reads our cached tables — **never a live dependency mid-op**. Prices change
infrequently, so daily is ample.

**Open for Blair:** sync mechanics (Supabase edge function + cron? where the API key lives); exact
price-selection logic for lowest-buy / best-sell across terminal rows; item-catalog **coverage**
(does UEX `items` cover all components/FPS gear we care about, or do gaps need manual entry?).

## 9 · Personal inventory — "My War Chest"

Every award writes to a permanent, **per-user awards history** (this is also exactly what the QM
fairness mouseover reads — §6.2). The member sees their own history in a dedicated screen,
**"My War Chest"**, reachable from **both the account menu and a card on The Hub** (not buried in
Settings). Shows every item ever awarded, which Ledger/op it came from, the date, and its value.

**Retention:** archive settled Ledgers **as long as feasible**; revisit a purge policy later
(possibly aligned to Star Citizen wipes) once real data/resource usage is observed. Not v1 work — an
ops decision to monitor.

## 10 · Cross-pillar seams

- **Rally Point** & **Fleet Command** each expose a **"Start a Spoils Ledger"** action that
  pre-seeds the roster from the event and links back to the source event.
- **Fleet Command "event ended → S.P.O.I.L.S." deep link** (already in the notifications spec) opens
  the linked Ledger with **no separate code**.
- **Lifecycle notifications** (closing soon · selections open · ratified/ready · delivery
  instructions) are enumerated in the notifications spec §5.4 — referenced here, not duplicated.
- **Social layer** (already on #107): a Ledger renders the **"Who's here" roster** (#124) and an
  **activity channel** (#117) wired to the participant list — these ship *as part of* S.P.O.I.L.S.

## 11 · Tournament-prize variant (reconcile with #43)

The epic also scopes **tournament prize settlement from Proving Ground**. That is a **distinct
Ledger type**: awards are by **placement / admin decision**, not by crew contribution — so it
**skips weighted splits and claims** and instead distributes prizes to finishers. v1 of S.P.O.I.L.S.
focuses on the **operational** (Fleet/Rally) Ledger above; the tournament-prize type is a noted
variant carried by child **#43**, reusing the same item/cash/award + My War Chest plumbing.

## 12 · Data model sketch (for Blair)

Indicative tables (names/columns to be finalized in migration review):

- **`spoils_ledgers`** — `id, name, status (standing_up|intake|requisition|adjudication|settled),
  type (operational|tournament), quartermaster_id, source_type (hub|rally|fleet|proving_ground),
  source_event_id, join_code, join_open bool, delivery_note, created_at, settled_at`.
- **`spoils_members`** — `ledger_id, user_id, role (quartermaster|officer|member), weight int
  (0–100, default 50), status (active|removed), banned bool`.
- **`spoils_items`** — `ledger_id, catalog_ref, name, category (component|fps|mineable|commodity),
  quantity, disposition (claimable|sell|bank), unit_value numeric, value_source
  (uex_buy|uex_sell|marketplace|manual), value_overridden bool`.
- **`spoils_claims`** — `item_id, user_id, rank int, status (pending|approved|denied)`.
- **`spoils_awards`** — `ledger_id, item_id, user_id, value, awarded_at` — the per-user history
  feeding My War Chest **and** the fairness mouseover.
- **`spoils_bank_slots`** — `ledger_id, label, kind (amount|percent), value`.
- **`spoils_payouts`** — `ledger_id, user_id, cash_amount, items_value, total` (computed at settle;
  CSV export source).
- **Price cache** — `uex_commodities`, `uex_items`, `uex_prices` (or unified `spoils_price_catalog`)
  populated by the daily sync.

RLS: QM/officers write within their Ledger; members read + manage their own claims; banlist enforced
on join.

## 13 · v1 scope

**IN:** Ledgers + 5 states · roster (manual / import / join-code) + kick/ban · INTAKE with
keep-or-sell + UEX value + QM override · ranked claims · Adjudication board with fairness mouseover +
approve/deny · orphan drag-drop / bank / sell · weighted cash split with live take-home % · bank
slots (labeled set-asides, cash %/amount + items) · SETTLED output + delivery note + CSV export ·
**My War Chest** · daily UEX price sync · cross-pillar "Start a Spoils Ledger" + Fleet deep-link.

**OUT (backlog — §14):** auto fair-allocation engine · org-bank management/treasury · org-level
standing Quartermaster · retention/wipe automation · (tournament-prize variant beyond #43's basic
flow).

## 14 · Open questions for Blair

1. **UEX sync** — edge function + cron vs. another mechanism; where the API key lives; rate budget.
2. **Price selection** — exact SQL for lowest-buy / best-sell across terminal rows; marketplace
   fallback aggregation; "estimated" flagging.
3. **Item-catalog coverage** — does UEX `items` cover all ship components & FPS gear, or do gaps
   need a manual catalog path?
4. **Join code** — Supabase generation + per-Ledger banlist enforcement via RLS.
5. **Naming (resolved):** object = **The S.P.O.I.L.S. Ledger** / "the Ledger"; **"Settlement"** =
   the closing act (SETTLED state). Remaining: do **"The Hub"** (main menu) and **"My War Chest"**
   land here or as part of a broader rebrand task?
6. **Existing child tickets #36–#44** — confirm the mapping in §15 and which need rescoping.

## 15 · Mapping to existing child tickets & new tickets

**Existing #36–#44 → design coverage:**
- #36 Post-op payout record → **STANDING UP / Ledger object** (§5, §12)
- #37 Payout history per op & user → feeds **My War Chest** (§9)
- #38 Loot entry — itemized → **INTAKE** (§5)
- #39 Inventory — org bank & reserve → **bank slots** (§7.2)
- #40 Claims — player claims → **REQUISITION + Adjudication** (§6)
- #41 Split calculator — share weights → **weighted split w/ live %** (§7.1)
- #42 Sale proceeds entry — aUEC → **keep/sell → cash pool** (§5, §8)
- #43 Tournament prize ledger → **tournament-prize variant** (§11)
- #44 Export CSV → **SETTLED output** (§7.3)

**New tickets to create:**
- **UEX price-sync integration** (foundational; §8) — *create now*.
- **Auto fair-allocation suggestion engine** (backlog; §6.5) — *create now, future*.
- **Join-code roster + kick/ban** (§4) — likely folds into #40/#36; flag at kickoff.
- **My War Chest inventory screen** (§9) — distinct from #37's history list; flag at kickoff.
- **Org-bank management/treasury** (backlog; §7.2, §9) — gated on Organizations.
- **Org-level standing Quartermaster** (backlog; §3) — gated on Organizations.
