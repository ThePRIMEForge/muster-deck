# Account Settings — Design Spec

**Date:** 2026-06-12
**Status:** 🔍 In review (design lock pending @blairg23)
**Author:** cmFrameShift
**Visual reference:** `docs/mockups/2026-06-12-account-admin-skins.html` (open via local static server; "User Settings" tab)
**Skin authority:** `docs/specs/2026-06-12-pillar-crt-styling-system.md` (LOCKED) — Account wears the **v2 Muster amber** utility palette at **20% grunge**.

**Tickets covered:** #13 (Account settings page) · #153 (Account skin — v2 Muster + CRT) · #130 (Notifications settings section) · #12 (RSI handle verification) · #14 (badge surfacing on profile)
**Depends on:** existing `profiles` / `profile_identities` / `notification_preferences` schema (migration `20260520190000_shared_foundation_accounts.sql`). Badge art for Patreon tiers comes from #103.

---

## 1. Overview

Re-skin and complete the user-facing Account Settings screen in the locked Muster-amber CRT treatment, restructured into a **left-column vertical tab nav** with three tabs:

1. **Profile** — identity, avatar, bio, RSI verification, game loops
2. **Security** — SSO links, email/password, account termination (Danger Zone)
3. **Notifications** — per-category × per-channel preference matrix

Each logical section owns its own **Save Changes** button (saves are section-scoped, not whole-page).

The current component (`src/components/foundation/AccountSettings.tsx`) is a single flat form (callsign / org / RSI handle / identity rows / save). This spec expands it substantially; it is a **full build**, not just a re-skin.

## 2. Layout & skin

- Two-column shell: sticky left nav (`Profile · Security · Notifications`) + content pane. Collapses to single column < 760px.
- CRT panels (2px accent border, phosphor bloom, chromatic fringe), Muster-amber palette tokens, 20% grunge — per the styling-system doc. No new visual decisions; this consumes the locked treatment.
- Buttons: Primary = Hardware-Extrude, Secondary = Nested-Brackets ghost, Slide-to-Confirm (brand spec) for irreversible actions only.

## 3. Profile tab

