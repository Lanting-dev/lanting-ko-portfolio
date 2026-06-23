#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if PIDS=$(lsof -ti :3000 2>/dev/null); then
  echo "→ stopping stale process on :3000"
  kill -9 $PIDS 2>/dev/null || true
  sleep 0.3
fi

if [[ "${1:-}" == "--clean" ]]; then
  echo "→ clearing .next"
  rm -rf .next
fi

exec npx next dev
