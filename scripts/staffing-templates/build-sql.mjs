import { sqlBoolean, sqlLiteral, sqlNumber } from '../wiki-sync/normalize.mjs';
import { deriveTemplatesForVehicle } from './derive.mjs';

function shipSubquery(slug) {
  return `(select id from public.ships where slug = ${sqlLiteral(slug)})`;
}

function profileSubquery(key) {
  return `(select id from public.staffing_profiles where key = ${sqlLiteral(key)})`;
}

function buildTemplateInsertSql(vehicle, template) {
  return `insert into public.ship_position_templates (
  ship_id, staffing_profile_id, role_type, label, required, min_count, max_count,
  can_transition_to_fps, sort_order, source, review_status
)
values (
  ${shipSubquery(vehicle.slug)}, ${profileSubquery(template.staffingProfileKey)}, ${sqlLiteral(template.roleType)}, ${sqlLiteral(template.label)},
  ${sqlBoolean(template.required)}, ${sqlNumber(template.minCount)}, ${sqlNumber(template.maxCount)},
  ${sqlBoolean(template.canTransitionToFps)}, ${sqlNumber(template.sortOrder)}, 'wiki_suggested', 'needs_review'
);`;
}

export function buildStaffingTemplateSql({ vehicles }) {
  const supportedVehicles = vehicles.filter((vehicle) => vehicle.slug);
  const slugs = supportedVehicles.map((vehicle) => sqlLiteral(vehicle.slug)).join(', ');
  const shipFilter = slugs
    ? `(select id from public.ships where slug in (${slugs}))`
    : '(select id from public.ships where false)';

  const statements = [
    'begin;',
    `delete from public.ship_position_templates
where source = 'wiki_suggested'
  and review_status = 'needs_review'
  and ship_id in ${shipFilter};`,
    ...supportedVehicles.flatMap((vehicle) => deriveTemplatesForVehicle(vehicle)
      .map((template) => buildTemplateInsertSql(vehicle, template))),
    'commit;',
  ];

  return `${statements.join('\n\n')}\n`;
}
