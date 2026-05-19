#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT_DIR/apps/server/.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "✗ Missing apps/server/.env"
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [[ -z "${SUPABASE_URL:-}" || -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]]; then
  echo "✗ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required in apps/server/.env"
  exit 1
fi

HTTP_CODE="$(curl -s -o /tmp/kupa-schema-probe.json -w "%{http_code}" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  "$SUPABASE_URL/rest/v1/profiles?select=id&limit=1")"

if [[ "$HTTP_CODE" == "200" ]]; then
  echo "✓ Supabase schema OK (profiles table reachable)"
  exit 0
fi

echo "✗ Supabase schema not ready (HTTP $HTTP_CODE)"
cat /tmp/kupa-schema-probe.json 2>/dev/null || true
echo ""
echo "  → Run apps/server/db/schema.sql in Supabase SQL Editor"
exit 1
