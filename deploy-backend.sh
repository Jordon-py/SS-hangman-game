#!/usr/bin/env bash
set -euo pipefail

# One-command backend deploy to Heroku.
# Usage:
#   ./deploy-backend.sh
#   HEROKU_APP=auralmind-master ./deploy-backend.sh
#   ./deploy-backend.sh my-heroku-app-name

APP_NAME="${HEROKU_APP:-${1:-auralmind-master}}"
HEROKU_REMOTE="${HEROKU_REMOTE:-heroku}"
ALLOWED_ORIGINS="${ALLOWED_ORIGINS:-https://auralmind.netlify.app,http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173}"
ALLOWED_ORIGIN_REGEX="${ALLOWED_ORIGIN_REGEX:-https://.*--auralmind\\.netlify\\.app}"
MAX_UPLOAD_MB="${MAX_UPLOAD_MB:-200}"
JOB_TIMEOUT_SEC="${JOB_TIMEOUT_SEC:-3600}"
WEB_CONCURRENCY="${WEB_CONCURRENCY:-2}"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1"
    exit 1
  fi
}

require_cmd git
require_cmd heroku
require_cmd curl

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "==> Verifying Heroku app: $APP_NAME"
if ! heroku apps:info --app "$APP_NAME" >/dev/null 2>&1; then
  echo "Heroku app '$APP_NAME' not found or CLI auth missing."
  echo "Run: heroku login"
  exit 1
fi

EXPECTED_REMOTE_URL="https://git.heroku.com/${APP_NAME}.git"
if git remote get-url "$HEROKU_REMOTE" >/dev/null 2>&1; then
  CURRENT_REMOTE_URL="$(git remote get-url "$HEROKU_REMOTE")"
  if [[ "$CURRENT_REMOTE_URL" != "$EXPECTED_REMOTE_URL" ]]; then
    echo "==> Updating git remote '$HEROKU_REMOTE' -> $EXPECTED_REMOTE_URL"
    git remote set-url "$HEROKU_REMOTE" "$EXPECTED_REMOTE_URL"
  fi
else
  echo "==> Adding git remote '$HEROKU_REMOTE' -> $EXPECTED_REMOTE_URL"
  git remote add "$HEROKU_REMOTE" "$EXPECTED_REMOTE_URL"
fi

echo "==> Ensuring Python buildpack"
heroku buildpacks:add --index 1 heroku/python --app "$APP_NAME" >/dev/null 2>&1 || true

echo "==> Setting Heroku config vars"
heroku config:set \
  ALLOWED_ORIGINS="$ALLOWED_ORIGINS" \
  ALLOWED_ORIGIN_REGEX="$ALLOWED_ORIGIN_REGEX" \
  MAX_UPLOAD_MB="$MAX_UPLOAD_MB" \
  JOB_TIMEOUT_SEC="$JOB_TIMEOUT_SEC" \
  WEB_CONCURRENCY="$WEB_CONCURRENCY" \
  --app "$APP_NAME" >/dev/null

echo "==> Deploying current commit to Heroku (HEAD -> main)"
git push "$HEROKU_REMOTE" HEAD:main

echo "==> Ensuring at least one web dyno"
heroku ps:scale web=1 --app "$APP_NAME" >/dev/null

BASE_URL="https://${APP_NAME}.herokuapp.com"
HEALTH_URL="${BASE_URL}/api/health"

echo "==> Waiting for health endpoint: $HEALTH_URL"
for _ in {1..20}; do
  if curl -fsS "$HEALTH_URL" >/dev/null 2>&1; then
    break
  fi
  sleep 3
done

echo "==> Health response"
curl -fsS "$HEALTH_URL"
echo
echo "==> Deploy complete: $BASE_URL"
