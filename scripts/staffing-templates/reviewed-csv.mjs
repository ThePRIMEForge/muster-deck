import { sqlBoolean, sqlLiteral, sqlNumber } from '../wiki-sync/normalize.mjs';

const profileByLabel = new Map([
  ['Skeleton', 'skeleton'],
  ['Standard', 'standard'],
  ['Full', 'full_crew'],
]);

const positionColumns = [
  ['Commander', 'commander', 'Commander', false],
  ['Pilot', 'pilot', 'Pilot', false],
  ['Copilot', 'copilot', 'Copilot', false],
  ['Chief Engineer', 'chief_engineer', 'Chief Engineer', false],
  ['Engineering Assistant', 'engineering_assistant', 'Engineering Assistant', false],
  ['Primary Turret Gunner', 'primary_turret_gunner', 'Primary Turret Gunner', false],
  ['Turret Gunner', 'turret_gunner', 'Turret Gunner', false],
  ['Remote Turret Gunner', 'remote_turret_gunner', 'Remote Turret Gunner', false],
  ['Marine Lead', 'marine_lead', 'Marine Lead', true],
  ['Marine Rifleman', 'marine_rifleman', 'Marine Rifleman', true],
  ['Marine Medic', 'marine_medic', 'Marine Medic', true],
  [
    'Mining/Salvage/Refueling: Operator',
    'industrial_operator',
    'Mining/Salvage/Refueling Operator',
    false,
  ],
  ['Cargo Logistics', 'cargo_logistics', 'Cargo Logistics', false],
  ['Scanning Operator', 'scanning_operator', 'Scanning Operator', false],
  ['Torpedo Operator', 'torpedo_operator', 'Torpedo Operator', false],
  ['Hangar Operations', 'hangar_operations', 'Hangar Operations', false],
  ['Doctor (Infirmary)', 'doctor', 'Doctor (Infirmary)', false],
];

function parseCsvLine(text, startIndex) {
  const values = [];
  let value = '';
  let index = startIndex;
  let quoted = false;

  while (index < text.length) {
    const character = text[index];
    const nextCharacter = text[index + 1];

    if (quoted) {
      if (character === '"' && nextCharacter === '"') {
        value += '"';
        index += 2;
        continue;
      }

      if (character === '"') {
        quoted = false;
        index += 1;
        continue;
      }

      value += character;
      index += 1;
      continue;
    }

    if (character === '"') {
      quoted = true;
      index += 1;
      continue;
    }

    if (character === ',') {
      values.push(value);
      value = '';
      index += 1;
      continue;
    }

    if (character === '\n' || character === '\r') {
      values.push(value);
      if (character === '\r' && nextCharacter === '\n') {
        index += 2;
      } else {
        index += 1;
      }
      return { values, nextIndex: index };
    }

    value += character;
    index += 1;
  }

  values.push(value);
  return { values, nextIndex: index };
}

function parseCsv(text) {
  const rows = [];
  let index = 0;

  while (index < text.length) {
    const parsed = parseCsvLine(text, index);
    index = parsed.nextIndex;

    if (parsed.values.length === 1 && parsed.values[0] === '') {
      continue;
    }

    rows.push(parsed.values);
  }

  return rows;
}

function dedupe(values) {
  return [...new Set(values.filter(Boolean))];
}

function targetNamesForRow(row) {
  return dedupe([
    row['Ship Name']?.trim(),
    ...(row.Variants ?? '')
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean),
  ]);
}

function numericQuantity(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function parseLockedReviewCsv(text) {
  const [headers, ...records] = parseCsv(text.trim());

  return records.map((record) =>
    Object.fromEntries(headers.map((header, index) => [header, record[index] ?? ''])),
  );
}

export function reviewRowsToTemplateGroups(rows) {
  const groups = new Map();

  for (const row of rows) {
    const shipName = row['Ship Name']?.trim();
    const staffingProfileKey = profileByLabel.get(row['Crew\nCompliment']);

    if (!shipName || !staffingProfileKey) {
      continue;
    }

    if (!groups.has(shipName)) {
      groups.set(shipName, {
        shipName,
        targetNames: targetNamesForRow(row),
        templates: [],
      });
    }

    const group = groups.get(shipName);
    group.targetNames = dedupe([...group.targetNames, ...targetNamesForRow(row)]);

    positionColumns.forEach(([column, roleType, label, canTransitionToFps], columnIndex) => {
      const quantity = numericQuantity(row[column]);

      if (quantity === null) {
        return;
      }

      group.templates.push({
        staffingProfileKey,
        roleType,
        label,
        required: quantity > 0,
        minCount: quantity,
        maxCount: quantity,
        canTransitionToFps,
        sortOrder: (columnIndex + 1) * 10,
      });
    });
  }

  return [...groups.values()];
}

function targetNameList(targetNames) {
  return targetNames.map((name) => sqlLiteral(name.toLowerCase())).join(', ');
}

function buildDeleteSql(group) {
  return `delete from public.ship_position_templates
where ship_id in (
  select id from public.ships where lower(name) in (${targetNameList(group.targetNames)})
)
and (
  (source = 'manual' and review_status = 'reviewed')
  or (source = 'wiki_suggested' and review_status = 'needs_review')
);`;
}

function buildInsertSql(group, template) {
  return `insert into public.ship_position_templates (
  ship_id, staffing_profile_id, role_type, label, required, min_count, max_count,
  can_transition_to_fps, sort_order, source, review_status
)
select
  ship.id,
  (select id from public.staffing_profiles where key = ${sqlLiteral(template.staffingProfileKey)}),
  ${sqlLiteral(template.roleType)},
  ${sqlLiteral(template.label)},
  ${sqlBoolean(template.required)},
  ${sqlNumber(template.minCount)},
  ${sqlNumber(template.maxCount)},
  ${sqlBoolean(template.canTransitionToFps)},
  ${sqlNumber(template.sortOrder)},
  'manual',
  'reviewed'
from public.ships as ship
where lower(ship.name) in (${targetNameList(group.targetNames)});`;
}

export function buildReviewedStaffingTemplateSql({ csvText }) {
  const groups = reviewRowsToTemplateGroups(parseLockedReviewCsv(csvText));
  const statements = [
    'begin;',
    ...groups.flatMap((group) => [
      buildDeleteSql(group),
      ...group.templates.map((template) => buildInsertSql(group, template)),
    ]),
    'commit;',
  ];

  return `${statements.join('\n\n')}\n`;
}
