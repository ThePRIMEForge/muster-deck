import { createClient } from '@supabase/supabase-js';
import {
  type FleetEventAssignmentRow,
  type FleetEventMemberRow,
  mapPersistedFleetRequests,
  type FleetEventPositionRow,
  type FleetEventShipRequestSummaryRow,
  type FleetSetupPosition,
} from './fleetSetup';
import type { PersistedMemberAssignment } from './fleetMembers';
import type { FleetShipRequest, StaffingProfile, ShipCatalogRow, ShipStaffingTemplateSummaryRow } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const publishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && publishableKey);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, publishableKey)
  : null;

export type DemoFleetLockState = {
  masterLocked: boolean;
  teams: Array<{
    teamKey: string;
    locked: boolean;
  }>;
};

export async function loadShipCatalog(): Promise<ShipCatalogRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('ship_catalog_summary')
    .select(
      [
        'id',
        'slug',
        'name',
        'manufacturer',
        'size_class',
        'career',
        'role',
        'crew_min',
        'crew_max',
        'cargo_scu',
        'primary_category_key',
        'primary_category_name',
        'primary_image_url',
        'thumbnail_image_url',
        'subcategory_keys',
      ].join(','),
    )
    .order('primary_category_sort_order', { ascending: true })
    .order('name', { ascending: true })
    .limit(500);

  if (error) {
    throw error;
  }

  return (data ?? []) as unknown as ShipCatalogRow[];
}

export async function loadShipStaffingTemplates(): Promise<ShipStaffingTemplateSummaryRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('ship_staffing_template_summary')
    .select(
      [
        'ship_id',
        'ship_slug',
        'ship_name',
        'staffing_profile_key',
        'staffing_profile_name',
        'role_type',
        'label',
        'required',
        'min_count',
        'max_count',
        'can_transition_to_fps',
        'sort_order',
        'source',
        'review_status',
        'updated_at',
      ].join(','),
    )
    .order('ship_name', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as unknown as ShipStaffingTemplateSummaryRow[];
}

export async function ensureDemoFleetEvent(): Promise<string | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.rpc('ensure_demo_fleet_event');

  if (error) {
    throw error;
  }

  return data as string;
}

export async function loadDemoFleetSetup(): Promise<FleetShipRequest[]> {
  if (!supabase) {
    return [];
  }

  const fleetEventId = await ensureDemoFleetEvent();

  if (!fleetEventId) {
    return [];
  }

  const { data: summaries, error: summaryError } = await supabase
    .from('fleet_event_ship_request_summary')
    .select(
      [
        'id',
        'fleet_event_id',
        'fleet_event_code',
        'fleet_event_name',
        'ship_id',
        'ship_slug',
        'ship_name',
        'primary_category_id',
        'requested_primary_category_key',
        'requested_primary_category_name',
        'resolved_primary_category_key',
        'resolved_primary_category_name',
        'requested_count',
        'team_id',
        'team_name',
        'parent_team_id',
        'staffing_profile_id',
        'staffing_profile_key',
        'staffing_profile_name',
        'staffing_profile_color',
        'is_exact_ship_required',
        'substitution_policy',
        'effective_ship_roster_locked',
        'notes',
        'required_positions_min',
        'required_positions_max',
        'optional_positions_min',
        'optional_positions_max',
        'position_type_count',
        'assigned_position_count',
        'pending_ship_suggestion_count',
        'created_at',
        'updated_at',
      ].join(','),
    )
    .eq('fleet_event_id', fleetEventId)
    .order('created_at', { ascending: false });

  if (summaryError) {
    throw summaryError;
  }

  const summaryRows = (summaries ?? []) as unknown as FleetEventShipRequestSummaryRow[];
  const requestIds = summaryRows.map((summary) => summary.id);

  if (requestIds.length === 0) {
    return [];
  }

  const { data: positions, error: positionError } = await supabase
    .from('fleet_event_positions')
    .select(
      [
        'id',
        'fleet_event_ship_request_id',
        'role_type',
        'label',
        'required',
        'min_count',
        'max_count',
        'can_transition_to_fps',
        'sort_order',
      ].join(','),
    )
    .in('fleet_event_ship_request_id', requestIds)
    .order('sort_order', { ascending: true });

  if (positionError) {
    throw positionError;
  }

  const { data: assignments, error: assignmentError } = await supabase
    .from('assignments')
    .select(
      [
        'id',
        'fleet_event_ship_request_id',
        'fleet_event_position_id',
        'member_id',
        'status',
      ].join(','),
    )
    .eq('fleet_event_id', fleetEventId)
    .eq('assignment_type', 'ship_position')
    .eq('status', 'assigned')
    .in('fleet_event_ship_request_id', requestIds);

  if (assignmentError) {
    throw assignmentError;
  }

  const assignmentRows = (assignments ?? []) as unknown as FleetEventAssignmentRow[];
  const memberIds = [...new Set(assignmentRows.map((assignment) => assignment.member_id).filter(Boolean))];
  let memberRows: FleetEventMemberRow[] = [];

  if (memberIds.length > 0) {
    const { data: members, error: memberError } = await supabase
      .from('members')
      .select(['id', 'display_name'].join(','))
      .in('id', memberIds);

    if (memberError) {
      throw memberError;
    }

    memberRows = (members ?? []) as unknown as FleetEventMemberRow[];
  }

  return mapPersistedFleetRequests(
    summaryRows,
    (positions ?? []) as unknown as FleetEventPositionRow[],
    assignmentRows,
    memberRows,
  );
}

