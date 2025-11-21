#!/usr/bin/env bash
set -euo pipefail

echo "Starting GoDaddy DNS update script..."

if [ -z "${GODADDY_KEY:-}" ] || [ -z "${GODADDY_SECRET:-}" ] || [ -z "${DOMAIN:-}" ] || [ -z "${RAILWAY_HOST:-}" ]; then
  echo "Error: GODADDY_KEY, GODADDY_SECRET, DOMAIN, and RAILWAY_HOST must be set." >&2
  exit 1
fi

# Default record name is 'www' (so www.example.com). For apex domain handling, user must configure forwarding or A record separately.
NAME=${GODADDY_RECORD_NAME:-www}

API_URL="https://api.godaddy.com/v1/domains/${DOMAIN}/records/CNAME/${NAME}"
BODY="[ { \"data\": \"${RAILWAY_HOST}\", \"ttl\": 600 } ]"

echo "Updating CNAME record: ${NAME}.${DOMAIN} -> ${RAILWAY_HOST}"

curl -s -X PUT "$API_URL" \
  -H "Authorization: sso-key ${GODADDY_KEY}:${GODADDY_SECRET}" \
  -H "Content-Type: application/json" \
  -d "$BODY"

echo "GoDaddy update finished. Note: if you updated the apex/root domain, GoDaddy may not accept a CNAME on the apex — use A records or forwarding." 
