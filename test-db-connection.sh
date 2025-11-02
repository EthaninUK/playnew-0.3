#!/bin/bash

# Test database connection to Supabase

echo "Testing Supabase connection..."
echo ""

DB_HOST="db.cujpgrzjmmttysphjknu.supabase.co"
DB_PORT="5432"

echo "1. Testing DNS resolution..."
nslookup $DB_HOST
echo ""

echo "2. Testing TCP connection..."
nc -zv $DB_HOST $DB_PORT 2>&1
echo ""

echo "3. Try pinging host..."
ping -c 3 $DB_HOST || echo "Ping failed (this is normal for some hosts)"
echo ""

echo "If DNS fails, you may need to:"
echo "  - Use Supabase connection pooler instead"
echo "  - Check your Supabase project is active"
echo "  - Verify the hostname is correct"
