# MusterDeck Brand Identity Guide

Status: **Canonical** — single source of truth for color, type, logo, and surface treatment.
Date: 2026-06-11
Built on: the **v2 per-pillar color system** decided 2026-06-09 (`docs/mockups/2026-06-09-musterdeck-pillar-color-system.html` + `…-type-specimen.html`, `…-weight-depth.html`).

> This guide replaces the older worn-industrial / single-mustard direction (the May 20–22 handoffs). That look — heavy chip-loss distress, one mustard for everything, Stardos Stencil / Capture It — is **retired**. v2 is the modern direction: a **unified system** (shared mark, type, layout grammar) with a **distinct accent color per pillar**, and far lighter texture. The May docs remain only as history.

---

## 1. The idea in one line

One unified operations system, **color-coded by pillar**. The mustard MusterDeck mark is the constant on every page; each pillar owns its own accent, background, and texture so you always know which room you're standing in. Modern industrial, lightly printed — not heavily weathered.

Independent fan tool. Not affiliated with CIG or RSI. Every surface carries the fan-project disclaimer.

---

## 2. The constant: master brand mark

On **every** page, regardless of pillar accent:

- **Mark glyph:** "M" in **Big Shoulders Stencil Display** (700–800), in mustard `#D4A028`, in a 2px mustard box.
- **Wordmark:** "MusterDeck" in **Archivo** (900), uppercase, letter-spacing ~0.1em, in the page's `--ink`.
- The mark is **always mustard and always clean** — it never takes on the pillar accent, never gets distressed. It's the through-line that ties the color-coded pillars into one product.

The mark is a **chart-tile badge**: an isometric naval-chart tile with the mustard dollop, a waypoint pin, and a targeting reticle. (Earlier mockups used a placeholder "M" box — retired.)

Logo source files (do not regenerate — these are the official mark; sources stay local in Google Drive):
- **Primary still:** `Content & Asstest/Muster Deck Logo Mockups v1/Mustard_Deck_logo_Mock_v1.14a CROPPED.png`
- Alt 3D-coin still: `…/Mustard_Deck_logo_Mock_v1.15.png`
- Animated loop (hero/loading): `…/MD Logo Loopv2.mov` (source) — a chart scan with the dollop plopping in
- Mascot: "Musty the Bot" (`…v1.13_cute_mustard_dollop.png`)

**Committed app assets** (use these in code — generated transparent cutouts of v1.15, the source stays local in Google Drive):
- `public/brand/musterdeck-badge.png` (512px, transparent) — header / general use
- `public/brand/musterdeck-badge-128.png` — apple-touch-icon / small
- `public/brand/favicon.png` (64px) — wired in `index.html`
- `public/brand/musterdeck-loop.mp4` / `.webm` (~85KB, 5.4s loop) — animated logo for loading splash / hero. Reference: `docs/mockups/2026-06-11-musterdeck-logo-splash.html`

Clear space = height of the badge. On mustard fills use a dark treatment; on dark surfaces the badge sits as-is (graphite rim reads on dark). Note: prior mockups used a placeholder "M" box — that is retired; the real badge is now the mark.

---

## 3. Color system — per-pillar (v2, LOCKED)

Every surface is one pillar "skin." Each skin is six tokens: `--ac` (accent), `--bg`, `--bg2` (raised surface), `--ink`, `--ink2` (secondary text), `--stamp` (status-stamp color). The mustard mark sits on top of all of them.

### Landing Page + Muster Hub — Muster palette (master brand)
Both the public **Landing page** and the signed-in **Muster Hub** (main menu) use this one mustard skin. There is no "Crossroads" — that naming is retired.

| Token | Hex | | Token | Hex |
| --- | --- | --- | --- | --- |
| `--ac` | `#D4A028` mustard | | `--ink` | `#F3ECDB` |
| `--bg` | `#161109` | | `--ink2` | `#B9B09C` |
| `--bg2` | `#1D1810` | | `--stamp` | `#9C4A22` |

