#!/bin/bash

echo "=== Verifying Refunds ==="
echo ""

STRIPE_KEY=$(grep "STRIPE_SECRET_KEY=" /Users/m1/PlayNew_0.3/frontend/.env.local | cut -d'=' -f2)

echo "1. Recent Refunds:"
curl -s https://api.stripe.com/v1/refunds?limit=5 \
  -u "${STRIPE_KEY}:" \
  -G | jq -r '.data[] | "\n- Refund ID: \(.id)\n  Amount: $\(.amount/100)\n  Status: \(.status)\n  Payment Intent: \(.payment_intent)\n  Created: \(.created | strftime("%Y-%m-%d %H:%M:%S"))"'

echo ""
echo "2. Customer Balance for the_uk2 accounts:"
echo ""
echo "Customer cus_TJw8FauzKRaPxa ($39):"
curl -s https://api.stripe.com/v1/customers/cus_TJw8FauzKRaPxa \
  -u "${STRIPE_KEY}:" \
  -G | jq -r '"  Email: \(.email)\n  Balance: $\(.balance/100)"'

echo ""
echo "Customer cus_TJw9gkqRWlpldG ($200):"
curl -s https://api.stripe.com/v1/customers/cus_TJw9gkqRWlpldG \
  -u "${STRIPE_KEY}:" \
  -G | jq -r '"  Email: \(.email)\n  Balance: $\(.balance/100)"'

echo ""
echo "=== Verification Complete ==="
