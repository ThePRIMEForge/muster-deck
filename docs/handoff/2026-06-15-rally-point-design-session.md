# Rally Point — Design Session Closeout (2026-06-15)

**Session goal:** Design the Rally Point module end-to-end (visually, in the rust CRT style), capture the decisions in a spec, and produce an implementation plan so Blair (@blairg23) can start building.

**Outcome:** All five Rally Point screens designed as interactive mockups; spec written and updated; foundation implementation plan written. Spec + plan committed and pushed to **GitHub PR #175**. Mockups + docs also on Google Drive.

---

## What was produced

### Interactive mockups (Google Drive)
`02_DESIGN & WORKING FILES/rally-point-mockups/` — served locally with `python3 -m http.server 8080` (stable address `http://127.0.0.1:8080/`). Numbered snapshots kept in `versions/` for rollback.

| File | Screen |
|---|---|
| `index.html` | Hub (links to all screens) |
| `discover.html` | 01 Discover board (three-rail: filters · listings · friends-online) |
| `listing.html` | 02 Listing detail — banner, two crew shapes (`?op=group` toggles open-group), Op Channel, host controls + Tier-3 handoff |
| `post.html` | 04 Post an Op — full field set, crew-shape segmented control, 16 header-image presets + Tier-2 upload gate |
| `activity.html` | 05 My Activity — Hosting / Joined / Past + membership strip |

Join flow (03) is interactive **inside** `listing.html` (identity chip cycles Guest → Member → Host).

### Spec (Drive + GitHub PR #175)
`docs/superpowers/specs/2026-06-15-rally-point-design-update.md` — extends the 2026-06-10 draft.

### Implementation plan (Drive + GitHub PR #175)
`docs/superpowers/plans/2026-06-15-rally-point-foundation.md` — sub-project ① (data/logic foundation), TDD, plus a roadmap for sub-projects ②–⑥.

---

## Decisions made this session

1. **Join is instant** — claiming a seat / taking a spot adds you to the crew immediately. No approval queue. (Reverses the draft's apply/approve framing, tickets #19/#20.)
2. **Host moderation = kick.** The host can remove anyone; trust on serious ops comes from the RSI-verified-only and org-only gates, not approvals.
3. **Two crew shapes**, chosen at post time: **open-group** (headcount, optional/open-ended, people bring whatever) vs **specific roles/seats** (named roles, often ship-bound).
4. **Three-tier access:** Guest (browse only) → Member/free (post, join, kick, voice link, 16 preset banners) → Patreon.
5. **Patreon tiers** (reconciled with the existing `app_patreon_tier` enum): **Captain** = Tier 1 (badge only) · **`admiral`** = Tier 2 (feature unlocks — the value tier) · **`praetorian`** = Tier 3 (tournaments + handoff).
6. **Tier-2 unlocks:** synced **Discord event** (layered on the free voice link) + **custom header-image upload**.
7. **Tier-3 unlock (new — reverses the draft's "out of scope"):** **cross-module handoff** — host ports a *live* op (post-creation only) to seed a new **Fleet Command**, **S.P.O.I.L.S.**, or **Proving Ground** instance.
8. **Op Channel:** built-in, crew-gated in-app messaging; host edits auto-post **⚙ status updates** + notify the crew. (Emits to the Notifications/Messaging epics.)
9. **Required to post:** Activity (≥1) · Title · Start time · Region · Time commitment. Crew count is optional/open-ended.
10. **Come-prepared** is a two-state toggle: "Come prepared" ⇄ "We'll provide all you need."
11. **Header images:** 16 generic presets (free) / custom upload (Tier 2).
12. **Styling:** inherits the locked Pillar CRT system; rust palette only. Back link sits below the top bar, not in it.

Full detail + the still-open data-model/backend items live in the spec.

---

## Branding & assets

**Branding — adheres to locked identity (no drift).** Mockups use the locked Rally Point rust palette verbatim: `--ac #C1632E · --bg #120B07 · --bg2 #1D110A · --ink #F1E6D8 · --ink2 #B5A48F · --stamp #9C4A22`, grunge 50%, fonts Archivo / Saira Condensed / JetBrains Mono — matching the Pillar CRT styling system and brand identity guide.

**No new binary assets were created this session** — the mockups are self-contained HTML (gradients + CDN fonts). Outstanding asset work to schedule:

- **16 "Hicksfield" header-image presets** — the generic op banner art (free-tier default). Currently stand-in CSS gradients in the mockups. *Needs real art.*
- **Custom header upload (Tier 2)** — backend storage + size/format limits + **moderation** of user-uploaded images.
- **Rally Point pillar icon** — brand research called for a Radio/broadcast mark; mockups use a `◤◢` placeholder. *Needs final icon.*
- **Discord event integration** — exact sync mechanism (scheduled-event link vs API).

---

## State of record

- **GitHub:** PR **#175** (`docs/rally-point-design-update`, base `main`) holds the spec + foundation plan. *(Specs/plans are in GitHub; the HTML mockups are Drive-only — can be added to the repo on request.)*
- **Google Drive:** spec + plan under `docs/superpowers/`, mockups under `02_DESIGN & WORKING FILES/rally-point-mockups/` (+ `versions/`), this handoff under `docs/handoff/`.

---

## Next steps

1. **Build sub-project ① (foundation)** — schema + RLS + tested pure-logic module. Plan is self-contained for Blair, or can be run subagent-driven. Work happens in the working clone `~/muster-deck` (not the Drive).
2. After ① lands, spec→plan each remaining sub-project: ② data-access · ③ Discover+Listing (read) · ④ Post+Join/kick (write) · ⑤ Op Channel + notifications · ⑥ Tier-2/3 features (Discord, custom image, cross-module handoff).
3. Commission the outstanding art assets (16 presets, pillar icon).
4. Resolve open backend items in the spec §9 (data model RLS for friends/org visibility, Patreon entitlement check, Discord sync, image moderation, mission-catalog sourcing, recurring/series).
