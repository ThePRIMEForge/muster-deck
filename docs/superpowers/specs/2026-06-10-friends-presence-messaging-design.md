# Friends, Presence & Messaging — Design

**Date:** 2026-06-10
**Status:** Approved in brainstorm; ready for Blair review → ticketing
**Author:** Christoph (product) with Claude; reviewed by Blair (tech owner)

---

## 1 · Goal

Give signed-in MusterDeck users a social layer: see which of their friends are online,
see who else is present in an activity they're in, and message people — modeled on what
works in Discord. Today there is **no friends or presence system** anywhere in the product
(the only "online" indicator is a cosmetic mockup inside a Fleet Command operation, and the
only user list is the admin/moderator moderation table).

This ships in two epics on a shared real-time foundation. **Epic 1 (Friends & Presence)
ships first and stands on its own.** Epic 2 (Messaging) builds on top.

**Framing — this is intentionally lightweight.** MusterDeck messaging is a low-friction option
for members who aren't comfortable moving into Discord yet; it is **not** meant to replace Discord.
That framing justifies the deliberately small retention limits (§6.5) and the modest scale we're
designing for.

---

## 2 · Scope — two distinct lists

There are two different things, and conflating them is the main risk:

1. **"Friends Online"** — one global list that follows the user. Shows **your friends who are
   currently logged into MusterDeck**, with where they are / what they're doing in the app.
   Appears in **Crossroads** (signed-in home) and **Rally Point browse**.
2. **"Who's here"** — a per-activity roster. Shows **everyone present or signed up for that
   specific activity**, friends highlighted. Appears inside a **Fleet Command operation** and a
   **S.P.O.I.L.S. settlement**.

**Proving Ground has no Friends-Online panel and no "who's here" roster** (kept clean by design).
It does, however, get an **activity chat channel** in Epic 2 (organizer announcements +
participant chat) — see §6.

---

## 3 · Key decisions (from brainstorm)

| Decision | Choice | Notes |
|---|---|---|
| Presence model | **Online + what they're doing in MusterDeck** | Green dot + context ("In a Fleet op", "Browsing Rally Point"). Not full Away/DND states. |
| Friend model | **Mutual, Discord-style** | Send → accept/decline. Add / remove. |
| Messaging build | **A — build our own now** | Discord Social SDK (friends/DMs/presence) is **native-only, no web support**, so it can't be used by a browser app. Announcement-bridge to Discord is a backlog enhancement (→ path C over time). |
| Activity messaging | **X + Y** | Auto channel per activity (membership = signups) **and** ability to start private DM/group DM with individuals from a roster. |
| Activity channel layers | **Announcements + chat** | Organizer can broadcast; participants chat in the same channel. |

---

## 4 · Shared foundation (both epics depend on this)

- **Real-time transport — Supabase Realtime channels (confirmed; not heartbeat polling).** Powers
  both presence and live messaging. Setup/conventions are a prerequisite ticket.
- **Presence cadence (recommended, lightweight):** use Realtime **Presence** so online/offline is
  event-driven (join/leave → near-instant), with no polling timer. The "what they're doing in
  MusterDeck" context updates only on a **screen/activity change**, and `last_seen_at` is written on
  disconnect. This is effectively free — a few-minutes timer isn't needed.
- **Building block in place:** `profiles.last_seen_at` already exists
  (`supabase/migrations/20260520190000_shared_foundation_accounts.sql`) — currently unused.

---

## 5 · Epic 1 — Friends & Presence  *(ships first, independent of pillar maturity)*

### 5.1 Friend graph
- Send / accept / decline a friend request (mutual).
- Remove a friend.
- **Block a user** (hard stop on contact in both directions).
- Data model: a `friendships` (or `relationships`) table with states
  (pending / accepted / blocked), plus appropriate RLS. New migration(s).

### 5.2 Presence
- Track **online + current location/activity within MusterDeck** while a tab is open and active.
- **Friends-Online panel** rendered in Crossroads and Rally Point browse.
- **Per-activity "Who's here" roster** rendered in a Fleet Command operation and a S.P.O.I.L.S.
  settlement — friends highlighted, signed-up participants listed.
- Proving Ground: no panel.

### 5.3 Privacy & safety model  *(promoted from a single "Block" line per Blair's review)*
Because Epic 2 lets non-friends reach you through activity channels and roster DMs, the controls
that bound that abuse surface are defined here in Epic 1 so they exist before messaging lands:

- **"Who can DM me" setting** (Discord-style): Everyone · Org members · Friends only · No one.
- **Relationship gate:** to *open a private thread* with someone, you must share a relationship —
  friend, shared org, or shared activity (both signed up to the same activity). Prevents cold,
  context-free DMs.
- **Rate limiting (recommended starter values, tunable):** friend requests **20 / day**; cold DMs
  to people you don't already share a thread with **5 / hour**, and you can't keep messaging a cold
  contact who hasn't replied (anti-spam). Block has no limit. Numbers are deliberately conservative
  given expected low usage; Blair tunes after launch.
- **Block & Report buttons on every person** — surfaced wherever a person appears (friends list,
  roster, profile, chat). **Block** is per-user and stops contact both directions (§5.1). **Report**
  routes into the moderation flow (§6.3).
- **Blocks notify moderators/admins** — each block emits a signal into the mod/admin notification
  view as an abuse indicator (a user being blocked repeatedly is a flag worth seeing). *Assumption
  to confirm with Blair: this is a mod/admin-facing signal, not a notification to the blocked user.*

> Activity *channels* themselves are not the main abuse vector (membership = legitimate signups).
> The gate primarily governs the **start-a-private-thread (Y)** path and friend requests.

---

## 6 · Epic 2 — Messaging  *(depends on Epic 1)*

