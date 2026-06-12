import assert from 'node:assert/strict';
import test from 'node:test';

import {
  demoAdminUsers,
  demoFoundationViewer,
  demoNotifications,
} from '../../src/lib/foundationData.ts';

test('demo viewer can access admin tools for local planning', () => {
  assert.equal(demoFoundationViewer.siteRole, 'super_admin');
  assert.equal(demoFoundationViewer.operationRole, 'fleet_admiral');
});

test('demo notifications include expected foundation categories', () => {
  const categories = new Set(demoNotifications.map((notification) => notification.category));
  assert.equal(categories.has('general'), true);
  assert.equal(categories.has('direct_message'), true);
  assert.equal(categories.has('group_message'), true);
  assert.equal(categories.has('assignment'), true);
  assert.equal(categories.has('application'), true);
  assert.equal(categories.has('settlement'), true);
  assert.equal(categories.has('tournament'), true);
  assert.equal(categories.has('admin'), true);
  assert.equal(categories.has('fleet_command_message'), false);
});

test('demo admin users include at least one restricted state', () => {
  assert.equal(
    demoAdminUsers.some((user) => user.accountStatus === 'restricted'),
    true
  );
});