Texture: **stamped printed ops** (mustard screenprint dot field). This is the master-brand skin — the only one that leads with mustard as its accent.

### Rally Point — "painted / rusted steel"
| Token | Hex | | Token | Hex |
| --- | --- | --- | --- | --- |
| `--ac` | `#C1632E` burnt orange / rust | | `--ink` | `#F1E6D8` |
| `--bg` | `#120B07` | | `--ink2` | `#B5A48F` |
| `--bg2` | `#1D110A` | | `--stamp` | `#9C4A22` |

Texture: **brushed painted metal** (fine horizontal brush + grain; no dots).

### Fleet Command — "military olive / dim radar green"
| Token | Hex | | Token | Hex |
| --- | --- | --- | --- | --- |
| `--ac` | `#7FA356` radar green | | `--ink` | `#DDE6CF` |
| `--bg` | `#080D07` | | `--ink2` | `#92A07E` |
| `--bg2` | `#0F160C` | | `--stamp` | `#566B34` |

Texture: **terminal scanlines** (faint green horizontal scan). **This is the "missing colors" set for Fleet Command** — paste these tokens.

### S.P.O.I.L.S. — "oxblood / plunder"
| Token | Hex | | Token | Hex |
| --- | --- | --- | --- | --- |
| `--ac` | `#C2473A` oxblood | | `--ink` | `#F3E3DF` |
| `--bg` | `#170D0C` | | `--ink2` | `#BFA39D` |
| `--bg2` | `#231110` | | `--stamp` | `#7E2A22` |

Texture: stamped printed ops (default dot field).

### Proving Ground — "SC blue dashboard"
| Token | Hex | | Token | Hex |
| --- | --- | --- | --- | --- |
| `--ac` | `#3DA3E0` SC blue | | `--ink` | `#DCE6F2` |
| `--bg` | `#0B1019` slate | | `--ink2` | `#93A8BD` |
| `--bg2` | `#101A28` slate | | `--stamp` | `#2F6F9E` |

Texture: stamped printed ops (default dot field).

---

## 4. Terminal — purple + cyan (NEW, v1 proposal — needs sign-off)

**Terminal** is a new section (not one of the four pillars) and is the only one in a cool, digital register: a CRT/console aesthetic in **purple + cyan** on near-black. Where the pillars are analog-industrial, Terminal is the green-screen-era computer terminal — except recolored to purple/cyan instead of phosphor green. (CRT font exploration already done in `…-crt-fonts.html`.)

It takes **two** accents instead of one: purple frames/structures, cyan is the live/action color.

| Token | Hex | Role |
| --- | --- | --- |
| `--ac` | `#A66BFF` | **Purple** — headers, structure, selected states, brand frame. |
| `--ac2` | `#2DE2E6` | **Cyan** — live data, primary actions, links, glow. |
| `--bg` | `#0B0A14` | Near-black, faint violet cast. |
| `--bg2` | `#141026` | Raised surface / console blocks. |
| `--ink` | `#E9E6F7` | Cool off-white text. |
| `--ink2` | `#9890B8` | Muted terminal labels. |
| `--stamp` | `#6D3BD4` | Status stamp (deep purple). |
| `--term-magenta` | `#E85AC8` | Rare third note only. Use sparingly. |
| `--term-glow` | `0 0 12px rgba(45,226,230,.45)` | Subtle cyan glow on key readouts. |

Texture: **CRT scanlines** in cyan. Display/mono font: pair with a CRT face from the font study (Share Tech Mono = clean modern terminal; VT323 = classic green-screen) over the Archivo body. Rules: cyan acts, purple frames — don't let them fight; keep glow subtle; the mustard mark still appears clean (one warm element in a cool room — on-brand). No distress.

> Exact hexes and the CRT font pick are a **first proposal**. Approve or adjust before this locks.

---

## 5. Typography (v2)

