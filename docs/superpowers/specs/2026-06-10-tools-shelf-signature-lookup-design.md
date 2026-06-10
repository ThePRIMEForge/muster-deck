# Tools Shelf + "Signature Ident" — Design

**Date:** 2026-06-10
**Status:** Approved in brainstorm; ready for Blair review → ticketing
**Author:** Christoph (product) with Claude; for Blair (tech owner)

---

## 1 · Goal & framing

Introduce a **Tools** area in MusterDeck — a lightweight shelf of small, self-contained utilities
for players — and ship its **first tool**, **Signature Ident**: a Star Citizen mining
**radar-signature lookup**. ("Ident" = identify-from-signal, in the IFF/comms sense — the tool
identifies an ore from its radar signature.)

This is its **own epic / new scope**. The Tools shelf is deliberately *not* a fifth pillar: it reads
as a collection of handy helpers, visually lighter than Rally Point, Fleet Command, Spoils, and
Proving Ground. The signature lookup is the proof-of-concept first tool; the shelf is built so future
tools are added as cards without re-plumbing navigation.

**Access:** **logged-in members only.** It lives in the authenticated hub, not on the public landing
page. (Consequence: it is a member perk, not a search-discoverable front-door feature. Revisit only
if we later want tools to attract new members.)

## 2 · What the signature tool does

In Star Citizen, scanning a deposit shows a **radar signature** number. Each mineral has a fixed base
signature (level 1) that scales linearly by scan level (×1 … ×10). The tool takes a number the player
types and returns the **5 closest matches** so they can infer what they're looking at.

Faithful rebuild of the original ([signature.verseworks.org](https://signature.verseworks.org/),
"Made by BunnyBlue" / VerseWorks) — same data and math, restyled in the MusterDeck theme, with visible
credit to the original author.

### Source data (current values, to be hardcoded)

26 minerals (base signature, level 1):

| Mineral | Base | Mineral | Base | Mineral | Base |
|---|---|---|---|---|---|
| Raw Ice | 4300 | Hephaestanite | 4180 | Borase | 3570 |
| Aluminum | 4285 | Torite | 3900 | Taranite | 3555 |
| Iron | 4270 | Agricium | 3885 | Beryl | 3540 |
| Raw Silicon | 4255 | Tungsten | 3870 | Lindinium | 3400 |
| Copper | 4240 | Titanium | 3855 | Riccite | 3385 |
| Corundum | 4225 | Aslarite | 3840 | Ouratite | 3370 |
| Quartz | 4210 | Laranite | 3825 | Savrilium | 3200 |
| Tin | 4195 | Bexalite | 3600 | Stileron | 3185 |
| | | Gold | 3585 | Quantainium | 3170 |

3 fixed-value node types (no level scaling): **Harvestables** 2000, **FPS Nodes** 3000,
**ROC/GEO Nodes** 4000.

### Matching logic (1:1 with original)

- Build a lookup table: for each mineral, `value = base × level` for `level` 1…10; plus the 3 fixed
  nodes at their fixed value.
- Parse input: strip commas/whitespace; reject empty, non-numeric, or ≤ 0 (show "awaiting input").
- Rank all rows by **absolute distance** from the input; return the **top 5**.
- For each result show: mineral name, matched value, signed delta (`+1,200` / `−800`) or **"Exact
  match"** when delta is 0, and a badge with the **signal level (1–10)**, or **"Type — "** for fixed
  nodes.

## 3 · Information architecture & navigation

- **New top-level route `tools`** (members-only, no `module`) added to `appRoutes` in
  `src/lib/appNavigation.ts`, plus `FoundationRouteId` in `src/lib/foundationTypes.ts`.
  It is **not** a `FoundationModuleKey` pillar.
- **Surfaced in two places**, both authenticated-only:
  - **Operations Hub** (`src/components/foundation/OperationsHub.tsx`) — a lighter "Tools" entry,
    visually distinct from the four pillar buttons.
  - **AppFrame nav** (`src/components/foundation/AppFrame.tsx`) — a nav item, gated to logged-in.
- **Not** added to `PublicLanding.tsx` (public crossroads), consistent with members-only access.

## 4 · Component & data structure

- `src/lib/tools/signatureData.ts` — exports `MINERALS` (name/base pairs), `FIXED_NODES`, and a
  `DATA_AS_OF_PATCH` string used by the caption. Single source of truth; updated by hand each patch.
- `src/lib/tools/signatureMatch.ts` — pure functions: `parseSignatureInput(raw)` and
  `findSignatureMatches(value)` returning the ranked top-5. No DOM, no React — easily unit-tested.
- `src/components/tools/ToolsHub.tsx` — the shelf. Renders a grid of **tool cards**; v1 has one card
  ("Signature Ident"). Holds local state for which tool is open and renders it inline, so
  adding future tools needs no new top-level route. Includes an empty/"more tools coming" affordance.
- `src/components/tools/SignatureLookup.tsx` — the tool UI: number input + live results list + the
  patch caption + attribution line.
- Styling: extend `src/styles.css` using existing theme variables (`--md-mustard`, `--md-olive`,
  `--md-surface`, etc.) and the existing card patterns. No new styling system.
- Wiring: add the `tools` render branch in `src/App.tsx` alongside the other foundation routes,
  wrapped in `AppFrame`.

## 5 · Data freshness

Signature values are tied to the current Star Citizen patch and CIG changes them occasionally.
Approach (approved): **hardcode current values**, display a caption — *"Signature values current as of
patch {DATA_AS_OF_PATCH}"* — and **update the table by hand each patch cycle**. No live data feed.
`DATA_AS_OF_PATCH` is set to the live patch at implementation time.

## 6 · Attribution

Visible credit in the tool: **"Data & concept: BunnyBlue · VerseWorks"**, linking to
`https://signature.verseworks.org/`.

## 7 · Testing

- **Unit tests** for `signatureMatch.ts`:
  - Known input → expected ordered top-5 (e.g. an exact mineral×level value ranks first with "Exact
    match"; a near value ranks the right neighbours with correct signed deltas).
  - Input parsing: commas/spaces stripped; empty / non-numeric / ≤ 0 → null (awaiting input).
  - Fixed nodes appear with no level ("Type").
- Light component smoke test optional; the math is the part that must stay correct.

## 8 · Scope / YAGNI

**In scope (v1):** Tools shelf (one card), signature lookup faithful to the original, members-only
gating, theme restyle, attribution, patch caption, unit tests.

**Out of scope (later):** additional tools; reverse lookup (mineral → value); patch-version history;
live/auto-updated data; public exposure of the shelf; per-tool deep-link routes.

## 9 · Files touched (summary for ticketing)

- `src/lib/appNavigation.ts`, `src/lib/foundationTypes.ts` — register `tools` route.
- `src/components/foundation/OperationsHub.tsx`, `AppFrame.tsx` — surface Tools entry (auth-only).
- `src/App.tsx` — render branch for `tools`.
- `src/lib/tools/signatureData.ts`, `src/lib/tools/signatureMatch.ts` — data + logic (+ tests).
- `src/components/tools/ToolsHub.tsx`, `SignatureLookup.tsx` — shelf + tool UI.
- `src/styles.css` — themed styles.
