# MusterDeck Icon Inventory

Date: 2026-05-20

## Purpose

Plan the icon system for MusterDeck before generating or drawing icon assets. The app will need many icons across Rally Point, Fleet Command, S.P.O.I.L.S., authentication, admin tools, notifications, and Star Citizen activity/role categories.

## Icon System Rules

- Functional icons should be vector-first so they remain sharp at small sizes.
- Raster/generated imagery should be used for icon plates, stamped backgrounds, worn frames, and decorative badges, not for the core symbol unless the symbol needs custom artwork.
- Avoid baking labels into icons. Text stays live in the UI.
- Icons should have a consistent visual grammar: simple outline or outline-plus-fill, strong central shape, controlled internal detail, readable at 16-24 px.
- Use the rugged MusterDeck treatment through color, plate shape, scuffed frame, and hover/active states.
- Do not copy official Star Citizen, manufacturer, faction, military, or real-world insignia marks.
- Prefer one base icon with state badges where possible instead of unique icons for every state.
- Stencil cuts should be intentional bridge gaps, not random missing chunks.
- Filled silhouettes are allowed only when the object still reads instantly. If a filled silhouette becomes ambiguous, switch to outline-first.

## Recommended Icon Types

- Functional UI icons: SVG/vector.
- Role and activity icons: custom vector or lucide-derived vector where possible.
- Component and loot category icons: custom vector, optionally placed on worn category plates.
- Decorative icon plates: generated/raster assets.
- Status/seal backgrounds: generated/raster assets with live text or vector status marks layered on top.

## V1 Proof Feedback

The first proof sheet established a useful rugged plate direction, but the icon symbols themselves were not strong enough.

Problems to fix:

- Many icons were too filled-in and lost their identity.
- Mining did not read as a pickaxe.
- Salvage did not read as a salvage/repair tool; it should be closer to a wrench or cutter.
- Several role icons were too abstract and looked interchangeable.
- The stencil effect was present, but not tied to believable object shapes.
- Small-size checks helped, but the full-size symbols need better object recognition first.

V2 direction:

- Shift from filled stencil blobs to outline-first stencil symbols.
- Use thicker outline strokes, internal negative space, and limited fill.
- Make game-loop icons literal tools or objects first, then stylize them.
- Make role icons use clearer role metaphors: rank, helmet, ship silhouette, turret, medical mark, command badge.
- Keep the worn colored plates, but judge symbols independently on plain backgrounds too.
- Use 128 x 128 as the drawing box, but verify at 16, 24, 32, 64, and 128 px.

Pass/fail test:

- At 24 px, a user should be able to identify the icon category without reading the label.
- At 16 px, the icon should still communicate broad category, even if fine detail is lost.
- At 128 px, the icon should look deliberate and not like a placeholder shape.
- If an icon fails at 24 px, simplify the metaphor instead of adding more details.

## Priority Tiers

### Tier 1: App Shell And Primary Workflows

These are needed early for navigation and mockups.

- MusterDeck hub.
- Rally Point.
- Fleet Command.
- S.P.O.I.L.S.
- Admin portal.
- User account.
- Settings.
- Notifications.
- Search.
- Filter.
- Calendar.
- Create/new.
- Edit.
- Duplicate/template.
- Archive.
- Delete.
- More/options.
- Back.
- Open/details.
- Close.
- Expand/collapse.
- Drag/reorder.
- Save.
- Export.
- Import.
- Share/link.
- Help/about.

### Tier 2: Action And Decision Icons

These are shared across all three pillars.

- Check mark.
- X/close.
- Accept.
- Deny.
- Approve.
- Reject.
- Confirm.
- Cancel.
- Pending.
- Warning.
- Error.
- Info.
- Lock.
- Unlock.
- Finalize.
- Reopen.
- Pin.
- Unpin.
- Flag/report.
- Note/comment.
- Message.
- Broadcast.
- Direct notification.
- Acknowledge.
- Request change.
- Manual override.
- Up/increase.
- Down/decrease.
- Plus/add.
- Minus/remove.
- Percentage.
- Fixed amount.
- Split/equal share.
- Weighted share.

## Rally Point Icons

### Listing And Discovery