| Role | Family | Notes |
| --- | --- | --- |
| Headlines / hero / wordmark / pillar names / buttons | **Archivo** (800–900) | Uppercase, ~0.02–0.12em tracking. The workhorse display + brand face. |
| Brand mark glyph "M" + status stamps | **Big Shoulders Stencil Display** (700–800) | Stencil character, used only for the mark and the rotated status stamps. |
| Body / nav / tiles / sub-copy | **Saira Condensed** (400–700) | Condensed industrial sans for all running text. |
| Mono / chips / version / metadata | **JetBrains Mono** | Hull codes, version chips (`SC 4.8.0-LIVE`), labels. |
| Terminal CRT (proposed) | **Share Tech Mono** or **VT323** | Terminal section only; see §4. |

All open-licensed Google Fonts. No negative letter-spacing. Don't scale font-size with viewport width. Long-form body never in the stencil face.

> Explored but **not** locked (in `…-type-specimen.html`): Chakra Petch, Stardos Stencil as alternates. The v2 pillar system shipped with the Archivo / Big Shoulders / Saira / JetBrains set above; treat that as current. Capture It / Take Cover (now licensed in `01_PRODUCTION ASSETS/Fonts/`) are the **logo's own** faces — logo lockups only, not the in-app type system. Confirm if you want any of these promoted.

---

## 6. Texture & depth grammar (v2 — lighter than the old worn look)

The heavy chip-loss / weathered-paint system is retired. v2 uses three light, per-pillar textures plus optional depth/glow:

- **Stamped printed ops** (default — Landing/Hub, S.P.O.I.L.S., Proving Ground): a sparse screenprint dot field in the pillar accent + faint fractal-noise overlay. Reads as printed signage, not grunge.
- **Brushed painted metal** (Rally Point): fine horizontal brush lines + grain. No dots.
- **Terminal scanlines** (Fleet Command, Terminal): faint horizontal scan in the accent.
- **Status stamp:** a rotated (-8°), outlined `--stamp`-colored stamp (e.g. "OP LIVE", "SHARES OUT") in Big Shoulders Stencil Display, top-right of a stage. One per surface, low opacity.
### Weight / depth baseline (LOCKED 2026-06-11 — starting point)

Locked from `docs/mockups/2026-06-11-musterdeck-palette-verification.html`. This is the **floor**, not the ceiling — we are actively pushing for more 3D and texture from here (see §12).

- **Buttons:** extruded bottom lip in the accent's deep shade (`color-mix(--ac 55%, #000)` ~4px), inset top highlight (`rgba(255,255,255,.35)`), accent glow, press-in on `:active` (translateY 3px). Cyan Terminal button extrudes in cyan.
- **Lines:** global-bar divider 2px, brand-mark box 2.5px (with faint mark glow), tiles 1.5px accent borders + inset highlight + drop shadow. **No 1px hairlines** — the thin-line look is explicitly rejected.
- **Texture:** denser screenprint dots, stronger fractal-noise overlay, heavier brushed-metal grain (Rally) and scanlines (Fleet/Terminal).
- Roughly the "C / Heavy" rung of the `…-weight-depth.html` A→D ladder.

Depth/glow ladder reference: `…-weight-depth.html` (2026-06-09 21:07).

### Button system (LOCKED 2026-06-11)

Three components, all **pure CSS/SVG — zero art assets**. All accent-token-driven (`--ac`, `--bg`), so each pillar skin colors them automatically. Reference implementations: `docs/mockups/2026-06-11-musterdeck-button-pair.html` and `…-slide-confirm.html`.

**1 · Primary — Hardware Extrude.** The solid CTA. Thick accent-deep bottom lip, top sheen highlight, accent glow, deep press-in on `:active`. In Terminal, swap `--ac` → `--ac2` (cyan).

