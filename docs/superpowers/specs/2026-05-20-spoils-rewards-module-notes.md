# Spoils And Rewards Module Notes

Date: 2026-05-20

## Project Context

Workspace at the time of this discussion:

`/Users/christophmayer/Library/CloudStorage/OneDrive-Personal/CIG Fleet App`

The project is expected to move from OneDrive to Google Drive so development can continue across multiple computers.

Existing app context reviewed:

- Vite/React frontend.
- Supabase backend.
- Existing fleet-planning schema includes fleet events, members, assignments, ship catalog tables, ship request helpers, read models, roster locks, and ship suggestions.
- Prior docs exist for backend data modeling, Crew Terminal research, and ship sync notes.

No implementation was completed in this thread. This was requirements and design discovery only.

## Module Goal

Create an independent Spoils / Rewards / Mission Loot tracker for Star Citizen organization operations.

The module should track scavenged rewards, contributed items, sale proceeds, reward requests, leadership approvals, payout splits, and historical rewards. It should cover loot and value that are not automatically handled by in-game mission completion rewards.

## Core Product Decision

The rewards module should work independently from the Fleet Manager, but it should optionally attach to a Fleet Manager event.

When attached to an event, the module can pull signed-up crew from that event. When used standalone, leadership or the list owner can add participants manually or import them later.

## List Ownership

A spoils list is created by whoever wants to organize it. Ideally, for planned events, this is the Fleet Admiral or event leader.

The creator/list owner controls what gets officially added to the list.

## Crew Contributions

Crew members may submit proposed additions, but they should not directly alter the official spoils list.

Crew submissions should go into an approval inbox or message queue for the list owner or leadership.

Crew should be able to submit:

- Items they found.
- Items they want to contribute to the shared list.
- Sale reports.
- aUEC proceeds from mining, salvage, cargo, contraband, or other activities.
- Individual ship or crew sale totals that should be pooled and split later.

## Supported Use Cases

The module should support:

- Combat scavenging.
- Executive hangar and Wicklow-style ship rewards.
- Contraband and cargo sales.
- Mining operations.
- Salvage operations.
- Multiple ships or crew selling separately and reporting totals back.
- Pooling proceeds and splitting them evenly or according to leadership rules.

## Initial Item Scope

Initial scope includes:

- Ship components.
- Ship weapons.
- aUEC / currency proceeds.
- Rare items, including Apex Valakar Pearls and Apex Valakar Teeth.
- Yormondi-related drops/items.
- Mining and salvage sale totals.

Out of scope for the first version:

- FPS weapons.
- FPS armor.
- FPS gear.
- Full general inventory tracking.

Those categories can be added in a later patch.

## UI Direction

The spoils list should not be one giant inventory table.

The UI should be divided into clear sections by item type, with dedicated add flows such as:

- Add Ship Component.
- Add Ship Weapon.
- Add Rare Item.
- Add Sale Proceeds / aUEC.
- Later additions may include Add Cargo, Add Contraband, Add Salvage, and Add Mining Output.

Each add flow should support:

- Searching/selecting the item.
- Quantity.
- Estimated value.
- Notes.
- Contributor/source.
- Approval status when submitted by crew.

## Pricing And Valuation

The module needs pricing support for items that may not have normal shop prices, including military components, stealth components, rare items, special rewards, and other loot that cannot normally be bought.

Pricing may include:

- Current known market or vendor pricing where available.
- Subjective/manual pricing where items cannot normally be purchased.
- Leadership-maintained estimates.

Open decision: whether pricing should use a shared leadership-maintained price catalog, per-list editable prices, or both.

Likely recommended direction: both.

- Shared catalog for default pricing and item metadata.
- Per-list price override for special circumstances, subjective valuation, or one-off leadership decisions.

## Reward Requests

Crew who participated should be able to request specific components or items from the spoils list.

The system should track:

- Who requested what.
- Who has received rewards in the past.
- Who has received aUEC payouts in the past.
- Leadership approval decisions.
- Approved/denied state, likely with an approval column or checkmark.

## Payout Splits

The module should calculate money splits from sold loot.

It needs:

- Total sale proceeds.
- Org-bank percentage withheld.
- Remaining distributable pool.
- Crew payout share.
- Historical record of who received how much.

## Leadership Decision Support

The Fleet Admiral or list owner should be able to decide who receives:

- aUEC payouts.
- Ship components.
- Ship weapons.
- Rare items.
- Other special loot.

Past reward history should help leadership make fair allocation decisions.

## Integration Points

Likely integration points with the existing Fleet Manager app:

- `fleet_events` for optional event attachment.
- `members` for event-signed crew.
- `assignments` for ship/team/role participation context.
- Future authenticated profiles for cross-event reward history.
- Ship catalog and source systems for ship-related item metadata and pricing references.

## Recommended Next Step

Continue design discovery with the unresolved pricing question:

Should the spoils module use a shared leadership-maintained price catalog, per-list editable prices, or both?

