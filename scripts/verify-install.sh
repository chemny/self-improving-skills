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
check_file "$skill_dir/references/memory-entry-standard.md"
check_file "$skill_dir/references/write-targets.md"
check_file "$skill_dir/references/application-routing.md"
check_file "$skill_dir/references/project-ledger.md"
check_file "$skill_dir/templates/evolution.md"
check_file "$skill_dir/templates/evolution-scan-reports.md"
check_file "$skill_dir/templates/codex-automation.toml"
check_file "$skill_dir/scripts/scan-window.mjs"
check_file "$skill_dir/evals/evals.json"
check_file "$skill_dir/test-prompts.json"

check_writable_dir() {
  local dir="$1"
  if [ -d "$dir" ] && [ -w "$dir" ]; then
    printf 'OK   writable %s\n' "$dir"
  else
    printf 'MISS writable %s\n' "$dir"
    ok=0
  fi
}

codex_home="${CODEX_HOME:-$HOME/.codex}"
if [ -d "$codex_home" ]; then
  check_file "$codex_home/memories/evolution.md"
  check_file "$codex_home/memories/evolution-candidates.md"
  check_file "$codex_home/memories/evolution-promotions.md"
  check_file "$codex_home/memories/evolution-scan-reports.md"
  check_writable_dir "$codex_home/memories"
  if [ -f "$codex_home/automations/agent-evolution-graded-scan/automation.toml" ]; then
    check_file "$codex_home/automations/agent-evolution-graded-scan/automation.toml"
  else
    check_file "$codex_home/automations/agent-evolution-candidate-scan/automation.toml"
  fi
fi

if [ -d "$HOME/.claude/agent-evolution" ]; then
  check_file "$HOME/.claude/agent-evolution/scan-prompt.md"
  check_file "$HOME/.claude/agent-evolution/memories/evolution.md"
  check_file "$HOME/.claude/agent-evolution/memories/evolution-candidates.md"
  check_file "$HOME/.claude/agent-evolution/memories/evolution-promotions.md"
  check_file "$HOME/.claude/agent-evolution/memories/evolution-scan-reports.md"
  check_writable_dir "$HOME/.claude/agent-evolution/memories"
fi

if [ -d "$HOME/.openclaw/agent-evolution" ]; then
  check_file "$HOME/.openclaw/agent-evolution/scan-prompt.md"
  check_file "$HOME/.openclaw/agent-evolution/memories/evolution.md"
  check_file "$HOME/.openclaw/agent-evolution/memories/evolution-candidates.md"
  check_file "$HOME/.openclaw/agent-evolution/memories/evolution-promotions.md"
  check_file "$HOME/.openclaw/agent-evolution/memories/evolution-scan-reports.md"
  check_writable_dir "$HOME/.openclaw/agent-evolution/memories"
fi

if [ "$ok" -eq 1 ]; then
  echo "Agent Evolution install verification passed."
else
  echo "Agent Evolution install verification found missing files."
  exit 1
fi
