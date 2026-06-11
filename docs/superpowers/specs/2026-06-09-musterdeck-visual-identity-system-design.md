# MusterDeck Visual Identity System — Design Spec

Date: 2026-06-09
Author: Christoph Mayer (creative direction) with Claude
Status: Approved direction, ready for implementation planning

## Purpose

Define MusterDeck's visual identity as an implementable system of design tokens and
rules. This supersedes the May 2026 "modern industrial / worn-paint" identity
(`2026-05-21-musterdeck-foundation-visual-identity-design.md` and the
`2026-05-22-musterdeck-visual-identity-handoff.md` lock). The earlier identity was
designed but **never implemented in the application code** — what currently ships in
`src/styles.css` is an older draft (olive tokens, a second "hot" mustard, the gitignored
"Capture It" font) that drifted from any locked decision. This spec replaces that
direction and is the one to build against.

## What changed from the May identity, and why

- **Dropped the worn-paint / chip-loss / grunge system entirely.** The elaborate SVG
  `feTurbulence` chip-loss treatment is retired. Direction is now *machined and printed*,
  not *weathered*.
- **Differentiation is explicit.** The crowded lane in the Star Citizen fan-tool space is
  cool navy/steel surfaces with blue or cyan glows (the "generic dashboard" look). MusterDeck
  deliberately goes the other way: **warm, physical, screen-printed, mustard-owning.** Warmth
  vs. coolness is the core differentiation axis.
- **Per-pillar color system.** Instead of one flat theme, the app is a set of color-coded
  "departments" sharing one grammar (see below). This was the key creative decision.
