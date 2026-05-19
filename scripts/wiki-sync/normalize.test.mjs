import test from 'node:test';
import assert from 'node:assert/strict';

import {
  inferPrimaryCategoryKey,
  inferSubcategoryKeys,
  normalizeMedia,
  normalizeShip,
  sqlLiteral,
} from './normalize.mjs';

test('uses ground vehicle as the primary category for ground vehicles', () => {
  const vehicle = {
    name: 'Ursa Rover',
    slug: 'ursa-rover',
    is_vehicle: true,
    is_gravlev: false,
    is_spaceship: false,
    size: { en_EN: 'vehicle' },
    role: 'Rover',
  };

  assert.equal(inferPrimaryCategoryKey(vehicle), 'ground_vehicle');
});

test('uses fighter role before generic ship size', () => {
  const vehicle = {
    name: 'Scorpius',
    slug: 'rsi-scorpius',
    is_vehicle: false,
    is_spaceship: true,
    size: { en_EN: 'small' },
    role: 'Heavy Fighter',
    career: 'Combat',
    foci: [{ en_EN: 'Heavy Fighter' }],
  };

  assert.equal(inferPrimaryCategoryKey(vehicle), 'heavy_fighter');
});

test('uses numeric size class fallback when Wiki size label is missing', () => {
  assert.equal(inferPrimaryCategoryKey({ size_class: 10, role: 'Destroyer', is_spaceship: true }), 'capital');
  assert.equal(inferPrimaryCategoryKey({ size_class: 5, role: 'Gunship', is_spaceship: true }), 'large');
  assert.equal(inferPrimaryCategoryKey({ size_class: 2, role: 'Transport', is_spaceship: true }), 'small');
});

test('infers mission subcategories from role and focus text', () => {
  const vehicle = {
    career: 'Combat',
    role: 'Heavy Bomber',
    foci: [{ en_EN: 'Torpedo' }, { en_EN: 'Stealth' }],
    description: { en_EN: 'A stealth torpedo bomber for anti-capital strikes.' },
  };

  assert.deepEqual(inferSubcategoryKeys(vehicle), [
    'anti_capital',
    'stealth',
    'bomber',
    'torpedo',
  ]);
});

test('infers tractor beam utility subcategory', () => {
  const vehicle = {
    career: 'Transport',
    role: 'Cargo',
    foci: [{ en_EN: 'Tractor Beam' }],
    description: { en_EN: 'Uses tractor beams for towing and cargo recovery.' },
  };

  assert.deepEqual(inferSubcategoryKeys(vehicle), ['cargo_transport', 'tractor_beam']);
});

test('normalizes Wiki image metadata into media records', () => {
  const media = normalizeMedia({
    images: [
      {
        source: 'starcitizen.tools',
        original_url: 'https://media.starcitizen.tools/example.jpg',
        thumbnail_url: 'https://media.starcitizen.tools/thumb/example.webp',
        original_width: 1440,
        original_height: 1040,
        thumbnail_width: 600,
        thumbnail_height: 433,
      },
    ],
  });

  assert.deepEqual(media, [
    {
      source: 'wiki',
      originalUrl: 'https://media.starcitizen.tools/example.jpg',
      thumbnailUrl: 'https://media.starcitizen.tools/thumb/example.webp',
      width: 1440,
      height: 1040,
      thumbnailWidth: 600,
      thumbnailHeight: 433,
      isPrimary: true,
      sortOrder: 0,
    },
  ]);
});

test('normalizes core ship fields', () => {
  const ship = normalizeShip({
    uuid: '97648869-5fa5-42da-b804-4d9314289539',
    name: 'Avenger Stalker',
    slug: 'aegs-avenger-stalker',
    manufacturer: { name: 'Aegis Dynamics' },
    size_class: 2,
    size: { en_EN: 'small' },
    career: 'Combat',
    role: 'Interceptor',
    crew: { min: 1, max: 1 },
    cargo_capacity: 0,
    max_medical_tier: null,
    is_vehicle: false,
    is_gravlev: false,
    is_spaceship: true,
  });

  assert.equal(ship.wikiUuid, '97648869-5fa5-42da-b804-4d9314289539');
  assert.equal(ship.name, 'Avenger Stalker');
  assert.equal(ship.manufacturer, 'Aegis Dynamics');
  assert.equal(ship.primaryCategoryKey, 'light_fighter');
  assert.equal(ship.crewMin, 1);
  assert.equal(ship.crewMax, 1);
  assert.equal(ship.isShip, true);
  assert.equal(ship.isGroundVehicle, false);
});

test('escapes SQL string literals safely', () => {
  assert.equal(sqlLiteral("Carrack's Bay"), "'Carrack''s Bay'");
  assert.equal(sqlLiteral(null), 'null');
});
