# MusterDeck Visual Asset Plan

Date: 2026-05-20

## Purpose

Plan the individual visual assets needed for the MusterDeck industrial/stenciled interface before generating or importing more files.

The current generated texture board should be treated as inspiration only. It should not be used as a full-page background in the app. Future assets should be smaller, named, reusable, and purpose-built.

## Current Direction

MusterDeck should feel like a used, physical command tool: worn mustard paint, olive drab equipment, graphite instrument panels, caution striping, scuffed edges, and sprayed/stenciled markings. The goal is not a literal World War II skin. It is a space-industrial interface that borrows the physicality, contrast, and rugged utility of old military equipment without copying real insignia, factions, or national markings.

Key rules:

- Use generated images as surfaces, plates, trims, and textures, not as one giant page background.
- Keep functional UI text as real HTML/CSS text for accessibility, localization, responsiveness, and search.
- Keep functional icons vector-first so they remain sharp and recognizable at small sizes.
- Use raster/generated imagery for wear, material texture, plates, button surfaces, decorative stamps, and background overlays.
- Avoid accidental readable text, logos, flags, real-world military symbols, or copied IP in generated assets.
- Use visual wear to support hierarchy, not to fight readability.

## Font Direction

Candidate display fonts:

- Capture it: https://www.1001fonts.com/capture-it-font.html
- Take Cover: https://www.1001fonts.com/take-cover-font.html

Observed from the public font pages:

- Both are by Magique Fonts.
- Both are marked free for commercial use on 1001 Fonts.
- Capture it is the normal eroded/stenciled version.
- Take Cover is the inverted/reverse companion.

Recommended usage:

- Use these only for display labels, large module titles, button labels, stamped status labels, and decorative markings.
- Do not use them for body text, dense tables, or small operational data.
- Pair with a clean condensed UI font for normal text.

Needed before production use:

- Download font files into a dedicated font folder.
- Keep the included license text with the font files.
- Record exact source URL and download date.
- Confirm the license text inside the zip, not only the 1001 Fonts page.

Suggested future folders:

- Mockup fonts: `docs/mockups/assets/fonts/`
- Production fonts, if approved: `src/assets/fonts/`

Font roles:

- Capture it: primary rugged stencil display face for big module labels, button labels, stamped headings, and large status words.
- Take Cover: reverse/knockout accent face for warning stamps, special seals, and occasional plate markings.
- UI/body font: still needs to be a clean, highly legible sans or condensed sans for tables, forms, account/admin screens, and mobile use.

## Asset Storage Rules

Mockup-only assets:

- `docs/mockups/assets/`

Production candidates after approval:

- `src/assets/ui/`
- `src/assets/textures/`
- `src/assets/icons/`
- `src/assets/fonts/`

Archive superseded mockup assets:

- `docs/archive/mockups/`

Every generated asset batch should include:

- Final image file.
- Prompt/source note.
- Creation date.
- Intended use.
- Whether it is mockup-only or production-candidate.

Recommended metadata file:

- `docs/mockups/assets/ASSET-MANIFEST.md` while we are still in mockups.
- Move approved production asset notes into the production source tree later.
- Each entry should include filename, source method, source URL if any, prompt summary for generated work, license status, and approval status.

## Asset Groups To Create

### 1. Button Assets

Create individual button images or sliced texture pieces inspired by worn analog hardware. This should become a button surface library, not a tiny sample set.

Button construction approach:

- Keep labels and icons as live HTML/CSS layered over the button surface.
- Generate surfaces without readable text.
- Build most buttons from a base surface, a hover/pressed overlay, and CSS shadows.
- For odd-shaped buttons, use a larger transparent PNG surface and preserve enough padding for responsive text.
- For rectangular buttons, prefer a nine-slice or layered CSS approach so the button can stretch without warping scratches or bolts.

Needed variants:

