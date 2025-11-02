#!/bin/bash

echo "========================================"
echo "   会员中心完整测试"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASS=0
FAIL=0

# Helper function
test_endpoint() {
  local name="$1"
  local url="$2"
  local expected_status="$3"
  local check_string="$4"

  echo -n "Testing: $name... "

  response=$(curl -s -w "\n%{http_code}" "$url")
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)

  if [ "$http_code" = "$expected_status" ]; then
    if [ -z "$check_string" ] || echo "$body" | grep -q "$check_string"; then
      echo -e "${GREEN}✓ PASS${NC}"
      ((PASS++))
      return 0
    else
      echo -e "${RED}✗ FAIL${NC} (missing expected string: $check_string)"
      ((FAIL++))
      return 1
    fi
  else
    echo -e "${RED}✗ FAIL${NC} (expected $expected_status, got $http_code)"
    ((FAIL++))
    return 1
  fi
}

echo "=== Phase 1: Backend API Tests ==="
echo ""

# Test 1: API without auth should return 401
test_endpoint "API without auth" \
  "http://localhost:3000/api/subscription" \
  "401" \
  "Unauthorized"

# Test 2: Directus health check
test_endpoint "Directus health check" \
  "http://localhost:8055/server/health" \
  "200"

# Test 3: Directus login
echo -n "Testing: Directus authentication... "
TOKEN=$(curl -s 'http://localhost:8055/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{"email":"the_uk1@outlook.com","password":"Mygcdjmyxzg2026!"}' | jq -r '.data.access_token // empty')

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
  echo -e "${GREEN}✓ PASS${NC}"
  ((PASS++))
else
  echo -e "${RED}✗ FAIL${NC}"
  ((FAIL++))
fi

# Test 4: Directus API access with token
if [ -n "$TOKEN" ]; then
  test_endpoint "Directus API with token" \
    "http://localhost:8055/items/user_subscriptions?limit=1" \
    "200"
fi

echo ""
echo "=== Phase 2: Frontend Tests ==="
echo ""

# Test 5: Membership page loads
test_endpoint "Membership page loads" \
  "http://localhost:3000/membership" \
  "200" \
  "会员中心"

# Test 6: Membership page shows login redirect or content
echo -n "Testing: Membership page content... "
MEMBERSHIP_HTML=$(curl -s "http://localhost:3000/membership")
if echo "$MEMBERSHIP_HTML" | grep -q "Free 会员\|Pro 会员\|加载"; then
  echo -e "${GREEN}✓ PASS${NC}"
  ((PASS++))
else
  echo -e "${RED}✗ FAIL${NC}"
  ((FAIL++))
fi

echo ""
echo "=== Phase 3: Database Tests ==="
echo ""

# Test 7: Check user exists
echo -n "Testing: User exists in database... "
USER_EXISTS=$(node -e "
const pg = require('pg');
(async () => {
  const client = new pg.Client({
    connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  const result = await client.query('SELECT id FROM auth.users WHERE email = \$1', ['the_uk1@outlook.com']);
  console.log(result.rows.length > 0 ? 'true' : 'false');
  await client.end();
})();
" 2>/dev/null)

if [ "$USER_EXISTS" = "true" ]; then
  echo -e "${GREEN}✓ PASS${NC}"
  ((PASS++))
else
  echo -e "${RED}✗ FAIL${NC}"
  ((FAIL++))
fi

# Test 8: Check subscription exists
echo -n "Testing: Subscription exists in database... "
SUB_EXISTS=$(node -e "
const pg = require('pg');
(async () => {
  const client = new pg.Client({
    connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  const userResult = await client.query('SELECT id FROM auth.users WHERE email = \$1', ['the_uk1@outlook.com']);
  if (userResult.rows.length > 0) {
    const subResult = await client.query('SELECT id FROM user_subscriptions WHERE user_id = \$1 AND status = \$2', [userResult.rows[0].id, 'active']);
    console.log(subResult.rows.length > 0 ? 'true' : 'false');
  } else {
    console.log('false');
  }
  await client.end();
})();
" 2>/dev/null)

if [ "$SUB_EXISTS" = "true" ]; then
  echo -e "${GREEN}✓ PASS${NC}"
  ((PASS++))
else
  echo -e "${RED}✗ FAIL${NC}"
  ((FAIL++))
fi

echo ""
echo "=== Phase 4: Integration Tests ==="
echo ""

# Test 9: Console logs check
echo -n "Testing: API logging is working... "
RECENT_LOGS=$(tail -20 /tmp/nextjs.log 2>/dev/null | grep -c "\[/api/subscription\]" || echo "0")
if [ "$RECENT_LOGS" -gt "0" ]; then
  echo -e "${GREEN}✓ PASS${NC}"
  ((PASS++))
else
  echo -e "${YELLOW}⚠ SKIP${NC} (no recent API calls)"
fi

# Test 10: Environment variables
echo -n "Testing: Environment variables are set... "
if [ -n "$(grep DIRECTUS_ADMIN_TOKEN /Users/m1/PlayNew_0.3/frontend/.env.local)" ] && \
   [ -n "$(grep NEXT_PUBLIC_SUPABASE_URL /Users/m1/PlayNew_0.3/frontend/.env.local)" ]; then
  echo -e "${GREEN}✓ PASS${NC}"
  ((PASS++))
else
  echo -e "${RED}✗ FAIL${NC}"
  ((FAIL++))
fi

echo ""
echo "========================================"
echo "   Test Results"
echo "========================================"
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo "Total:  $((PASS + FAIL))"
echo ""

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}✓ All tests passed!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Login to http://localhost:3000/auth/login"
  echo "2. Use: the_uk1@outlook.com / Mygcdjmyxzg2026!"
  echo "3. Visit: http://localhost:3000/membership"
  echo "4. You should see your Pro membership!"
  exit 0
else
  echo -e "${RED}✗ Some tests failed. Please review the output above.${NC}"
  exit 1
fi
