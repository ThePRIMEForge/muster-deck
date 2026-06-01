import test from 'node:test';
import assert from 'node:assert/strict';

import { deriveTemplatesForVehicle } from './derive.mjs';

function rolesFor(profileKey, vehicle) {
  return deriveTemplatesForVehicle(vehicle)
    .filter((template) => template.staffingProfileKey === profileKey)
    .map((template) => ({
      roleType: template.roleType,
      label: template.label,
      required: template.required,
      minCount: template.minCount,
      maxCount: template.maxCount,
      canTransitionToFps: template.canTransitionToFps,
    }));
}

test('creates pilot-only templates for a single-seat fighter', () => {
  const vehicle = {
    name: 'Arrow',
    slug: 'anvl-arrow',
    role: 'Light Fighter',
    size: { en_EN: 'small' },
    crew: { min: 1, max: 1 },
    turrets: { manned: [], remote: [], pdc: [] },
  };

  assert.deepEqual(rolesFor('skeleton', vehicle), [
    {
      roleType: 'pilot',
      label: 'Pilot',
      required: true,
      minCount: 1,
      maxCount: 1,
      canTransitionToFps: false,
    },
  ]);

  assert.equal(rolesFor('full_crew', vehicle).some((role) => role.roleType === 'engineer'), false);
});

test('adds a required remote turret gunner for two-seat heavy fighters', () => {
  const vehicle = {
    name: 'Scorpius',
    slug: 'rsi-scorpius',
    role: 'Heavy Fighter',
    size: { en_EN: 'small' },
    crew: { min: 1, max: 2 },
    turrets: {
      manned: [],
      remote: [{ display_name: 'Remote Turret', weapons: [{ name: 'CF-337 Panther' }] }],
      pdc: [],
    },
  };

  assert.deepEqual(rolesFor('standard', vehicle), [
    {
      roleType: 'pilot',
      label: 'Pilot',
      required: true,
      minCount: 1,
      maxCount: 1,
      canTransitionToFps: false,
    },
    {
      roleType: 'remote_turret_gunner',
      label: 'Remote Turret Gunner',
      required: true,
      minCount: 1,
      maxCount: 1,
      canTransitionToFps: false,
    },
  ]);
});

test('keeps Perseus standard lean and full crew broader', () => {
  const vehicle = {
    name: 'Perseus',
    slug: 'rsi-perseus',
    role: 'Heavy Gunship',
    size: { en_EN: 'large' },
    crew: { min: 6, max: 6 },
    turrets: {
      manned: [{ display_name: 'Top Turret' }, { display_name: 'Bottom Turret' }],
      remote: [{ display_name: 'Remote Turret', weapons: [{ name: 'Remote repeater' }] }],
      pdc: [{ display_name: 'PDT 1' }, { display_name: 'PDT 2' }],
    },
  };

  assert.deepEqual(rolesFor('standard', vehicle), [
    {
      roleType: 'pilot',
      label: 'Pilot',
      required: true,
      minCount: 1,
      maxCount: 1,
      canTransitionToFps: false,
    },
    {
      roleType: 'turret_gunner',
      label: 'Turret Gunner',
      required: true,
      minCount: 2,
      maxCount: 2,
      canTransitionToFps: false,
    },
    {
      roleType: 'remote_turret_gunner',
      label: 'Remote Turret Gunner',
      required: false,
      minCount: 0,
      maxCount: 1,
      canTransitionToFps: false,
    },
    {
      roleType: 'engineer',
      label: 'Engineer',
      required: false,
      minCount: 0,
      maxCount: 1,
      canTransitionToFps: false,
    },
  ]);

  assert.deepEqual(rolesFor('full_crew', vehicle), [
    {
      roleType: 'pilot',
      label: 'Pilot',
      required: true,
      minCount: 1,
      maxCount: 1,
      canTransitionToFps: false,
    },
    {
      roleType: 'turret_gunner',
      label: 'Turret Gunner',
      required: true,
      minCount: 2,
      maxCount: 2,
      canTransitionToFps: false,
    },
    {
      roleType: 'remote_turret_gunner',
      label: 'Remote Turret Gunner',
      required: true,
      minCount: 1,
      maxCount: 1,
      canTransitionToFps: false,
    },
    {
      roleType: 'engineer',
      label: 'Engineer',
      required: true,
      minCount: 1,
      maxCount: 3,
      canTransitionToFps: false,
    },
    {
      roleType: 'medic',
      label: 'Medic Team',
      required: false,
      minCount: 0,
      maxCount: 3,
      canTransitionToFps: true,
    },
    {
      roleType: 'marine',
      label: 'Marine Team',
      required: false,
      minCount: 0,
      maxCount: 8,
      canTransitionToFps: true,
    },
  ]);
});
