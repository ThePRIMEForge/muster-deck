# MusterDeck Information Architecture & Site Map — Design Spec

Date: 2026-06-09
Author: Christoph Mayer (creative/product direction) with Claude
Status: Approved structure, ready for implementation planning
Companion: `2026-06-09-musterdeck-visual-identity-system-design.md` (visual identity)

## Purpose

Define MusterDeck's page structure, access tiers, navigation, key on-page actions, and
account/role model. This is the structural backbone the page designs and implementation build
against. Visual treatment is covered by the companion visual-identity spec.

Visual companions in Drive (`Muster Deck/02_DESIGN & WORKING FILES/`):
- `2026-06-09-musterdeck-sitemap.{pdf,html}`
- `2026-06-09-musterdeck-pillar-color-system.{pdf,html}`
- `2026-06-09-musterdeck-type-specimen.html`, `2026-06-09-musterdeck-crt-fonts.html`

## Three Access Tiers

1. **Public / Guest** — no account.
2. **Account Required** — signed in.
3. **Admin / Moderator** — elevated.

## 1 · Landing Page (public, marketing)

- **No top menu / no nav bar.** It is a marketing page, not the app shell.
- **Hero:** big hero image/background, hero messaging ("Rally, Command, Settle."), a **Sign Up**
  button, and a **Browse Rally Point** button.
  - The Browse Rally Point button has a hover treatment: on hover the label types out
    **"Looking for Group"** in the VT323 CRT font (the LFG nod).
- **Four large pillar sections** below the hero — Rally Point, Fleet Command, S.P.O.I.L.S.,
  Proving Ground — each with a description and an image.
  - Each pillar island has a **radar hover/idle effect**: faint concentric radar rings fill the
    island at idle (cropped to the rectangle); on hover a corner-anchored sweep arm rotates with a
    trailing glow, and contact "pings" flash as the sweep passes them. Sweep origin per pillar:
    Rally top-left, Fleet top-right, S.P.O.I.L.S. bottom-left, Proving Ground bottom-right.
    (Exact ping-to-sweep timing is a build-time detail.)
  - CTA: Rally Point's island says **Browse Rally Point** (guest-accessible); the other three say
    **Sign up for access**.

## 2 · Sign Up / Log In (Supabase auth)

Three methods:
- **Google SSO**
- **Discord SSO** (fits the community)
- **Email + Password** — with **email confirmation** (needs Supabase setup; ties to issue #78,
  custom SMTP).

## 3 · Crossroads (gated — signed-in home)

Reachable **only after sign-up/sign-in.**

- **Minimal top bar:** site logo + name (left); **no nav links**; right side: **Account Settings**,
  **Admin ▸** (only if the user is an admin), **Log out**.
- **Four pillar cards**, each with a short description and action items:

| Pillar | Actions |
|---|---|
| **Rally Point** | **Browse Mission Board** · **Post Group Activity** |
| **Fleet Command** | **Join Operation** (enter operation code → modal) · **Set Up Fleet Operation** |
| **S.P.O.I.L.S.** (Settlement · Payouts · Operations · Inventory · Loot · Shares) | **Enter for Settlement** · **Set Up a Settlement** |
| **Proving Ground** | **Join Tournament** · **Set Up Tournament** · **Browse Public** |

## Account Settings (own page)

Separate from the Crossroads. Fields (extensible — intentionally room to grow):
- Bio
- Org affiliation
- Preferred game loops (**multiple** allowed)
- Verify admin status
- Future: avatar, RSI handle, timezone, languages, ships owned, roles played, etc.
- **Delete account** — behind a verification step so it is hard to do by accident.

## Admin Portal (admin only)

- List all users
- Time out a user (24h / 7 days)
- Ban + blocklist email
- Reverse: unban / unblocklist
- System / page status (what's working / not)
- Error log
- Manage admins & moderators
- Future candidates: usage stats, content reports, audit log

## Moderator Page (moderator only)

A lighter subset of admin:
- See the entire user list
- Time out / un-time-out users
- Banned + blocklist — **read only**
- See system / page status
- **No** ban/blocklist actions, **no** admin management

## Account / Role Model

Levels (highest → lowest):

1. **Admin**
2. **Moderator**
3. **Registered User**
4. **Guest User**

Plus an orthogonal **modifier badge** for visibility: **◆ RSI Verified** (a trust badge shown on
verified users; not an access level).

Admin & moderator membership is editable by admins. (Whether there is a distinct non-removable
"master admin" — Christoph + Blair — is an open decision; see below.)

## Global Elements (all pages)

- **Footer:** Privacy Policy · Terms of Service · Disclaimer · Paid Support · Consumer Rights · RSI
  fan-site disclosure · version chips. Fan-project disclaimer intact.
- **Consent banner:** cookie/tracking consent overlay (shipped — #97).

## Operation Codes

Fleet Command (and likely S.P.O.I.L.S. settlements and Proving Ground tournaments) use a
**join-by-code** pattern: a short alphanumeric operation code that participants enter to join.
Open: exact format (an 8-character code was discussed), generation, collision handling, and whether
all three pillars share one code system.

## Open Items to Research / Decide

- **SC-flavored verb** for "Browse Mission Board" — confirm the right in-fiction term.
- **Operation codes** — format, generation, and whether Fleet / S.P.O.I.L.S. / Proving Ground share
  one system.
- **Supabase email confirmation** — confirm it can be enabled (issue #78, custom SMTP).
- **Role model** — confirm Admin / Moderator / Registered / Guest + RSI-Verified badge; decide
  whether a protected "master admin" tier exists for managing the admin/mod lists.
- **Public Proving Ground leaderboards** — does any tournament data show publicly (landing or a
  public view) without an account?
- **Pillar sub-pages** — map each pillar's internal screens during its own deep-dive (next phase).

## Next Phase

Pillar-by-pillar deep dive: for each of Rally Point, Fleet Command, S.P.O.I.L.S., and Proving
Ground, define the internal screens, data, and stack. Each pillar gets its own spec → plan →
implementation cycle.
