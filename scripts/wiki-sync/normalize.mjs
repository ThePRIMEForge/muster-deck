const SUBCATEGORY_RULES = [
  ['repair', /\brepair\b/],
  ['rearm', /\brearm\b|\brearming\b/],
  ['refuel', /\brefuel\b|\brefueling\b/],
  ['anti_fighter', /\banti[- ]fighter\b/],
  ['anti_capital', /\banti[- ]capital\b/],
  ['stealth', /\bstealth\b/],
  ['bomber', /\bbomber\b|\bbombing\b/],
  ['torpedo', /\btorpedo\b|\btorpedoes\b/],
  ['scanning', /\bscanning\b|\bscanner\b|\bscout\b|\brecon\b/],
  ['carrier', /\bcarrier\b/],
  ['troop_transport', /\btroop\b|\bdrop ship\b|\bdropship\b|\bboarding\b|\bpersonnel\b/],
  ['cargo_transport', /\bcargo\b|\bfreight\b|\bhauler\b|\btransport\b/],
  ['reclamation', /\breclamation\b/],
  ['ground_vehicle_transport', /\bground vehicle transport\b|\bvehicle transport\b/],
  ['medical', /\bmedical\b|\bmedic\b/],
  ['mining', /\bmining\b|\bminer\b/],
  ['salvage', /\bsalvage\b/],
  ['interdiction', /\binterdiction\b|\binterdictor\b/],
  ['emp_qed', /\bemp\b|\bqed\b|\bquantum enforcement\b/],
  ['exploration', /\bexploration\b|\bexplorer\b|\bpathfinder\b|\bexpedition\b/],
  ['data_runner', /\bdata runner\b|\bdata-running\b|\bdata\b/],
];

function localizedText(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.en_EN ?? value.en ?? '';
}

function searchableVehicleText(vehicle) {
  const foci = Array.isArray(vehicle.foci)
    ? vehicle.foci.map((focus) => localizedText(focus)).join(' ')
    : '';

  return [
    vehicle.name,
    vehicle.game_name,
    vehicle.career,
    vehicle.role,
    localizedText(vehicle.type),
    localizedText(vehicle.size),
    localizedText(vehicle.description),
    foci,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function inferPrimaryCategoryKey(vehicle) {
  const text = searchableVehicleText(vehicle);

  if (vehicle.is_vehicle || vehicle.is_gravlev) return 'ground_vehicle';
  if (/\bheavy fighter\b/.test(text)) return 'heavy_fighter';
  if (/\bmedium fighter\b/.test(text)) return 'medium_fighter';
  if (/\blight fighter\b|\binterceptor\b/.test(text)) return 'light_fighter';
  if (/\bsnub fighter\b|\bsnub\b/.test(text)) return 'snub_fighter';

  const size = localizedText(vehicle.size).toLowerCase().replace(/[-_\s]/g, '');
  if (size === 'capital') return 'capital';
  if (size === 'subcapital') return 'subcapital';
  if (size === 'large') return 'large';
  if (size === 'medium') return 'medium';
  if (size === 'small') return 'small';

  const sizeClass = Number(vehicle.size_class);
  if (Number.isFinite(sizeClass)) {
    if (sizeClass >= 10) return 'capital';
    if (sizeClass >= 6) return 'subcapital';
    if (sizeClass >= 4) return 'large';
    if (sizeClass === 3) return 'medium';
    if (sizeClass >= 1) return 'small';
  }

  return null;
}

export function inferSubcategoryKeys(vehicle) {
  const text = searchableVehicleText(vehicle);
  return SUBCATEGORY_RULES
    .filter(([, pattern]) => pattern.test(text))
    .map(([key]) => key);
}

export function normalizeMedia(vehicle) {
  if (!Array.isArray(vehicle.images)) return [];

  return vehicle.images
    .filter((image) => image.original_url || image.thumbnail_url)
    .map((image, index) => ({
      source: 'wiki',
      originalUrl: image.original_url ?? null,
      thumbnailUrl: image.thumbnail_url ?? null,
      width: image.original_width ?? null,
      height: image.original_height ?? null,
      thumbnailWidth: image.thumbnail_width ?? null,
      thumbnailHeight: image.thumbnail_height ?? null,
      isPrimary: index === 0,
      sortOrder: index,
    }));
}

export function normalizeShip(vehicle) {
  return {
    wikiUuid: vehicle.uuid ?? null,
    uexUuid: null,
    name: vehicle.name ?? vehicle.game_name,
    slug: vehicle.slug,
    manufacturer: typeof vehicle.manufacturer === 'string'
      ? vehicle.manufacturer
      : vehicle.manufacturer?.name ?? null,
    sizeClass: vehicle.size_class == null ? null : String(vehicle.size_class),
    career: vehicle.career ?? null,
    role: vehicle.role ?? null,
    crewMin: vehicle.crew?.min ?? null,
    crewMax: vehicle.crew?.max ?? null,
    cargoScu: vehicle.cargo_capacity ?? null,
    medicalTier: vehicle.max_medical_tier == null ? null : String(vehicle.max_medical_tier),
    isShip: Boolean(vehicle.is_spaceship),
    isGroundVehicle: Boolean(vehicle.is_vehicle || vehicle.is_gravlev),
    primaryCategoryKey: inferPrimaryCategoryKey(vehicle),
    subcategoryKeys: inferSubcategoryKeys(vehicle),
    media: normalizeMedia(vehicle),
  };
}

export function sqlLiteral(value) {
  if (value === null || value === undefined) return 'null';
  return `'${String(value).replaceAll("'", "''")}'`;
}

export function sqlNumber(value) {
  if (value === null || value === undefined || value === '') return 'null';
  const number = Number(value);
  return Number.isFinite(number) ? String(number) : 'null';
}

export function sqlBoolean(value) {
  return value ? 'true' : 'false';
}