export async function loadDemoFleetLockState(): Promise<DemoFleetLockState> {
  if (!supabase) {
    return { masterLocked: false, teams: [] };
  }

  const { data, error } = await supabase.rpc('demo_fleet_lock_state');

  if (error) {
    throw error;
  }

  return data as DemoFleetLockState;
}

export async function loadDemoMemberAssignments(): Promise<PersistedMemberAssignment[]> {
  if (!supabase) {
    return [];
  }

  const fleetEventId = await ensureDemoFleetEvent();

  if (!fleetEventId) {
    return [];
  }

  const { data: assignments, error: assignmentError } = await supabase
    .from('assignments')
    .select(
      [
        'id',
        'fleet_event_ship_request_id',
        'fleet_event_position_id',
        'member_id',
        'status',
      ].join(','),
    )
    .eq('fleet_event_id', fleetEventId)
    .eq('assignment_type', 'ship_position')
    .eq('status', 'assigned');

  if (assignmentError) {
    throw assignmentError;
  }

  const assignmentRows = (assignments ?? []) as unknown as FleetEventAssignmentRow[];
  const memberIds = [...new Set(assignmentRows.map((assignment) => assignment.member_id).filter(Boolean))];
  const requestIds = [
    ...new Set(assignmentRows.map((assignment) => assignment.fleet_event_ship_request_id).filter(Boolean)),
  ];

  if (memberIds.length === 0 || requestIds.length === 0) {
    return [];
  }

  const [{ data: members, error: memberError }, { data: requests, error: requestError }] =
    await Promise.all([
      supabase.from('members').select(['id', 'display_name'].join(',')).in('id', memberIds),
      supabase
        .from('fleet_event_ship_request_summary')
        .select(
          [
            'id',
            'team_name',
            'ship_name',
            'resolved_primary_category_key',
            'resolved_primary_category_name',
          ].join(','),
        )
        .in('id', requestIds),
    ]);

  if (memberError) {
    throw memberError;
  }

  if (requestError) {
    throw requestError;
  }

  const membersById = new Map(
    ((members ?? []) as unknown as FleetEventMemberRow[]).map((member) => [member.id, member]),
  );
  const requestsById = new Map(
    ((requests ?? []) as unknown as Array<{
      id: string;
      team_name: string | null;
      ship_name: string | null;
      resolved_primary_category_key: string | null;
      resolved_primary_category_name: string | null;
    }>).map((request) => [request.id, request]),
  );

  return assignmentRows.flatMap((assignment) => {
    const member = membersById.get(assignment.member_id ?? '');
    const request = requestsById.get(assignment.fleet_event_ship_request_id);

    if (!member || !request) {
      return [];
    }

    return [
      {
        displayName: member.display_name,
        requestId: assignment.fleet_event_ship_request_id,
        team: request.team_name ?? 'Unassigned',
        shipName: request.ship_name ?? `${request.resolved_primary_category_name ?? 'Ship'} Request`,
        categoryKey: (request.resolved_primary_category_key ?? 'medium') as PersistedMemberAssignment['categoryKey'],
      },
    ];
  });
}

export async function createDemoFleetShipRequest({
  shipSlug,
  primaryCategoryKey,
  requestedCount,
  teamKey,
  staffingProfile,
  exactRequired,
  notes,
}: {
  shipSlug?: string | null;
  primaryCategoryKey?: string | null;
  requestedCount: number;
  teamKey?: string | null;
  staffingProfile: StaffingProfile;
  exactRequired: boolean;
  notes: string;
}): Promise<string> {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const { data, error } = await supabase.rpc('create_demo_fleet_ship_request', {
    target_ship_slug: shipSlug ?? null,
    target_primary_category_key: primaryCategoryKey ?? null,
    target_requested_count: requestedCount,
    target_team_key: teamKey ?? null,
    target_staffing_profile_key: staffingProfile,
    target_is_exact_ship_required: exactRequired,
    target_notes: notes,
  });

  if (error) {
    throw error;
  }

  return data as string;
}