- **Type retired and replaced.** "Capture It" (gitignored fan-kit font, broken path — issue
  #83) is gone. The stencil-heavy May type stack is replaced with a sharp technical sans plus
  CRT/terminal accent fonts. All fonts are free Google Fonts (no asset-shipping problem).

## Core Concept

**Refined industrial / stamped printed-ops.** Warm, physical surfaces that read like a real
printed and stamped operational object — screenprint grain, ink stamps, hazard punctuation —
rendered with precision rather than grunge. The feeling is an operations tool that belongs in
the 'verse but is unmistakably its own brand, not a reskin of the game UI.

## Master Brand Thread

These are constant on **every** surface, regardless of pillar, and are what make the colored
departments read as one product:

- The **mustard MusterDeck mark** (`#D4A028`) — top-left brand position, always mustard.
- **Archivo** headings and the global navigation.
- The shared **screenprint / stamp grammar** (texture language, ink-stamp motif, hazard edges).

## Color System

### Master / brand palette

| Token | Hex | Role |
|---|---|---|
| `--md-mustard` | `#D4A028` | Master brand + Home/Crossroads accent. The one mustard. |
| `--md-mustard-hi` | `#E3B651` | Highlight / hover only. Not a second brand yellow. |
| `--md-rust` | `#9C4A22` | Rust accent, stamps, edge wear. |
| `--md-ink` | `#F3ECDB` | Primary text (warm off-white). |
| `--md-ink-2` | `#B9B09C` | Secondary text. |
| `--md-ink-3` | `#8B8472` | Muted labels. |
| `--md-base` | `#161109` | Warm near-black page base (Home). |
| `--md-panel` | `#1D1810` | Cards / surfaces (Home). |

No olive-as-base, no second warm yellow, no RSI orange, no cool steel as the master surface.

### Per-pillar accents

Each pillar shares the master grammar and the mustard brand mark, but carries its own accent
color and surface tint. Texture varies per pillar to reinforce its character.

| Surface | Accent token | Hex | Surface base | Texture / character |
|---|---|---|---|---|
| **Crossroads** (Home + Hub / control panel) | `--md-mustard` | `#D4A028` | `#161109` | Screenprint + ink stamp; VT323 amber flair |
| **Rally Point** | `--pillar-rally` | `#C1632E` (burnt orange/rust) | `#120B07` | Brushed rusted metal, darker, light wear |
| **Fleet Command** | `--pillar-fleet` | `#7FA356` (dim olive/radar green) | `#080D07` | CRT scanlines; Share Tech Mono readouts |
| **S.P.O.I.L.S.** | `--pillar-spoils` | `#C2473A` (oxblood/plunder) | `#170D0C` | Screenprint |
| **Proving Ground** | `--pillar-ground` | `#3DA3E0` (SC blue) | `#0B1019` | Screenprint; the one cool "arena" environment |

The system is **extensible**: a future pillar simply gets its own accent + base in the same
grammar.

**Open verification item:** Rally Point burnt-orange (`#C1632E`) and S.P.O.I.L.S. oxblood
(`#C2473A`) are both warm reds. Confirm they read as clearly distinct when seen in the built
app; if not, push Rally more amber-orange or S.P.O.I.L.S. deeper.

## Typography

All free Google Fonts.

| Role | Family | Usage |
|---|---|---|
| Display / headings / nav | **Archivo** (800–900, wide-tracked uppercase) | The workhorse. Engineered-nameplate feel. Real headings and navigation. |
| Body | **Saira Condensed** | Paragraphs, descriptions, dense UI text. |
| Mono utility | **JetBrains Mono** | Version chips, codes, metadata. |
| CRT/terminal accent | **Share Tech Mono** | System-wide terminal accent — status readouts, op channels. Clean, legible, used with restraint. |
| Special flair | **VT323** (amber phosphor) | Home / Landing / Control screens **only** — hero and status flourishes. |

Rules: headings and navigation must always be Archivo (legibility). CRT fonts are accents, not
body or primary headings. Stencil faces from the May identity are not used.

## Texture & Treatment

- **Screenprint grain:** fine accent-colored dot pattern at low opacity (default surface texture).
- **Ink stamp motif:** rotated stencil-stamp marks (e.g. status stamps) in rust or pillar accent.
- **Brushed metal:** faint horizontal brush lines (Rally Point).
- **CRT scanlines + phosphor glow:** Fleet Command terminal surfaces and any CRT-font text.
- The retired worn-paint **chip-loss / weathering** system stays retired. "More texture" below
  means richer surface grain and depth, **not** a return to the grunge-filter look.

## Weight, Depth & Glow (2026-06-09 addendum)

This refines the earlier "machined / minimal / thin-1px" stance. The site should feel **heavier and
more tactile** — more physical weight, not flatter. Where this conflicts with the original "precision
over grunge, thin dividers" guidance above, this addendum wins.

- **More texture, site-wide:** apply subtle surface texture (screenprint grain / fine noise) across
  all surfaces, not only per-pillar accents — enough to kill flat dead-color panels.
- **Thicker borders:** raise default borders from hairline 1px toward ~1.5–2px, with stronger
  presence on cards, islands, and controls.
- **Glow + shadow everywhere it earns it:** layered drop shadows for separation and depth; soft
  accent glow on focus and key surfaces.
- **Glowing CTAs:** primary calls-to-action carry an accent glow (box-shadow halo) at rest, and a
  brighter glow on hover/active.
- **Hover effects:** interactive elements (buttons, islands, nav, cards) respond on hover with
  added glow and/or lift (shadow + slight translate).
- **3D depth on buttons and islands:** raised treatment — edge highlights (inset top highlight),
  bottom/outer shadow, optional press-in active state — so buttons and pillar islands read as
  physical, depressible objects rather than flat rectangles.
- Keep it **token-driven**: define shadow, glow, border-weight, and depth as reusable CSS variables
  so weight can be tuned globally.

These are deliberate "add weight" moves; legibility and performance still gate them (glow/shadow must
not blow out text or tank render performance — verify at build).

**Chosen weight level: "D · Max / Hardware"** (from the 2026-06-09 weight/depth options board, saved
to Drive as `2026-06-09-musterdeck-weight-depth.{pdf,html}`). Specifics:

- Borders ~2.5px, accent-tinted, on cards/islands/controls.
- Strong site-wide surface grain (noise texture ~0.5 opacity).
- Islands: thick bevel — inset top highlight + inner bottom shadow + large outer drop shadow; on
  hover they lift (translateY + slight scale) and gain an accent glow.
- CTAs: extruded/raised with a resting accent glow that brightens on hover; press-in (translateY)
  active state.
- **Refinement flag:** the extruded CTA's hard flat bottom-edge shadow (the `0 6px 0 <dark>` color
  edge) read as "weird" in the pre-vis. Refine at build — soften or restyle the button's 3D edge
  (e.g. blended dual-shadow or a beveled border-bottom rather than a flat color slab) so it reads as
  a clean physical key, not a detached bar.

