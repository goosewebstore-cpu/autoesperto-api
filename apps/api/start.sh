#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ]; then
  echo "Running Prisma db push..."
  npx prisma db push --skip-generate
else
  echo "DATABASE_URL not configured; starting without database persistence."
fi

echo "Starting API server..."
exec node dist/index.js