```css
.md-btn{font-family:"Archivo";font-weight:800;letter-spacing:.06em;text-transform:uppercase;font-size:15px;
  padding:15px 30px;border:none;cursor:pointer;position:relative;border-radius:6px;color:var(--bg);
  background:linear-gradient(180deg,color-mix(in srgb,var(--ac) 80%,#fff 20%),var(--ac) 50%,color-mix(in srgb,var(--ac) 82%,#000));
  box-shadow:inset 0 3px 0 rgba(255,255,255,.6),inset 0 -4px 8px color-mix(in srgb,var(--ac) 55%,#000),
    0 9px 0 color-mix(in srgb,var(--ac) 40%,#000),0 10px 2px rgba(0,0,0,.5),0 18px 26px rgba(0,0,0,.6),
    0 0 24px color-mix(in srgb,var(--ac) 35%,transparent);
  transition:transform .13s ease, box-shadow .13s ease, filter .13s ease}
.md-btn::after{content:"";position:absolute;left:8%;right:8%;top:3px;height:38%;border-radius:6px;
  background:linear-gradient(180deg,rgba(255,255,255,.45),transparent);pointer-events:none}
.md-btn:hover{filter:brightness(1.07)}
.md-btn:active{transform:translateY(8px);
  box-shadow:inset 0 3px 0 rgba(255,255,255,.5),inset 0 -3px 6px color-mix(in srgb,var(--ac) 55%,#000),
    0 1px 0 color-mix(in srgb,var(--ac) 40%,#000),0 3px 8px rgba(0,0,0,.55)}
```

**2 · Secondary — Hollow Nested Brackets** (Pair A). Same 6px corners as the primary so they pair; hollow, with the bracket detail tucked inside the rounded corners.

```css
.md-btn-ghost{font-family:"Archivo";font-weight:800;letter-spacing:.06em;text-transform:uppercase;font-size:15px;
  padding:15px 30px;border-radius:6px;cursor:pointer;position:relative;background:transparent;color:var(--ac);
  border:2px solid color-mix(in srgb,var(--ac) 52%,transparent);
  box-shadow:inset 0 0 18px color-mix(in srgb,var(--ac) 14%,transparent),0 6px 16px rgba(0,0,0,.4);
  transition:box-shadow .13s ease, transform .13s ease}
.md-btn-ghost::before,.md-btn-ghost::after{content:"";position:absolute;width:14px;height:14px;border:2.5px solid var(--ac)}
.md-btn-ghost::before{top:4px;left:4px;border-right:none;border-bottom:none;border-top-left-radius:5px}
.md-btn-ghost::after{bottom:4px;right:4px;border-left:none;border-top:none;border-bottom-right-radius:5px}
.md-btn-ghost:hover{box-shadow:inset 0 0 26px color-mix(in srgb,var(--ac) 24%,transparent),
  0 0 18px color-mix(in srgb,var(--ac) 40%,transparent),0 6px 16px rgba(0,0,0,.4)}
.md-btn-ghost:active{transform:translateY(3px)}
```

**3 · Slide-to-Confirm** — for irreversible / high-stakes actions ONLY (end operation, disband, delete, settle & lock payouts). Never for routine actions.

- Industrial metal slab handle; **push-down on grab** (slab depresses), then drag right.
- **Grey chevrons** (`#6E6A60`) ahead of the handle with a subtle nudge animation; **red hazard chevrons** (`#C2473A`) revealed behind as the handle crosses (clip-path keyed to handle X).
- Release **< 92%** → snaps back, "cancelled" (no accidental confirm). Reach the end → locks, slab turns red, ✓, fires confirm.
- Full CSS + JS reference implementation: `…-slide-confirm.html`. Pointer + touch supported.

The brand mark and any org/event patches stay clean and sharp on all of the above.

---

## 7. Layout grammar (shared across pillars)

Each pillar surface ("stage") shares one structure so the system reads as unified:

- **Global bar:** brand mark + `/` separator + pillar name (in `--ac`) + nav (active item in `--ac`) + a mono version chip (in accent, right-aligned).
- **Pre-label:** mono, letter-spaced, accent-colored kicker (e.g. "COMMAND AN OPERATION").
- **Hero:** Archivo 900 uppercase, with one emphasized word in `--ac` (`<em>` rendered as accent, not italic).
- **Sub:** Saira Condensed, `--ink2`, ~56ch.
- **Actions:** solid accent button (`--ac` bg, dark text) + ghost button (accent-outlined).
- **Tiles:** accent-titled cards on `--bg2`, accent-tinted borders.

