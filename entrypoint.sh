#!/bin/sh
set -e

# Extract DB name from DATABASE_URL
# Expected format: postgres://user:pass@host:port/dbname
DB_NAME=$(echo $DATABASE_URL | sed 's/.*\///' | sed 's/\?.*//')
DB_HOST=$(echo $DATABASE_URL | sed 's/.*@//' | sed 's/:.*//')
DB_USER=$(echo $DATABASE_URL | sed 's/.*\/\///' | sed 's/:.*//')

echo "Checking if database $DB_NAME exists on $DB_HOST..."

# Try to connect to the specific database
if npx prisma db execute --stdin <<EOF
SELECT 1;
EOF
then
    echo "Database $DB_NAME already exists."
else
    echo "Database $DB_NAME does not exist. Attempting to create it..."
    
    # Connect to the default 'postgres' database to create the new one
    # We replace the DB name in the URL with 'postgres'
    POSTGRES_URL=$(echo $DATABASE_URL | sed "s/\/$DB_NAME/\ /" | awk '{print $1"/postgres"}')
    
    npx prisma db execute --url "$POSTGRES_URL" --stdin <<EOF
CREATE DATABASE "$DB_NAME";
EOF
    echo "Database $DB_NAME created successfully."
fi

# Execute the original command
exec "$@"
