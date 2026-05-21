# Fleet Command Reviewed Staffing Setup Design

Date: 2026-05-21

## Purpose

Fleet Setup should use the locked Ship Position Review baseline when officers add ships to an operation. The current prototype can load the live ship catalog, but it still infers seats from broad ship categories. This slice replaces that guesswork with reviewed position templates for Skeleton, Standard, and Full Crew.

## Scope

Build now:

- Expose reviewed ship-position templates through a Supabase read model.
- Load reviewed position templates beside the ship catalog in the frontend.
- When an officer selects a ship, show Skeleton, Standard, Full Crew, and Custom as setup choices.
- Selecting Skeleton, Standard, or Full Crew sets the crew target and seat list from the reviewed template data.
- Selecting Customize opens a modal seeded from the selected ship and preset. The modal shows every reviewed position available for that ship with a quantity field for each.
- Applying the modal switches the setup line to Custom and uses the edited quantities when adding the fleet line.
- Keep existing fallback behavior when Supabase is not configured or a selected ship has no reviewed templates.

Out of scope for this slice:

- Persisting new fleet events to Supabase from the frontend.
- Editing the locked spreadsheet from inside MusterDeck.
- Building the final visual identity treatment.
- Reworking the full Fleet Command page structure.

## Data Model

Add a read-only view named `ship_staffing_template_summary`.

Each row should include:

- Ship id, slug, and name.
- Staffing profile key and display name.
- Role type and label.
- Required flag.
- Minimum and maximum count.
- FPS transition flag.
- Sort order.
- Source and review status.

The view should only expose reviewed templates. The local database load already imports the locked spreadsheet as reviewed manual templates.

## Frontend Behavior

Fleet Setup keeps the current Specific Ship / Ship Type split.

For Specific Ship:

- The ship dropdown comes from the live catalog when available.
- Preset profile buttons read the selected ship's reviewed templates.
- If a preset has templates, crew target equals the sum of its quantities.
- If a preset is missing, fallback category inference remains available.
- The Customize button opens all reviewed positions known for the selected ship. Quantities come from the active preset where possible and default to `0` when that role is not part of the active preset.

For Ship Type:

- Existing category-based fallback positions remain unchanged for now.
- Customize still works with the category fallback list.

## Copy

Use plain operational labels:

- `Customize`
- `Preset from reviewed ship positions`
- `No reviewed template found; using category fallback`
- `Apply Positions`

Avoid claims that the data is official or guaranteed.

## Testing

Add unit tests for the mapping logic:

- Reviewed rows produce profile-specific positions.
- Customization includes all reviewed roles for the ship and uses `0` for roles missing from the selected preset.
- Missing reviewed templates fall back to the existing inferred positions.

Keep database smoke tests passing so the read model is covered by the Supabase reset path.
