#!/bin/bash

# Directus database credentials
export PGPASSWORD="Mygcdjmyxzg2026!"
DB_HOST="localhost"
DB_USER="directus"
DB_NAME="directus_play"

echo "🔧 Setting up arbitrage_types public permissions via SQL..."

# Get Public role and policy IDs
PUBLIC_ROLE_ID=$(psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -c "SELECT id FROM directus_roles WHERE name = 'Public' LIMIT 1;" | xargs)
PUBLIC_POLICY_ID=$(psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -c "SELECT id FROM directus_policies WHERE name = 'Public Access' LIMIT 1;" | xargs)

echo "Public Role ID: $PUBLIC_ROLE_ID"
echo "Public Policy ID: $PUBLIC_POLICY_ID"

if [ -z "$PUBLIC_POLICY_ID" ]; then
  echo "❌ Public Access policy not found. Creating one..."
  PUBLIC_POLICY_ID=$(psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -c "
    INSERT INTO directus_policies (id, name, icon, description, ip_access, enforce_tfa, admin_access, app_access)
    VALUES (gen_random_uuid(), 'Public Access', 'public', 'Public access policy', NULL, false, false, false)
    RETURNING id;
  " | xargs)
  echo "✅ Created policy: $PUBLIC_POLICY_ID"

  # Link role to policy
  psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "
    INSERT INTO directus_access (id, role, \"user\", policy, sort)
    VALUES (gen_random_uuid(), '$PUBLIC_ROLE_ID', NULL, '$PUBLIC_POLICY_ID', 1)
    ON CONFLICT DO NOTHING;
  "
  echo "✅ Linked role to policy"
fi

# Check if permission already exists
EXISTING_PERM=$(psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -c "
  SELECT id FROM directus_permissions
  WHERE policy = '$PUBLIC_POLICY_ID'
  AND collection = 'arbitrage_types'
  AND action = 'read'
  LIMIT 1;
" | xargs)

if [ -n "$EXISTING_PERM" ]; then
  echo "ℹ️  Permission already exists, deleting old one..."
  psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "DELETE FROM directus_permissions WHERE id = '$EXISTING_PERM';"
fi

# Create read permission for arbitrage_types
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "
  INSERT INTO directus_permissions (id, policy, collection, action, permissions, validation, fields)
  VALUES (
    gen_random_uuid(),
    '$PUBLIC_POLICY_ID',
    'arbitrage_types',
    'read',
    '{\"status\": {\"_eq\": \"published\"}}',
    '{}',
    '*'
  );
"

if [ $? -eq 0 ]; then
  echo "✅ Successfully created public read permission for arbitrage_types"
  echo ""
  echo "🎉 All done! Please refresh your browser."
  echo "   Visit: http://localhost:3000/arbitrage/types"
else
  echo "❌ Failed to create permission"
  exit 1
fi
