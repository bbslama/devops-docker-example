#!/bin/sh
set -eu

BASE_URL=${BASE_URL:-http://localhost:8080}
NOTE_ID=

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

cleanup() {
  if [ -n "$NOTE_ID" ]; then
    curl --silent --show-error --fail --max-time 5 \
      --request DELETE "$BASE_URL/api/notes/$NOTE_ID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

wait_for() {
  url=$1
  attempt=0
  while [ "$attempt" -lt 40 ]; do
    if curl --silent --fail --connect-timeout 3 --max-time 5 "$url" >/dev/null 2>&1; then
      return 0
    fi
    attempt=$((attempt + 1))
    sleep 2
  done
  return 1
}

wait_for "$BASE_URL/" || fail "frontend did not become available"

health=$(curl --silent --show-error --fail --connect-timeout 3 --max-time 5 \
  "$BASE_URL/actuator/health") || fail "backend health endpoint failed through frontend proxy"
printf '%s' "$health" | grep -F '"status":"UP"' >/dev/null \
  || fail "backend health endpoint did not report UP"

title="smoke-check-$$-$(date +%s)"
payload="{\"title\":\"$title\",\"content\":\"Temporary deployment acceptance note\"}"
created=$(curl --silent --show-error --fail --connect-timeout 3 --max-time 8 \
  --header 'Content-Type: application/json' --data "$payload" \
  "$BASE_URL/api/notes") || fail "could not create a smoke-test note"
NOTE_ID=$(printf '%s' "$created" | sed -n 's/.*"id":[[:space:]]*\([0-9][0-9]*\).*/\1/p')
[ -n "$NOTE_ID" ] || fail "create response did not contain a note id"

notes=$(curl --silent --show-error --fail --connect-timeout 3 --max-time 8 \
  "$BASE_URL/api/notes") || fail "could not retrieve notes"
printf '%s' "$notes" | grep -F "$title" >/dev/null \
  || fail "created note was not present in the notes response"

curl --silent --show-error --fail --connect-timeout 3 --max-time 8 \
  --request DELETE "$BASE_URL/api/notes/$NOTE_ID" >/dev/null \
  || fail "could not delete the smoke-test note"
NOTE_ID=

printf 'PASS: frontend, proxied backend health, and note create/read/delete\n'