- Primary mustard command button: default, hover, pressed, disabled.
- Olive secondary command button: default, hover, pressed, disabled.
- Graphite utility button: default, hover, pressed, disabled.
- Red/orange caution/destructive button: default, hover, pressed, disabled.
- Square icon button: mustard, olive, graphite, caution.
- Compact toolbar button.
- Large mobile/touch command button.
- Wide call-to-action command button.
- Icon-plus-label command button.
- Segmented-control tab button: left, middle, right, active, inactive.
- Toggle switch or rocker button: off, on, disabled.
- Small pill/chip button for filters.
- Confirmation button.
- Cancel/back button.
- Approve button.
- Deny/reject button.
- Assign/reassign button.
- Broadcast/notify button.
- Lock/finalize button.
- Unlock/reopen button.
- Add item/add participant button.
- Remove item/remove participant button.
- Up/down adjustment buttons for S.P.O.I.L.S. shares.
- Numeric stepper button.
- Drag/reorder handle plate.
- Dropdown/select button.
- Search/filter tool button.

Visual requirements:

- Chipped yellow or olive paint.
- Scraped edges.
- Slightly uneven spray/stencil label feel.
- Pressed physical depth.
- Subtle dust and wear.
- No full-page texture baked into the button.
- No readable accidental text inside texture.

Recommended technical form:

- Use CSS for text and layout.
- Use generated bitmap only as texture/background layer or nine-slice-style button surface.
- Avoid generating button text into the image unless it is decorative, because real UI text needs to stay accessible and editable.
- Prefer one reusable surface per state, then layer live text/icons over it.
- If we need irregular chipped edges, generate larger surfaces and crop or mask in CSS.

### 2. Panel Assets

Create reusable panel surfaces rather than one giant background. Panels must support responsive widths/heights, so the artwork should be designed as layered pieces rather than a single fixed image.

Panel construction approach:

- Use CSS color/gradient as the base fill.
- Use a tileable center texture for the interior.
- Use separate corner caps, edge strips, bolts, scratches, and hazard overlays as optional layers.
- Avoid fixed text baked into panel art.
- Keep the center area calmer than the edges so body text, tables, and controls remain readable.
- For production, use CSS `border-image`, mask layers, pseudo-elements, or separate absolutely positioned decorative pieces.
- Design at least one large mostly-empty panel kit for section containers.

Needed variants:

- Main graphite panel.
- Olive field panel.
- Mustard header plate.
- Dark instrument-panel card.
- Admin warning panel.
- S.P.O.I.L.S. ledger panel.
- Rally Point listing card panel.
- Fleet Command operation panel.
- Compact mobile panel.
- Top navigation/version plate.
- Footer disclaimer strip.
- Notification drawer panel.
- User/account settings panel.
- Admin user table panel.
- Empty-state panel.
- Confirmation modal panel.
- Large empty section panel.
- Stretchable card panel.
- Stretchable table/list panel.
- Side rail panel.
- Horizontal command bar panel.
- Thin status strip.
- Map/battleboard panel.
- S.P.O.I.L.S. payout ledger panel.
- S.P.O.I.L.S. item inventory panel.
- Rally Point listing feed panel.
- Fleet Command roster panel.
- Fleet Command ship/team panel.
- Account identity/verification panel.

Visual requirements:

- Worn but readable.
- Panel seams.
- Subtle rivets or screw heads.
- Edge scrapes.
- Light surface grunge.
- No distracting high-contrast scratches behind body text.

Recommended technical form:

- CSS background color/gradient as base.
- Small tileable texture overlay.
- Optional corner/rivet overlays.
- Separate bolt/screw/greeble assets placed at corners or along edges.
- Panel edges should be stronger than panel centers.
- Design panel parts to stretch horizontally and vertically without obvious repeating artifacts.

### 3. Background And Texture Tiles

Create tileable or large-but-subtle textures.

Needed variants:

