# StarCitizen Fleet Manager Backend Data Model Design

Date: 2026-05-19

## Goal

Build the backend foundation for a Star Citizen fleet planning app that can sync ship data from public sources, preserve human-reviewed fleet doctrine, and support shared signup links where members provide ships or fill positions.

The first backend release focuses on ship catalog data, ship categories, staffing profiles, position templates, fleet event requests, and signups. Mission phase tabs are intentionally out of scope for the first release, but the schema must allow them later without reworking ship, team, or assignment records.

## Source Strategy

Star Citizen Wiki API is the primary source because it is currently aligned with patch `4.8.0-LIVE.11825000`. It should provide canonical ship identity and core vehicle data such as UUID, name, manufacturer, ship size, career, role, crew range, cargo, medical tier, ship flag, ground vehicle flag, and related metrics.

UEX is a secondary enrichment source. It can help identify operational tags such as carrier, hangar, medical, refuel, repair, salvage, stealth, scanning, bomber, and pad type. Because UEX is behind the current patch, UEX fields must not automatically override newer Wiki data. UEX values may suggest subcategories and review notes.

Each sync stores raw source snapshots before normalization. This gives us an audit trail and lets us detect source changes over time.

Ship and vehicle images should be stored as catalog media records rather than a single field on the ship. Star Citizen Wiki already includes image metadata in vehicle responses. Other sources, including CCU Game and similar fleet/store catalog sites, can be added as media enrichment sources if their URLs are stable and allowed to be used. Media sync should preserve source attribution and should not hotlink from sources that prohibit it.

## Core Principle

API data describes what a ship is. The app's doctrine templates describe how the fleet wants to crew it.

Position requirements should never be blindly overwritten by an API sync. API data can suggest possible roles, but the app keeps human-reviewed Skeleton, Standard, Full Crew, and Custom position templates as the source of truth for fleet planning.

## Ship Catalog

Each ship has one primary category. Primary categories are size/class oriented so the app works for combat and non-combat planning:

- Capital
- Subcapital
- Large
- Medium
- Small
- Light Fighter
- Medium Fighter
- Heavy Fighter
- Snub Fighter
- Ground Vehicle

Each ship may have multiple subcategories. Subcategories describe mission utility, combat purpose, logistics role, or support function:

- Repair
- Rearm
- Refuel
- Anti-fighter
- Anti-capital
- Stealth
- Bomber
- Torpedo
- Scanning
- Carrier
- Troop transport
- Cargo transport
- Reclamation
- Ground vehicle transport
- Medical
- Mining
- Salvage
- Interdiction
- EMP / QED
- Exploration
- Data runner

Subcategories can be inferred from Wiki and UEX, but users with admin permissions can override them. Overrides should record who changed them and when.

## Staffing Profiles

Staffing profiles apply to ships only:

- Skeleton: minimum required ship crew, shown with a red circle.
- Standard: recommended normal crew, shown with a yellow circle.
- Full Crew: all intended ship positions filled, shown with a green circle.
- Custom: event planner chooses the exact required and optional positions from a checklist.

If Marines are aboard a ship, show a white chevron above that ship's staffing indicator.

If the Fleet Admiral or fleet commander is aboard a ship, show a gold star around that ship's staffing indicator with a subtle shimmer.

Single-seat fighters default to pilot only. Fighters with turrets add turret gunner positions. Medium, large, and capital ships can add engineers. Full Crew for medium, large, and capital ships can include up to three engineers. Medium-large subcapital and capital ships can optionally include one to three medics and one to eight Marines.

## Position Model

Position templates support these initial role types:

- Pilot
- Ship captain
- Fleet commander / Admiral
- Turret gunner
- Remote turret gunner
- Engineer
- Medic
- Marine
- Scanner operator
- Cargo / logistics operator
- Repair / refuel / rearm operator
- Boarding crew

Each position has:

- A role type.
- A display label.
- A required or optional setting.
- A minimum count.
- A maximum count when relevant.
- A sort order.
- A flag for whether the position can transition to FPS or ground work later.

Custom staffing for a fleet event copies the ship's template into the event and then lets the planner check or uncheck positions. Changing global templates later does not mutate an event that has already been created.

## Teams And Embarked Groups

The first release should support teams such as Alpha, Beta, Charlie, Delta, Echo, Foxtrot, Golf, and Hotel.

