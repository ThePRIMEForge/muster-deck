# MusterDeck reusable UI components

Self-contained HTML/CSS reference snippets extracted from the landing page so the
same pieces can be reused across the landing page, the in-app hub, and the
marketing site. Each file previews standalone (open it in a browser) and carries
copy/paste instructions at the top.

| Component | File | What's inside |
|---|---|---|
| Become a supporter | [become-a-supporter.html](become-a-supporter.html) | The "free / supporters keep it running" blurb, the **Become a supporter** button, and the Patreon tier modal (Captain $1 / Admiral $5 / Praetorian $20) with the holographic cast-open reveal. |
| Made by the Community | [community-badge.html](community-badge.html) | The "Made by the Community" badge and the unofficial Star Citizen fan-site trademark/affiliation disclaimer. Also used on the hub. |

Shared brand tokens (`--ac` mustard, `--ink`, `--ink2`) are duplicated in each
file's `:root` so they preview in isolation; drop those lines when the host page
already defines them.
