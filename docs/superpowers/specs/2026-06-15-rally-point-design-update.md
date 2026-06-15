# Rally Point — Design Update (screens, membership, comms)

**Date:** 2026-06-15
**Status:** ✅ Decisions captured from the 2026-06-15 design session (visual mockups built + confirmed). Ready for data-model spec + implementation planning.
**Author:** Christoph (product/creative direction) with Claude
**Supersedes / extends:** [`2026-06-10-rally-point-design.md`](2026-06-10-rally-point-design.md) — resolves its open items §9.1 (listing detail), §9.2 (apply/join), §9.3 (My Activity) and adds membership tiers, header images, and the in-app op channel. The 2026-06-10 listing/post field set (its §3) stays authoritative and is **not** re-litigated here.
**Visual source of truth:** `02_DESIGN & WORKING FILES/rally-point-mockups/` (served at `http://127.0.0.1:8080/`; numbered snapshots in `versions/`). Screens: `discover.html`, `listing.html` (`?op=group` variant), `post.html`, `activity.html`, hub `index.html`.
**Epic:** #105 (Rally Point) · **Related:** Friends & Presence, Messaging, Notifications & Push, Patreon/monetization (cross-pillar).

---

## 1 · What changed since the 2026-06-10 draft

The draft locked the listing model, visibility, and Discover board, but left the join flow, listing detail, My Activity, and data model undesigned, and assumed an **apply → host approval** flow (tickets #19/#20). This session resolves those and revises the join model:

- **Join is instant, not approval-gated.** Claiming a seat / taking a spot adds you to the crew immediately. The original "Apply to join / Approval / rejection" framing (#19/#20) is **dropped** for Rally Point's lightweight model.
- **Host moderation = kick.** The host (op owner) can remove anyone from the crew at any time. That is the only moderation lever; trust on serious ops comes from the existing **RSI-verified-only** and **org-only** gates, not approvals.
- **Two crew shapes**, surfaced as a choice at post time (formalizes the draft's "total number, optional role breakdown").
- **Three-tier access model** with Patreon monetization (new).
- **Per-op header image** (new) and **built-in Op Channel + status updates** (new; realizes the draft's Messaging/Notifications dependencies).

> **Now in scope (reversing the draft):** the 2026-06-10 draft treated "promote a Rally op into Fleet Command" as out of scope. This update brings it in as a **Tier-3 cross-module handoff** — the host can port a live op into Fleet Command, S.P.O.I.L.S., *or* Proving Ground (see §4.6).

---

## 2 · Access & membership model

Three access levels, plus a three-tier Patreon ladder on top of the free member tier.

| Level | Who | Can |
|---|---|---|
| **Guest** | no account | Browse all **public** listings + every filter; open a listing and read it; see counts. **Cannot** post, join, offer a ship, message, or see Friends-Online. |
| **Member** (free) | signed-in | All guest abilities **plus** post ops, join (instant), offer a ship, kick from own ops, use the Op Channel on ops they're in, see Friends-Online, friends-only/org-only listings they're entitled to. Free header-image **presets**, free **voice link**. |
| **Patreon** | paying member | Member + tier perks below. |

### Patreon tiers
1. **Tier 1 — "Captain"** — supporter badge only. **No feature unlocks.**
2. **Tier 2** — feature unlocks. **This is the real value tier.** Unlocks: synced **Discord event** on ops, **custom header-image upload**.
3. **Tier 3** (highest) — everything in Tier 2 plus **tournament tools** (Proving Ground) and the **cross-module handoff**: port a live op into Fleet Command, S.P.O.I.L.S., or Proving Ground (§4.6).

**Gating pattern.** Guests hitting any gated action (Post an Op, Join, Offer a ship, Message, locked nav) get a **"Create a free account" modal**. Free members hitting a Tier-2 feature (Discord event, custom image) get an **"Upgrade to Patreon" modal** showing the tier ladder with Tier 2 highlighted. Same visual pattern, different purpose.

---

## 3 · Crew model (instant claim)

An op declares its crew as **one of two shapes**, chosen at post time:

### 3.1 Open group (headcount)
"Just need people — bring whatever." A flat roster up to a **capacity**; people optionally self-declare the ship they're bringing (`🚀 MOLE`, or "ship TBD"). Open slots are generic **"＋ join"** spots. Used for mining nights, hangouts, casual piracy, etc.

### 3.2 Specific roles / seats
Host defines named **roles**, optionally bound to a specific ship (e.g. seats on the host's Scorpius: Pilot, Gunner). Each role has a count. Crew claim a specific seat. Used for "need a gunner," "need 2 turret operators," structured runs.

### 3.3 Actions (both shapes)
- **Claim / join** — member only; instant; updates fill meter + status (`Recruiting` → `Full` at capacity). Posts a system line to the Op Channel.
- **Leave** — member removes themselves.
- **Kick** — host only; removes any crew member (reopens the seat/spot); posts a system line.
- **Offer a ship** — soft, informational heads-up to the host (no approval needed in the instant model). Surfaces on the listing as "X is bringing a Hurricane — heads-up to host."

> This deliberately does **not** carry Fleet Command's locked/unlocked claim mechanic, officer roles, or approval routing — that is Fleet's heavy staffing model and explicitly does not apply to Rally Point's lightweight listing.

---

## 4 · Screens (IA)

Five screens, all skinned in the Rally Point rust palette under the shared **Pillar CRT styling system** (see §7).

### 4.1 Discover board (`discover.html`)
The public front door, as a **three-rail immersive board** (mirrors Fleet Command's layout, rust palette):
- **Left rail — filters** (multi-select): Activity · System · Region · Risk · Vibe · Ship need (search) · Language · Status.
- **Center — listings**: Sort + "I'll be online around…" finder, title search, **Post an Op** (gated), listing cards with header-image accent, fill meter, and tags. Cards open the listing.
- **Right rail — Friends Online** (members only); guest-gating hint when logged out.
- Top nav: Discover · Post an Op (gated) · My Activity (gated) + identity chip.

### 4.2 Listing detail (`listing.html`)
Two-column: content left, sticky action rail right.
- **Header banner** — per-op image (preset or custom) with title + status overlaid; corner tag shows source ("Preset · Hicksfield #07" or "Custom banner · Patreon host").
- **Briefing** (description).
- **Crew** — renders per crew shape: ship + named **seats** (roles), or a flat **roster** with each member's ship (open group). Filled entries show presence dots; host sees **✕ kick** on each; the viewer's own entry is tagged "you"; open seats/spots are claim targets.
- **What to bring / Seats & ships** — ships-needed summary.
- **Op Channel** — see §6.
- **Right rail**: sticky **join card** (slot meter + primary join CTA, state-aware by role), **Host** card (RSI-verified, org SID, ops hosted — trust signals, visible to guests), **Details** (when/commitment/system/region/risk/languages), **Vibe**, **Comms** (§6).
- **Back to Discover** link sits **below** the top bar (not in it).

### 4.3 Join flow (instant) — on the listing
Member clicks an open seat/spot or the join CTA → added immediately → seat/spot fills, meter ticks, status may flip to Full, join card becomes "✓ You're on the crew" with **Leave op**. A system line posts to the Op Channel. Host view replaces the join card with hosting controls (Message the crew, Edit op · notify crew) and ✕ kick on crew entries.

### 4.4 Post an Op (`post.html`)
The creation form, sectioned:
1. **Activity** (required, multi-select; full 6-group taxonomy, *Refining/Hacking* greyed "(soon)") + optional specific-mission search.
2. **Basics** — title (required), **Header image** (16 presets free; ＋Upload gated to Tier 2), description.
3. **Crew** — segmented **"Just need people" (headcount) / "Specific roles · seats"** control driving the two shapes.
4. **Ships needed** — Any / By category / Specific.
5. **When & where** — system (multi), region (single), start time (UTC→viewer-local), commitment.
6. **Vibe & rules** — intensity/risk (single); style/who/flags/languages (multi); **Come prepared** + **RSI-verified only** toggles.
7. **Visibility** — Public / Friends-only / Org-only.
8. **Comms** — free **voice link** + Tier-2 **Discord event** (gated).
- Sticky footer: Save draft / Post op.

**Required fields (validated on Post):** at least one **Activity**, **Title**, **Start time**, **Region**, **Time commitment**. Everything else is optional.

**Crew is optional / open-ended.** In headcount mode the host can set a number *or* flip **Open-ended** (no cap — as many or as few as show up). Roles mode counts are likewise not required.

**Come-prepared is a two-state toggle**, not a simple flag:
- **ON → "Come prepared"** — players show up fueled, armed & loadout-ready.
- **OFF → "We'll provide all you need"** — host supplies ships, gear & ammo.
Both states are meaningful and surface on the listing's join card.

### 4.5 My Activity (`activity.html`)
Member home (no approval queues, since join is instant):
- **Membership strip** — identity, free/tier status, RSI/org, **★ Become a Captain** upsell.
- **Upcoming / Past** tabs.
- **Hosting** — your ops; quick actions **Message crew · Edit op · Open**.
- **Joined** — ops you're in, with host + your seat/role; **Open · Leave op**.
- **Past** — ended ops with **View summary** / **Run it again** (re-post).

### 4.6 Host controls & cross-module handoff (Tier 3)
On an **existing** op (post-creation), the host's listing view carries a controls cluster: **Message the crew** (op channel), **Edit op · notify crew**, **Start event**, **End event** — and, gated to **Tier 3 (`praetorian`, the highest tier)**, **Hand off to a module**: port the op's data (crew/roster, system, start time, title, vibe) to **seed a new instance** in another MusterDeck module:
- **→ Fleet Command** — spin up a full fleet operation from this crew.
- **→ S.P.O.I.L.S.** — open a loot-split ledger for the haul.
- **→ Proving Ground** — seed a tournament bracket.

Handoff is **only available after the op exists** (created/started), never at post time. It is a one-way seed (the Rally op stays as-is; the target module gets a pre-filled new instance the host then runs).

**Backend (to spec):** a per-target port mapping (Rally listing → `fleet_event` / S.P.O.I.L.S. ledger / Proving Ground bracket). Each target module owns a "create from payload" entry point; Rally Point builds the payload and the Tier-3 entitlement check. This is its own integration sub-project (one slice per target module).

---

## 5 · Header images

- **Free:** choose from **16 generic presets** (the "Hicksfield" placeholder set), used as default/free-tier banners.
- **Tier 2:** **upload a custom image**.
- Surfaces as the listing **header banner** and as a thumbnail on Discover/My-Activity cards.
- **Backend (to spec):** preset library storage + IDs; custom-upload storage, size/format limits, and **moderation/abuse handling** for user-uploaded images (a real requirement, not optional).

---

## 6 · Comms & messaging

Two layered comms features plus a built-in channel:

### 6.1 Voice link (free) + Discord event (Tier 2) — layered
- **Free:** host pastes a plain external **voice/server link** (Discord/TeamSpeak). Anyone who joins sees it.
- **Tier 2:** host attaches a **synced Discord scheduled event** — shows title/time/RSVP count on the listing with a one-click **"Join the Discord event."** Coexists with the free voice link.
- **Backend (to spec):** Discord event sync mechanism (scheduled-event link vs. API integration) — exact approach deferred.

### 6.2 Op Channel (built-in messaging)
- A per-op **in-app channel**, **crew-gated** (host + joined members). Guests/non-joined see a locked teaser ("Join the op to open the crew channel" / sign-up gate for guests).
- Host and crew post messages; host messages tagged `· host`.
- **Auto status updates:** when the host **edits the event** (time, muster point, risk, briefing…), a **⚙ system update** posts to the channel and **notifies the crew**. Join/leave/kick also post system lines.
- **Ownership:** Rally Point **emits** the channel + update events; delivery (in-app + web push) is owned by the **Notifications & Push** epic; the channel itself aligns with the **Messaging** epic's "in-app activity channel per op." Rally Point consumes presence from the **Friends & Presence** epic.

---

## 7 · Styling

- Rally Point inherits the locked **Pillar CRT styling system** (`docs/specs/2026-06-12-pillar-crt-styling-system.md`): immersive frame, phosphor glow + vignette, 50% grunge, ~2px bloom borders + chromatic fringe, 8px/6px radii, Hardware-Extrude primary / Nested-Brackets-ghost buttons, brightness-as-importance hierarchy, dynamic fill meter.
- **Palette = rust** (the only thing that changes per pillar): `--ac #C1632E · --bg #120B07 · --bg2 #1D110A · --ink #F1E6D8 · --ink2 #B5A48F · --stamp #9C4A22 · grunge 50%`.
- Fill meter colour tracks fill % (red → amber → green), independent of palette.
- **Back link** lives below the top bar, never in it.
- (Mockup note: chromatic fringe currently uses the shared cyan/violet; warming it for rust is an open visual tweak.)

---

## 8 · Decisions log (this session)

- Join is **instant**; no apply/approval. Host **kick** is the moderation lever. (Supersedes #19/#20 framing.)
- Crew is **one of two shapes**: open-group headcount, or specific roles/seats. Chosen at post time.
- Offering a ship is an informational heads-up (no approval).
- **Three-tier Patreon**: Captain (badge) / Tier 2 (features — the value) / Tier 3 (tournaments). Gated features sit at **Tier 2**.
- **Header image**: 16 free presets; custom upload = Tier 2.
- **Discord**: free voice link + Tier-2 synced Discord event, layered (both can coexist).
- **Op Channel**: built-in, crew-gated messaging + auto status updates on host edits.
- **Five-screen IA**: Discover · Listing · (Join on listing) · Post an Op · My Activity.
- No Fleet Command lock/officer/approval machinery in Rally Point.
- **Required to post:** Activity (≥1) · Title · Start time · Region · Time commitment. Crew count is **optional / open-ended**.
- **Come-prepared** is a two-state toggle: "Come prepared" ⇄ "We'll provide all you need."
- **Tier-3 cross-module handoff** (new, reverses the draft): host can port a live op into Fleet Command / S.P.O.I.L.S. / Proving Ground, post-creation only.

---

## 9 · Open items / next

**To spec before/with implementation:**
1. **Data model** — listing tables (with `crew_shape` enum, roles vs roster), `op_messages`, header-image refs, Patreon-tier read; RLS posture; ties to `profiles` / `ships` / `friendships`; status derivation. *(Carried from the draft §9.4 — still the biggest gap.)*
2. **Header-image backend** — preset library + custom-upload storage, limits, **moderation**.
3. **Discord event integration** — exact sync mechanism + which Tier-2 entitlement check gates it.
4. **Patreon entitlement** — how tier is verified/stored and checked server-side for gating (Tier 2 = `admiral` for Discord/image; Tier 3 = `praetorian` for handoff).
4a. **Cross-module handoff** — per-target port mapping (Rally listing → `fleet_event` / S.P.O.I.L.S. ledger / Proving Ground bracket); each target's "create from payload" entry point. One slice per module.
5. **Mission-catalog sourcing** and **recurring/series** — still carried from the draft §9.5–9.6.
6. **Visual tweak** — warm the CRT chromatic fringe for the rust palette.

**Confirmed elsewhere, consumed here:** Friends/Presence (Friends-Online + presence dots), Messaging (op channel), Notifications & Push (delivery of status updates), ship catalog (ships-needed + offers).
