#!/usr/bin/env bash
set -euo pipefail

echo "This script prints the GoDaddy curl command you'll need to set the CNAME for 'www' to the Railway host. It does NOT execute the change."

if [ -z "${GODADDY_KEY:-}" ] || [ -z "${GODADDY_SECRET:-}" ] || [ -z "${DOMAIN:-}" ] || [ -z "${RAILWAY_HOST:-}" ]; then
  echo "Please set the environment variables: GODADDY_KEY, GODADDY_SECRET, DOMAIN, RAILWAY_HOST"
  echo "Example: export DOMAIN=ojasritu.co.in; export RAILWAY_HOST=your.railway.app"
  exit 1
fi

echo
echo "Run the following command to update the CNAME (copy and run it yourself):"
echo
echo "curl -s -X PUT \"https://api.godaddy.com/v1/domains/${DOMAIN}/records/CNAME/www\" \"
echo "  -H \"Authorization: sso-key ${GODADDY_KEY}:${GODADDY_SECRET}\" \"
echo "  -H \"Content-Type: application/json\" \"
echo "  -d \"[ { \\\"data\\\": \\\"${RAILWAY_HOST}\\\", \\\"ttl\\\": 600 } ]\""

echo
echo "Note: This prints the command. To actually change DNS, paste the printed command into your shell and run it."