export async function replaceFleetEventPositions(
  requestId: string,
  positions: FleetSetupPosition[],
): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const activePositions = positions
    .filter((position) => position.quantity > 0)
    .map((position, index) => ({
      role_type: position.roleType ?? position.id,
      label: position.label,
      required: true,
      min_count: position.quantity,
      max_count: position.quantity,
      can_transition_to_fps: false,
      sort_order: (index + 1) * 10,
    }));

  const { error } = await supabase.rpc('replace_fleet_event_positions', {
    target_fleet_event_ship_request_id: requestId,
    target_positions: activePositions,
  });

  if (error) {
    throw error;
  }
}

export async function assignDemoMemberToFleetPosition({
  requestId,
  memberName,
  primaryRole,
}: {
  requestId: string;
  memberName: string;
  primaryRole: string;
}): Promise<string> {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const { data, error } = await supabase.rpc('assign_demo_member_to_fleet_position', {
    target_fleet_event_ship_request_id: requestId,
    target_display_name: memberName,
    target_primary_role: primaryRole,
  });

  if (error) {
    throw error;
  }

  return data as string;
}

export async function moveDemoFleetShipRequestToTeam({
  requestId,
  teamKey,
}: {
  requestId: string;
  teamKey: string;
}): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const { error } = await supabase.rpc('move_demo_fleet_ship_request_to_team', {
    target_fleet_event_ship_request_id: requestId,
    target_team_key: teamKey,
  });

  if (error) {
    throw error;
  }
}

export async function removeDemoFleetShipRequest(requestId: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const { error } = await supabase.rpc('remove_demo_fleet_ship_request', {
    target_fleet_event_ship_request_id: requestId,
  });

  if (error) {
    throw error;
  }
}

export async function setDemoFleetMasterLock(locked: boolean): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const { error } = await supabase.rpc('set_demo_fleet_master_lock', {
    target_locked: locked,
  });

  if (error) {
    throw error;
  }
}

export async function setDemoFleetTeamLock({
  teamKey,
  locked,
}: {
  teamKey: string;
  locked: boolean;
}): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const { error } = await supabase.rpc('set_demo_fleet_team_lock', {
    target_team_key: teamKey,
    target_locked: locked,
  });

  if (error) {
    throw error;
  }
}

export async function unlockAllDemoFleetShipRosters(): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const { error } = await supabase.rpc('unlock_all_demo_ship_rosters');

  if (error) {
    throw error;
  }
}

// --- Profile ---

export type ProfileRow = {
  id: string;
  auth_user_id: string | null;
  display_name: string;
  primary_org: string;
  rsi_handle: string | null;
  rsi_verification_status: string;
  account_status: string;
  is_site_admin: boolean;
};

export async function getOrCreateProfile(): Promise<ProfileRow | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc('get_or_create_profile');
  if (error || !data?.length) return null;
  return (data as ProfileRow[])[0];
}

export async function updateMyProfile({
  displayName,
  primaryOrg,
  rsiHandle,
}: {
  displayName?: string;
  primaryOrg?: string;
  rsiHandle?: string;
}): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('update_my_profile', {
    p_display_name: displayName ?? null,
    p_primary_org: primaryOrg ?? null,
    p_rsi_handle: rsiHandle ?? null,
  });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

// --- Admin ---

export type AdminProfileRow = {
  id: string;
  display_name: string;
  account_status: string;
  rsi_handle: string | null;
  rsi_verification_status: string;
  is_site_admin: boolean;
  last_active_at: string | null;
  created_at: string;
  discord_linked: boolean;
  google_linked: boolean;
};

export async function listProfilesForAdmin(): Promise<AdminProfileRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.rpc('list_profiles_for_admin');
  if (error) throw error;
  return (data ?? []) as AdminProfileRow[];
}

export async function adminSetAccountStatus(
  profileId: string,
  action: 'ban' | 'unban' | 'restrict' | 'unrestrict' | 'require_approval' | 'restore_access',
  reason = '',
): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.rpc('admin_set_account_status', {
    p_profile_id: profileId,
    p_action: action,
    p_reason: reason,
  });
  if (error) throw error;
}
