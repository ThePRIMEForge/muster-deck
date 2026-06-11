import assert from 'node:assert/strict';
import test from 'node:test';

import {
  canAccessPage,
  canChangeRanks,
  canEndDeployment,
  canManageFleetSetup,
  canManageOperation,
  canManageTeam,
  defaultPageForRole,
  isSiteAdminOrAbove,
  isModeratorOrAbove,
} from '../../src/lib/permissions.ts';

test('fleet admiral is the only role that can see and manage fleet setup', () => {
  assert.equal(canAccessPage('fleet_admiral', 'setup'), true);
  assert.equal(canAccessPage('fleet_officer', 'setup'), false);
  assert.equal(canAccessPage('team_officer', 'setup'), false);
  assert.equal(canAccessPage('crew', 'setup'), false);
  assert.equal(canManageFleetSetup('fleet_admiral'), true);
  assert.equal(canManageFleetSetup('fleet_officer'), false);
  assert.equal(canManageFleetSetup('team_officer'), false);
});

test('admiral, fleet officers, and team officers can all reach the operation view', () => {
  assert.equal(canAccessPage('fleet_admiral', 'operation'), true);
  assert.equal(canAccessPage('fleet_officer', 'operation'), true);
  assert.equal(canAccessPage('team_officer', 'operation'), true);
  assert.equal(canAccessPage('crew', 'operation'), false);
});

test('only admiral and fleet officers manage the live roster fleet-wide', () => {
  assert.equal(canManageOperation('fleet_admiral'), true);
  assert.equal(canManageOperation('fleet_officer'), true);
  assert.equal(canManageOperation('team_officer'), false);
  assert.equal(canManageOperation('crew'), false);
});

test('team officers manage only their own team; admiral and fleet officers manage any', () => {
  // Admiral and Fleet Officer reach every team regardless of their own team.
  assert.equal(canManageTeam('fleet_admiral', null, 'Alpha'), true);
  assert.equal(canManageTeam('fleet_officer', 'Bravo', 'Alpha'), true);
  // Team Officer governs exactly their own team.
  assert.equal(canManageTeam('team_officer', 'Alpha', 'Alpha'), true);
  assert.equal(canManageTeam('team_officer', 'Alpha', 'Bravo'), false);
  assert.equal(canManageTeam('team_officer', null, 'Alpha'), false);
  // Crew manage no team.
  assert.equal(canManageTeam('crew', 'Alpha', 'Alpha'), false);
});

test('only the admiral can change ranks and end the deployment', () => {
  assert.equal(canChangeRanks('fleet_admiral'), true);
  assert.equal(canChangeRanks('fleet_officer'), false);
  assert.equal(canChangeRanks('team_officer'), false);
  assert.equal(canChangeRanks('crew'), false);

  assert.equal(canEndDeployment('fleet_admiral'), true);
  assert.equal(canEndDeployment('fleet_officer'), false);
  assert.equal(canEndDeployment('team_officer'), false);
  assert.equal(canEndDeployment('crew'), false);
});

test('role changes resolve to the first allowed view', () => {
  assert.equal(defaultPageForRole('fleet_admiral'), 'setup');
  assert.equal(defaultPageForRole('fleet_officer'), 'operation');
  assert.equal(defaultPageForRole('team_officer'), 'operation');
  assert.equal(defaultPageForRole('crew'), 'crew');
});

test('isSiteAdminOrAbove: only admin and super_admin pass', () => {
  assert.equal(isSiteAdminOrAbove('super_admin'), true);
  assert.equal(isSiteAdminOrAbove('admin'), true);
  assert.equal(isSiteAdminOrAbove('moderator'), false);
  assert.equal(isSiteAdminOrAbove('registered_user'), false);
});

test('isModeratorOrAbove: moderator admin and super_admin pass', () => {
  assert.equal(isModeratorOrAbove('super_admin'), true);
  assert.equal(isModeratorOrAbove('admin'), true);
  assert.equal(isModeratorOrAbove('moderator'), true);
  assert.equal(isModeratorOrAbove('registered_user'), false);
});
