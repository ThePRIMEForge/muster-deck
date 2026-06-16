# MusterDeck landing — background art brief (Higgsfield)

Date: 2026-06-15
Purpose: art-direction + prompt set + technical slot specs to generate the looping background art for the landing page, so each render drops into a named layer slot in `landing-full.html`.

## Scene concept

A dark, quiet stretch of space: drifting asteroids and large space rocks above the limb of a planet, seen through the debris. Not bright — low-key, cinematic, mostly black with cool slate-blue light on the planet and a single warm accent (the mustard brand mark in the UI, and the cyan mining lasers in the far distance). There is activity happening *elsewhere* — distant spacecraft mining rocks with laser beams — but nothing close or detailed. The viewer is parked in a calm pocket of an active mining belt.

On scroll, an explosion ignites out where those distant ships were working, streaks to screen-center, and detonates; the wheel forms from that blast.

## Palette

- Background near-black: `#05060A` → `#0D0B0C`
- Planet cool slate: `#2B3344` lit side → `#0A0C10` shadow; subtle blue rim light `rgba(150,180,220,.2)`
- Rocks: dark brown-grey `#2A2620` → `#100D0A`, faint top light
- Mining laser accent: cyan `#2DE2E6`
- Brand accent (UI only, not in plates): mustard `#D4A028`
- Keep it DARK. Target overall scene luminance low; the UI text must read on top.

## Layer slots (each = a swappable plate in the page)

The page composites these as stacked full-bleed layers with independent parallax. Render each **on transparent background** except `sky`. Z-order bottom → top:

| Slot (CSS class) | Content | Transparent? | Motion | Loop | Delivery |
|---|---|---|---|---|---|
| `sky` | Deep-space gradient + starfield (no rocks) | No (opaque base) | Stars twinkle, ultra-slow drift | 20s seamless or static | WebP/JPG 2560×1440; optional alpha-less WebM |
| `planetwrap` | Large planet limb, lower third, partially occluded; only a portion visible | Yes | Very slow cloud/terminator drift, subtle | 20s seamless | WebM VP9 alpha, 2560×1440 |
| `rocks-far` | 4–6 small, slightly blurred distant asteroids | Yes | Slow tumble + slow drift | 18s seamless | WebM VP9 alpha |
| `rocks-near` | 2–3 larger, sharper foreground asteroids (edges of frame) | Yes | Tumble + parallax drift | 16s seamless | WebM VP9 alpha |
| `mining` | 2–3 tiny far-off spacecraft + thin cyan mining beams hitting rocks (upper-right region) | Yes | Ships drift slightly; beams pulse; small spark flecks | 10s seamless | WebM VP9 alpha |
| `fx` (explosion) | One-shot: ignition flash → streak → fireball + shockwave + smoke | Yes | Plays once, scrubbed by scroll | NON-looping, ~3s @ 30fps | WebM VP9 alpha **or** PNG sprite sheet |
| `vignette` | Edge darkening | — | — | CSS only (no asset) |

Notes:
- The `mining` layer's ships should sit in the **upper-right** so the explosion can originate there and read as "where the mining was."
- Keep ships and beams TINY and low-detail — distance is the point.

## Technical delivery

- **Master render**: 2560×1440 (16:9). Also export 1920×1080. Provide @2x where sharpness matters.
- **Transparency**: WebM **VP9 with alpha** (`yuva420p`). Provide an **animated WebP** fallback per layer.
- **Seamless loops**: first frame == last frame (use Higgsfield loop mode, or we trim/cross-fade on import).
- **Frame rate**: 24–30 fps. **Durations**: 12–20s for ambient layers (slow), ~3s for the explosion.
- **File size targets**: ambient layers < ~1.5 MB each (WebM); explosion < ~2 MB.
- Deliver into `public/brand/landing/` named: `sky`, `planet`, `rocks-far`, `rocks-near`, `mining`, `fx-explosion` (+ `.webm` / `.webp`).

## Per-layer prompts (text-to-image → image-to-video)

Render a still first, then animate with the motion prompt. Keep camera locked (no camera move) so layers composite cleanly.

**sky**
- Still: "Deep space backdrop, near-black with a faint violet-blue nebula haze in one corner, scattered small stars of varying brightness, cinematic, very dark, high contrast, no planets, no asteroids, 16:9."
- Motion: "Stars twinkle subtly, nebula haze drifts almost imperceptibly, locked camera, seamless loop."

**planet**
- Still: "The curved limb of a large rocky-blue planet seen from orbit, occupying only the lower portion of the frame, cool slate-blue lit side and deep shadow, subtle blue atmospheric rim light, rest of frame transparent/empty space, dark, cinematic, 16:9, alpha background."
- Motion: "Extremely slow terminator and faint cloud drift across the planet surface, no camera movement, seamless loop."

**rocks-far**
- Still: "A scattering of small distant asteroids and space rocks, dark brown-grey, slightly soft/blurred from distance, lit faintly from upper left, floating on transparent background, dark, cinematic, 16:9, alpha."
- Motion: "Each asteroid tumbles slowly on its own axis and drifts gently, parallax, locked camera, seamless loop."

**rocks-near**
- Still: "Two or three large jagged asteroids at the edges of the frame (foreground), sharp detail, dark rock with faint top light and deep shadow, transparent background, cinematic, dark, 16:9, alpha."
- Motion: "Slow heavy tumble and slight drift, foreground parallax, locked camera, seamless loop."

**mining** (upper-right)
- Still: "Two or three tiny far-away industrial spacecraft in the upper-right distance, mining large asteroids with thin cyan laser beams, small sparks at the impact points, the rest transparent, very small in frame, low detail due to distance, dark, cinematic, 16:9, alpha."
- Motion: "Beams pulse gently, faint spark flecks drift, ships hold position with tiny drift, locked camera, seamless loop."

**fx-explosion** (one-shot, NOT looping)
- Sequence: "A bright ignition flash in the upper-right, a fast streak of light toward screen-center, then a large fireball detonation at center with an expanding shockwave ring and billowing smoke, orange-white core fading to dark smoke, transparent background, dark scene, 16:9, alpha, ~3 seconds, dramatic."
- We scrub this by scroll position, so deliver as a clean linear sequence (or PNG sprite sheet, ~60 frames).

## Dimmed in-wheel (inspecting) variant

When the wheel is settled and the user inspects it, the same stack is dimmed as a backdrop:
- Brightness ~50%, saturation ~75%, heavier vignette.
- Ambient layers (planet, rocks, sky) keep drifting/tumbling slowly; `mining` and `fx` are gone.
- No separate art needed — same plates, dimmed via CSS. (If you want a distinct calmer plate, render a `sky-dim` variant.)

## How it maps to code

In `landing-full.html` the `.scene` contains `.layer.sky / .planetwrap / .rocks-far / .rocks-near / .mining` plus `.fx`. Today these are CSS stand-ins with parallax drift/tumble. To swap in real art, replace each layer's contents with `<video autoplay muted loop playsinline>` (WebM+WebP source) or an `<img>` (animated WebP), keeping the same class so the parallax timing applies. The explosion `.fx` is driven by the scroll `frame()` loop (scrub), so it takes the sequence rather than an autoplay loop.
