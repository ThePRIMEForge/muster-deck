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
};

export type Member = {
  id: string;
  name: string;
  status: 'ready' | 'filling' | 'suggesting' | 'standby';
  team: string;
  primaryRole: string;
  shipOffer?: string;
};

export type FilterMode = 'all' | FleetCategoryKey | `team:${string}`;