- Dark graphite worn metal tile.
- Olive-drab worn paint tile.
- Mustard chipped paint strip.
- Subtle dust/noise overlay.
- Topographical battlemap line tile.
- Tactical grid tile.
- Scratched clearcoat overlay.
- Edge wear overlay for panels.
- Low-contrast starfield/noise field for deep background only.
- Subtle paper/clipboard ledger texture for S.P.O.I.L.S. surfaces.
- Rubberized black instrument texture for toolbars.
- Mustard hazard paint tile.
- Mustard chipped-paint overlay.
- Olive chipped-paint overlay.
- Black/yellow hazard stripe tile.
- Transparent scratch overlay.
- Transparent grime/dust overlay.
- Transparent worn-edge overlay.
- Transparent stencil overspray overlay.
- Subtle metal dent overlay.

Visual requirements:

- Seamless or easy to crop.
- Low contrast for UI readability.
- No accidental words, logos, real insignia, or copyrighted marks.
- Topographical map should feel strategic, not like a fantasy map or neon cyber grid.

### 4. Caution And Flare Items

Create small decorative utility assets that can be placed sparingly. These are the pieces that should carry the mustard hazard personality without forcing every background or panel to be busy.

Needed variants:

- Hazard stripe strip: mustard/black.
- Worn caution corner bracket.
- Diagonal warning tape fragment.
- Rivet/screw cap set.
- Stamped serial-number plate with placeholder marks, not readable real text.
- Scuffed module divider.
- Torn paint edge.
- Small warning tab.
- Status seal/stamp background.
- Rubber gasket/border strip.
- Stenciled arrow marker.
- Worn tab label plate.
- Small maintenance tag.
- Painted index number chip.
- Topographic contour patch.
- Map coordinate crosshair.
- Small worn seal for "verified" or "locked" states.
- Mustard hazard overlay block.
- Mustard hazard overlay corner.
- Mustard hazard overlay strip.
- Mustard hazard overlay diagonal slash.
- Mustard hazard overlay scuffed label backing.
- Paint scrape decal.
- Chipped paint decal.
- Bolt cluster.
- Washer/rivet ring.
- Toggle screw.
- Cable clamp detail.
- Small vent grille.
- Small inset handle.
- Rubber bumper.
- Metal latch.
- Warning light lens.
- Tiny status diode.
- Inventory tag plate.
- Ledger tab plate.
- Clipboard clamp strip.
- Tactical map pin marker.
- Numbered stencil chip.

Usage rules:

- Decorative only.
- Do not overuse.
- Keep body text areas clean.
- Use to guide hierarchy and create physical character.

### 4A. Knobs, Greebles, And Physical Controls

Create loose physical parts that can be layered onto panels and command bars.

Needed variants:

- Rotary knob: graphite, mustard marker line.
- Small round indicator light: off, green, amber, red.
- Rectangular indicator light: off, green, amber, red.
- Toggle switch cap: off/on positions.
- Rocker switch cap: off/on positions.
- Small screw heads: flat, worn, dark, brass/mustard-tinted.
- Rivets/bolts: small, medium, large.
- Handle/latch plate.
- Cable port/connector plate.
- Vent grille strip.
- Rubber bumper.
- Metal corner guard.
- Small physical tab for active module selection.

Technical form:

- Transparent PNG overlays for mockups.
- In production, use SVG/CSS for simple knobs where possible and PNG only for material/wear detail.
- Treat these as optional decoration, not required controls, unless the actual interaction needs them.

### 5. Iconography

Use lucide or a similar vector icon set for functional icons where possible, then style them with the MusterDeck visual language.

Detailed icon inventory:

- `docs/handoff/2026-05-20-musterdeck-icon-inventory.md`

Core app/navigation icons:

- Home / hub.
- Rally Point.
- Fleet Command.
- S.P.O.I.L.S.
- Admin.
- Account/profile.
- Login/logout.
- Settings.
- Notifications.
- Search.
- Filter.
- Calendar.
- Status/version.
- Help/about.
- Documentation/notes.
- Mobile/device notifications.

