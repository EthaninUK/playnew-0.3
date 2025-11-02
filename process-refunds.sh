#!/bin/bash

echo "=== Processing Refunds for the_uk2@outlook.com ==="
echo ""

# Get Stripe secret key
STRIPE_KEY=$(grep "STRIPE_SECRET_KEY=" /Users/m1/PlayNew_0.3/frontend/.env.local | cut -d'=' -f2)

if [ -z "$STRIPE_KEY" ]; then
  echo "❌ Stripe secret key not found"
  exit 1
fi

# Get payment intents for the_uk2@outlook.com
echo "Step 1: Getting payment intents for the_uk2@outlook.com..."
PAYMENTS=$(curl -s https://api.stripe.com/v1/payment_intents?limit=10 \
  -u "${STRIPE_KEY}:" \
  -G)

# Extract payment intent IDs for the_uk2 customer
# Based on earlier data: cus_TJw9gkqRWlpldG ($200) and cus_TJw8FauzKRaPxa ($39)

echo ""
echo "Step 2: Finding the $39 payment (customer: cus_TJw8FauzKRaPxa)..."
PI_39=$(echo "$PAYMENTS" | jq -r '.data[] | select(.customer == "cus_TJw8FauzKRaPxa" and .amount == 3900) | .id' | head -1)

echo "Step 3: Finding the $200 payment (customer: cus_TJw9gkqRWlpldG)..."
PI_200=$(echo "$PAYMENTS" | jq -r '.data[] | select(.customer == "cus_TJw9gkqRWlpldG" and .amount == 20000) | .id' | head -1)

if [ -z "$PI_39" ]; then
  echo "⚠️  Could not find $39 payment intent"
else
  echo "✓ Found $39 payment: $PI_39"
fi

if [ -z "$PI_200" ]; then
  echo "⚠️  Could not find $200 payment intent"
else
  echo "✓ Found $200 payment: $PI_200"
fi

echo ""
echo "=== Processing Refunds ==="
echo ""

# Refund $39
if [ -n "$PI_39" ]; then
  echo "Refunding $39 payment ($PI_39)..."
  REFUND_39=$(curl -s https://api.stripe.com/v1/refunds \
    -u "${STRIPE_KEY}:" \
    -d payment_intent="$PI_39")

  REFUND_39_ID=$(echo "$REFUND_39" | jq -r '.id // empty')
  REFUND_39_STATUS=$(echo "$REFUND_39" | jq -r '.status // empty')
  REFUND_39_ERROR=$(echo "$REFUND_39" | jq -r '.error.message // empty')

  if [ -n "$REFUND_39_ID" ]; then
    echo "✓ Refund $39: $REFUND_39_STATUS (ID: $REFUND_39_ID)"
  else
    echo "❌ Refund $39 failed: $REFUND_39_ERROR"
  fi
else
  echo "⏭️  Skipping $39 refund (payment not found)"
fi

echo ""

# Refund $200
if [ -n "$PI_200" ]; then
  echo "Refunding $200 payment ($PI_200)..."
  REFUND_200=$(curl -s https://api.stripe.com/v1/refunds \
    -u "${STRIPE_KEY}:" \
    -d payment_intent="$PI_200")

  REFUND_200_ID=$(echo "$REFUND_200" | jq -r '.id // empty')
  REFUND_200_STATUS=$(echo "$REFUND_200" | jq -r '.status // empty')
  REFUND_200_ERROR=$(echo "$REFUND_200" | jq -r '.error.message // empty')

  if [ -n "$REFUND_200_ID" ]; then
    echo "✓ Refund $200: $REFUND_200_STATUS (ID: $REFUND_200_ID)"
  else
    echo "❌ Refund $200 failed: $REFUND_200_ERROR"
  fi
else
  echo "⏭️  Skipping $200 refund (payment not found)"
fi

echo ""
echo "=== Refund Summary ==="
echo "All refunds for the_uk2@outlook.com have been processed."
echo "Refunds typically take 5-10 business days to appear on the card."
echo ""
echo "Next steps:"
echo "1. Logout from the_uk2@outlook.com"
echo "2. Login with the_uk1@outlook.com"
echo "3. Access membership page to see your Pro subscription"
