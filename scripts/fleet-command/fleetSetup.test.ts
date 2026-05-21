import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildCustomizablePositions,
  buildPresetPositions,
  crewTargetForPositions,
  mapPersistedFleetRequests,
  reviewedTemplateSummary,
  type FleetEventPositionRow,
  type FleetEventShipRequestSummaryRow,
  type ShipStaffingTemplateRow,
} from '../../src/lib/fleetSetup.ts';

const scorpiusTemplates: ShipStaffingTemplateRow[] = [
  {
    ship_id: 'ship-scorpius',
    ship_slug: 'rsi-scorpius',
    ship_name: 'Scorpius',
    staffing_profile_key: 'skeleton',
    staffing_profile_name: 'Skeleton',
    role_type: 'pilot',
    label: 'Pilot',
    required: true,
    min_count: 1,
    max_count: 1,
    can_transition_to_fps: false,
    sort_order: 20,
  },
  {
    ship_id: 'ship-scorpius',
    ship_slug: 'rsi-scorpius',
    ship_name: 'Scorpius',
    staffing_profile_key: 'standard',
    staffing_profile_name: 'Standard',
    role_type: 'pilot',
    label: 'Pilot',
    required: true,
    min_count: 1,
    max_count: 1,
    can_transition_to_fps: false,
    sort_order: 20,
  },
  {
    ship_id: 'ship-scorpius',
    ship_slug: 'rsi-scorpius',
    ship_name: 'Scorpius',
    staffing_profile_key: 'standard',
    staffing_profile_name: 'Standard',
    role_type: 'turret_gunner',
    label: 'Turret Gunner',
    required: true,
    min_count: 1,
    max_count: 1,
    can_transition_to_fps: false,
    sort_order: 70,
  },
  {
    ship_id: 'ship-scorpius',
    ship_slug: 'rsi-scorpius',
    ship_name: 'Scorpius',
    staffing_profile_key: 'full_crew',
    staffing_profile_name: 'Full Crew',
    role_type: 'pilot',
    label: 'Pilot',
    required: true,
    min_count: 1,
    max_count: 1,
    can_transition_to_fps: false,
    sort_order: 20,
  },
  {
    ship_id: 'ship-scorpius',
    ship_slug: 'rsi-scorpius',
    ship_name: 'Scorpius',
    staffing_profile_key: 'full_crew',
    staffing_profile_name: 'Full Crew',
    role_type: 'turret_gunner',
    label: 'Turret Gunner',
    required: true,
    min_count: 1,
    max_count: 1,
    can_transition_to_fps: false,
    sort_order: 70,
  },
  {
    ship_id: 'ship-scorpius',
    ship_slug: 'rsi-scorpius',
    ship_name: 'Scorpius',
    staffing_profile_key: 'full_crew',
    staffing_profile_name: 'Full Crew',
    role_type: 'engineering_assistant',
    label: 'Engineering Assistant',
    required: true,
    min_count: 1,
    max_count: 1,
    can_transition_to_fps: false,
    sort_order: 50,
  },
];

test('builds preset positions from reviewed templates', () => {
  assert.deepEqual(buildPresetPositions(scorpiusTemplates, 'standard'), [
    { id: 'pilot', roleType: 'pilot', label: 'Pilot', quantity: 1 },
    { id: 'turret_gunner', roleType: 'turret_gunner', label: 'Turret Gunner', quantity: 1 },
  ]);
});

test('custom positions include every reviewed role and zero missing preset roles', () => {
  assert.deepEqual(buildCustomizablePositions(scorpiusTemplates, 'standard'), [
    { id: 'pilot', roleType: 'pilot', label: 'Pilot', quantity: 1 },
    {
      id: 'engineering_assistant',
      roleType: 'engineering_assistant',
      label: 'Engineering Assistant',
      quantity: 0,
    },
    { id: 'turret_gunner', roleType: 'turret_gunner', label: 'Turret Gunner', quantity: 1 },
  ]);
});

