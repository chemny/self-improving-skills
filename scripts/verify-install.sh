#!/usr/bin/env bash
set -euo pipefail

skill_dir="${1:-$HOME/.agents/skills/agent-evolution}"
ok=1

check_file() {
  if [ -f "$1" ]; then
    printf 'OK   %s\n' "$1"
  else
    printf 'MISS %s\n' "$1"
    ok=0
  fi
}

check_file "$skill_dir/SKILL.md"
check_file "$skill_dir/references/self-start.md"
check_file "$skill_dir/templates/evolution.md"
check_file "$skill_dir/templates/codex-automation.toml"

codex_home="${CODEX_HOME:-$HOME/.codex}"
if [ -d "$codex_home" ]; then
  check_file "$codex_home/memories/evolution.md"
  check_file "$codex_home/memories/evolution-candidates.md"
  check_file "$codex_home/memories/evolution-promotions.md"
  check_file "$codex_home/automations/agent-evolution-graded-scan/automation.toml"
fi

if [ "$ok" -eq 1 ]; then
  echo "Agent Evolution install verification passed."
else
  echo "Agent Evolution install verification found missing files."
  exit 1
fi