People can have both a shipboard assignment and a team assignment. A Marine or Medic can be assigned to a ship position and also belong to a deployable team.

Teams may be embarked on a ship. For example:

- Idris is assigned as Team Alpha's command ship.
- Fleet Admiral is assigned to an Idris command role.
- Six members fill Idris turret roles.
- One member fills Idris engineer.
- Team Gamma, containing six Marines and two Medics, is embarked aboard the Idris.

This gives the behavior of nested teams without making team ownership too rigid.

## Ship Roster Requests And Locks

The Fleet Admiral can build the fleet from exact ships, category counts, or a mixture of both.

Examples:

- Request `4` Heavy Fighters and let members choose which heavy fighters they can bring.
- Request `1` Perseus and require that exact ship.
- Request `2` Capital ships, plus `1` specific Idris, plus `6` Medium Fighters.

Each requested fleet row can either point at a specific ship or at a primary category. When a requested row points at a specific ship and `is_exact_ship_required` is true, members should fill that roster row rather than substituting another ship.

Ship roster locking has three layers:

- Master event lock: locks the full ship roster. No substitutions or ship suggestions can be submitted while it is active.
- Team lock: locks substitutions and ship suggestions for that team only.
- Request policy: controls whether a specific ship/category request accepts alternatives.

The UI should expose a lock/unlock icon in the fleet header, each team header, and each team row/list section. There should also be an `Unlock All` control that clears the master lock and all team locks for the event.

Ship roster locks only affect which ships are being taken. They prevent ship suggestions and substitutions. They do not lock crews or people into ships, and they do not prevent crew members from moving between open positions.

## Future Mission Phases

Phase tabs are not part of the first release.

The schema should still reserve space for future mission planning with phases such as:

- Fleet Prep
- Fleet Movement
- Fleet Engagement
- External Strike
- Precision Strike
- Boarding / Ground Operation
- Extraction
- Custom Phase

Boarding and ground operations are treated as the same phase concept because the label depends on mission type. Fleet Engagement may continue in parallel while Marines, Medics, cargo crews, or rescue teams transition into later objectives.

Future phase support should allow a team or ship to be assigned to a phase-specific state such as aboard ship, deployed, extracting, recovered, or continuing fleet defense.

## Database Tables

The initial schema should include these tables.

### source_systems

Stores source metadata for Wiki and UEX.

Fields:

- `id`
- `name`
- `base_url`
- `current_patch`
- `trust_level`
- `last_checked_at`

### source_snapshots

Stores raw API responses by source and sync run.

Fields:

- `id`
- `source_system_id`
- `external_id`
- `external_slug`
- `payload`
- `source_patch`
- `fetched_at`

### ships

Canonical normalized ship records.

Fields:

- `id`
- `wiki_uuid`
- `uex_uuid`
- `name`
- `slug`
- `manufacturer`
- `size_class`
- `career`
- `role`
- `crew_min`
- `crew_max`
- `cargo_scu`
- `medical_tier`
- `is_ship`
- `is_ground_vehicle`
- `primary_category`
- `source_confidence`
- `review_status`
- `last_synced_at`

### ship_subcategories

Allowed subcategory labels.

Fields:

- `id`
- `name`
- `description`
- `sort_order`

### ship_subcategory_assignments

Many-to-many table connecting ships to subcategories.

Fields:

- `ship_id`
- `subcategory_id`
- `source`
- `is_manual_override`
- `created_at`

### ship_media

Stores one or more images for a ship.

Fields:

- `id`
- `ship_id`
- `source_system_id`
- `source`
- `original_url`
- `thumbnail_url`
- `width`
- `height`
- `thumbnail_width`
- `thumbnail_height`
- `is_primary`
- `sort_order`
- `fetched_at`

### ship_source_conflicts

Tracks disagreements or stale-source warnings.

Fields:

- `id`
- `ship_id`
- `field_name`
- `wiki_value`
- `uex_value`
- `status`
- `notes`
- `created_at`
- `resolved_at`

### staffing_profiles

Global staffing profile definitions.

Fields:

- `id`
- `key`
- `name`
- `color`
- `sort_order`

Initial records:

- `skeleton`, red
- `standard`, yellow
- `full_crew`, green
- `custom`, neutral

### ship_position_templates

Position templates for a specific ship and staffing profile.