- Rally / rally marker.
- Beacon/broadcast listing.
- Create listing.
- Join/apply.
- Applicant queue.
- My activity.
- Active listing.
- Draft listing.
- Closed listing.
- Public listing.
- Unlisted link.
- Private/org-only listing.
- Guest allowed.
- Verification required.
- Discord required.
- RSI required.
- Manual approval required.
- Start soon.
- Starting later.
- Expired.
- Time window.
- Party size.
- Looking for pilot.
- Looking for crew.
- Looking for ship.
- Looking for role.
- Voice/comms required.
- Region/server.
- Language.
- Reputation grind.
- Risk level.
- Reward/payout model.

### Game Loop / Activity Icons

From Crew Terminal references and MusterDeck scope:

- Mining.
- Bounty hunting.
- Exploration.
- Logistics.
- Security escort.
- Salvage.
- Mercenary.
- Piracy.
- Cargo hauling.
- Combat patrol.
- Combat scavenging.
- Medical/rescue.
- Repair/refuel/rearm.
- Racing.
- Transport.
- Trading.
- Smuggling/contraband.
- Data running.
- Recon/scouting.
- Ground/FPS operation.
- Multi-discipline operation.
- Reputation grind.
- General/freeform operation.

### Location And Environment

- Star system.
- Stanton.
- Pyro.
- Nyx.
- Planet.
- Moon.
- Station.
- Landing zone.
- Outpost.
- Asteroid field.
- Jump point.
- Quantum route.
- Rally point marker.
- Extraction point.
- Objective marker.

## Fleet Command Icons

### Command Structure

- Fleet commander / admiral.
- Fleet officer.
- Ship captain.
- Team lead.
- Marine lead.
- Quartermaster, when Fleet Command links to S.P.O.I.L.S.
- Operations planner.
- Dispatcher/assignment officer.
- Logistics officer.
- Comms officer.
- Medical officer.
- Security lead.

### Requested Crew Positions

Use these for ship staffing, role signup, roster views, and assignment changes.

- Commander.
- Pilot.
- Fighter pilot.
- Capital pilot.
- Copilot.
- Navigator.
- Scanner operator.
- Radar operator.
- Chief engineer.
- Engineering assistant.
- Power engineer.
- Shield operator.
- Damage control.
- Primary turret gunner.
- Turret gunner.
- Remote turret gunner.
- Missile operator.
- Torpedo operator.
- Tractor beam operator.
- Mining operator.
- Salvage operator.
- Cargo logistics.
- Hangar operations.
- Doctor / infirmary.
- Combat medic.
- Marine lead.
- Marine rifleman.
- Marine medic.
- Breacher.
- Heavy weapons marine.
- Boarding/security specialist.
- Ground vehicle operator.
- Dropship pilot.
- Repair/refuel/rearm operator.

### Fleet And Ship Organization

- Fleet.
- Squadron.
- Wing.
- Fireteam.
- Ship.
- Ship class/category.
- Capital ship.
- Sub-capital ship.
- Fighter.
- Bomber.
- Support ship.
- Cargo ship.
- Medical ship.
- Mining ship.
- Salvage ship.
- Exploration ship.
- Dropship/troop transport.
- Ground vehicle.
- Ship offered.
- Ship accepted.
- Ship rejected.
- Ship locked.
- Ship roster lock.
- Crew slot.
- Filled crew slot.
- Open crew slot.
- Overstaffed.
- Understaffed.
- Full crew.
- Minimum crew.
- Lean crew.
- Assign/reassign.
- Move team.
- Move ship.
- Formation.
- Objective phase.
- Briefing.
- Orders.
- Checklist.
- Status change.

### Notifications And Live Operations

- Broadcast to event.
- Broadcast to team.
- Broadcast to ship.
- Direct assignment notice.
- Phase start.
- Phase complete.
- Regroup.
- Hold position.
- Deploy.
- Extract.
- Emergency.
- Stand down.
- Ready check.
- Acknowledged.
- Request assistance.

## Ship Component And Equipment Icons

### Ship Systems