Rally Point icons:

- Create listing.
- Join/apply.
- Applicant queue.
- Public listing.
- Private listing.
- Unlisted link.
- Manual approval.
- Discord required.
- RSI verified.
- Guest allowed.
- Star system.
- Location/sector.
- Activity type.
- Risk level.
- Reward model.
- Voice/comms.
- Party size.
- Ship requested.
- Role requested.
- Region/server.
- Reputation grind.
- Mining/salvage/combat/general activity.
- Event owner.
- Expiration/closing time.

Fleet Command icons:

- Ship.
- Ship class/category.
- Crew role.
- Team.
- Officer.
- Fleet commander.
- Ship captain.
- Lock roster.
- Unlock roster.
- Move/reassign.
- Phase/status change.
- Briefing.
- Orders.
- Acknowledge.
- Request change.
- Duplicate/template.
- Formation.
- Squadron/team lane.
- Objective.
- Rally marker.
- Extraction point.
- Logistics/cargo.
- Medical/rescue.
- Repair/refuel/rearm.
- Security/escort.
- Broadcast notification.
- Direct assignment notification.

S.P.O.I.L.S. icons:

- Quartermaster.
- Ledger.
- Org bank.
- Payout split.
- Percentage adjust up/down.
- Fixed amount adjust.
- Item request.
- Approval queue.
- Approved.
- Denied.
- Paid.
- Locked/finalized.
- Mining.
- Salvage.
- Cargo/proceeds.
- Ship component.
- Ship weapon.
- Rare/special item.
- Valakar harvestable.
- Yormandi harvestable.
- Wicklow favor.
- Manual adjustment.
- Sale pending.
- Sale completed.
- Participant share.
- Virtual org bank participant.
- Dispute/note.
- Export ledger.
- Settlement report.

Account, trust, and admin icons:

- Email account.
- Discord linked.
- Google linked.
- RSI handle.
- RSI verified.
- Verification pending.
- Guest account.
- Password.
- Linked identity.
- Role/permission group.
- User search.
- User status.
- Ban/restrict.
- Unban/restore.
- Audit log.
- Report/flag.
- Impersonation/espionage risk marker.
- Moderation note.

Recommended technical form:

- Functional icons should remain vector/SVG for clarity and accessibility.
- Decorative frames/plates around icons can use generated image assets.

### 6. Data And Status Badges

Needed badges:

- Rally Point version.
- Fleet Command version.
- S.P.O.I.L.S. version.
- Star Citizen data patch.
- Catalog sync stale/current.
- Discord linked.
- Google linked.
- RSI verified.
- Guest.
- Restricted.
- Banned.
- Event public/unlisted/private/org-only.
- Pending approval.
- Ready.
- In progress.
- Completed.
- Settlement locked.
- Settlement draft.
- Payout pending.
- Payout complete.
- Item requested.
- Item reserved.
- Item claimed.
- Officer-only.
- Org-only.
- Public.
- Guest allowed.
- Verification required.
- Discord required.
- RSI required.

Visual requirements:

- Mostly CSS/vector.
- Use stenciled display font only at readable sizes.
- Avoid image text for badges unless decorative.

### 7. S.P.O.I.L.S. Item Category Visuals

Needed category marks:

- Minables.
- Metals.
- Pristine metals.
- Ship components.
- Ship weapons.
- Valakar harvestables.
- Yormandi-style harvestables.
- Wicklow favors.
- Sale proceeds/aUEC.
- Org bank.
- Generic commodity crate.
- Unknown/unclassified item.
- Requested item.
- Reserved item.
- Sold item.

Recommended technical form:

- Vector icon plus rugged plate.
- Optional category texture strip.
- Avoid photoreal item images until the item database is clearer.

## Generation Order

Recommended library batches:

