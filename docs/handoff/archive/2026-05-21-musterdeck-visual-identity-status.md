# MusterDeck Visual Identity Status - 2026-05-21

## Current Direction

MusterDeck is moving toward a modern industrial Star Citizen fan-tool identity: clean enough for repeated operational use, but with visible mustard caution paint, black hazard contrast, stencil headings, and subtle worn-interface texture.

The team decided to tone down the military paneling. The interface should keep a hint of rugged command-deck hardware without becoming full military green, drab, or overly heavy. The desired feel is operational, modern, industrial, and slightly distressed.

## Core Visual Decisions

- Use mustard yellow as the primary caution/identification color.
- Hazard stripes must be black on yellow, not yellow on yellow.
- Use distressed/stencil typography for page titles, headings, and high-priority labels.
- Keep body copy and dense UI text readable in normal condensed sans-serif styling.
- Avoid overusing olive/drab green. Use it only as a supporting industrial tone.
- Keep the app shell visually branded, but leave room for future custom graphics and icon systems.
- Use star-chart/topographic waypoint inspiration for the site background instead of flat gradients, stock imagery, or heavy panel art.
- Keep the public landing page account-first.
- Do not use the phrase "Star Citizen operations" as a headline label. Use `SC Operations` as a small preheading instead.

## Current Landing Page State

The landing page now presents:

- Small preheading: `SC Operations`
- Main headline: `Rally, Command, Settle.`
- Primary CTA: `Create Account`
- Secondary CTA: `Browse Rally Point`
- Four pillar cards below the hero:
  - Rally Point
  - Fleet Command
  - S.P.O.I.L.S.
  - Proving Ground

The four pillar cards do not route directly to their modules. They open modal briefs with fuller explanations. This matches the current direction that the landing page should explain the product before sending users into module workflows.

## Public Access Decisions

- Rally Point is the main guest-access surface.
- Guests may browse LFG listings before creating an account.
- Guests cannot post, join, message, or coordinate through Rally Point without an account.
- Proving Ground may expose selected event leaderboards publicly.
- Proving Ground signup, reporting, moderation, and bracket tools require accounts.
- Fleet Command and S.P.O.I.L.S. are account-required operational tools.

## Header And Footer Direction

The header now uses a full yellow caution band with black hazard striping. The four primary navigation tabs are boxed individually in dark panels so the labels read against the hazard field.

The top version-number strip was removed. Version chips now live in the footer:

- Rally v0.1
- Fleet v0.1
- S.P.O.I.L.S. v0.1
- Ground v0.1
- SC data 4.8.0-LIVE.11825000

The footer also uses the yellow caution band treatment. The fan-project disclaimer is centered in a dark readable panel, with legal/status links grouped beside it on wider screens.

## Typography Status

The app currently uses the local `Capture It` font for display headings and key buttons. This is the cleaner of the available stencil candidates and avoids the heavy white-block look of `Take Cover`.

The old XiInchil font references were removed from CSS because those font files are no longer present in the current workspace font folder. The current CSS points at:

- `Fankit_2025_11_19/05_FONTS/capture-it/Capture it.ttf`

Important: `Fankit_2025_11_19/**` is ignored by git. If this visual pass is committed for sharing or deployment, the needed font asset either has to be force-added intentionally, moved to a tracked app asset folder, or replaced with a tracked licensed font file.

## Background Status

The active landing background uses CSS-generated visual texture:

- faint grid structure
- radial waypoint dots
- thin plotted-route lines
- repeating radial contour rings
- muted mustard and off-white map marks

This is a first CSS-only proof of the requested star-chart/topographic idea. It is not final artwork. Future custom graphics can replace or layer over it once the graphic system is ready.

## Work Completed In App Code

Files intentionally changed for the visual identity pass:

- `src/components/foundation/AppFrame.tsx`
  - Removed the top version/status strip.
  - Moved version/status chips into the footer.
  - Restructured footer content for centered disclaimer and grouped links.

- `src/components/foundation/PublicLanding.tsx`
  - Updated landing preheading and hero direction.
  - Converted pillar cards into modal triggers.
  - Added modal detail behavior for pillar explanations.
  - Added placeholder star-chart visual panels inside pillar cards.

- `src/lib/foundationCopy.ts`
  - Updated title casing for hero CTA/copy.
  - Expanded pillar descriptions.
  - Added modal detail copy and guest-access notes.

- `src/styles.css`
  - Added display font setup for stencil headings.
  - Updated shell background to the current star-chart/topographic treatment.
  - Updated header and footer to black/yellow caution striping.
  - Removed the small header-side caution lines.
  - Restyled version chips to avoid oval pills and improve contrast.
  - Added pillar card visual panels, access notes, and modal styling.

- `scripts/foundation/foundationCopy.test.ts`
  - Updated the expected hero title to match the approved title-case copy.

## Verification

Latest verification completed:

- `npm run build` passed.
- `npm run test` passed: 39/39 tests.
- Browser preview at `http://127.0.0.1:5173/` showed:
  - landing hero copy in title case
  - `SC Operations` preheading
  - `Create Account` as the primary CTA
  - black/yellow caution header and footer bands
  - version chips in the footer
  - four pillar cards
  - pillar modal opens and closes
  - no horizontal overflow at desktop preview width

## Current Worktree Notes

There are uncommitted visual identity changes plus unrelated active files from other workstreams.

Visual identity files expected for this pass:

- `scripts/foundation/foundationCopy.test.ts`
- `src/components/foundation/AppFrame.tsx`
- `src/components/foundation/PublicLanding.tsx`
- `src/lib/foundationCopy.ts`
- `src/styles.css`

Font/workspace caveat:

- `Fankit_2025_11_19/05_FONTS/xiinchil/xiinchil-Bold.otf` currently shows as deleted.
- `Fankit_2025_11_19/05_FONTS/xiinchil/xiinchil-Regular.otf` currently shows as deleted.
- These old files are no longer referenced by the current CSS.
- The currently used `Capture It` font is ignored by git through the fan-kit ignore rule.

Unrelated worktree files should not be bundled into a visual identity commit without review. At the time this note was written, there were also Fleet Command/Supabase plan or persistence files in the worktree.

## Committed Foundation Work Today

Earlier committed foundation/visual commits in this branch:

- `2d1d496 fix: simplify foundation header navigation`
- `d722ad8 style: apply caution band header and footer`

The latest landing-page visual changes described in this handoff were not committed at the time of this note.

## Recommended Next Session

1. Decide how to handle the stencil font asset:
   - force-add the current `Capture It` font,
   - move it into a tracked app asset folder,
   - or replace it with another tracked licensed display font.
2. Review the landing page visually in browser and decide whether the hero headline stencil weight is right.
3. Tune the black/yellow hazard band density if the header feels too loud.
4. Replace the CSS-only pillar mini-images with custom graphics or icon plates when the graphics pass begins.
5. Confirm the exact guest-access policy for Rally Point listings and Proving Ground leaderboards before building those public views.
