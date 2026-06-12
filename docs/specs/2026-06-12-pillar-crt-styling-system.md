# Pillar CRT Styling System — Design Decision (LOCKED)

**Date:** 2026-06-12
**Status:** ✅ Confirmed by Christoph against a visual mockup
**Applies to:** every pillar app + the User (Account) and Admin screens
**Visual reference:** `02_DESIGN & WORKING FILES/2026-06-12-musterdeck-pillar-crt-skins.html` (+ `.pdf`) — Google Drive
**Reference implementation:** Fleet Command, `src/styles.css` (scoped under `.app-shell`) — PR #148

---

## Decision

MusterDeck's pillar apps and the User/Admin screens all use **one shared CRT/terminal styling treatment**. The treatment is identical everywhere; **only the colour palette changes per screen.** This was confirmed visually (see the mockup above), so it does not need to be re-litigated per screen.

**Explicitly excluded:** the **Landing page** and the **Muster Hub** — they follow a separate direction and must NOT receive this treatment.

## The treatment (palette-agnostic)

- **Immersive frame** — pillar apps render with no foundation header/footer (full viewport). `AppFrame` `immersive` prop.
- **CRT surface** — phosphor inset edge-glow + radial vignette + subtle flicker (gated by `prefers-reduced-motion`). No scanlines (rejected). No holographic sweep (rejected).
- **Grunge** — SVG `feTurbulence` fractal-noise overlay, `mix-blend-mode: overlay`. **50% on pillars, 20% on the User/Admin utility screens.**
- **CRT lines** — ~2px borders + phosphor bloom (tight bright halo + wide soft halo) + **RGB-misconvergence chromatic fringe**. Fringe is tuned per palette (default cyan/amber; adjusted on blue/purple so it still reads as a CRT edge). Section-divider rails stay accent-dominant (low fringe).
- **Rounded corners everywhere** — panels 8px, buttons 6px.
- **Hover glow** on interactive tiles.
- **Button system** (locked) — Primary = Hardware-Extrude (bright/hot accent), Secondary = Nested-Brackets ghost. Accent-token-driven.
- **Colour hierarchy** — brightness = importance: bright/hot accent for primary buttons + active states; base accent for general accents; dim/low-alpha for secondary borders and labels; primary text = `--ink` (brightest), secondary = `--ink2`.
- **No orange** in any green/non-rust pillar (orange is Rally's identity). **Destructive actions = muted red** (the palettes have no dedicated danger colour); pair with Slide-to-Confirm.
- **Dynamic fill meter** — colour tracks fill %: `hsl(fill * 1.2, 70%, 46%)` → red → amber → green (not a fixed gradient).

## Per-screen palette (the only thing that changes)

Token shape: `--ac / --bg / --bg2 / --ink / --ink2 / --stamp` (Terminal adds `--ac2`). The brighter "hot" accent for the hierarchy is derived per palette via `color-mix(--ac, white)`.

| Screen | Accent `--ac` | `--bg` | `--bg2` | `--ink` | `--ink2` | `--stamp` | Grunge |
|---|---|---|---|---|---|---|---|
| **User + Admin** (v2 Muster) | `#D4A028` | `#161109` | `#1D1810` | `#F3ECDB` | `#B9B09C` | `#9C4A22` | 20% |
| **Rally Point** | `#C1632E` | `#120B07` | `#1D110A` | `#F1E6D8` | `#B5A48F` | `#9C4A22` | 50% |
| **Fleet Command** (shipped) | `#7FA356` | `#080D07` | `#0F160C` | `#DDE6CF` | `#92A07E` | `#566B34` | 50% |
| **S.P.O.I.L.S.** | `#C2473A` | `#170D0C` | `#231110` | `#F3E3DF` | `#BFA39D` | `#7E2A22` | 50% |
| **Proving Ground** | `#3DA3E0` | `#0B1019` | `#101A28` | `#DCE6F2` | `#93A8BD` | `#2F6F9E` | 50% |
| **Terminal** ⚠️ | `#A66BFF` + `#2DE2E6` | `#0B0A14` | `#141026` | `#E9E6F7` | `#9890B8` | `#6D3BD4` | 50% |

**Notes:**
- **v2 Muster** is the clean master palette (no hazard tape, no chip-loss/rust *wear effect*). The rust-brown `--stamp #9C4A22` is a status-stamp colour and stays — "no rust" refers to the worn texture, not this colour.
- **Terminal is a v1 PROPOSAL, not locked.** It is the only **dual-accent** screen — `--ac` purple = headers/structure, `--ac2` cyan = live data/actions — so it needs extra wiring beyond a palette swap, and its screen does not exist yet.

## PR split (separate PR per screen)

Each screen is its own PR, slotted under its existing epic. Pillars marked "build + skin" are currently placeholder stubs and must be built before/with skinning.

| Screen | Epic | Scope |
|---|---|---|
| Account (User) | epic:foundation (#109) | skin existing screen |
| Admin Portal | epic:foundation (#110) | skin existing screen |
| Rally Point | epic:rally-point (#105) | build + skin |
| S.P.O.I.L.S. | epic:spoils (#107) | build + skin |
| Proving Ground | epic:proving-ground (#108) | build + skin |
| Terminal | epic:tools (#137) | build + skin — **after palette lock** |
