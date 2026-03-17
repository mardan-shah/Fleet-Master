#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL is not set."
  exit 1
fi

# Extract DB name: everything after the last slash, but before the question mark
DB_NAME=$(echo "$DATABASE_URL" | sed 's/.*\///' | cut -d'?' -f1)
# Extract Host: everything between @ and the next : or /
DB_HOST=$(echo "$DATABASE_URL" | sed 's/.*@//' | cut -d':' -f1 | cut -d'/' -f1)

echo "Checking if database '$DB_NAME' exists on '$DB_HOST'..."

# In Prisma 7, db execute reads from DATABASE_URL in prisma.config.ts
# It does NOT accept the --url flag.
if npx prisma db execute --stdin <<EOF
SELECT 1;
EOF
then
    echo "Database '$DB_NAME' already exists."
else
    echo "Database '$DB_NAME' does not exist. Attempting to create it..."
    
    # Construct POSTGRES_URL to connect to the default 'postgres' database
    BEFORE_LAST_SLASH=$(echo "$DATABASE_URL" | rev | cut -d'/' -f2- | rev)
    QUERY_CONTENT=$(echo "$DATABASE_URL" | cut -d'?' -f2- -s)
    
    if [ -n "$QUERY_CONTENT" ]; then
        POSTGRES_URL="${BEFORE_LAST_SLASH}/postgres?${QUERY_CONTENT}"
    else
        POSTGRES_URL="${BEFORE_LAST_SLASH}/postgres"
    fi
    
    echo "Connecting to default 'postgres' database to create '$DB_NAME'..."
    # Temporarily override DATABASE_URL for this command
    DATABASE_URL="$POSTGRES_URL" npx prisma db execute --stdin <<EOF
CREATE DATABASE "$DB_NAME";
EOF
    echo "Database '$DB_NAME' created successfully."
fi

# Execute the original command (npm run start)
echo "Starting application..."
exec "$@"
