import type { CrewAssignment, FleetCategoryKey, FleetShipRequest, StaffingProfile } from './types';

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

export type FleetEventShipRequestSummaryRow = {
  id: string;
  fleet_event_id: string;
  fleet_event_code: string;
  fleet_event_name: string;
  ship_id: string | null;
  ship_slug: string | null;
  ship_name: string | null;
  primary_category_id: string | null;
  requested_primary_category_key: string | null;
  requested_primary_category_name: string | null;
  resolved_primary_category_key: string | null;
  resolved_primary_category_name: string | null;
  requested_count: number;
  team_id: string | null;
  team_name: string | null;
  parent_team_id: string | null;
  staffing_profile_id: string | null;
  staffing_profile_key: StaffingProfile | null;
  staffing_profile_name: string | null;
  staffing_profile_color: string | null;
  is_exact_ship_required: boolean;
  substitution_policy: 'allow_alternatives' | 'exact_only' | 'locked';
  effective_ship_roster_locked: boolean;
  notes: string;
  required_positions_min: number;
  required_positions_max: number;
  optional_positions_min: number;
  optional_positions_max: number;
  position_type_count: number;
  assigned_position_count: number;
  pending_ship_suggestion_count: number;
  created_at: string;
  updated_at: string;
};

export type FleetEventPositionRow = {
  id: string;
  fleet_event_ship_request_id: string;
  role_type: string;
  label: string;
  required: boolean;
  min_count: number;
  max_count: number | null;
  can_transition_to_fps: boolean;
  sort_order: number;
};

export type FleetEventAssignmentRow = {
  id: string;
  fleet_event_ship_request_id: string;
  fleet_event_position_id: string | null;
  member_id: string | null;
  status: 'requested' | 'assigned' | 'declined' | 'removed';
};

export type FleetEventMemberRow = {
  id: string;
  display_name: string;
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

export function mapPersistedFleetRequests(
  summaries: FleetEventShipRequestSummaryRow[],
  positions: FleetEventPositionRow[],
  assignments: FleetEventAssignmentRow[] = [],
  members: FleetEventMemberRow[] = [],
): FleetShipRequest[] {
  const positionsByRequest = positions.reduce<Map<string, FleetEventPositionRow[]>>((groups, position) => {
    const current = groups.get(position.fleet_event_ship_request_id) ?? [];
    current.push(position);
    groups.set(position.fleet_event_ship_request_id, current);
    return groups;
  }, new Map());
  const membersById = new Map(members.map((member) => [member.id, member]));
  const assignmentsByPosition = assignments.reduce<Map<string, FleetEventAssignmentRow[]>>(
    (groups, assignment) => {
      if (!assignment.fleet_event_position_id || assignment.status !== 'assigned') {
        return groups;
      }

      const current = groups.get(assignment.fleet_event_position_id) ?? [];
      current.push(assignment);
      groups.set(assignment.fleet_event_position_id, current);
      return groups;
    },
    new Map(),
  );

  return summaries.map((summary) => {
    const categoryKey = (summary.resolved_primary_category_key ?? 'medium') as FleetCategoryKey;
    const categoryName = summary.resolved_primary_category_name ?? 'Ship';
    const shipName = summary.ship_name ?? `${categoryName} Request`;

    return {
      id: summary.id,
      team: summary.team_name ?? 'Unassigned',
      teamKey: teamKey(summary.team_name),
      categoryKey,
      categoryName,
      shipName,
      manufacturer: 'Any',
      requestedCount: summary.requested_count,
      staffingProfile: summary.staffing_profile_key ?? 'standard',
      requiredPositions: summary.required_positions_max,
      optionalPositions: summary.optional_positions_max,
      assignedPositions: summary.assigned_position_count,
      pendingSuggestions: summary.pending_ship_suggestion_count,
      locked: summary.effective_ship_roster_locked,
      exactRequired: summary.is_exact_ship_required,
      hasMarines: categoryKey === 'marines',
      isAdmiralShip: false,
      notes: summary.notes,
      crew: buildCrewFromPersistedPositions(
        positionsByRequest.get(summary.id) ?? [],
        assignmentsByPosition,
        membersById,
      ),
    };
  });
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

function teamKey(teamName: string | null) {
  return (teamName ?? 'Unassigned').toLowerCase().replace(/\s+/g, '_');
}

function buildCrewFromPersistedPositions(
  positions: FleetEventPositionRow[],
  assignmentsByPosition: Map<string, FleetEventAssignmentRow[]>,
  membersById: Map<string, FleetEventMemberRow>,
) {
  return positions
    .slice()
    .sort((left, right) => left.sort_order - right.sort_order || left.label.localeCompare(right.label))
    .flatMap((position) => {
      const quantity = Math.max(0, position.max_count ?? position.min_count);
      const assignedCrew: CrewAssignment[] = (assignmentsByPosition.get(position.id) ?? [])
        .slice(0, quantity)
        .map((assignment, index) => ({
          id: assignment.id,
          name: membersById.get(assignment.member_id ?? '')?.display_name ?? 'Assigned',
          role: quantity > 1 ? `${position.label} ${index + 1}` : position.label,
          status: 'assigned' as const,
        }));
      const openSlots = Math.max(0, quantity - assignedCrew.length);

      const openCrew: CrewAssignment[] = Array.from({ length: openSlots }, (_, index) => ({
        id: `${position.id}-${index}`,
        name: 'Open',
        role:
          quantity > 1
            ? `${position.label} ${assignedCrew.length + index + 1}`
            : position.label,
        status: 'requested' as const,
      }));

      return assignedCrew.concat(openCrew);
    });
}
