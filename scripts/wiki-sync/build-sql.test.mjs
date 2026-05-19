import test from 'node:test';
import assert from 'node:assert/strict';

import { buildVehicleSyncSql } from './build-sql.mjs';

test('builds ship, subcategory, and media SQL for a Wiki vehicle', () => {
  const sql = buildVehicleSyncSql({
    pages: [
      {
        pageNumber: 1,
        payload: {
          data: [
            {
              uuid: 'ship-1',
              name: 'RSI Scorpius',
              slug: 'rsi-scorpius',
              manufacturer: { name: 'Roberts Space Industries' },
              size_class: 2,
              size: { en_EN: 'small' },
              career: 'Combat',
              role: 'Heavy Fighter',
              crew: { min: 1, max: 2 },
              cargo_capacity: 0,
              is_spaceship: true,
              is_vehicle: false,
              is_gravlev: false,
              foci: [{ en_EN: 'Heavy Fighter' }, { en_EN: 'Stealth' }],
              images: [
                {
                  original_url: 'https://media.example/scorpius.jpg',
                  thumbnail_url: 'https://media.example/scorpius-thumb.webp',
                },
              ],
            },
          ],
        },
      },
    ],
  });

  assert.match(sql, /insert into public\.source_snapshots/);
  assert.match(sql, /'ship-1', 'rsi-scorpius'/);
  assert.match(sql, /wiki_uuid, uex_uuid, name, slug/);
  assert.match(sql, /'ship-1'/);
  assert.match(sql, /'heavy_fighter'/);
  assert.match(sql, /insert into public\.ship_subcategory_assignments/);
  assert.match(sql, /insert into public\.ship_media/);
  assert.match(sql, /https:\/\/media\.example\/scorpius-thumb\.webp/);
});
