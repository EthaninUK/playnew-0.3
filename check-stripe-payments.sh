#!/bin/bash

echo "=== Checking Recent Stripe Payments ==="
echo ""

# Get Stripe secret key from .env.local
STRIPE_KEY=$(grep "STRIPE_SECRET_KEY=" /Users/m1/PlayNew_0.3/frontend/.env.local | cut -d'=' -f2)

if [ -z "$STRIPE_KEY" ]; then
  echo "❌ Stripe secret key not found"
  exit 1
fi

echo "1. Recent Payment Intents (last 5):"
curl -s https://api.stripe.com/v1/payment_intents?limit=5 \
  -u "${STRIPE_KEY}:" \
  -G | jq -r '.data[] | "\n- Amount: \(.amount/100) \(.currency | ascii_upcase)\n  Status: \(.status)\n  Created: \(.created | strftime("%Y-%m-%d %H:%M:%S"))\n  Customer: \(.customer // "N/A")"'

echo ""
echo "2. Recent Subscriptions (last 5):"
curl -s https://api.stripe.com/v1/subscriptions?limit=5 \
  -u "${STRIPE_KEY}:" \
  -G | jq -r '.data[] | "\n- Subscription ID: \(.id)\n  Status: \(.status)\n  Customer: \(.customer)\n  Plan: \(.items.data[0].price.id)\n  Amount: \(.items.data[0].price.unit_amount/100) \(.items.data[0].price.currency | ascii_upcase)\n  Created: \(.created | strftime("%Y-%m-%d %H:%M:%S"))\n  Current Period: \(.current_period_start | strftime("%Y-%m-%d")) to \(.current_period_end | strftime("%Y-%m-%d"))"'

echo ""
echo "3. Recent Customers (last 5):"
curl -s https://api.stripe.com/v1/customers?limit=5 \
  -u "${STRIPE_KEY}:" \
  -G | jq -r '.data[] | "\n- Customer ID: \(.id)\n  Email: \(.email // "N/A")\n  Created: \(.created | strftime("%Y-%m-%d %H:%M:%S"))"'

echo ""
echo "=== Check Complete ==="
