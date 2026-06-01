import test from 'node:test';
import assert from 'node:assert/strict';

import { buildStaffingTemplateSql } from './build-sql.mjs';

test('builds idempotent SQL for suggested staffing templates', () => {
  const sql = buildStaffingTemplateSql({
    vehicles: [
      {
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
      },
    ],
  });

  assert.match(sql, /delete from public\.ship_position_templates/);
  assert.match(sql, /review_status = 'needs_review'/);
  assert.match(sql, /'rsi-scorpius'/);
  assert.match(sql, /'remote_turret_gunner'/);
  assert.match(sql, /'wiki_suggested'/);
  assert.match(sql, /commit;/);
});
