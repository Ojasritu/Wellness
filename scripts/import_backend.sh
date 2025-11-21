#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<EOF
Usage: $0 [EXPORT_DIR] [--use-db]

EXPORT_DIR: directory containing exported files (default: ./exports)
--use-db : if present and exports/db.sqlite3 exists, replace local db.sqlite3 with exported DB
           (this will bring exact superuser and all data as in source). Use with caution.

If --use-db is not provided, script will try to load fixtures (fixtures_all.json) and unpack media.
EOF
}

echo "Importing backend data/artifacts..."

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="${1:-$REPO_ROOT/exports}"

# parse optional flags
USE_DB=0
if [ "${2:-}" = "--use-db" ] || [ "${1:-}" = "--use-db" ]; then
  USE_DB=1
  # if first arg was --use-db, reset SRC_DIR to default
  if [ "${1:-}" = "--use-db" ]; then
    SRC_DIR="$REPO_ROOT/exports"
  fi
fi

if [ ! -d "$SRC_DIR" ]; then
  echo "Source dir $SRC_DIR not found. Provide path to exported files." >&2
  usage
  exit 1
fi

cd "$REPO_ROOT"

if [ $USE_DB -eq 1 ] && [ -f "$SRC_DIR/db.sqlite3" ]; then
  echo "--use-db set and exported db.sqlite3 found. Replacing local db.sqlite3 with exported DB."
  [ -f db.sqlite3 ] && mv db.sqlite3 db.sqlite3.bak
  cp "$SRC_DIR/db.sqlite3" ./db.sqlite3
  echo "DB replaced. Note: this brings all users including superuser and all data exactly as in source."
else
  if [ $USE_DB -eq 1 ]; then
    echo "--use-db specified but no db.sqlite3 found in $SRC_DIR. Falling back to fixtures/media import."
  fi

  # If fixtures json present, load it
  if [ -f "$SRC_DIR/fixtures_all.json" ]; then
    echo "Loading fixtures from $SRC_DIR/fixtures_all.json"
    python manage.py loaddata "$SRC_DIR/fixtures_all.json"
  else
    echo "No fixtures_all.json found. Skipping fixture import."
  fi
fi

# Unpack media (product images etc.)
if [ -f "$SRC_DIR/media.tar.gz" ]; then
  echo "Extracting media.tar.gz to repository root (will overwrite existing media files with same paths)"
  tar -xzf "$SRC_DIR/media.tar.gz" -C "$REPO_ROOT"
else
  echo "No media archive (media.tar.gz) found in $SRC_DIR. Skipping media extraction."
fi

echo "Import complete. It's recommended to run:"
echo "  python manage.py migrate"
echo "  python manage.py collectstatic --noinput"
