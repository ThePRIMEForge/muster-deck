# Admin Portal — Design Spec

**Date:** 2026-06-12
**Status:** 🔍 In review (design lock pending @blairg23)
**Author:** cmFrameShift
**Visual reference:** `docs/mockups/2026-06-12-account-admin-skins.html` ("Admin Portal" tab)
**Skin authority:** `docs/specs/2026-06-12-pillar-crt-styling-system.md` (LOCKED) — Admin wears the **v2 Muster amber** utility palette at **20% grunge** (same skin as Account).

**Tickets covered:** #110 (Admin Portal — moderation & system tooling) · #154 (Admin skin — v2 Muster + CRT)
**Blocked by:** **#112 (Role model & permissions)** — must land first. Part of epic #109. Related: #111 (Moderator page).
**Reviewer note:** Supabase RLS / permissions are higher-risk — **@blairg23 to review** the auth-sensitive parts (per #110).

---

## 1. Overview

Re-skin and complete the Admin Portal in the locked Muster-amber CRT treatment, restructured into a **left-column vertical tab nav** (mirroring Account Settings):

`Status · Users · Team · Analytics · System`

The portal is **shared by Admin and Super Admin** (one portal, not two). Per #109/#112 the only difference: **Super Admin (Christoph + Blair, hard-coded) can grant/revoke Admin rights; an Admin cannot** (and cannot self-escalate). The separate **Moderator page (#111)** is a limited, mostly read-only subset and is **not** built here — but its view-only System/Status + error-log access is noted where relevant.

The current component (`src/components/foundation/AdminPortal.tsx`) is a flat user table with inline ban/restrict buttons. This spec restructures it and adds the manage modal, history, team, analytics, and system surfaces. **Full build**, not just a re-skin.

## 2. Role model dependency (#112)

Five-level ladder: **Super Admin ▸ Admin ▸ Moderator ▸ Registered User ▸ Guest.** The portal's available actions are gated by the viewer's role. This spec assumes #112 lands first and exposes the viewer's site role + permission checks. Badges (RSI Verified, Patreon tiers) are orthogonal visibility modifiers.

## 3. Tabs

### 3.1 Status
- Stat strip: **Total users · Active now (live presence) · Active 7d · Timed out · Banned.**
  - "Active now" needs a presence source (realtime/last-active heartbeat). If presence infra isn't ready, derive from a short `last_active_at` window and label accordingly.
- "System at a glance": compact health rows (App/API, Database, RSI verification worker). Full detail under **System**.

### 3.2 Users (core moderation surface)
- Paginated user list with **search** (callsign / RSI / Discord) and **status filters** (All / Active / Timed out / Banned).
- Each row: avatar, callsign (+ badges), RSI handle, last active, status pill, and a **Manage** button.
- **Click the name → Moderation History** modal: joined date, last active, and a timeline of every moderation event (timeouts, bans, reinstatements) with timestamp + acting moderator.
- **Manage → action modal** explaining each action, each gated behind its own **Slide-to-Confirm**:
  - **Timeout — 24h or 7 days** (selectable duration). Effect: user cannot use comms, chat, or create events for the duration **or until a mod reinstates**. Reversible (un-timeout, also slide-to-confirm).
  - **Ban.** Effect: cannot return unless they plead their case / prove innocence via email or Discord. **Also email-blocklists** the account's email. Reversible (Unban → also un-blocklists), slide-to-confirm.
- Every ban/timeout (and reversal) **notifies the user** via email or Discord once that channel is connected (hook now, deliver when messaging/Discord lands).

**Schema (new):**
- `moderation_actions(id, target_profile_id, actor_profile_id, action ['timeout'|'ban'|'reinstate'|'unban'], duration_hours nullable, reason, created_at)` — the dated log behind history + the "Timed out / Banned" counts.
- `email_blocklist(email, profile_id nullable, created_at, created_by)` — enforced at signup.
- `account_status` already supports `active | restricted | banned | deleted` (+ `approval_required`). Map "timed out" → `restricted` + an active `moderation_actions` row with expiry; a job (or lazy check) clears expired timeouts.

### 3.3 Team
- **Administrators** list — distinguishes **Super Admin** (Christoph + Blair, owner/hard-coded) from **Admin**. **Super Admin only:** grant/revoke Admin.
- **Moderators** list — add/remove moderators (Admin + Super Admin can).
- Each entry: Manage action appropriate to viewer's role.

### 3.4 Analytics (UI now, backend stubbed)
- **Decision (locked): design the UI, stub the backend.** Visitors / pageviews / avg session / bounce + a traffic chart, sourced from **Google Analytics** later. Rendered with a clear **"Stub · GA not wired"** tag and a "Connect Google Analytics" action. GA integration (API + auth) is its own follow-up.

### 3.5 System (UI now, backend stubbed)
- Health rows: App server (uptime/version), Database (pool/size, "Check"), RSI verification worker (status, "Logs"). **Error-log view** (per #110) lives here; **Moderators get view-only** access to System status + error log (#111).
- **Restart server** — **Slide-to-Confirm** (brand spec), tagged stub. "Server" semantics are unresolved (stack is React + managed Supabase); the actual target (worker/edge/bot) is defined when the backend is wired. UI ships now as a non-functional, clearly-marked placeholder.

## 4. Interactions / components reused

- **Slide-to-Confirm** (brand spec) for: Timeout, Ban, Unban/Un-timeout, Restart server. Metal slab, grey chevrons ahead, red hazard chevrons revealed behind, snaps back < 92%.
- **Modal** pattern for Manage (actions) and History (timeline).
- Status pills (active/timeout/banned) with phosphor glow; banned rows dim.

## 5. Permissions / safety (Blair to review)

- All destructive endpoints enforce role server-side via RLS — never trust the client. Admin cannot grant Admin; no self-escalation; guests/registered users cannot reach the portal.
- Timeout expiry and ban/blocklist enforcement must hold at the data layer (RLS / policies), not just the UI.
- Email blocklist checked at signup to prevent ban evasion via re-registration.

## 6. Out of scope

- Role model itself (#112 — prerequisite)
- Moderator page (#111 — separate, limited subset)
- Patreon plumbing (#103/#104); GA backend; real "restart server" backend; messaging/Discord delivery (hooks only)

## 7. Sequencing

1. **#112 role model & permissions** (blocker)
2. Schema: `moderation_actions`, `email_blocklist`
3. Skin + left-nav shell; Status + Users (list/search/filter)
4. Manage modal + Timeout/Ban (+ blocklist) + reversals + history timeline
5. Team (admin/mod management; Super-Admin grant-Admin)
6. Analytics + System UI stubs (tagged), error-log view
7. Notification hooks for ban/timeout (deliver when messaging/Discord lands)
