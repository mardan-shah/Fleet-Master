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

# Try to connect to the specific database
if npx prisma db execute --url "$DATABASE_URL" --stdin <<EOF
SELECT 1;
EOF
then
    echo "Database '$DB_NAME' already exists."
else
    echo "Database '$DB_NAME' does not exist. Attempting to create it..."
    
    # Construct POSTGRES_URL to connect to the default 'postgres' database
    # 1. Get everything before the last slash
    BEFORE_LAST_SLASH=$(echo "$DATABASE_URL" | rev | cut -d'/' -f2- | rev)
    # 2. Get the query part (if any)
    QUERY_CONTENT=$(echo "$DATABASE_URL" | cut -d'?' -f2- -s)
    
    if [ -n "$QUERY_CONTENT" ]; then
        POSTGRES_URL="${BEFORE_LAST_SLASH}/postgres?${QUERY_CONTENT}"
    else
        POSTGRES_URL="${BEFORE_LAST_SLASH}/postgres"
    fi
    
    echo "Connecting to default 'postgres' database to create '$DB_NAME'..."
    npx prisma db execute --url "$POSTGRES_URL" --stdin <<EOF
CREATE DATABASE "$DB_NAME";
EOF
    echo "Database '$DB_NAME' created successfully."
fi

# Execute the original command (npm run start)
echo "Starting application..."
exec "$@"
