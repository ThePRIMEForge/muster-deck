import { createClient } from '@supabase/supabase-js';
import {
  mapPersistedFleetRequests,
  type FleetEventPositionRow,
  type FleetEventShipRequestSummaryRow,
  type FleetSetupPosition,
} from './fleetSetup';
import type { FleetShipRequest, StaffingProfile, ShipCatalogRow, ShipStaffingTemplateSummaryRow } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const publishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && publishableKey);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, publishableKey)
  : null;

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

  return mapPersistedFleetRequests(summaryRows, (positions ?? []) as unknown as FleetEventPositionRow[]);
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
