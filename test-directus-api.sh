#!/bin/bash

USER_ID="24da5b63-cda3-424d-b98e-dfa32cb61278"

echo "=== Getting Directus admin token ==="
TOKEN=$(curl -s 'http://localhost:8055/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{"email":"the_uk1@outlook.com","password":"Mygcdjmyxzg2026!"}' | jq -r '.data.access_token')

echo "Token obtained: ${TOKEN:0:30}..."

echo -e "\n=== Testing 1: Check if user_subscriptions collection exists ==="
curl -s "http://localhost:8055/collections/user_subscriptions" \
  -H "Authorization: Bearer $TOKEN"

echo -e "\n\n=== Testing 2: Get user_subscriptions without filters ==="
curl -s "http://localhost:8055/items/user_subscriptions?limit=5" \
  -H "Authorization: Bearer $TOKEN"

echo -e "\n\n=== Testing 3: Get user_subscriptions for specific user ==="
curl -s "http://localhost:8055/items/user_subscriptions?filter[user_id][_eq]=$USER_ID" \
  -H "Authorization: Bearer $TOKEN"

echo -e "\n\n=== Testing 4: Get user_subscriptions with membership join ==="
curl -s "http://localhost:8055/items/user_subscriptions?filter[user_id][_eq]=$USER_ID&fields=*,membership_id.*" \
  -H "Authorization: Bearer $TOKEN"

echo ""
