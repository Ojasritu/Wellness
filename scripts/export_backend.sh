#!/usr/bin/env bash
set -euo pipefail

echo "Exporting backend data and artifacts..."

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="${1:-$REPO_ROOT/exports}"
mkdir -p "$OUT_DIR"

cd "$REPO_ROOT"

# 1) Dump Django fixtures (all app data) except auth.permission and contenttypes
echo "Creating Django fixture: $OUT_DIR/fixtures_all.json"
python manage.py dumpdata --natural-foreign --indent 2 --exclude auth.permission --exclude contenttypes > "$OUT_DIR/fixtures_all.json"


# 2) Copy sqlite DB if present (this will include superuser and all DB data)
if [ -f db.sqlite3 ]; then
  echo "Copying sqlite database to $OUT_DIR/db.sqlite3"
  cp db.sqlite3 "$OUT_DIR/db.sqlite3"
else
  echo "No db.sqlite3 found in repo root. If you use Postgres, export via pg_dump (see README)."
fi

# 3) Export media files (if any) - includes product images
if [ -d media ]; then
  echo "Archiving media/ to $OUT_DIR/media.tar.gz"
  tar -czf "$OUT_DIR/media.tar.gz" media
fi

# 4) Optional: create a zip package for easy transfer
if command -v zip >/dev/null 2>&1; then
  PKG="$OUT_DIR/exports_package.zip"
  echo "Creating package $PKG"
  (cd "$OUT_DIR" && zip -r "$(basename "$PKG")" .) >/dev/null 2>&1 || true
fi

echo "Export complete. Files in: $OUT_DIR"
echo "Recommended: transfer the $OUT_DIR contents to the collaborator securely (scp/s3/gh release)."