- Power plant.
- Cooler.
- Shield generator.
- Quantum drive.
- Jump drive.
- Fuel intake.
- Fuel tank.
- Radar.
- Scanner.
- Computer.
- Avionics.
- Life support.
- Thruster.
- Main engine.
- Maneuvering thruster.
- Power relay.
- Component slot.
- Damaged component.
- Military component.
- Industrial component.
- Stealth component.
- Competition component.
- Civilian component.

### Ship Weapons And Hardpoints

- Ship weapon.
- Laser repeater.
- Laser cannon.
- Ballistic repeater.
- Ballistic cannon.
- Distortion weapon.
- Neutron weapon.
- Missile.
- Torpedo.
- Bomb.
- Turret.
- Remote turret.
- Fixed hardpoint.
- Gimbal.
- Weapon rack.
- Ammo/magazine.
- Countermeasure.

### Utility Systems

- Mining laser.
- Mining module.
- Mining consumable.
- Salvage head.
- Tractor beam.
- Cargo grid.
- Cargo crate.
- Refinery/output.
- Medical bed.
- Repair tool.
- Refuel.
- Rearm.
- Hangar bay.
- Docking collar.
- Vehicle bay.

## S.P.O.I.L.S. Icons

### Module And Roles

- S.P.O.I.L.S.
- Quartermaster.
- Settlement.
- Payouts.
- Operations.
- Inventory.
- Loot.
- Shares.
- Ledger.
- Settlement report.
- Export ledger.
- Audit trail.

### Item Categories

- Ship component.
- Ship weapon.
- FPS weapon, later version.
- FPS armor, later version.
- FPS gear, later version.
- Mining output.
- Salvage output.
- Cargo.
- Contraband.
- Rare/special item.
- Apex Valakar pearl.
- Apex Valakar tooth.
- Yormondi item.
- Wicklow favor.
- Executive hangar reward.
- Commodity crate.
- Unknown/unclassified item.
- Sale proceeds.
- aUEC / credits.
- Org bank.

### Inventory And Claims

- Add item.
- Submit item.
- Approve submitted item.
- Reject submitted item.
- Item requested.
- Item reserved.
- Item claimed.
- Item sold.
- Item locked.
- Item disputed.
- Item note.
- Item source/contributor.
- Quantity.
- Estimated value.
- Manual price.
- Market price.
- Sale pending.
- Sale complete.

### Payout And Share Controls

- Equal split.
- Percentage split.
- Weighted split.
- Role weighting.
- Contribution weighting.
- Ship-owner bonus.
- Officer override.
- Org-bank cut.
- Participant share.
- Increase share.
- Decrease share.
- Fixed amount adjustment.
- Payout pending.
- Payout complete.
- Settlement locked.
- Settlement reopened.
- Finalize settlement.

## Account, Trust, And Admin Icons

### Account And Identity

- Email account.
- Password.
- Discord linked.
- Google linked.
- RSI handle.
- RSI verified.
- RSI verification pending.
- RSI verification failed.
- Linked identity.
- Guest account.
- Verified user.
- Unverified user.
- Profile/bio.
- Avatar.

### Permissions And Moderation

- Admin.
- Owner.
- Officer.
- Member.
- Guest.
- Role/permission group.
- Restricted.
- Banned.
- Unban/restore.
- Trust level.
- Suspicious/espionage risk marker.
- Audit log.
- Moderation note.
- User report.
- User status.
- User search.
- User filter.

## Version And Data Icons

- Rally Point version.
- Fleet Command version.
- S.P.O.I.L.S. version.
- Star Citizen patch/data version.
- Data current.
- Data stale.
- Syncing.
- Sync failed.
- Catalog.
- Ship catalog.
- Loot catalog.
- Pricing catalog.

## Icon Plate Variants

The icon symbol should usually stay vector. These plates provide the MusterDeck personality.

- Mustard square icon plate.
- Olive square icon plate.
- Graphite square icon plate.
- Caution square icon plate.
- Round indicator plate.
- Rank/role badge plate.
- S.P.O.I.L.S. ledger category plate.
- Rally Point listing category plate.
- Fleet Command roster role plate.
- Admin warning plate.
- Verified/locked seal plate.

## First Icon Proof Batch Proposal

Start with a compact proof set that exercises the major icon styles:

