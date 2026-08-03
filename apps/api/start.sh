#!/bin/sh
set -e
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
REPO_ROOT=$(cd "$SCRIPT_DIR/../.." && pwd)
cd "$REPO_ROOT"
echo "Starting AutoEsperto API..."
if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL is required for accounts and saved analyses."
  exit 1
fi
if [ "${DATABASE_SCHEMA_SYNC:-true}" = "true" ]; then
  echo "Synchronizing the database schema..."
  npx prisma db push --schema=packages/database/prisma/schema.prisma --skip-generate
fi
exec node apps/api/dist/index.js
