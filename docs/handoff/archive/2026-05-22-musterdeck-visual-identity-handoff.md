# MusterDeck visual identity handoff

Date: 2026-05-22
Author: Christoph Mayer with Claude
Audience: Blair Gemmer (incoming engineering partner) and the project team

## Purpose

This document closes the first visual identity pass for MusterDeck (working repo name "SCFleet App"). It records what was built, what was decided, and what is now locked. Blair should be able to read this cold and understand the visual language the engineering work needs to support.

Companion files:

- Mood board (source HTML): `docs/mockups/2026-05-21-musterdeck-visual-identity-v1.html`
- Mood board archive copy: `docs/mockups/archive/2026-05-22-musterdeck-visual-identity-v1-locked.html`
- Mood board PDF: `docs/handoff/2026-05-22-musterdeck-visual-identity-v1.pdf`
- Screenshots: `outputs/identity-v1-full.png`, `outputs/identity-v1-textures.png`, `outputs/identity-v1-lanes.png`, `outputs/zoom-worn.png`, `outputs/zoom-lane-a.png`

## Context for Blair

MusterDeck is an independent fan-made operations platform for Star Citizen players and organizations. Four product pillars: Rally Point (LFG board), Fleet Command (org operations), S.P.O.I.L.S. (post-event settlement), and Proving Ground (tournaments). Stack is React, Vite, TypeScript, Supabase, and Postgres. The project is not affiliated with CIG or RSI; all surfaces must carry the fan-project disclaimer.

The brand voice guide is already locked at `docs/superpowers/specs/2026-05-20-musterdeck-brand-voice-guide.md`. The voice direction is operational command, light conscription, broad crew respect. Read that document before touching copy.

This visual identity pass is the first time the project commits to a coherent aesthetic. Prior renders looked like a generic dark dashboard. The new direction is modern industrial fan-tool: mustard caution paint with real wear, black hazard contrast, stencil display type on condensed sans utility, naval chart background vocabulary.

## Work completed today

### Research

A short research report covered three areas: RSI and Star Citizen's own visual language (mobiGlas, Comm-Link, Spectrum, robertsspaceindustries.com), how existing Star Citizen fan tools present themselves visually (Erkul, OrgManager, CCU Game, SC Org.Tools, Cornerstone, Star Citizen Wiki), and real-world industrial caution paint references (Caterpillar, Komatsu, NASA stenciling, shipping container marks, Apollo control panels). Findings reproduced in summary below; see the mood board for applied conclusions.

Key takeaways:

- Nobody in the fan-tool space owns mustard yellow, industrial weathering, or stencil typography. That lane is open.
- RSI's own brand color is orange; use it would put MusterDeck on the same shelf. We avoid it.
- Real worn paint follows a three-color chip system: topcoat, faded underlayer, primer grey, occasional bare metal.
- Hazard stripes belong at edges, never as a full background fill.
- Stencil bridges in letters like M, D, O, A, R, P must be visible. Faked stencils on a normal sans face never read right.

### Mood board built

A single self-contained HTML page at `docs/mockups/2026-05-21-musterdeck-visual-identity-v1.html` was produced as a working language for the system. It contains six sections:

1. **Paint system.** One committed mustard plus three underlayer states (sun-bleached, faded underlayer, shadow), hazard black, warm primer grey, bare metal, four industrial neutrals, and two rare accents (rust, signal red).
2. **Texture studies.** Worn paint, clean hazard tape, weathered hazard tape, stencil sample with intact bridges, primer wall, mission patch grammar.
3. **Typography.** Stardos Stencil for display, Black Ops One for heavier headlines, Saira Condensed for body, JetBrains Mono for mono utility. All open-licensed Google Fonts. Replaces the prior Capture It font which sat in a gitignored fan-kit folder.
4. **Header treatment lanes.** Four production-candidate header bands built on the same paint system, varying how much yellow appears and where.
5. **Background.** Naval-chart vocabulary: hairline grid, sparse mustard waypoints with mono labels, plotted route, contour arcs. Replaces the prior generic dark background.
6. **Open decisions.** Now superseded by the locks below.

### Distressed paint system implemented

The paint surfaces use a layered SVG and CSS treatment to read as real worn industrial paint, not a "grunge filter" overlay. The stack from bottom to top:

1. Base mustard gradient with sun-bleach to shadow.
2. Chip-point ellipses revealing primer grey with faded-yellow halos (the discrete drilled-down chip markers).
3. Corner-dirt darkening, weighted toward bottom corners.
4. Two opaque chip-loss substrate layers (SVG fractal noise with binary-discrete alpha threshold, opaque concrete-grey blobs). These replace yellow with substrate where the paint is gone. This is what reads as real chunky chip-loss in the photos.
5. Multiply-blend wear: heavy horizontal traffic scratches, coarse flake clusters, fine sandpaper grain.
6. Underlayer rings around the larger chip points, drip stains, directional scuffs.

