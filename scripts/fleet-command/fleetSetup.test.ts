import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildCustomizablePositions,
  buildPresetPositions,
  crewTargetForPositions,
  reviewedTemplateSummary,
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