### 3.1 Identity
- **Avatar** — upload, **max 320×320px**, PNG/JPG. Stored in a new Supabase Storage bucket `avatars` (public-read, owner-write RLS); `profiles.avatar_url` holds the public URL. Client-side downscale/validate to ≤320×320 before upload.
- **Callsign** (`display_name`), **Primary organization** (`primary_org`), **Bio** (`bio`, 280-char limit with live counter).
- **Badges** surfaced next to the callsign (read-only here; see §3.2 and #14): ◆ **RSI Verified**, and Patreon **Captain / Admiral / Praetorian** (whichever the user holds). Badges are orthogonal to role; art from #103.
- Save Changes (section-scoped) → `updateMyProfile`.

### 3.2 RSI Verification (#12)
**Decision (locked): automated scrape.** No manual review queue.

Flow:
1. User presses **Generate Code** → server creates `MUSTERDECK-` + 16 uppercase alphanumeric chars, stored in `profiles.rsi_verification_code`, status → `not_submitted`/`pending`.
2. User copies the code into the **Short Bio** of their public RSI citizen page.
3. User presses **Verify** → a **Supabase Edge Function** fetches the **public citizen page** `https://robertsspaceindustries.com/citizens/{rsi_handle}`, parses the bio text, and checks the code is present.
4. **Gate:** `display_name` (callsign) must equal `rsi_handle` exactly, else verification fails with a clear message.
5. On success: `rsi_verification_status = 'verified'`, `rsi_verified_at = now()`, RSI-Verified badge applied. On failure: status `failed` with reason.

**Schema additions to `profiles`:** `rsi_verification_code text`, `rsi_verified_at timestamptz`. (Status column already exists.)

**Risks / caveats (call out to reviewer):**
- RSI has **no public API**; this depends on scraping a public HTML page — **brittle** (breaks if RSI changes markup) and **grey-area on ToS**. Edge function must handle: page not found, private profile, rate-limiting, markup drift. Failures degrade to status `failed` with a retry path, never a hard crash.
- Consider a server-side rate limit on Verify attempts per user.

### 3.3 Game Loops
- Checkbox grid; user selects the loops they play. Used by Rally Point / crews for recruiting.
- **New schema:** `game_loops` catalog table (`id`, `slug`, `label`, `sort`, `active`) + `profile_game_loops` join (`profile_id`, `game_loop_id`). RLS: owner-write on the join, public-read.
- **Catalog (confirmed by Christoph 2026-06-12; can still grow):** Bounty Hunting, Mining, Salvage, Refuelling, Refining, Cargo Hauling, Trading, Combat (PvP), Combat (PvE), Exploration, Medical/Rescue, Racing, FPS/Ground, Piracy, Engineering, Scouting/Recon.
- Save Changes (section-scoped).

## 4. Security tab

### 4.1 Linked accounts (SSO)
- Discord / Google link state with Link / Unlink actions, backed by `profile_identities`. Unlink guarded so the user can't remove their only sign-in method (see §4.2).

### 4.2 Email & password
- Lets an SSO-only user **add an email + password** credential so they can also sign in directly. Set/change email, set/confirm password (Supabase auth). Validation: password confirm match; email format.
- Guard: a user must always retain at least one working sign-in method.

### 4.3 Danger Zone — Terminate account
- **Slide-to-Confirm** (brand spec: metal slab, grey chevrons ahead, red hazard chevrons revealed behind, snaps back < 92%). Irreversible.
- Cascade: sets `account_status = 'deleted'` and removes/anonymizes the account, **all listings posted, and all applications submitted**. Define exact cascade vs soft-delete with Blair (data-retention + RLS implications). Recommend soft-delete (`deleted`) + scheduled hard purge over immediate destructive delete.

## 5. Notifications tab (#130)

A **category × channel** preference matrix. Columns: **Email · In-app · Desktop (browser push)**. Rows:

| Category | Email | In-app | Desktop |
|---|---|---|---|
| MusterDeck Newsletter | ✓ | — | — |
| Rally Point (listing joins · changes to listings you joined) | ✓ | ✓ | ✓ |
| DMs & Group chat | ✓ | ✓ | ✓ |
| Proving Grounds | ✓ | ✓ | ✓ |
| S.P.O.I.L.S. (invites · settlements) | ✓ | ✓ | ✓ |
| Fleet Command (ops, assignments, alerts — high volume) | — | ✓ | ✓ |

- **Newsletter** is email-only and **defaults ON** at signup (the signup consent flow, #99/#150, sets it; user can uncheck there and here).
- **Fleet Command** has no email channel (high volume); in-app + desktop only.
- "Application digest email" from the old mock is **removed**.

**Schema:** the existing `notification_preferences` table is per-category single booleans. This matrix needs **per-channel** granularity. Options for Blair: (a) widen `notification_preferences` to `{category}_{email|inapp|push}` boolean columns, or (b) normalize into a `notification_preferences_channels(profile_id, category, channel, enabled)` table. Recommend (b) for extensibility. Add `newsletter_enabled` regardless. Desktop push reuses existing `browser_push_enabled` concept.
- Save Changes (section-scoped).

## 6. Data-model summary (new/changed)

- `profiles`: **+** `rsi_verification_code`, `rsi_verified_at`
- **+** Storage bucket `avatars` (≤320×320, RLS)
- **+** `game_loops`, `profile_game_loops`
- `notification_preferences`: **+** `newsletter_enabled`; channel granularity per §5 (decision pending)
- Patreon badge fields consumed from #103 (not built here)

## 7. Out of scope

- Patreon integration / tier mechanics (#103/#104) — Account only *displays* the resulting badges
- The Admin Portal (separate spec) and Moderator page (#111)
- Auth/signup/SSO plumbing itself (foundation)

## 8. Sequencing

No hard blockers. Build order: schema migration → Profile (identity/avatar/bio) → Game Loops → Notifications matrix → Security (email/password, SSO guards) → RSI verification edge function (highest risk, last) → Danger Zone cascade (confirm policy with Blair first).