1. Button surface library.
2. Mustard hazard overlay and texture library.
3. Stretchable panel kit.
4. Knob/greeble/control overlay kit.
5. Caution/flare item kit.
6. Icon plate/frame set.

Then:

7. Rally Point-specific icons/plates.
8. Fleet Command-specific icons/plates.
9. S.P.O.I.L.S.-specific icons/plates.

Practical approval sequence:

1. Approve this inventory.
2. Generate a contact sheet proof batch with buttons, hazard overlays, panel pieces, and greebles together.
3. Place the assets into a local HTML contact sheet with live labels/icons and example panel compositions.
4. Pick the winning surface treatment.
5. Expand the chosen treatment across the full button/panel/overlay library.
6. Build a single app-shell mockup using only approved individual assets.
7. Archive rejected mockup assets with notes instead of deleting them.

## First Image Generation Batch Proposal

Batch name:

- `musterdeck-industrial-ui-kit-proof-v1`

Assets:

- Button surfaces:
  - `button-primary-mustard-default.png`
  - `button-primary-mustard-hover.png`
  - `button-primary-mustard-pressed.png`
  - `button-primary-mustard-disabled.png`
  - `button-secondary-olive-default.png`
  - `button-secondary-olive-hover.png`
  - `button-secondary-olive-pressed.png`
  - `button-graphite-utility-default.png`
  - `button-caution-danger-default.png`
  - `button-square-icon-mustard.png`
  - `button-square-icon-graphite.png`
  - `button-filter-chip-olive.png`
  - `button-stepper-up.png`
  - `button-stepper-down.png`
- Hazard overlays:
  - `overlay-hazard-mustard-strip.png`
  - `overlay-hazard-mustard-corner.png`
  - `overlay-hazard-diagonal-slash.png`
  - `overlay-chipped-mustard-paint.png`
  - `overlay-scratch-clear.png`
- Stretchable panel kit:
  - `panel-graphite-center-tile.png`
  - `panel-graphite-corner-tl.png`
  - `panel-graphite-corner-tr.png`
  - `panel-graphite-corner-bl.png`
  - `panel-graphite-corner-br.png`
  - `panel-graphite-edge-top.png`
  - `panel-graphite-edge-right.png`
  - `panel-graphite-edge-bottom.png`
  - `panel-graphite-edge-left.png`
  - `panel-mustard-header-plate.png`
- Greebles:
  - `greeble-bolt-small.png`
  - `greeble-bolt-medium.png`
  - `greeble-rivet-ring.png`
  - `greeble-rotary-knob.png`
  - `greeble-toggle-switch-off.png`
  - `greeble-toggle-switch-on.png`
  - `greeble-indicator-amber.png`
  - `greeble-vent-strip.png`

Prompt direction:

Create isolated UI kit assets for a worn space-industrial web app. No embedded text. Chipped mustard and olive paint, scraped edges, analog physical depth, subtle dust, brushed metal, mustard hazard paint, bolts, scratches, modular panel edges, transparent backgrounds where possible, no logos, no national insignia, no weapons, no readable markings. Assets must be individual pieces that can be layered in HTML/CSS, not one large composed dashboard background.

## Open Questions Before Generating Assets

1. Should the first asset batch be flat PNG previews, or should we attempt transparent PNG/button surfaces?
2. Should button text always remain live HTML/CSS text instead of being baked into images?
3. Do we want Capture it for normal stenciled labels and Take Cover only for special reverse-stamped accents?
4. Should asset dimensions target desktop only first, or include mobile/touch sizes immediately?
5. Should icons stay mostly lucide/vector, with generated image plates behind them?

Recommended answers unless you want to change them:

1. Start with transparent PNG/button surfaces when possible, plus a flat preview contact sheet.
2. Keep all real UI text live in HTML/CSS.
3. Use Capture it as the main display stencil and Take Cover only as a special accent.
4. Include mobile/touch sizes immediately because notifications and field use are central to the app.
5. Keep icons vector-first and use generated worn plates/frames behind them.
