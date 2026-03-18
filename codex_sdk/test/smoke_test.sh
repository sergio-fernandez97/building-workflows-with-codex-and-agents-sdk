#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:3000}"
TMP_DIR="$(mktemp -d)"
PASS=0; FAIL=0

log(){ echo "[smoke] $*"; }
req(){
  local method="$1" path="$2" body="${3:-}"; shift || true
  local out_body="$TMP_DIR/out.json" out_code="$TMP_DIR/code.txt"
  if [[ -n "$body" ]]; then
    curl -sS -X "$method" -H 'Content-Type: application/json' \
      -d "$body" -o "$out_body" -w "%{http_code}" "$BASE_URL$path" > "$out_code"
  else
    curl -sS -X "$method" -o "$out_body" -w "%{http_code}" "$BASE_URL$path" > "$out_code"
  fi
  printf "%s\n" "$(cat "$out_code")" "$(cat "$out_body")"
}

assert_code(){ local got="$1" want="$2"; [[ "$got" == "$want" ]]; }
contains(){ grep -q "$1" <<<"$2"; }

run_test(){
  local name="$1" code want substr body
  shift
  read -r code body < <("$@")
  if assert_code "$code" "$want_code" && contains "$substr" "$body"; then
    log "PASS: $name"; PASS=$((PASS+1))
  else
    log "FAIL: $name (code=$code, want=$want_code)"; echo "$body"; FAIL=$((FAIL+1))
  fi
}

log "Base URL: $BASE_URL"

# 1) GET /health
want_code=200; substr='"status":"ok"'
read -r code body < <(req GET /health)
if assert_code "$code" "$want_code" && contains "$substr" "$body"; then
  log "PASS: GET /health"
  PASS=$((PASS+1))
else
  log "FAIL: GET /health (code=$code)"; echo "$body"; FAIL=$((FAIL+1))
fi

# 2) GET /scores (should return array)
want_code=200; substr='"scores"'
read -r code body < <(req GET /scores)
if assert_code "$code" "$want_code" && contains "$substr" "$body"; then
  log "PASS: GET /scores"
  PASS=$((PASS+1))
else
  log "FAIL: GET /scores (code=$code)"; echo "$body"; FAIL=$((FAIL+1))
fi

# 3) POST /scores valid
want_code=201; substr='"saved"'
read -r code body < <(req POST /scores '{"name":"AA","score":7}')
if assert_code "$code" "$want_code" && contains "$substr" "$body"; then
  log "PASS: POST /scores (valid)"
  PASS=$((PASS+1))
else
  log "FAIL: POST /scores (valid) (code=$code)"; echo "$body"; FAIL=$((FAIL+1))
fi

# 4) POST /scores invalid (name too short)
want_code=400; substr='"error"'
read -r code body < <(req POST /scores '{"name":"A","score":1}')
if assert_code "$code" "$want_code" && contains "$substr" "$body"; then
  log "PASS: POST /scores (invalid name)"
  PASS=$((PASS+1))
else
  log "FAIL: POST /scores (invalid name) (code=$code)"; echo "$body"; FAIL=$((FAIL+1))
fi

log "Summary: PASS=$PASS FAIL=$FAIL"
if [[ "$FAIL" -gt 0 ]]; then exit 1; fi
log "All smoke tests passed."
