#!/bin/bash
set -e
BASE="http://localhost:3000"

echo "→ health"
curl -sf "$BASE/api/health" | grep -q '"status":"ok"'

echo "→ readiness"
curl -sf "$BASE/api/health/ready" | grep -q '"status":"ready"'

echo "→ list flights"
curl -sf "$BASE/api/flights" | grep -q '"total"'

echo "→ filter by status"
curl -sf "$BASE/api/flights?status=scheduled" | grep -q '"data"'

echo "→ pagination"
curl -sf "$BASE/api/flights?limit=2&offset=0" > /tmp/page1.json
curl -sf "$BASE/api/flights?limit=2&offset=2" > /tmp/page2.json
diff -q /tmp/page1.json /tmp/page2.json > /dev/null && echo "FAIL: pages identical" && exit 1

echo "→ create flight"
ID=$(curl -sf -X POST "$BASE/api/flights" \
  -H "Content-Type: application/json" \
  -d '{"flightNumber":"TEST1","origin":"SVO","destination":"JFK","departureTime":"2025-07-01T10:00:00Z","arrivalTime":"2025-07-01T18:00:00Z"}' \
  | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "  created id=$ID"

echo "→ get by id"
curl -sf "$BASE/api/flights/$ID" | grep -q "TEST1"

echo "→ invalid create (bad dates) → expect 400"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/flights" \
  -H "Content-Type: application/json" \
  -d '{"flightNumber":"BAD1","origin":"SVO","destination":"JFK","departureTime":"2025-07-01T18:00:00Z","arrivalTime":"2025-07-01T10:00:00Z"}')
[ "$STATUS" = "400" ] || (echo "FAIL: expected 400, got $STATUS" && exit 1)

echo "→ update status"
curl -sf -X PATCH "$BASE/api/flights/$ID/status" \
  -H "Content-Type: application/json" \
  -d '{"status":"departed"}' | grep -q '"departed"'

echo "→ delete"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE/api/flights/$ID")
[ "$STATUS" = "204" ] || (echo "FAIL: expected 204, got $STATUS" && exit 1)

echo "→ get deleted → expect 404"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/flights/$ID")
[ "$STATUS" = "404" ] || (echo "FAIL: expected 404, got $STATUS" && exit 1)

echo "→ stats"
curl -sf "$BASE/api/flights/stats" | grep -q '"data"'

echo ""
echo "ALL PASSED ✓"