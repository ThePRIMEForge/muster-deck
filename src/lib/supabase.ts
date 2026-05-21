import { createClient } from '@supabase/supabase-js';
import type { ShipCatalogRow, ShipStaffingTemplateSummaryRow } from './types';

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
