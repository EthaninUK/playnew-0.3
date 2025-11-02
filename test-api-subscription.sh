#!/bin/bash

echo "=== Testing /api/subscription endpoint ==="

# First login to get session
echo -e "\n1. Login to get session cookie..."
COOKIE_FILE=$(mktemp)
curl -s -c $COOKIE_FILE 'http://localhost:3000/api/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{"email":"the_uk1@outlook.com","password":"Mygcdjmyxzg2026!"}' | jq '.'

echo -e "\n2. Get subscription data..."
curl -s -b $COOKIE_FILE 'http://localhost:3000/api/subscription' | jq '.'

# Clean up
rm -f $COOKIE_FILE

echo -e "\n=== Testing Directus /items/user_subscriptions directly ==="
USER_ID="24da5b63-cda3-424d-b98e-dfa32cb61278"

# Get admin token
echo -e "\n3. Getting Directus admin token..."
TOKEN=$(curl -s 'http://localhost:8055/auth/login' \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"the_uk1@outlook.com\",\"password\":\"Mygcdjmyxzg2026!\"}" | jq -r '.data.access_token')

echo "Token: ${TOKEN:0:20}..."

echo -e "\n4. Testing Directus API for user_subscriptions..."
curl -s "http://localhost:8055/items/user_subscriptions?filter[user_id][_eq]=$USER_ID&filter[status][_eq]=active&fields=*,membership_id.*" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
