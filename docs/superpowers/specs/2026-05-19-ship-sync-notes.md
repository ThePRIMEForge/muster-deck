# Ship Sync Notes

Date: 2026-05-19

## Source Priority

Star Citizen Wiki API is primary for patch `4.8.0-LIVE.11825000`.

UEX is secondary enrichment. UEX fields can suggest subcategories, but UEX must not overwrite newer Wiki fields without review.

CCU Game is deferred as a media enrichment source. A read-only investigation on 2026-05-19 found no stable public CCU Game ship-image catalog API. Its frontend appears to reference RSI runtime data, private Firestore paths, or partner commerce data rather than a complete public catalog. Do not depend on CCU Game bundles, private Firestore paths, or partner store JSON for fleet-manager catalog media.

## Normalization Rules

- Match ships by Wiki UUID when present.
- Store UEX UUID separately.
- Use slug fallback only when UUID matching is not available.
- Store every raw source response in `source_snapshots`.
- Store ship images in `ship_media`, preserving original and thumbnail URLs when available.
- Prefer Wiki image metadata for the first sync because vehicle responses include source, original URL, thumbnail URL, and dimensions.
- Revisit RSI-hosted media later only if we can confirm acceptable public usage and obtain stable media IDs from an appropriate source.
- Update `ships.last_synced_at` when normalized fields are refreshed.
- Mark ship records as `needs_review` when source fields conflict.

## Position Template Rules

- API data can suggest position templates.
- Human-reviewed templates are the source of truth.
- Existing fleet events keep copied positions even when global templates change.

## First Sync Scope

- Fetch Wiki vehicles.
- Insert raw Wiki snapshots.
- Upsert canonical ships.
- Upsert Wiki image metadata into `ship_media`.
- Assign primary category when a safe rule exists.
- Assign subcategories only when source data clearly supports them.
- Leave uncertain ships with `review_status = needs_review`.
