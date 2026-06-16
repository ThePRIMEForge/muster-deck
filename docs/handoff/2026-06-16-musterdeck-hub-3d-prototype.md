# MusterDeck — 3D Operations Hub (polished prototype)

**Date:** 2026-06-16
**File:** [`02_DESIGN & WORKING FILES/2026-06-12-musterdeck-hub-3d.html`](../../02_DESIGN%20%26%20WORKING%20FILES/2026-06-12-musterdeck-hub-3d.html)
**Status:** Polished prototype for review. Visual/interaction target for the in-app Operations Hub. Not production code.

## How to view
Serve the repo root over HTTP (the page loads local assets + Three.js from a CDN):
```
python3 -m http.server 8080
# open http://localhost:8080/02_DESIGN%20%26%20WORKING%20FILES/2026-06-12-musterdeck-hub-3d.html
```
Needs a normal browser tab (WebGL). Try it both wide (the 3D wheel) and narrow (the stacked card menu).

## What it is
The module selector for MusterDeck — a 3D "glass tile on an asteroid" wheel with five modules: Fleet Command, S.P.O.I.L.S., Terminal, Proving Ground, Rally Point.

## Key features
- **Responsive by available room.** Width ≥ 1500 AND height ≥ 1100 → the 3D wheel (auto-shrinks to fit smaller-but-still-large screens). Otherwise → a responsive stacked card menu (3 / 2 / 1 columns), full mobile support.
- **Rock disc selector.** The asteroid (`public/brand/hub/rock-disc.png`, desaturated to remove a green cast) backs the translucent colour tiles. Starfield + feathered planet are in the 3D scene so the tiles read against space.
- **Golem mining ship (large screens only).** A compressed GLB (48 MB → 657 KB via gltf-transform) slowly orbits the rock, parks, fires a nose laser at the rim, sometimes loops behind the rock (occluded), and is draggable (drag it away, it flies back). On/off "Miner" toggle, top-left. Killed on small screens.
- **Hover detail.** Each module panel/segment reveals fuller copy on hover (incl. the S.P.O.I.L.S. acronym); stacked cards show it on tap.
- **Account menu** (top-right): callsign + Settings / Admin Console (admin-gated) / Log out.
- **Friends + Comms** dock: mustard tabs hanging off the right edge; each pops out an independent panel (Friends scrolls for large lists, Comms keeps its room below). Works on mobile (overlays).
- **Become a supporter** (bottom-left) with tier modal + Star Citizen referral code (`STAR-QHCT-M72L`) chip/copy + info modal. **Made by the Community** badge + fan-site disclaimer.
- **Coming soon** stamps on Proving Ground (module + Praetorian tier perks + the unbuilt Admiral perks).
- **Footer version line:** `MusterDeck v0.0.0 · Star Citizen data v0.0.0 · prototype`. Only bump the SC data version after a full game-data pull.

## Placeholder / not wired
- Module buttons, account menu items, friends/comms content, supporter tiers, and version numbers are placeholders — no navigation or real data yet.
- Three.js loads from `esm.sh`; icons from Iconify. Needs network on first load.

## Assets added
`public/brand/hub/`: `rock-disc.png`, `planet-feathered.png`, `golem.glb`, `nebula.jpg`. Updated brand badge in `public/brand/`.
