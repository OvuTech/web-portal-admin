#!/bin/bash

# Script to approve a partner directly via the API using curl
#
# Usage:
#   ./scripts/approve-partner.sh <partner_id> <admin_token>
#
# Example:
#   ./scripts/approve-partner.sh 6931d4fafcd8804e9bb8d9ed "Bearer your_admin_token_here"

API_URL="${API_URL:-https://ovu-transport-staging.fly.dev}"
PARTNER_ID="$1"
ADMIN_TOKEN="$2"

if [ -z "$PARTNER_ID" ] || [ -z "$ADMIN_TOKEN" ]; then
  echo "Usage: ./scripts/approve-partner.sh <partner_id> <admin_token>"
  echo ""
  echo "Example:"
  echo "  ./scripts/approve-partner.sh 6931d4fafcd8804e9bb8d9ed \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\""
  exit 1
fi

# Ensure token starts with "Bearer "
if [[ ! "$ADMIN_TOKEN" =~ ^Bearer ]]; then
  ADMIN_TOKEN="Bearer $ADMIN_TOKEN"
fi

echo "Approving partner $PARTNER_ID..."

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "${API_URL}/api/v1/admin/partners/${PARTNER_ID}/approve" \
  -H "Content-Type: application/json" \
  -H "Authorization: ${ADMIN_TOKEN}" \
  -d '{
    "action": "approve",
    "rate_limit_per_minute": 100,
    "rate_limit_per_day": 10000,
    "notes": "Approved via script"
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 300 ]; then
  echo "✅ Partner approved successfully!"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
  echo "❌ Failed to approve partner (HTTP $HTTP_CODE):"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
  exit 1
fi


