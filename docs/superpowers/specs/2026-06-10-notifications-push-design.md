# Notifications & Push — Design

**Date:** 2026-06-10
**Status:** Approved in brainstorm; ready for Blair review → ticketing
**Author:** Christoph (product) with Claude; for Blair (tech owner)

---

## 1 · Goal & framing

A site-wide notification system with **two delivery channels**:
- **🗂️ In-app** — notifications stack in the **comms/chat section** (alongside messages), for when MusterDeck is open.
- **📲 Push** — true **web/device push**, so alerts reach a user even when MusterDeck is closed.

The marquee use case is **Fleet Command as a live companion-app orders tool**: when 50–100 people
are in Discord and chat is chaos, the fleet commander fires clear, fast orders ("Attack the Idris",
"Rally", "Return to base") that land as unmistakable notifications so everyone knows the next move.
Speed of firing matters (hotkeys, one-tap re-fire, sticky fields).

This is its **own epic**. It builds on existing scaffolding and integrates with the social epics
(#116 Friends & Presence, #117 Messaging) and every pillar.

## 2 · What already exists (build on, don't rebuild)

- **Notification Center UI shell** — `src/components/foundation/NotificationCenter.tsx` renders
  notifications by category (`general, direct_message, group_message, assignment, application,
  settlement, tournament, admin`); currently demo data.
- **`notification_preferences` table** — per-category on/off flags + **`browser_push_enabled`**
  (default false) — `supabase/migrations/20260520190000_shared_foundation_accounts.sql`.
- **Fleet event messages** — `fleet_event_messages` (`order, assignment_change, request_status,
  ship_change, team_change, system`) with tags (`member, team, ship_request, position, fleet,
  command, custom`) and acknowledgements — `20260519203000_fleet_event_messages.sql`. The order +
  targeting model the live-orders tool needs already exists.
- **Open tickets:** #26 (Notifications — applicants, approvals, op updates), #34 (Live updates).

## 3 · Delivery model

- **In-app:** notifications render as a **stack in the comms/chat section** (not a separate silo),
  unifying messages + alerts. Reuses/extends the Notification Center.
- **Push:** Web Push API + a **service worker** + **VAPID** keys; users subscribe per device. A
  master **"Enable push on this device"** toggle drives the browser permission prompt.
  - ⚠️ **iOS caveat:** Safari only delivers web push when MusterDeck is **installed as a PWA**
    (home-screen). Confirm scope with Blair.
  - ⚠️ **Guest/spectator push:** Proving Ground spectators may be guests (no account); their push
    subscription must be device-level without a profile. Flag for Blair.

## 4 · Settings model — Account Settings ▸ Notifications (a section, not a popup)

- One row per notification **group**. Each row sets a **level**: **Off** / **🗂️ In-app only** /
  **🗂️ + 📲 In-app & Push**.
- Master **"Enable push on this device"** (browser permission, per device).
- **Spectator follows** (Proving Ground public) are **per-tournament opt-ins**, separate from the
  account-level groups.
- Storage: evolves the existing `notification_preferences` (per-category booleans →
  per-group level enum + a separate push-subscription table per device).

## 5 · Notification taxonomy

### 5.1 Site-wide
- **DM received** — "New message from {person}" / "New message in {group}" — **no message content**.
- **Friend request** received / accepted.

### 5.2 Rally Point (event-status lifecycle)
- Accepted into an event · someone joined your event (host) · starting soon · starting now · ended.

### 5.3 Fleet Command (the big one)
**A — Assignment & roster (per user):**
- Assigned → **{team · ship · position}**
- Reassigned → **{team · ship · position}**
- Removed from a position → "wait for reassignment"
- Roster locked

**B — Change requests & responses:**
- Member requests **position change / ship change / substitute ship** → notifies the **commander**
- Commander **approves / denies** → notifies back the **requesting player**

**C — Officer role (private + public):**
- To the user: "You've been promoted / demoted"
- To all crew: **public notice** that {user} was promoted / demoted

**D — Live orders / lifecycle broadcasts** (commander → fleet/team/ship; **quick-action + hotkey
buttons on the fleet admiral / command screen**; each click broadcasts a notification):
- Event started · Preparing · Gathering · Travelling · Rallying · Go for action · Retreat & regroup
  · **Attack** · **Defend** · Next phase · Return to base · Event ended
- **Attack** and **Defend** each have an **optional sticky note/target field** — fire bare or with a
  target ("the Idris", "Capt Morgan", "the transport"); **the text persists** in the field for rapid
  re-fire. **Attack** renders **high-emphasis** (color/emphasis, maybe sound).
- **Event ended → S.P.O.I.L.S. deep link:** if transitioning to settlement, the notification carries
  a **direct link into the S.P.O.I.L.S. pillar** for this op — no separate code.

**E — Custom broadcasts:**
- Free-form message → **all crew / specific team(s) / specific ship(s) / specific user(s)**.

### 5.4 S.P.O.I.L.S. (settlement lifecycle)
- List **closing soon** — make your selections · selections **open** — go pick · list **ratified /
  closed** — go collect; check back for delivery instructions.

### 5.5 Proving Ground (two audiences)
- **Participant (private):** tournament started · your bracket/wave starting soon · **you advanced**
  · **you were eliminated**.
- **Public / spectator (opt-in, toggleable, no login required):** follow a tournament for round
  results · who advances · bracket progression · tournament ended. Ties to the public bracket view
  (#59). **Future:** embedded streaming.

## 6 · Cross-epic seams (so nothing gets lost)

- **Fleet live-orders buttons + hotkeys** live in the **Fleet Command command view** (#106 / #35);
  the **notifications they fire** live in this epic. Built together.
- **Event-ended → S.P.O.I.L.S. deep link** ties Fleet Command (#106) ↔ S.P.O.I.L.S. (#107): the
  settlement opens for the op without a code.
- **DM + friend-request notifications** depend on the social epics (#116 / #117).
- **In-app stack lives in the comms/chat section** → shares UI with Messaging (#117).
- **Each pillar emits notification trigger events** — a per-pillar acceptance criterion (#105–#108).

## 7 · Open questions for Blair

1. **Web push stack** — service worker + VAPID self-hosted vs. a push service; where the fan-out
   runs (Supabase edge function?).
2. **iOS PWA** — do we require home-screen install for iOS push, or accept iOS in-app-only?
3. **Guest/spectator push** — device-level subscription without a profile: in scope for v1 or later?
4. **Settings storage** — migrate `notification_preferences` booleans to a per-group level enum now?
5. **Hotkey scheme** — key bindings for the admiral screen order buttons.

## 8 · Backlog

- Embedded **streaming** in Proving Ground spectator view.
- Notification **sound packs** / per-order audio.
- Digest / batching for low-priority notifications.

## 9 · Proposed GitHub structure (for ticketing)

- **[EPIC] Notifications & Push** (`epic`, `epic:notifications`)
  - **Foundation tickets (created now — buildable independently):**
    1. Notification **engine** — events → notification records + delivery fan-out (in-app + push routing)
    2. **In-app stack** in the comms/chat section + Notification Center wiring
    3. **Web push delivery** — service worker + VAPID + per-device subscription + "enable push on this device"
    4. **Settings section** — Account Settings ▸ Notifications (per-group levels + master push toggle)
  - **Per-pillar notification sets (checklist; split into tickets at kickoff, each needs the engine
    + the pillar):**
    - Site-wide: DM received + friend requests
    - Rally Point event-status set
    - Fleet Command: A assignment/roster · B change requests ⇄ responses · C officer (private+public)
    - Fleet Command **live-orders tool**: lifecycle/order buttons + Attack/Defend sticky composers +
      hotkeys (cross-epic with #106/#35) + Event-ended S.P.O.I.L.S. deep link
    - Fleet Command custom broadcasts (all/team/ship/user)
    - S.P.O.I.L.S. settlement set
    - Proving Ground: participant + public/spectator follow
  - **Cross-pillar acceptance criteria** appended to #105 (Rally), #106 (Fleet), #107 (S.P.O.I.L.S.),
    #108 (Proving Ground): "emit notification trigger events for the Notifications epic."