- Rally Point.
- Fleet Command.
- S.P.O.I.L.S.
- Mining.
- Salvage.
- Bounty hunting.
- Logistics.
- Security escort.
- Fleet commander/admiral.
- Fleet officer.
- Marine lead.
- Marine medic.
- Marine rifleman.
- Fighter pilot.
- Capital pilot.
- Quartermaster.
- Ship component.
- Ship weapon.
- Shield generator.
- Engine/thruster.
- Power plant.
- Cargo crate.
- Rare item.
- aUEC / credits.
- Check/accept.
- X/deny.
- Lock/finalize.
- Broadcast notification.

## V2 Proof Batch Visual Brief

The next proof batch should redraw the first 21 icons with clearer visual metaphors.

| Icon | V2 Visual Metaphor | Must Read As | Avoid |
| --- | --- | --- | --- |
| Mining | Outline pickaxe with long handle, pointed pick head, and optional small rock chip | Pickaxe / mining tool | Lightning bolt, hammer, vague diagonal marks |
| Salvage | Open-ended wrench crossed with a small cutter/spark or broken panel edge | Wrench / repair/salvage | Generic crate, random broken hull block |
| Bounty | Crosshair over a shield or target ticket | Target / bounty | Plain shield with no target language |
| Logistics | Cargo crate with route arrow or stacking mark | Cargo / logistics | Plain cube that looks like inventory only |
| Fleet commander/admiral | Command star above chevrons or command badge with central star | Senior command | Generic star only |
| Fleet officer | Chevrons inside shield or shoulder-board style rank badge | Officer / leadership | Same shape as admiral without hierarchy |
| Marine lead | Helmet or shield with squad chevrons and small command bar | Marine squad lead | Generic shield blob |
| Medic | Medical cross with stencil bridge gaps plus small field kit outline | Medic / medical role | Cross so broken it reads as plus button only |
| Marine rifleman | Rifle outline at angle with simple stock/barrel silhouette | Rifleman / infantry | Ambiguous diagonal pipe |
| Fighter pilot | Small agile spacecraft outline with swept wings/cockpit | Fighter pilot | Generic arrowhead |
| Capital pilot | Large ship bridge/helm silhouette or broad capital hull icon | Capital ship pilot | Small fighter-like silhouette |
| Turret | Turret ring/dome with clear barrel or remote-gun mount | Turret gunner | Chess pawn / microphone shape |
| Quartermaster | Crate plus key, clipboard, or inventory stamp mark | Quartermaster / inventory authority | Plain crate only |
| Ledger | Open ledger book with ruled lines and a check column | Ledger / record | Solid rounded rectangle |
| Credits | Coin stack or credit chip with central currency notch | Money / credits | Plain circle only |
| Check | Strong angular check mark with stencil break | Check / complete | Too many cuts that weaken the mark |
| X | Strong angular X with stencil break | X / close / fail | Overlapping bars that become a blob |
| Accept | Check inside badge or stamp frame | Accepted / approved | Same as plain check with no approval context |
| Deny | X inside badge or stamp frame | Denied / rejected | Same as plain X with no denial context |
| Lock | Outline padlock with shackle and keyhole cutout | Locked / finalized | Solid bag shape |
| Broadcast | Speaker/megaphone with wave lines | Broadcast / notification | Abstract radar arcs without speaker source |

## V2 Drawing Rules

- Draw in a 128 x 128 viewBox.
- Use an outline-first style with thick strokes between 7 and 10 px.
- Use square/mitered joins where possible for industrial character.
- Use filled accents only when they clarify the object.
- Use negative-space stencil bridges in one or two places, not everywhere.
- Keep all important shapes inside a 104 x 104 safe area so plates do not crowd them.
- Test each icon on plain background, mustard plate, olive plate, graphite plate, and caution plate.
- Compare at 16, 24, 32, 64, and 128 px before accepting.
- If an icon depends on the label to be understood, redraw it.

## Open Questions

1. Should role icons look like military stencil silhouettes, shoulder patches, or simple tactical map symbols?
2. Should game-loop icons be literal tools/objects, or abstract mission-category symbols?
3. Should S.P.O.I.L.S. item-category icons use the same style as Fleet Command icons, or use a more ledger/inventory stamp style?
4. Should the first icon proof batch be monochrome vector only, or vector icons shown on rugged colored plates?