test('falls back when a reviewed preset is missing', () => {
  const fallback = [{ id: 'pilot', roleType: 'pilot', label: 'Pilot', quantity: 1 }];

  assert.deepEqual(buildPresetPositions([], 'standard', fallback), fallback);
  assert.deepEqual(buildCustomizablePositions([], 'standard', fallback), fallback);
});

test('summarizes reviewed template availability by profile', () => {
  assert.deepEqual(reviewedTemplateSummary(scorpiusTemplates), {
    skeleton: 1,
    standard: 2,
    full_crew: 3,
    custom: 0,
  });
});

test('crew target sums position quantities', () => {
  assert.equal(crewTargetForPositions(buildPresetPositions(scorpiusTemplates, 'standard')), 2);
});

test('maps persisted request summaries and positions to fleet setup rows', () => {
  const summaries: FleetEventShipRequestSummaryRow[] = [
    {
      id: 'request-1',
      fleet_event_id: 'event-1',
      fleet_event_code: 'DEMO-DRAFT',
      fleet_event_name: 'Tactical Strike Group',
      ship_id: 'ship-scorpius',
      ship_slug: 'rsi-scorpius',
      ship_name: 'Scorpius',
      primary_category_id: null,
      requested_primary_category_key: null,
      requested_primary_category_name: null,
      resolved_primary_category_key: 'heavy_fighter',
      resolved_primary_category_name: 'Heavy Fighter',
      requested_count: 2,
      team_id: 'team-beta',
      team_name: 'Beta',
      parent_team_id: null,
      staffing_profile_id: 'profile-standard',
      staffing_profile_key: 'standard',
      staffing_profile_name: 'Standard',
      staffing_profile_color: '#eab308',
      is_exact_ship_required: false,
      substitution_policy: 'allow_alternatives',
      effective_ship_roster_locked: false,
      notes: 'two Scorpius fighters',
      required_positions_min: 4,
      required_positions_max: 4,
      optional_positions_min: 0,
      optional_positions_max: 0,
      position_type_count: 2,
      assigned_position_count: 1,
      pending_ship_suggestion_count: 3,
      created_at: '2026-05-21T00:00:00Z',
      updated_at: '2026-05-21T00:00:00Z',
    },
  ];
  const positions: FleetEventPositionRow[] = [
    {
      id: 'position-pilot',
      fleet_event_ship_request_id: 'request-1',
      role_type: 'pilot',
      label: 'Pilot',
      required: true,
      min_count: 2,
      max_count: 2,
      can_transition_to_fps: false,
      sort_order: 20,
    },
    {
      id: 'position-turret',
      fleet_event_ship_request_id: 'request-1',
      role_type: 'turret_gunner',
      label: 'Turret Gunner',
      required: true,
      min_count: 2,
      max_count: 2,
      can_transition_to_fps: false,
      sort_order: 70,
    },
  ];

  assert.deepEqual(mapPersistedFleetRequests(summaries, positions), [
    {
      id: 'request-1',
      team: 'Beta',
      teamKey: 'beta',
      categoryKey: 'heavy_fighter',
      categoryName: 'Heavy Fighter',
      shipName: 'Scorpius',
      manufacturer: 'Any',
      requestedCount: 2,
      staffingProfile: 'standard',
      requiredPositions: 4,
      optionalPositions: 0,
      assignedPositions: 1,
      pendingSuggestions: 3,
      locked: false,
      exactRequired: false,
      hasMarines: false,
      isAdmiralShip: false,
      notes: 'two Scorpius fighters',
      crew: [
        { id: 'position-pilot-0', name: 'Open', role: 'Pilot 1', status: 'requested' },
        { id: 'position-pilot-1', name: 'Open', role: 'Pilot 2', status: 'requested' },
        { id: 'position-turret-0', name: 'Open', role: 'Turret Gunner 1', status: 'requested' },
        { id: 'position-turret-1', name: 'Open', role: 'Turret Gunner 2', status: 'requested' },
      ],
    },
  ]);
});