The chip-loss layer was the breakthrough. It uses SVG `feTurbulence` with `feComponentTransfer feFuncA type='discrete'` to create binary alpha (chip is fully there or fully not), then `feColorMatrix` to paint the chip in opaque concrete grey. Composited with normal blend mode at the top of the host element's background-image stack, this gives genuine concrete-substrate-showing-through, which a multiply-blend approach cannot achieve from a yellow base.

Reference photos provided by Christoph guided the calibration:

- Painted concrete safety stripe with heavy linear traffic scratches and irregular chip-through.
- Workshop floor with large patches of completely missing paint and dirty substrate.
- Black-and-yellow chevron stripes with irregular chunks of both colors missing, revealing concrete.

The current output matches the reference vocabulary at production-acceptable fidelity. See `outputs/zoom-worn.png` and `outputs/zoom-lane-a.png` for the rendered result.

## Decisions locked

### Color

One committed mustard yellow. No second "warmer" yellow for accents.

| Token              | Hex     | Role                                                  |
| ------------------ | ------- | ----------------------------------------------------- |
| md-yellow          | #D4A028 | Primary mustard. Between Cat and Komatsu.             |
| md-yellow-sun      | #E3B651 | Top-of-panel sun-bleach highlight.                    |
| md-yellow-faded    | #B68A33 | Underlayer visible at chip edges.                     |
| md-yellow-shadow   | #8A6818 | Underside recesses, deep panel shadow.                |
| md-hazard-black    | #0F0E0C | Stripes, stencil ink, contrast labels.                |
| md-primer          | #6E6A60 | First underlayer revealed by chip-through.            |
| md-metal           | #8A8682 | Deepest chips. Rare.                                  |
| md-substrate       | #443E32 | Concrete-grey shown by chip-loss patches.             |
| md-panel-deep      | #14130E | Page base. Warm-black, not blue-black.                |
| md-panel           | #1C1B16 | Cards, sections, surfaces.                            |
| md-panel-raised    | #25241D | Inputs, raised tiles, secondary surfaces.             |
| md-ink             | #F3EEDE | Primary text (warm off-white).                        |
| md-ink-secondary   | #C8C1AD | Secondary text.                                       |
| md-ink-muted       | #8B8472 | Muted labels.                                         |
| md-rust            | #9C4A22 | Rare accent. Patches, edge wear, badge highlights.    |
| md-signal          | #B43A2A | Error and alert color. Truly rare. Not brand.         |

No olive or drab green. No cyan or holographic blue. No RSI orange.

### Typography

| Role           | Family             | Notes                                              |
| -------------- | ------------------ | -------------------------------------------------- |
| Display        | Stardos Stencil    | Visible stencil bridges. Free Google Font.         |
| Display heavy  | Black Ops One      | For the rare heavier hero. Free Google Font.       |
| Body           | Saira Condensed    | Condensed industrial sans. Free Google Font.       |
| Mono utility   | JetBrains Mono     | Hull-stencil codes, version chips, metadata.       |

Stencil type is for headers and high-priority labels only. Long-form body in stencil is unreadable. The prior Capture It font is retired; it sat in a gitignored fan-kit folder and could not ship.

### Header lanes per app context

This is the most consequential lock. Three of the four mood-board lanes are in production. Each maps to a specific app surface based on the user's task at that surface.

| Lane                          | Used for                                                       | Yellow commitment              |
| ----------------------------- | -------------------------------------------------------------- | ------------------------------ |
| Lane A "Hangar Doors"         | Landing page, Operations Hub, general brand vibe.              | Full distressed mustard band.  |
| Lane C "Mission Patch"        | The four pillar apps (Rally Point, Fleet Command, S.P.O.I.L.S., Proving Ground). | Brand mark carries identity. Header stays dark. |
| Lane D "Caution Tape"         | Admin Portal, user account and profile panels, modals, the main panels inside Fleet Command. | 6px hazard tape strip at top. Everything else dark. |

Lane B (Operations Placard) is not used.

Logic: loudness drops as the user moves from welcome to working surfaces. Landing and Hub excite. Pillar apps focus. Admin and dense ops panels stay calm.

When a Lane C pillar app contains a Lane D panel (a typical Fleet Command screen), the outer shell stays Lane C and the inner working panel uses Lane D. The two coexist on one screen.

### Wear and aging

- Mustard caution paint, hazard tape, large yellow surfaces: full distress treatment. Chip-loss, scratches, drips, flake, grain.
- **Patches and logos: clean.** No distressing, no aging. The MusterDeck mark and any org or event patches are crisp.
- **Iconography: distressed.** Add chips, scrapes, and aging to icon plates. Icons are operational hardware in the visual story; they live on the dirty side of the line with the paint.

