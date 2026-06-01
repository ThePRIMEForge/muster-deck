create or replace view public.ship_catalog_summary
with (security_invoker = true)
as
select
  ship.id,
  ship.slug,
  ship.name,
  ship.manufacturer,
  ship.size_class,
  ship.career,
  ship.role,
  ship.crew_min,
  ship.crew_max,
  ship.cargo_scu,
  ship.medical_tier,
  ship.is_ship,
  ship.is_ground_vehicle,
  primary_category.id as primary_category_id,
  primary_category.key as primary_category_key,
  primary_category.name as primary_category_name,
  primary_category.sort_order as primary_category_sort_order,
  media.primary_image_url,
  media.thumbnail_image_url,
  coalesce(
    array_agg(subcategory.key order by subcategory.sort_order)
      filter (where subcategory.id is not null),
    array[]::text[]
  ) as subcategory_keys,
  coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', subcategory.id,
        'key', subcategory.key,
        'name', subcategory.name
      )
      order by subcategory.sort_order
    )
      filter (where subcategory.id is not null),
    '[]'::jsonb
  ) as subcategories,
  ship.source_confidence,
  ship.review_status,
  ship.last_synced_at,
  ship.updated_at
from public.ships as ship
left join public.ship_primary_categories as primary_category
  on primary_category.id = ship.primary_category_id
left join public.ship_subcategory_assignments as assignment
  on assignment.ship_id = ship.id
left join public.ship_subcategories as subcategory
  on subcategory.id = assignment.subcategory_id
left join lateral (
  select
    coalesce(ship_media.original_url, ship_media.thumbnail_url) as primary_image_url,
    coalesce(ship_media.thumbnail_url, ship_media.original_url) as thumbnail_image_url
  from public.ship_media
  where ship_media.ship_id = ship.id
  order by ship_media.is_primary desc, ship_media.sort_order, ship_media.fetched_at desc, ship_media.id
  limit 1
) as media on true
group by
  ship.id,
  primary_category.id,
  media.primary_image_url,
  media.thumbnail_image_url;

comment on view public.ship_catalog_summary is
  'Flattened ship catalog read model with primary category, subcategories, and preferred image URL for app browsing.';

create or replace view public.fleet_event_ship_request_summary
with (security_invoker = true)
as
select
  request.id,
  request.fleet_event_id,
  event.code as fleet_event_code,
  event.name as fleet_event_name,
  request.ship_id,
  ship.slug as ship_slug,
  ship.name as ship_name,
  request.primary_category_id,
  request_category.key as requested_primary_category_key,
  request_category.name as requested_primary_category_name,
  coalesce(ship_category.key, request_category.key) as resolved_primary_category_key,
  coalesce(ship_category.name, request_category.name) as resolved_primary_category_name,
  request.requested_count,
  request.team_id,
  team.name as team_name,
  team.parent_team_id,
  request.staffing_profile_id,
  staffing_profile.key as staffing_profile_key,
  staffing_profile.name as staffing_profile_name,
  staffing_profile.color as staffing_profile_color,
  request.is_exact_ship_required,
  request.substitution_policy,
  (
    event.ship_roster_locked
    or coalesce(team.ship_roster_locked, false)
    or request.substitution_policy = 'locked'
  ) as effective_ship_roster_locked,
  request.notes,
  coalesce(
    sum(position.min_count) filter (where position.required),
    0
  )::integer as required_positions_min,
  coalesce(
    sum(coalesce(position.max_count, position.min_count)) filter (where position.required),
    0
  )::integer as required_positions_max,
  coalesce(
    sum(position.min_count) filter (where not position.required),
    0
  )::integer as optional_positions_min,
  coalesce(
    sum(coalesce(position.max_count, position.min_count)) filter (where not position.required),
    0
  )::integer as optional_positions_max,
  count(distinct position.id)::integer as position_type_count,
  count(distinct assignment.id)
    filter (
      where assignment.assignment_type = 'ship_position'
        and assignment.status = 'assigned'
    )::integer as assigned_position_count,
  count(distinct suggestion.id)
    filter (where suggestion.status = 'pending')::integer as pending_ship_suggestion_count,
  request.created_at,
  request.updated_at
from public.fleet_event_ship_requests as request
join public.fleet_events as event
  on event.id = request.fleet_event_id
left join public.ships as ship
  on ship.id = request.ship_id
left join public.ship_primary_categories as request_category
  on request_category.id = request.primary_category_id
left join public.ship_primary_categories as ship_category
  on ship_category.id = ship.primary_category_id
left join public.teams as team
  on team.id = request.team_id
left join public.staffing_profiles as staffing_profile
  on staffing_profile.id = request.staffing_profile_id
left join public.fleet_event_positions as position
  on position.fleet_event_ship_request_id = request.id
left join public.assignments as assignment
  on assignment.fleet_event_position_id = position.id
  and assignment.fleet_event_ship_request_id = request.id
left join public.fleet_event_ship_suggestions as suggestion
  on suggestion.fleet_event_ship_request_id = request.id
group by
  request.id,
  event.id,
  ship.id,
  request_category.id,
  ship_category.id,
  team.id,
  staffing_profile.id;

comment on view public.fleet_event_ship_request_summary is
  'Fleet event read model for requested ships/categories, staffing totals, assigned positions, pending ship suggestions, and effective ship roster lock state.';

grant select on public.ship_catalog_summary to anon, authenticated;
grant select on public.fleet_event_ship_request_summary to anon, authenticated;
