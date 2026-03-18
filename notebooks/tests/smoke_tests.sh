#!/usr/bin/env bash
# Bug Busters backend smoke test
# Verifies core routes using curl. Exits non-zero on failure.

set -u
BASE_URL=${BASE_URL:-"http://localhost:3000"}

pass() { echo "PASS: $1"; }
fail() { echo "FAIL: $1"; exit 1; }

jqf() {
  # Try to pretty print JSON if jq exists; otherwise cat
  if command -v jq >/dev/null 2>&1; then jq "."; else cat; fi
}

echo "Testing Bug Busters backend at ${BASE_URL}" || true

# 1) Health
status=$(curl -s -o /tmp/health.json -w "%{http_code}" "${BASE_URL}/health") || true
if [ "$status" != "200" ]; then fail "GET /health expected 200, got $status"; fi
if ! grep -q '"status"' /tmp/health.json; then fail "GET /health response missing 'status'"; fi
pass "GET /health"

# 2) Create a score
payload='{"name":"TestUser","score":3}'
status=$(curl -s -o /tmp/create.json -w "%{http_code}" -H 'Content-Type: application/json' -d "$payload" "${BASE_URL}/scores") || true
if [ "$status" != "201" ]; then
  echo "Response:"; cat /tmp/create.json | jqf
  fail "POST /scores expected 201, got $status"
fi
if ! grep -q '"score"' /tmp/create.json || ! grep -q '"ts"' /tmp/create.json; then fail "POST /scores response missing fields"; fi
pass "POST /scores (valid)"

# 3) List scores
status=$(curl -s -o /tmp/list.json -w "%{http_code}" "${BASE_URL}/scores") || true
if [ "$status" != "200" ]; then fail "GET /scores expected 200, got $status"; fi
if ! grep -q '"scores"' /tmp/list.json; then fail "GET /scores missing 'scores' field"; fi
pass "GET /scores (list)"

# 4) Invalid payload
payload_bad='{"name":"X","score":-1}'
status=$(curl -s -o /tmp/bad.json -w "%{http_code}" -H 'Content-Type: application/json' -d "$payload_bad" "${BASE_URL}/scores") || true
if [ "$status" != "400" ]; then
  echo "Response:"; cat /tmp/bad.json | jqf
  fail "POST /scores invalid expected 400, got $status"
fi
pass "POST /scores (invalid)"

echo "All smoke tests passed."
