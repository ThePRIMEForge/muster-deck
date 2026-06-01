import assert from 'node:assert/strict';
import test from 'node:test';

import {
  canAccessPage,
  canManageFleetSetup,
  canManageOperation,
  defaultPageForRole,
} from '../../src/lib/permissions.ts';

test('fleet admiral is the only role that can see and manage fleet setup', () => {
  assert.equal(canAccessPage('fleet_admiral', 'setup'), true);
  assert.equal(canAccessPage('officer', 'setup'), false);
  assert.equal(canAccessPage('crew', 'setup'), false);
  assert.equal(canManageFleetSetup('fleet_admiral'), true);
  assert.equal(canManageFleetSetup('officer'), false);
});

test('officers can operate the live roster but ordinary crew cannot', () => {
  assert.equal(canAccessPage('fleet_admiral', 'operation'), true);
  assert.equal(canAccessPage('officer', 'operation'), true);
  assert.equal(canAccessPage('crew', 'operation'), false);
  assert.equal(canManageOperation('officer'), true);
  assert.equal(canManageOperation('crew'), false);
});

test('role changes resolve to the first allowed view', () => {
  assert.equal(defaultPageForRole('fleet_admiral'), 'setup');
  assert.equal(defaultPageForRole('officer'), 'operation');
  assert.equal(defaultPageForRole('crew'), 'crew');
});
