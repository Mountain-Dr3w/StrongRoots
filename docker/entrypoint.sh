#!/bin/sh
set -e

if [ -z "${DATABASE_URL}" ]; then
  echo "DATABASE_URL is required"
  exit 1
fi

echo "[entrypoint] applying migrations..."
node /app/scripts/migrate.mjs

echo "[entrypoint] starting Next.js server..."
exec "$@"
