insert into public.ship_subcategories (key, name, description, sort_order)
values (
  'tractor_beam',
  'Tractor Beam',
  'Tractor beam utility, cargo handling, towing, or recovery role.',
  220
)
on conflict (key) do update
set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order;
