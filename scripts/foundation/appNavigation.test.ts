import assert from 'node:assert/strict';
import test from 'node:test';

import {
  appRoutes,
  defaultFoundationRouteForViewer,
  getRouteById,
  visibleFoundationRoutes,
} from '../../src/lib/appNavigation.ts';
import type { FoundationViewer } from '../../src/lib/foundationTypes.ts';

const guest: FoundationViewer = {
  id: 'guest',
  displayName: 'Guest',
  accountState: 'guest',
  operationRole: 'crew',
  siteRole: 'registered_user',
};

const crew: FoundationViewer = {
  id: 'crew-1',
  displayName: 'Deck Crew',
  accountState: 'email_account',
  operationRole: 'crew',
  siteRole: 'registered_user',
};

const admin: FoundationViewer = {
  id: 'admin-1',
  displayName: 'Deck Admin',
  accountState: 'discord_linked',
  operationRole: 'fleet_admiral',
  siteRole: 'admin',
};

test('guest users only see public and auth routes', () => {
  assert.deepEqual(
    visibleFoundationRoutes(guest).map((route) => route.id),
    ['landing', 'rally-browse', 'login', 'signup', 'privacy', 'terms', 'legal']
  );
  assert.equal(defaultFoundationRouteForViewer(guest), 'landing');
});

test('signed in users see hub, account, notifications, and fleet command', () => {
  const visible = visibleFoundationRoutes(crew).map((route) => route.id);
  assert.equal(visible.includes('hub'), true);
  assert.equal(visible.includes('account'), true);
  assert.equal(visible.includes('notifications'), true);
  assert.equal(visible.includes('fleet-command'), true);
  assert.equal(visible.includes('proving-ground'), true);
  assert.equal(visible.includes('admin'), false);
  assert.equal(defaultFoundationRouteForViewer(crew), 'hub');
});

test('site admins see the admin portal route', () => {
  const visible = visibleFoundationRoutes(admin).map((route) => route.id);
  assert.equal(visible.includes('admin'), true);
  assert.equal(getRouteById('admin')?.label, 'Admin');
});

test('route ids remain unique', () => {
  const ids = appRoutes.map((route) => route.id);
  assert.equal(new Set(ids).size, ids.length);
});
