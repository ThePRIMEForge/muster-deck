import type { OperationRole } from './permissions';

export type ShipCategoryKey =
  | 'capital'
  | 'subcapital'
  | 'large'
  | 'medium'
  | 'small'
  | 'light_fighter'
  | 'medium_fighter'
  | 'heavy_fighter'
  | 'snub_fighter'
  | 'ground_vehicle';

export type FleetCategoryKey = ShipCategoryKey | 'marines';

export type StaffingProfile = 'skeleton' | 'standard' | 'full_crew' | 'custom';

export type { OperationRole };

export type ShipCatalogRow = {
  id: string;
  slug: string;
  name: string;
  manufacturer: string | null;
  size_class: string | null;
  career: string | null;
  role: string | null;
  crew_min: number | null;
  crew_max: number | null;
  cargo_scu: number | null;
  primary_category_key: ShipCategoryKey | null;
  primary_category_name: string | null;
  primary_image_url: string | null;
  thumbnail_image_url: string | null;
  subcategory_keys: string[] | null;
};

export type ShipStaffingTemplateSummaryRow = {
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
  source: 'wiki_suggested' | 'uex_suggested' | 'manual';
  review_status: 'needs_review' | 'reviewed';
  updated_at: string;
};

export type FleetShipRequest = {
  id: string;
  team: string;
  teamKey: string;
  categoryKey: FleetCategoryKey;
  categoryName: string;
  shipName: string;
  manufacturer: string;
  requestedCount: number;
  staffingProfile: StaffingProfile;
  requiredPositions: number;
  optionalPositions: number;
  assignedPositions: number;
  pendingSuggestions: number;
  locked: boolean;
  exactRequired: boolean;
  hasMarines: boolean;
  isAdmiralShip: boolean;
  notes: string;
  imageUrl?: string;
  ownerName?: string;
  crew: CrewAssignment[];
};

export type CrewAssignment = {
  id: string;
  name: string;
  role: string;
  status: 'assigned' | 'requested' | 'available';
};

export type Member = {
  id: string;
  name: string;
  status: 'ready' | 'filling' | 'suggesting' | 'standby';
  operationRole: OperationRole;
  team: string;
  primaryRole: string;
  shipOffer?: string;
  assignedRequestId?: string;
};

export type FilterMode = 'all' | FleetCategoryKey | `team:${string}`;
