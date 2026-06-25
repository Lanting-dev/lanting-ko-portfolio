#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

LOOP_ID=$1
SECONDS=$2
PROMPT=$3
CONVERGE=$4

sleep "$SECONDS"

if node scripts/loop-converged.mjs "$CONVERGE" >/dev/null 2>&1; then
  echo "AGENT_LOOP_STOP_${LOOP_ID} {\"reason\":\"all green\"}"
  exit 0
fi

printf 'AGENT_LOOP_WAKE_%s {"prompt":"%s"}\n' "$LOOP_ID" "$PROMPT"
