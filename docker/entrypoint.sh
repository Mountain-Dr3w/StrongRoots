#!/bin/sh
set -e

if [ -z "${DATABASE_URL}" ]; then
  echo "DATABASE_URL is required"
  exit 1
fi

echo "[entrypoint] applying schema via drizzle-kit push..."
node /app/node_modules/drizzle-kit/bin.cjs push

echo "[entrypoint] starting Next.js server..."
exec "$@"
