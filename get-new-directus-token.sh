#!/bin/bash

echo "=== Getting fresh Directus admin token ==="

TOKEN=$(curl -s 'http://localhost:8055/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{"email":"the_uk1@outlook.com","password":"Mygcdjmyxzg2026!"}' | jq -r '.data.access_token')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ Failed to get token"
  exit 1
fi

echo "✓ Got new token: ${TOKEN:0:30}..."
echo ""
echo "Token length: ${#TOKEN}"
echo ""
echo "Please update .env.local with:"
echo "DIRECTUS_ADMIN_TOKEN=$TOKEN"