## Header Behavior — 3-tier, loud → calm

Loudness drops as the user moves from welcome to work. Same logic from the May design, now
expressed through the per-pillar accent rather than caution paint:

1. **Crossroads / Home + Hub** — loudest. Full stamped mustard treatment, large wordmark, VT323 flair.
2. **Pillar surfaces** — each pillar's accented header; the mustard brand mark still carries identity.
3. **Admin / dense working panels** — calmest. A thin accent signal line, otherwise quiet.

When a pillar surface contains a dense working panel, the outer header stays the pillar's tier-2
treatment and the inner panel uses the tier-3 calm treatment.

## Scope

### This build (first pass)

- The **design-token system**: master palette, per-pillar accent tokens, type stack — all as CSS
  custom properties in `src/styles.css`, so future changes are token edits, not rewrites.
- The **shell / 3-tier header** behavior.
- Fully styled foundation surfaces:
  - Home / **Crossroads** landing
  - **Hub / control panel** (post-login)
  - Authentication screens
  - Account settings
  - Admin portal
  - Notification center
  - Footer (with the fan-project disclaimer intact)

### Deferred to later PRs (one per module)

The four pillar **modules** get their accent tokens defined now but are fully skinned later, in
this order: Fleet Command, Rally Point, S.P.O.I.L.S., Proving Ground.

### Open / page-craft items (recorded, designed live at page time)

- A proper **mission-patch MusterDeck mark** (currently a placeholder "M").
- **Background environments** per pillar (naval-chart/waypoint, radar sweep for Fleet, manifest
  grid for S.P.O.I.L.S., bracket grid for Proving Ground).
- **Hazard-edge / stamp accents** as page punctuation.
- The **icon system** (operational, lightly worn plates; glyphs stay crisp).

## Constraints

- Keep functional text as real text; icons vector-first.
- Token-driven: no per-screen color literals; everything references the CSS custom properties.
- Legibility: verify contrast on warm-red pillars and CRT-font text; CRT fonts never used for
  body or critical controls.
- Forms and tables remain readable and responsive on mobile.
- The fan-project disclaimer and brand-voice rules
  (`2026-05-20-musterdeck-brand-voice-guide.md`) are unchanged by this pass. No implied RSI/CIG
  endorsement; do not adopt RSI's orange as a brand color.
- Build must pass (`npm run build`) and existing tests stay green.

## Acceptance Criteria

- `src/styles.css` exposes the master + per-pillar tokens and the new type stack as CSS variables.
- The "Capture It" font and the olive / second-mustard tokens are removed (closes #83).
- Home/Crossroads, Hub, auth, account, admin, notifications, and footer share one coherent
  warm stamped-ops system and clearly do **not** read as a generic cool dashboard.
- The mustard brand mark and Archivo type are present on every styled surface.
- The four pillar accent tokens exist and are documented even though the pillar modules are
  deferred.
- App builds; existing tests pass; scoped screens are readable and responsive.

## Follow-up after this pass

1. Mission-patch brand mark design.
2. Pillar module skinning (Fleet → Rally → S.P.O.I.L.S. → Proving Ground).
3. Per-pillar background environments.
4. Icon system.