---

## 8. Pillar → skin → meaning

| Pillar / Section | Accent | Reads as |
| --- | --- | --- |
| Landing Page | Mustard `#D4A028` | Master brand, public front door |
| Muster Hub (main menu) | Mustard `#D4A028` | Master brand, signed-in home |
| Rally Point | Rust `#C1632E` | Painted steel, find-an-op |
| Fleet Command | Radar green `#7FA356` | Military ops console |
| S.P.O.I.L.S. | Oxblood `#C2473A` | Plunder, settlement |
| Proving Ground | SC blue `#3DA3E0` | Competition dashboard |
| Terminal *(new)* | Purple `#A66BFF` + cyan `#2DE2E6` | Digital console / CRT |

---

## 9. CSS tokens (copy-paste)

Per-pillar skins. Apply the matching class/attribute on each pillar's root; the mustard mark and shared layout live above these.

```css
/* Landing Page + Muster Hub — master brand (Muster palette) */
.skin-muster { --ac:#D4A028; --bg:#161109; --bg2:#1D1810; --ink:#F3ECDB; --ink2:#B9B09C; --stamp:#9C4A22; }

/* Rally Point — painted/rusted steel */
.pillar-rally      { --ac:#C1632E; --bg:#120B07; --bg2:#1D110A; --ink:#F1E6D8; --ink2:#B5A48F; --stamp:#9C4A22; }

/* Fleet Command — radar green + scanlines */
.pillar-fleet      { --ac:#7FA356; --bg:#080D07; --bg2:#0F160C; --ink:#DDE6CF; --ink2:#92A07E; --stamp:#566B34; }

/* S.P.O.I.L.S. — oxblood */
.pillar-spoils     { --ac:#C2473A; --bg:#170D0C; --bg2:#231110; --ink:#F3E3DF; --ink2:#BFA39D; --stamp:#7E2A22; }

/* Proving Ground — SC blue / slate */
.pillar-ground     { --ac:#3DA3E0; --bg:#0B1019; --bg2:#101A28; --ink:#DCE6F2; --ink2:#93A8BD; --stamp:#2F6F9E; }

/* Terminal — purple + cyan (v1 proposal, pending sign-off) */
.pillar-terminal   { --ac:#A66BFF; --ac2:#2DE2E6; --bg:#0B0A14; --bg2:#141026;
                     --ink:#E9E6F7; --ink2:#9890B8; --stamp:#6D3BD4; }
```

> ⚠️ **Code drift to fix:** `src/styles.css` still holds the *old* worn-industrial tokens (`--md-mustard: #d69a2f`, `--md-olive`, `Capture It` heading font, `--md-bg: #070808`). None of the v2 per-pillar skins exist in code yet — which is exactly why Fleet Command "has no colors." Porting these skins in is the engineering task.

---

## 10. Fan-project compliance

Independent fan tool, no implied RSI/CIG endorsement. Footer disclaimer stays on every surface. RSI handle verification is a trust signal, not identity proof. S.P.O.I.L.S. values are organizer-managed records, not guarantees. (Locked in `docs/superpowers/specs/2026-05-20-musterdeck-brand-voice-guide.md`; unchanged here.)

---

## 11. Open items / needs your call

1. **Terminal palette + CRT font** (§4) — exact purple/cyan hexes and Share Tech Mono vs VT323 are a proposal. Sign off or adjust.
2. **Type alternates** (§5) — Chakra Petch / Stardos Stencil were explored but not locked; confirm the Archivo set is final.
3. **Depth/glow lock** (§6) — `…-weight-depth.html` options aren't a hard decision yet.
4. **Port v2 skins into `src/styles.css`** (§9) — the actual fix for Fleet Command and any new surface. Not done yet.
