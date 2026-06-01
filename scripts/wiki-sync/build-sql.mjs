import {
  normalizeShip,
  sqlBoolean,
  sqlLiteral,
  sqlNumber,
} from './normalize.mjs';

function sqlJsonLiteral(value) {
  return `${sqlLiteral(JSON.stringify(value))}::jsonb`;
}

function categorySubquery(key) {
  if (!key) return 'null';
  return `(select id from public.ship_primary_categories where key = ${sqlLiteral(key)})`;
}

function sourceSystemSubquery(key) {
  return `(select id from public.source_systems where key = ${sqlLiteral(key)})`;
}

function shipSubquery(slug) {
  return `(select id from public.ships where slug = ${sqlLiteral(slug)})`;
}

function subcategorySubquery(key) {
  return `(select id from public.ship_subcategories where key = ${sqlLiteral(key)})`;
}

function buildSourceSnapshotSql(vehicle) {
  return `insert into public.source_snapshots (source_system_id, external_id, external_slug, payload, source_patch)
values (${sourceSystemSubquery('star_citizen_wiki')}, ${sqlLiteral(vehicle.uuid ?? null)}, ${sqlLiteral(vehicle.slug ?? null)}, ${sqlJsonLiteral(vehicle)}, ${sqlLiteral(vehicle.version ?? null)});`;
}

function buildShipUpsertSql(ship) {
  return `insert into public.ships (
  wiki_uuid, uex_uuid, name, slug, manufacturer, size_class, career, role,
  crew_min, crew_max, cargo_scu, medical_tier, is_ship, is_ground_vehicle,
  primary_category_id, source_confidence, review_status, last_synced_at
)
values (
  ${sqlLiteral(ship.wikiUuid)}, ${sqlLiteral(ship.uexUuid)}, ${sqlLiteral(ship.name)}, ${sqlLiteral(ship.slug)},
  ${sqlLiteral(ship.manufacturer)}, ${sqlLiteral(ship.sizeClass)}, ${sqlLiteral(ship.career)}, ${sqlLiteral(ship.role)},
  ${sqlNumber(ship.crewMin)}, ${sqlNumber(ship.crewMax)}, ${sqlNumber(ship.cargoScu)}, ${sqlLiteral(ship.medicalTier)},
  ${sqlBoolean(ship.isShip)}, ${sqlBoolean(ship.isGroundVehicle)}, ${categorySubquery(ship.primaryCategoryKey)},
  'wiki_primary', 'needs_review', now()
)
on conflict (slug) do update
set
  wiki_uuid = excluded.wiki_uuid,
  name = excluded.name,
  manufacturer = excluded.manufacturer,
  size_class = excluded.size_class,
  career = excluded.career,
  role = excluded.role,
  crew_min = excluded.crew_min,
  crew_max = excluded.crew_max,
  cargo_scu = excluded.cargo_scu,
  medical_tier = excluded.medical_tier,
  is_ship = excluded.is_ship,
  is_ground_vehicle = excluded.is_ground_vehicle,
  primary_category_id = excluded.primary_category_id,
  source_confidence = 'wiki_primary',
  last_synced_at = now(),
  updated_at = now();`;
}

function buildSubcategorySql(ship) {
  return ship.subcategoryKeys.map((key) => `insert into public.ship_subcategory_assignments (ship_id, subcategory_id, source, is_manual_override)
values (${shipSubquery(ship.slug)}, ${subcategorySubquery(key)}, 'wiki', false)
on conflict (ship_id, subcategory_id) do update
set source = excluded.source;`);
}

function buildMediaSql(ship) {
  return ship.media.map((media) => `insert into public.ship_media (
  ship_id, source_system_id, source, original_url, thumbnail_url, width, height,
  thumbnail_width, thumbnail_height, is_primary, sort_order
)
values (
  ${shipSubquery(ship.slug)}, ${sourceSystemSubquery('star_citizen_wiki')}, ${sqlLiteral(media.source)},
  ${sqlLiteral(media.originalUrl)}, ${sqlLiteral(media.thumbnailUrl)}, ${sqlNumber(media.width)}, ${sqlNumber(media.height)},
  ${sqlNumber(media.thumbnailWidth)}, ${sqlNumber(media.thumbnailHeight)}, ${sqlBoolean(media.isPrimary)}, ${sqlNumber(media.sortOrder)}
);`);
}

export function buildVehicleSyncSql({ pages }) {
  const vehicles = pages.flatMap((page) => page.payload.data ?? []);
  const ships = vehicles
    .map(normalizeShip)
    .filter((ship) => ship.name && ship.slug);
  const slugList = ships.map((ship) => sqlLiteral(ship.slug)).join(', ');
  const currentShipFilter = slugList
    ? `(select id from public.ships where slug in (${slugList}))`
    : '(select id from public.ships where false)';

  const statements = [
    'begin;',
    ...vehicles.map(buildSourceSnapshotSql),
    ...ships.map(buildShipUpsertSql),
    `delete from public.ship_media
where source = 'wiki'
  and ship_id in ${currentShipFilter};`,
    `delete from public.ship_subcategory_assignments
where source = 'wiki'
  and is_manual_override = false
  and ship_id in ${currentShipFilter};`,
    ...ships.flatMap(buildSubcategorySql),
    ...ships.flatMap(buildMediaSql),
    'commit;',
  ];

  return `${statements.join('\n\n')}\n`;
}
