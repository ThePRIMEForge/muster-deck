# MusterDeck — Holographic Ops Hub: Asset Build Plan

Date: 2026-06-11
Goal: Build the Operations Hub as a high-fidelity holographic ring (per the Higgs Field renders) that is also **functional, accessible, responsive, and maintainable**.

## The core decision: baked visuals + live text/interaction overlay

We do NOT bake the whole hub into one flat image, and we do NOT try to do the 3D look in pure CSS (it can't, and it's why the labels won't stand vertical). Instead, two layers:

1. **Baked visual layer** — the glowing 3D ring, rendered as image pieces (the depth, neon, reflections AI/3D do well).
2. **Live layer (real HTML/SVG on top)** — pillar **names**, **descriptions**, **counts**, and **click targets**.

Why this is the answer:
- **Names become normal HTML text → always vertical, facing the viewer.** The laying-down problem disappears because text is never part of the tilted image.
- Text stays **crisp, editable, localizable, accessible** (screen readers, alt text). AI-baked text is garbled and unchangeable — we never ship it.
- Each segment image can be **swapped for a brighter "active" version on hover**, so it still feels interactive.

## Asset inventory (the pieces that slot together)

All pieces share **one camera / perspective / canvas size** so they stack pixel-perfectly. Export as **transparent PNG** (or WebP), 2× for retina.

| # | Piece | Notes |
|---|---|---|
| 1 | **Background plate** | dark holo-space + floor reflection/ambient glow. Static. Precision doesn't matter — good Higgs Field job. |
| 2 | **Center core** | the raised pedestal. Two variants: with mustard logo, and without (you flip-flopped on this — we keep both and decide in layout). |
| 3–7 | **Five pillar segments** | one transparent PNG **per pillar**, each an extruded glowing wedge in its accent. Rest state. |
| 8–12 | **Five segment "active" states** | brighter/stronger-glow version of each segment for hover/selected. (Can be faked with CSS glow if we want fewer assets.) |
| — | **Icons** | per pillar. Keep as separate crisp **SVG** overlay (not baked) so they stay sharp and recolorable. |
| — | **Labels & descriptions** | NOT assets — real HTML text in the live layer. |

**Ring position order (locked, clockwise from top):**
1. **12:00 — Fleet Command** — radar green `#7FA356`
2. **~2:00 — Proving Ground** — SC blue `#3DA3E0`
3. **~5:00 — Terminal** — violet-purple `#A66BFF`
4. **~7:00 — S.P.O.I.L.S.** — oxblood/crimson `#C2473A`
5. **~10:00 — Rally Point** — rust/amber `#C1632E`

Mustard core `#D4A028`.

## How to actually produce slot-together pieces

The trap: **5 separately-generated AI images will NOT line up** — text-to-image tools share no 3D coordinate system, so you'd get five mismatched wedges. Two ways that DO produce aligned pieces:

### Option A — Generate one master, then SLICE (recommended, fits your Higgs Field workflow)
1. In Higgs Field, generate **one** high-res master of the full ring (like render #2): tilted, extruded, neon, five pillar colours, **NO text labels**, dark gaps between segments, on a dark background. Iterate the prompt until the geometry is clean and the colours/positions are right.
2. Because every segment came from one image, they're already aligned. **Slice** the master into transparent PNGs along the dark gaps: 5 segments + core + background. (Any editor; I can also slice it with ImageMagick if you drop the high-res master in.)
3. Reassemble in the web as stacked layers → perfect slot-together, independently swappable.
- Hover/active glow: CSS `filter: brightness/drop-shadow` on the sliced segment, or a second sliced master.
- Pros: uses your tool, fast, aligned. Cons: re-generating to change one pillar means re-slicing; hover relighting is faked.

### Option B — Model in Blender (higher control, more effort)
Model one wedge, array ×5 + core, emission materials per colour, one camera, render each segment on its own layer → perfectly aligned PNGs + real "active" relights. Best fidelity + true per-segment lighting, but needs 3D time.

### Recommendation
Start with **Option A** (master → slice). It gets us a shippable, high-fidelity hub fastest with the tool you already use. Move to **B** only if we need per-segment animation/relighting beyond what CSS glow gives.

**Higgs Field prompt guardrails:** request "no text, no labels, no UI text"; specify the five colours in clockwise order; specify tilt/perspective; dark background with clear gaps between segments; consistent neon glow. Generate at the **highest resolution available** (slicing needs the pixels).

## Assembly in the app

- A fixed-aspect `.hub` stage; all image layers absolutely positioned, same size, same origin.
- **Hit targets:** an SVG overlay with one `<path>` per wedge (matching the segment shape) for precise clicks + keyboard focus — not rectangular hotspots.
- **Text layer:** names (Archivo, billboarded = just normal HTML, glowing in pillar colour), descriptions (Saira), counts (JetBrains Mono), positioned above/beside each wedge.
- **Hover/active:** swap segment image (or CSS glow) + lift the name slightly.
- **Responsive:** scale the whole stage; below a breakpoint, fall back to the **card grid / lanes** layout (the holo ring is desktop flourish, not the only way to navigate) — keeps mobile usable and accessible.
- **Accessibility:** every pillar is a real focusable link with text; images are decorative (`alt=""`).

## Pillar content (finalized)

| Pillar | One-liner (description) |
|---|---|
| **Rally Point** | Find an operation — browse open crews and join the muster. |
| **Fleet Command** | Command an operation — build rosters, assign crew, run the op. |
| **S.P.O.I.L.S.** | Settle rewards — log hauls and split the payout. |
| **Proving Ground** | Run a tournament — seed brackets, score, publish standings. |
| **Terminal** | **Tools and applications** — utilities and apps for your org. |

## File / naming convention

Committed assets live in the working clone under `public/brand/hub/`:
```
public/brand/hub/
  bg.webp
  core.webp            core-logo.webp
  seg-rally.webp       seg-rally-active.webp
  seg-fleet.webp       seg-fleet-active.webp
  seg-spoils.webp      seg-spoils-active.webp
  seg-ground.webp      seg-ground-active.webp
  seg-terminal.webp    seg-terminal-active.webp
```
Source masters/working files stay on the Drive under `Content & Asstest/MusterDeck hub holograph AI mockup/`.

## Build sequence

1. Lock the master look in Higgs Field (clean geometry, no text, right colours).
2. Drop the high-res master on the Drive; slice into the pieces above.
3. I build the web `.hub` component: layer stack + SVG hit paths + HTML text/descriptions + hover swaps + responsive fallback to cards.
4. Wire it into the app's OperationsHub, replacing the current card layout (or behind a desktop breakpoint).

## Open decisions
- Center: with logo, or empty core? (renders disagree with your earlier "remove it.")
- Hover relight: CSS glow (fewer assets) vs second sliced master (richer).
- Icons baked into segments vs separate SVG overlay (recommend overlay).
