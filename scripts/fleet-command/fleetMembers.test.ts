import assert from 'node:assert/strict';
import test from 'node:test';

import { hydrateMembersFromPersistedAssignments } from '../../src/lib/fleetMembers.ts';
import type { Member } from '../../src/lib/types.ts';

const members: Member[] = [
  {
    id: 'm1',
    name: 'Rook',
    status: 'ready',
    operationRole: 'crew',
    team: 'Beta',
    primaryRole: 'Heavy Fighter Pilot',
    shipOffer: 'Scorpius',
    assignedRequestId: 'stale-local-request',
  },
  {
    id: 'm2',
    name: 'Patch',
    status: 'standby',
    operationRole: 'crew',
    team: 'Delta',
    primaryRole: 'Medic',
    shipOffer: 'Cutlass Red',
    assignedRequestId: 'another-stale-request',
  },
];

test('hydrates fallback members from persisted assignments and clears stale local request ids', () => {
  assert.deepEqual(
    hydrateMembersFromPersistedAssignments(members, [
      {
        displayName: 'Rook',
        requestId: 'request-scorpius',
        team: 'Alpha',
        shipName: 'Scorpius',
        categoryKey: 'heavy_fighter',
      },
    ]),
    [
      {
        ...members[0],
        team: 'Alpha',
        shipOffer: 'Scorpius',
        assignedRequestId: 'request-scorpius',
      },
      {
        ...members[1],
        assignedRequestId: undefined,
      },
    ],
  );
});

test('does not assign ship offers for persisted marine assignments', () => {
  assert.equal(
    hydrateMembersFromPersistedAssignments(members, [
      {
        displayName: 'Patch',
        requestId: 'request-marines',
        team: 'Gamma',
        shipName: 'Marines/FPS',
        categoryKey: 'marines',
      },
    ])[1].shipOffer,
    undefined,
  );
});
