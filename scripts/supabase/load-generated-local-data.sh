#!/usr/bin/env bash
set -euo pipefail

container="${SUPABASE_DB_CONTAINER:-supabase_db_CIG_Fleet_App}"

if ! docker ps --format '{{.Names}}' | grep -qx "$container"; then
  echo "Supabase database container is not running: $container" >&2
  echo "Start it with: supabase start" >&2
  exit 1
fi

npm run staffing:generate-reviewed

for file in supabase/generated/wiki-vehicles-sync/*.sql supabase/generated/reviewed-staffing-templates/*.sql; do
  echo "Loading $file"
  docker exec -i "$container" psql -v ON_ERROR_STOP=1 -U postgres -d postgres < "$file" >/dev/null
done
