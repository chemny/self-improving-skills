#!/usr/bin/env bash
set -euo pipefail

found=0

if [ -d "${CODEX_HOME:-$HOME/.codex}" ]; then
  echo "codex"
  found=1
fi

if [ -d "$HOME/.claude" ]; then
  echo "claude-code"
  found=1
fi

if [ -d "$HOME/.openclaw" ]; then
  echo "openclaw"
  found=1
fi

if [ "$found" -eq 0 ]; then
  echo "generic"
fi