Fields:

- `id`
- `ship_id`
- `staffing_profile_id`
- `role_type`
- `label`
- `required`
- `min_count`
- `max_count`
- `can_transition_to_fps`
- `sort_order`
- `source`
- `review_status`

### fleet_events

A shared fleet request.

Fields:

- `id`
- `code`
- `name`
- `description`
- `created_by`
- `created_at`
- `status`
- `ship_roster_locked`

### fleet_event_ship_requests

Requested ships or ship categories for an event.

Fields:

- `id`
- `fleet_event_id`
- `ship_id`
- `primary_category`
- `requested_count`
- `team_id`
- `staffing_profile_id`
- `is_exact_ship_required`
- `substitution_policy`
- `notes`

`substitution_policy` starts with:

- `allow_alternatives`: members can suggest alternate ships.
- `exact_only`: members can only bring/fill the requested exact ship.
- `locked`: this row is locked from substitutions regardless of master/team lock state.

### fleet_event_positions

Copied event-level positions from the selected staffing template.

Fields:

- `id`
- `fleet_event_ship_request_id`
- `role_type`
- `label`
- `required`
- `min_count`
- `max_count`
- `can_transition_to_fps`
- `sort_order`

### members

Members who join a fleet request.

Fields:

- `id`
- `fleet_event_id`
- `display_name`
- `discord_id`
- `created_at`
- `last_active_at`

### member_ship_offers

Ships a member can bring.

Fields:

- `id`
- `member_id`
- `ship_id`
- `custom_ship_name`
- `notes`

### fleet_event_ship_suggestions

Member-submitted suggestions for an alternate ship or substitution.

Fields:

- `id`
- `fleet_event_id`
- `fleet_event_ship_request_id`
- `member_id`
- `suggested_ship_id`
- `custom_ship_name`
- `suggestion_type`
- `notes`
- `status`
- `created_at`
- `reviewed_at`

### assignments

Actual member assignments to ships, positions, or teams.

Fields:

- `id`
- `fleet_event_id`
- `member_id`
- `fleet_event_ship_request_id`
- `fleet_event_position_id`
- `team_id`
- `assignment_type`
- `status`
- `created_at`

### teams

Event-level teams.

Fields:

- `id`
- `fleet_event_id`
- `name`
- `sort_order`
- `parent_team_id`
- `embarked_ship_request_id`
- `ship_roster_locked`

The `parent_team_id` exists for future flexibility, but the first release should prefer explicit embarked-team behavior over deeply nested team trees.

### mission_phases

Reserved for later phase-tab support.

Fields:

- `id`
- `fleet_event_id`
- `name`
- `sort_order`
- `phase_type`
- `is_active`

### phase_assignments

Reserved for later phase-tab support.

Fields:

- `id`
- `mission_phase_id`
- `assignment_id`
- `phase_state`
- `notes`

## RLS And Access

All exposed tables must have Row Level Security enabled.

The first release can use invite-code-based access for fleet events while keeping admin tables restricted. Public fleet links can allow members to join and update their own assignments, but only event owners or admins can change ship templates, categories, source sync records, or staffing doctrine.

Service role credentials must never be exposed in the browser. Source sync jobs should run server-side through an Edge Function, backend job, or trusted admin process.

## First Build Boundary

Included in first backend implementation:

- Supabase migration setup.
- Source tables for Wiki and UEX snapshots.
- Canonical ships table.
- Categories and subcategories.
- Staffing profiles.
- Position templates.
- Fleet events.
- Ship requests.
- Event-level copied positions.
- Members, offers, teams, and assignments.
- Reserved phase tables.

Not included in first backend implementation:

- Full UI.
- Realtime presence.
- Advanced mission phase tabs.
- Discord OAuth.
- Automatic role inference beyond safe initial suggestions.
- Fully automated conflict resolution.

## Acceptance Criteria

- The database can store canonical ships synced from Wiki.
- UEX enrichment can be stored without overriding newer Wiki data automatically.
- Each ship can have one primary category and many subcategories.
- Each ship can define Skeleton, Standard, Full Crew, and Custom staffing behavior.
- Fleet events copy selected staffing positions so later template changes do not mutate existing events.
- Members can offer ships or fill positions.
- Teams can be assigned and embarked on ships.
- The schema leaves room for future mission phases without redesigning assignments.
