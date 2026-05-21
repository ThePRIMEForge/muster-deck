import type { StaffingProfile } from './types';

export type FleetSetupPosition = {
  id: string;
  roleType?: string;
  label: string;
  quantity: number;
};

export type ShipStaffingTemplateRow = {
  ship_id: string;
  ship_slug: string;
  ship_name: string;
  staffing_profile_key: StaffingProfile;
  staffing_profile_name: string;
  role_type: string;
  label: string;
  required: boolean;
  min_count: number;
  max_count: number | null;
  can_transition_to_fps: boolean;
  sort_order: number;
};

const emptySummary: Record<StaffingProfile, number> = {
  skeleton: 0,
  standard: 0,
  full_crew: 0,
  custom: 0,
};

export function reviewedTemplateSummary(rows: ShipStaffingTemplateRow[]) {
  return rows.reduce<Record<StaffingProfile, number>>(
    (summary, row) => ({
      ...summary,
      [row.staffing_profile_key]: summary[row.staffing_profile_key] + 1,
    }),
    { ...emptySummary },
  );
}

export function buildPresetPositions(
  rows: ShipStaffingTemplateRow[],
  profile: StaffingProfile,
  fallback: FleetSetupPosition[] = [],
) {
  const positions = rows
    .filter((row) => row.staffing_profile_key === profile)
    .sort((left, right) => left.sort_order - right.sort_order || left.label.localeCompare(right.label))
    .map(positionFromTemplate);

  return positions.length > 0 ? positions : fallback;
}

export function buildCustomizablePositions(
  rows: ShipStaffingTemplateRow[],
  profile: StaffingProfile,
  fallback: FleetSetupPosition[] = [],
) {
  if (rows.length === 0) {
    return fallback;
  }

  const activeQuantities = new Map(
    rows
      .filter((row) => row.staffing_profile_key === profile)
      .map((row) => [roleKey(row), templateQuantity(row)]),
  );
  const allRoles = new Map<string, ShipStaffingTemplateRow>();

  for (const row of rows) {
    const key = roleKey(row);
    const current = allRoles.get(key);

    if (!current || row.sort_order < current.sort_order) {
      allRoles.set(key, row);
    }
  }

  return [...allRoles.values()]
    .sort((left, right) => left.sort_order - right.sort_order || left.label.localeCompare(right.label))
    .map((row) => ({
      id: roleKey(row),
      roleType: row.role_type,
      label: row.label,
      quantity: activeQuantities.get(roleKey(row)) ?? 0,
    }));
}

export function crewTargetForPositions(positions: FleetSetupPosition[]) {
  return positions.reduce((total, position) => total + Math.max(0, position.quantity), 0);
}

function positionFromTemplate(row: ShipStaffingTemplateRow): FleetSetupPosition {
  return {
    id: roleKey(row),
    roleType: row.role_type,
    label: row.label,
    quantity: templateQuantity(row),
  };
}

function templateQuantity(row: ShipStaffingTemplateRow) {
  return Math.max(0, row.max_count ?? row.min_count);
}

function roleKey(row: Pick<ShipStaffingTemplateRow, 'role_type' | 'label'>) {
  return row.role_type || row.label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}