### 6.1 Core chat
- **Friend DMs** (1-on-1).
- **Group DMs** (hand-picked friends).
- Real-time delivery + unread badges; wires into the existing `NotificationCenter`.

### 6.2 Activity channels (X + Y)
- **Auto channel per activity** — membership derived from the activity's signup list (no manual
  management).
- **📣 Organizer announcements** — host/organizer can broadcast to all participants. Ties into the
  existing notification work (#26 op notifications, #34 live updates).
- **💬 Participant chat** — everyone signed up talks in the same channel.
- **Start a private DM/group DM** with specific people from a roster (the Y path; subject to §5.3).

### 6.3 Report & moderation flow  *(moved up from backlog per Blair's review)*
Given how open activity channels are, reporting is in Epic 2 core, not the backlog.

- **Report button** on every person (per §5.3) and from within any chat.
- A report lands in a **moderator/admin inbox**, including a **link to the last conversation thread
  with the reported member** so a moderator has immediate context.
- Routes into the existing admin/moderator tooling (Admin Portal #110 / Moderator page #111), which
  already supports time-out / ban / blocklist actions.
- Block events also feed the mod/admin view as a passive abuse signal (§5.3).

### 6.4 Pillar-maturity rule  *(explicit, so the assumption is not lost)*
- The **activity-channel capability** (the reusable pattern: a channel bound to a signup list, with
  announcements + chat) is built in **Epic 2**, wired first into the pillars that already have
  signup data: **Rally Point** and **Fleet Command**.
- **S.P.O.I.L.S.** and **Proving Ground** channels are delivered **as part of those pillars'
  own build-out** — a named acceptance criterion inside each pillar's epic — **not** as separate
  standalone "later" tickets. When the pillar matures enough to have a participant/signup list, its
  channel comes online by wiring that list into the Epic 2 capability.

---

### 6.5 Retention & scale  *(deliberately small)*
Designed for light use (see Framing in §1), which keeps storage and complexity low:

- **DMs & group DMs:** rolling **last 50 messages per thread** — older messages drop off. Keep only
  the **15 most-recent conversations per user**; older threads age out.
- **Activity channels:** lifetime is bound to the activity — a channel is archived/removed when its
  activity closes. *Open for Blair: a busy op channel may want a higher or time-based cap than 50;
  flagged rather than assumed.*
- Implementation: enforce via a scheduled prune (or trigger) rather than keeping everything and
  filtering at read time.

---

## 7 · Cross-epic & cross-pillar dependencies

- Epic 2 depends on Epic 1 (friend graph, presence, rosters, privacy model).
- Both epics depend on the §4 real-time foundation spike.
- Activity channels depend on each pillar exposing a participant/signup list (see §6.4).
- Report-from-chat depends on existing admin/moderator moderation tooling.

---

## 8 · Backlog (deliberately deferred)

- **In-game Star Citizen status** — show whether a friend is actually in SC (would piggyback on
  Discord "Now Playing" / RSI presence). Separate integration, real unknowns.
- **Discord announcement-bridge** — bot/webhooks mirror organizer announcements into the org's
  Discord server (gets us to hybrid path "C"). Only reaches Discord-linked members.
- **Away / Do-Not-Disturb** presence states (manual, Discord-style).
- **Native desktop app + Discord Social SDK** — the only path that revives full native Discord
  friends/DM/presence integration; out of scope while MusterDeck is a web app.

---

## 9 · Decisions resolved + remaining questions for Blair

**Resolved (2026-06-10):**
- Real-time transport: **Supabase Realtime channels** (not heartbeat). → §4
- Presence cadence: **event-driven via Realtime Presence**, context on screen change; no polling. → §4
- Rate limits: starter values **20 req/day, 5 cold DMs/hour** (tunable). → §5.3
- Retention: **50 messages/thread, 15 threads/user**. → §6.5
- Block + Report on every person; report → mod/admin inbox with link to last thread; blocks signal
  mods/admins. → §5.3, §6.3

**Still open for Blair:**
1. **Relationship-gate default** — default "who can DM me" value for a new user (recommend:
   *Org members + shared activity*, not fully open).
2. **Busy-channel retention** — whether activity channels need a higher/time-based cap than 50 (§6.5).
3. **Block-signal direction** — confirm blocks are a mod/admin-facing signal only, not surfaced to
   the blocked user (§5.3).

---

## 10 · Proposed GitHub structure (for ticketing after Blair sign-off)

- **[EPIC] Friends & Presence** (`epic`, new `epic:social` label)
  - Foundation spike: real-time infrastructure approach
  - Friend graph: requests / accept / decline / remove (data model + RLS migration)
  - Block + Report buttons on every person (block stops contact both ways)
  - Presence tracking service (online + in-app activity) via Supabase Realtime Presence
  - Friends-Online panel (Crossroads + Rally Point browse)
  - "Who's here" roster (Fleet Command op + S.P.O.I.L.S. settlement)
  - Privacy & safety: "who can DM me" setting + relationship gate + rate limiting + block-signal to mods
- **[EPIC] Messaging** (`epic:social`, *depends on Friends & Presence*)
  - Friend DMs (1-on-1)
  - Group DMs
  - Activity-channel capability (announcements + participant chat) — Rally Point + Fleet Command
  - Start private thread from a roster
  - Report → moderator/admin inbox with link to last thread (→ Admin #110 / Moderator #111)
  - Retention prune: 50 messages/thread, 15 threads/user (scheduled job/trigger)
- **Cross-pillar acceptance criteria** (added to existing pillar epics #107 S.P.O.I.L.S. and #108
  Proving Ground): "activity channel wired to this pillar's signup list."
- **Backlog tickets:** Discord announcement-bridge · in-game SC status · Away/DND · native-app
  Social SDK note.
