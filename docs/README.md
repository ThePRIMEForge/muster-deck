# MusterDeck — Docs

In-repo knowledge base for product decisions, design specs, and implementation plans.
Versioned with the code so every branch carries the context it needs.

**Rule: code wins on conflict.**
If a spec and the code disagree, the code is the truth. Update the spec, not the code.

---

## Structure

| Folder | What goes here |
|---|---|
| `docs/specs/` | Design specs — what to build and why; decisions locked before implementation |
| `docs/plans/` | Implementation plans — how to phase an epic into tickets |
| `docs/adr/` | Architecture decision records — why a specific technical choice was made (create when needed) |

**Naming convention:** `YYYY-MM-DD-<slug>.md`

---

## Doc Lifecycle

Every doc carries a `**Status:**` header. Valid values:

| Status | Meaning |
|---|---|
| `draft` | Work in progress; not yet reviewed |
| `active` | Current and authoritative |
| `implemented` | Feature shipped; doc is now historical reference |
| `superseded` | Replaced by a newer doc — header must link to the replacement |

---

## Index

### Design Specs

| Doc | Description | Status |
|---|---|---|
| [Visual Identity System](specs/2026-06-09-musterdeck-visual-identity-system-design.md) | Refined-industrial visual direction, per-pillar color system, type stack | active |
| [Information Architecture](specs/2026-06-09-musterdeck-information-architecture-design.md) | Three-tier access architecture, sitemap, navigation model | active |
| [Friends, Presence & Messaging](specs/2026-06-10-friends-presence-messaging-design.md) | Social layer: friend lists, online presence, in-app chat | active |
| [Notifications & Push](specs/2026-06-10-notifications-push-design.md) | In-app stack + web push (VAPID), per-group notification levels, per-pillar taxonomy | active |
| [S.P.O.I.L.S.](specs/2026-06-10-spoils-design.md) | Loot settlement: hybrid fairness ledger, QM roles, 5-state lifecycle, UEX pricing | active |

### Implementation Plans

| Doc | Description | Status |
|---|---|---|
| [Friends & Presence Epic 1 Plan](plans/2026-06-10-friends-presence-epic1-plan.md) | Phase breakdown and ticket map for Epic 1 (friends + presence foundation) | active |

---

## Adding a Doc

1. Pick the right type (`specs/`, `plans/`, `adr/`)
2. Name it `YYYY-MM-DD-<slug>.md`
3. Open with `**Date:**`, `**Author:**`, `**Status:** draft`
4. Add a row to the index above
5. Change status to `active` when reviewed and approved
