# MusterDeck Free Icon Sourcing Plan

Date: 2026-05-20

## Decision

Use free and open-source icon sources first. Paid marketplaces stay as a fallback only if a specific icon cannot be solved with acceptable free assets.

## Source Strategy

1. Use clean UI icon families for app controls.
   - Primary: Lucide, Tabler
   - Secondary: Material Design Icons, Remix Icon, Iconoir, Phosphor
   - Preferred licenses: ISC, MIT, Apache 2.0

2. Use game/object libraries for Star Citizen activity concepts.
   - Primary: Game-icons.net, but only with attribution tracking because it is CC BY 3.0.
   - Secondary: Kenney, Maki, Temaki, NPS symbols, OSHA hazard symbols where relevant.
   - Preferred licenses: CC0, public domain, MIT, Apache 2.0.

3. Use user-supplied local references when they are stronger than library assets.
   - `docs/mockups/assets/icon-references/New Rifle SVG.svg`
   - `docs/mockups/assets/icon-references/Gas can.png`
   - `docs/mockups/assets/icon-references/new salvage icon.jpg`
   - `docs/mockups/assets/icon-references/Pirate Skull.svg`
   - `docs/mockups/assets/icon-references/Quartermaster.png`

4. Apply MusterDeck style after selecting source symbols.
   - The symbol should remain clean and readable.
   - Personality should come from icon plates, distressed surfaces, stencil labels, color states, and panel treatment.

## V3 Proof Batch

File: `docs/mockups/musterdeck-free-icon-candidates-v3.html`

Purpose:
- Compare source candidates before redrawing or styling.
- Flag licenses directly on the proof sheet.
- Separate source selection from final MusterDeck styling.

## License Rules

- Safe default: MIT, ISC, Apache 2.0, CC0, public domain.
- Acceptable with tracking: CC BY 3.0/4.0.
- Avoid for production app assets unless there is a strong reason: CC BY-SA, noncommercial, unclear marketplace terms, logo/brand icon sets.

## Current Recommendation

Use Lucide or Tabler as the app-wide action/UI family. Use Material Design Icons and Phosphor for machinery/fuel gaps. Use Game-icons.net only for game-specific concepts where the attribution burden is worth the stronger metaphor.

## 2026-05-20 Review Decisions

| Icon | Decision | Source | License / Tracking |
| --- | --- | --- | --- |
| Salvage | Locked to uploaded hammer/wrench reference; hand-built and library-combo attempts are rejected. Production needs trace/extraction from this reference. | `docs/mockups/assets/icon-references/new salvage icon.jpg` | User supplied |
| Rifleman / FPS Combat | Locked to uploaded rifle SVG, recolored for MusterDeck and rotated 45 degrees counterclockwise. | `docs/mockups/assets/icon-references/New Rifle SVG.svg` | User supplied |
| Piracy | Locked to uploaded pirate skull SVG. MDI skull-crossbones can be emergency fallback. | `docs/mockups/assets/icon-references/Pirate Skull.svg` | User supplied |
| Refuel | Locked to Phosphor gas can. | `ph:gas-can` | MIT |
| Repair | Locked to Lucide wrench; MDI wrench acceptable backup. | `lucide:wrench`, `mdi:wrench` | ISC / Apache 2.0 |
| Mining | Locked to Lucide pickaxe. Game-icons ore is useful for mined-resource categories. | `lucide:pickaxe`, `game-icons:ore` | ISC / CC BY 3.0 |
| Logistics | Locked to Game-icons forklift, with Lucide/Tabler as clean backups. | `game-icons:forklift` | CC BY 3.0 attribution required |
| Ship Combat | Locked back to V2-style custom spaceship with the target-overlay reticle replacing the small round reticle. | Custom SVG from V2 direction plus target overlay treatment | Project owned |
| Turret | Locked to first Game-icons turret. | `game-icons:turret` | CC BY 3.0 attribution required |
| Quartermaster | Locked to MusterDeck custom V2 chevrons/bars. | Custom SVG from V2 proof | Project owned |
| Accept / Deny / Lock / Unlock | Locked to Lucide. | `lucide:circle-check`, `lucide:circle-x`, `lucide:lock`, `lucide:lock-open` | ISC |
| Broadcast | Locked to Remix Icon broadcast. | `ri:broadcast-line` | Apache 2.0 |

## Remaining Open Problems

- Salvage needs clean SVG extraction from the uploaded hammer/wrench reference before production use.
- FPS Combat should combine the uploaded rifle SVG with a selected target/bounty overlay after the rifle is extracted cleanly.
