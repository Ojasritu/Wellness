#!/usr/bin/env bash
set -euo pipefail

echo "Starting Railway deploy script..."

if [ -z "${RAILWAY_API_TOKEN:-}" ] || [ -z "${RAILWAY_PROJECT_ID:-}" ]; then
  echo "Error: RAILWAY_API_TOKEN and RAILWAY_PROJECT_ID must be set as environment variables or GitHub secrets." >&2
  exit 1
fi

# Install Railway CLI (official installer)
if ! command -v railway >/dev/null 2>&1; then
  echo "Installing Railway CLI..."
  curl -sL https://raw.githubusercontent.com/railwayapp/cli/master/install.sh | sh
  export PATH="$HOME/.railway/bin:$PATH"
fi

echo "Logging into Railway using API token..."
railway login --apiKey "$RAILWAY_API_TOKEN"

echo "Linking to project id: $RAILWAY_PROJECT_ID"
# Attempt to link by project id (if CLI supports it)
railway link "$RAILWAY_PROJECT_ID" || true

echo "Triggering deploy..."
# Try to run an up/deploy command. If the CLI flavor differs, user may need to tweak this script.
if railway up --detach 2>/dev/null; then
  echo "railway up triggered"
elif railway deploy 2>/dev/null; then
  echo "railway deploy triggered"
else
  echo "Could not run a standard railway deploy command. This script attempted 'railway up' and 'railway deploy'. If your Railway CLI differs, update this script accordingly." >&2
fi

echo "Attempting to read host/domain from Railway status..."
# Try to get a domain from railway status JSON
HOST=""
if railway status --json 2>/dev/null | jq -r '.services[0].url // .services[0].status.domain // empty' >/tmp/railway_status.json 2>/dev/null; then
  HOST=$(cat /tmp/railway_status.json | tr -d '"')
fi

if [ -z "$HOST" ]; then
  echo "Railway host could not be determined automatically. Please set it manually or update this script to parse the correct field." >&2
  HOST="REPLACE_WITH_RAILWAY_HOST"
fi

echo "Railway host: $HOST"
echo "$HOST" > railway_host.txt
echo "RAILWAY_HOST=$HOST" >> $GITHUB_ENV || true

echo "Railway deploy script finished."
