#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

LOOP_ID=$1
PROMPT=$2
CONVERGE=$3
shift 3
FILES=("$@")

fingerprint() {
  for f in "${FILES[@]}"; do
    if [[ -f "$f" ]]; then
      stat -f "%m %z" "$f"
    fi
  done | shasum | awk '{print $1}'
}

if node scripts/loop-converged.mjs "$CONVERGE" >/dev/null 2>&1; then
  echo "AGENT_LOOP_STOP_${LOOP_ID} {\"reason\":\"all green\"}"
  exit 0
fi

LAST=$(fingerprint)
while true; do
  if node scripts/loop-converged.mjs "$CONVERGE" >/dev/null 2>&1; then
    echo "AGENT_LOOP_STOP_${LOOP_ID} {\"reason\":\"all green\"}"
    exit 0
  fi

  sleep 10
  CUR=$(fingerprint)
  if [[ "$CUR" != "$LAST" ]]; then
    LAST="$CUR"
    printf 'AGENT_LOOP_WAKE_%s {"prompt":"%s"}\n' "$LOOP_ID" "$PROMPT"
  fi
done
