#!/usr/bin/env bash
# Block production build while dev server is running — prevents .next corruption.

if lsof -ti :3000 >/dev/null 2>&1; then
  echo ""
  echo "✗ dev server is running on :3000"
  echo "  Stop it first (Ctrl+C in the dev terminal), then run npm run build"
  echo ""
  exit 1
fi
