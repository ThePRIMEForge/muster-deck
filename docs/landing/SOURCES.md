# Landing assets — sources & provenance

The web-ready assets in `assets/` are derived from source footage/art kept locally
in the Google Drive archive (not committed to git — the source folder is large).

## Source footage (local only: `Explosions/` and `Explosions/new/`, gitignored)

| Web asset | Source file | Notes / processing |
|---|---|---|
| `assets/ex_sw4.mp4` | `Explosions/new/4k-animation-shock-wave-explosion-from-the-centre-…-SBV-346416552-HD.mp4` | Orange radial flame burst with rays. Trimmed ~2.6s, scaled 1280w, all-keyframe (`-g 1`), no audio. Screen-blended in page. |
| `assets/ex_swc.mp4` | `Explosions/new/shock-waves-3-different-versions-…-SBV-314355832-HD.mp4` | Blue shockwave (first "version", 0–2.6s). Same transcode. |
| `assets/ex_sph.mp4` | `Explosions/new/alpha-channel-quick-spherical-explosion-1-SBV-300075509-HD.mov` | 224MB PNG-alpha source → trimmed ~1.4s, flattened on black, scaled 960w, ~116KB. Screen-blended (black disappears). |

Unused source clips kept in the archive: `Explosions/fiery-vfx-explosion-…green-screen…4K.mp4`
(green-screen, rejected — too red), `Explosions/fireball-transition-*.mov` (alpha
fireballs, rejected — too orange/flamey).

> Stock clip IDs (the `SBV-…` numbers) are the vendor identifiers. Confirm the
> stock licence covers production web use before launch.

## Brand / scene art

| Web asset | Origin |
|---|---|
| `assets/bg-planet.webp` (also `public/brand/space-planet.webp`) | Higgsfield-generated planet limb, darkened/cropped for the persistent background. |
| `assets/musterdeck-logo.webp` | MusterDeck badge (from `public/brand/`). |
| `assets/made-by-community.webp` (also `public/brand/`) | "Made by the Community" badge. |
| `assets/sprites/rN.webp` + `manifest.js` | Higgsfield asteroid field, cut into 32 individual rocks (ImageMagick connected-components) so they shatter outward independently on the blast. |

The starfield is generated in JS (2D canvas) — no image asset.

## Transcode recipe (reference)

```sh
# shockwave clips (black bg -> screen blend), all-keyframe for smooth scroll-scrub
ffmpeg -y -t 2.6 -i SRC.mp4 -an -vf "scale=1280:-2" -pix_fmt yuv420p -g 1 -crf 22 -movflags +faststart ex_swX.mp4
# alpha spherical -> flatten on black, trim, shrink
ffmpeg -y -i SRC.mov -t 1.4 -filter_complex "color=black:s=960x540[bg];[0:v]scale=960:540[v];[bg][v]overlay=shortest=1,format=yuv420p[o]" -map "[o]" -r 24 -g 1 -crf 30 -movflags +faststart -an ex_sph.mp4
```
