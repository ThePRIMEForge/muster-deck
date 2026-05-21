import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  buildReviewedStaffingTemplateSql,
  parseLockedReviewCsv,
  reviewRowsToTemplateGroups,
} from './reviewed-csv.mjs';

const headers = [
  'Status',
  'Guidance',
  'Ship Name',
  'Manufacturer',
  'Primary Category',
  'Subcategories',
  'Career',
  'Role',
  'Crew Min',
  'Crew Max',
  'Crew\nCompliment',
  'Commander',
  'Pilot',
  'Copilot',
  'Chief Engineer',
  'Engineering Assistant',
  'Primary Turret Gunner',
  'Turret Gunner',
  'Remote Turret Gunner',
  'Marine Lead',
  'Marine Rifleman',
  'Marine Medic',
  'Mining/Salvage/Refueling: Operator',
  'Cargo Logistics',
  'Scanning Operator',
  'Torpedo Operator',
  'Hangar Operations',
  'Doctor (Infirmary)',
  'Source Hints',
  'Variants',
  'Notes',
];

function csvValue(value) {
  const text = String(value ?? '');

  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
}

function row(values) {
  return headers.map((header) => csvValue(values[header])).join(',');
}

const sampleCsv = [
  headers.map(csvValue).join(','),
  row({
    Guidance: 'Multi-crew: review preserved positions.',
    'Ship Name': 'Perseus',
    Manufacturer: 'Roberts Space Industries',
    'Primary Category': 'large',
    Career: 'Combat',
    Role: 'Heavy Gunship',
    'Crew Min': 6,
    'Crew Max': 6,
    'Crew\nCompliment': 'Skeleton',
    Pilot: 1,
    'Source Hints': 'Crew 6-6',
    Variants: 'Perseus',
  }),
  row({
    Guidance: 'Multi-crew: review preserved positions.',
    'Ship Name': 'Perseus',
    Manufacturer: 'Roberts Space Industries',
    'Primary Category': 'large',
    Career: 'Combat',
    Role: 'Heavy Gunship',
    'Crew Min': 6,
    'Crew Max': 6,
    'Crew\nCompliment': 'Standard',
    Pilot: 1,
    'Primary Turret Gunner': 1,
    'Remote Turret Gunner': 2,
    Variants: 'Perseus, Perseus Thundercloud',
  }),
  row({
    Guidance: 'Multi-crew: review preserved positions.',
    'Ship Name': 'Perseus',
    Manufacturer: 'Roberts Space Industries',
    'Primary Category': 'large',
    Career: 'Combat',
    Role: 'Heavy Gunship',
    'Crew Min': 6,
    'Crew Max': 6,
    'Crew\nCompliment': 'Full',
    Commander: 1,
    Pilot: 1,
    Copilot: 1,
    'Engineering Assistant': 1,
    'Primary Turret Gunner': 1,
    'Remote Turret Gunner': 2,
    'Marine Lead': 1,
    'Marine Rifleman': 4,
    'Marine Medic': 1,
    Variants: 'Perseus, Perseus Thundercloud',
  }),
  row({
    Guidance: 'Fighter: review turret; positions preserved.',
    'Ship Name': 'Scorpius',
    Manufacturer: 'Roberts Space Industries',
    'Primary Category': 'heavy_fighter',
    Career: 'Combat',
    Role: 'Heavy Fighter',
    'Crew Min': 2,
    'Crew Max': 2,
    'Crew\nCompliment': 'Standard',
    Pilot: 1,
    'Turret Gunner': 1,
    Variants: 'Scorpius, Scorpius Wikelo Sneak Special',
  }),
].join('\n');

const lockedReferenceCsv = readFileSync(
  new URL('../../supabase/reference/ship-position-review-2026-05-21.csv', import.meta.url),
  'utf8',
);

test('parses locked review csv with embedded newline headers', () => {
  const rows = parseLockedReviewCsv(sampleCsv);

  assert.equal(rows.length, 4);
  assert.equal(rows[0]['Crew\nCompliment'], 'Skeleton');
  assert.equal(rows[1].Variants, 'Perseus, Perseus Thundercloud');
});

test('builds reviewed template groups from locked review rows', () => {
  const groups = reviewRowsToTemplateGroups(parseLockedReviewCsv(sampleCsv));
  const perseus = groups.find((group) => group.shipName === 'Perseus');
  const scorpius = groups.find((group) => group.shipName === 'Scorpius');

  assert.deepEqual(perseus?.targetNames, ['Perseus', 'Perseus Thundercloud']);
  assert.equal(perseus?.templates.filter((template) => template.staffingProfileKey === 'full_crew').length, 9);
  assert.equal(scorpius?.templates.some((template) => template.roleType === 'turret_gunner'), true);
});

test('builds idempotent reviewed staffing sql', () => {
  const sql = buildReviewedStaffingTemplateSql({ csvText: sampleCsv });

  assert.match(sql, /delete from public.ship_position_templates/);
  assert.match(sql, /source = 'manual'/);
  assert.match(sql, /review_status = 'reviewed'/);
  assert.match(sql, /perseus thundercloud/);
  assert.match(sql, /turret_gunner/);
});

test('locked reference csv remains parseable and preserves reviewed Scorpius baseline', () => {
  const groups = reviewRowsToTemplateGroups(parseLockedReviewCsv(lockedReferenceCsv));
  const scorpius = groups.find((group) => group.shipName === 'Scorpius');
  const standardRoles = scorpius?.templates
    .filter((template) => template.staffingProfileKey === 'standard')
    .map((template) => template.roleType)
    .sort();

  assert.equal(groups.length, 205);
  assert.deepEqual(standardRoles, ['pilot', 'turret_gunner']);
});
