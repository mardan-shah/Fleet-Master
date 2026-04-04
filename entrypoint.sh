#!/bin/sh
set -e

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL is not set."
  exit 1
fi

echo "DATABASE_URL is set, starting application..."

# Execute the original command (npm run start)
# The start script will run: npx prisma db push && npx prisma db seed && next start
exec "$@"