This means the brand mark on Lane C reads sharp and trustworthy, while the pillar icons on a Lane A hub feel lived-in and used.

### Background

Naval chart vocabulary, not generic topographic blobs. Hairline 48px grid on a 12px sub-grid, sparse mustard waypoints with mono labels, faint contour arcs, occasional dashed plot lines, small contour callouts in mono at low opacity. Each pillar can map to its own waypoint metaphor: Rally Point as fix point, Fleet Command as sector, S.P.O.I.L.S. as manifest overlay, Proving Ground as bracket grid.

### Fan-project compliance

Independent fan tool, no implied RSI or CIG endorsement. The footer disclaimer language stays intact. RSI handle verification is a trust signal, not identity proof. S.P.O.I.L.S. values are organizer-managed records, not guarantees. All locked in the brand voice guide; the visual identity does not change this posture.

## What is NOT decided yet

These come after this handoff:

- **Lane C and Lane D production rendering.** Both lanes exist as mood-board sketches but have not been built at production fidelity. The mission patch needs its final mark and minor accent paint. Lane D's hazard tape strip should use the weathered (chip-loss) treatment, not the clean stripes currently rendered.
- **Pillar card design.** The four hub cards on Lane A still use Lucide icons on small brown squares. Replacing them with iconography that carries the distress treatment is a near-term task.
- **Footer treatment.** Not redesigned yet. Currently still the old yellow band layout. Should be re-evaluated against the lane choices.
- **Empty states, form fields, buttons, error states.** Not designed.
- **Pillar logos and org patches.** Need to be drawn at brand-mark fidelity, clean (per the lock).
- **Iconography system.** Approach for adding the chip-and-scrape aging to icons needs a small study. Likely an icon plate (the dark inset square behind each glyph) carries the wear, while the glyph itself stays crisp.
- **Brand voice cleanup pass.** Some shipped copy still drifts from the voice guide (notably "WELCOME, ADMIRAL ROWAN" which the guide explicitly forbids as fake-rank shouting). Surgical fixes pending.

## Implementation notes for engineering

- The distress system is pure CSS plus inline SVG data URIs. No raster textures. Bundle impact is small.
- The most important pattern to replicate when implementing in `src/styles.css`: the chip-loss SVGs MUST go in the host element's `background-image` stack with normal blend mode, NOT in `::before` with multiply blend. Multiply against yellow can never produce concrete grey. The mood board has a worked example.
- `feComponentTransfer feFuncA type='discrete'` is required for the binary alpha threshold that produces chunky chip-loss shapes. Without the `type='discrete'` attribute, the table values get interpolated and the entire surface fills uniformly.
- Stencil bridges depend on the actual typeface. Do not synthesize stencil cuts by slicing a sans face; the result never reads right at any size.
- The font stack uses Google Fonts. No special licensing or asset management needed. The previous Capture It workflow is retired.

## Working files affected today

Documentation:

- `docs/handoff/2026-05-22-musterdeck-visual-identity-handoff.md` (this file)
- `docs/handoff/2026-05-22-musterdeck-visual-identity-v1.pdf`
- `docs/handoff/project-change-log.md` (entry appended)

Mockups:

- `docs/mockups/2026-05-21-musterdeck-visual-identity-v1.html` (the source mood board)
- `docs/mockups/archive/2026-05-22-musterdeck-visual-identity-v1-locked.html` (frozen reference copy)

Outputs (rendered screenshots):

- `outputs/identity-v1-full.png`
- `outputs/identity-v1-textures.png`
- `outputs/identity-v1-lanes.png`
- `outputs/zoom-worn.png`
- `outputs/zoom-lane-a.png`

No application source files were modified in this pass. The visual identity is not yet implemented in `src/styles.css` or React components. That is the next workstream.

## Recommended next session

1. Visual: build Lane C and Lane D at production fidelity in the mood board. Resolve the mission patch design. Apply weathered hazard tape to Lane D.
2. Visual: design pillar card system for Lane A hub. Decide icon plate approach so the chip-scrape aging lives on the plate, not the glyph.
3. Voice: surgical pass through `src/lib/foundationCopy.ts` and `src/components/foundation/PublicLanding.tsx` to remove "WELCOME, ADMIRAL ROWAN" and similar voice-guide violations.
4. Engineering: begin porting the locked color tokens into `src/styles.css` as CSS custom properties, then rebuild the header treatment per Lane assignment.

## Welcome, Blair

The visual language is now real enough to build against. The decisions above are locked; revisit them only with explicit cause. Anything above marked as "not decided" is open and a logical next session for you to weigh in on.
