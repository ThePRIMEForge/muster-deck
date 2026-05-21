create or replace view public.ship_staffing_template_summary
with (security_invoker = true)
as
select
  ship.id as ship_id,
  ship.slug as ship_slug,
  ship.name as ship_name,
  profile.key as staffing_profile_key,
  profile.name as staffing_profile_name,
  template.role_type,
  template.label,
  template.required,
  template.min_count,
  template.max_count,
  template.can_transition_to_fps,
  template.sort_order,
  template.source,
  template.review_status,
  template.updated_at
from public.ship_position_templates as template
join public.ships as ship
  on ship.id = template.ship_id
join public.staffing_profiles as profile
  on profile.id = template.staffing_profile_id
where template.review_status = 'reviewed';

comment on view public.ship_staffing_template_summary is
  'Reviewed ship staffing template read model for Fleet Command setup presets and custom position editing.';

grant select on public.ship_staffing_template_summary to anon, authenticated;
