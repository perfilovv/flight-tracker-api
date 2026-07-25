#!/bin/bash
set -e
BASE="http://localhost:3000"

echo "→ health"
curl -sf "$BASE/api/health" | grep -q '"status":"ok"'

echo "→ readiness"
curl -sf "$BASE/api/health/ready" | grep -q '"status":"ready"'

echo ""
echo "ALL PASSED ✓"