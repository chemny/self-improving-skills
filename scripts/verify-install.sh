#!/usr/bin/env bash
set -euo pipefail

skill_dir="${1:-$HOME/.agents/skills/self-improving-skills}"
ok=1

check_file() {
  if [ -f "$1" ]; then
    printf 'OK   %s\n' "$1"
  else
    printf 'MISS %s\n' "$1"
    ok=0
  fi
}

check_any_file() {
  local file
  for file in "$@"; do
    if [ -f "$file" ]; then
      printf 'OK   %s\n' "$file"
      return 0
    fi
  done
  printf 'MISS one of:\n'
  for file in "$@"; do
    printf 'MISS %s\n' "$file"
  done
  ok=0
}

check_file "$skill_dir/SKILL.md"
check_file "$skill_dir/references/self-start.md"
check_file "$skill_dir/references/memory-entry-standard.md"
check_file "$skill_dir/references/write-targets.md"
check_file "$skill_dir/references/application-routing.md"
check_file "$skill_dir/references/project-ledger.md"
check_file "$skill_dir/references/dashboard.md"
check_file "$skill_dir/templates/evolution.md"
check_file "$skill_dir/templates/evolution-scan-reports.md"
check_file "$skill_dir/templates/codex-automation.toml"
check_file "$skill_dir/scripts/scan-window.mjs"
check_file "$skill_dir/scripts/generate-dashboard.mjs"
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
  check_any_file \
    "$codex_home/automations/self-improving-skills-graded-scan/automation.toml" \
    "$codex_home/automations/self-improving-skills-candidate-scan/automation.toml" \
    "$codex_home/automations/agent-evolution-graded-scan/automation.toml" \
    "$codex_home/automations/agent-evolution-candidate-scan/automation.toml"
fi

if [ -d "$HOME/.claude/self-improving-skills" ]; then
  check_file "$HOME/.claude/self-improving-skills/scan-prompt.md"
  check_file "$HOME/.claude/self-improving-skills/memories/evolution.md"
  check_file "$HOME/.claude/self-improving-skills/memories/evolution-candidates.md"
  check_file "$HOME/.claude/self-improving-skills/memories/evolution-promotions.md"
  check_file "$HOME/.claude/self-improving-skills/memories/evolution-scan-reports.md"
  check_writable_dir "$HOME/.claude/self-improving-skills/memories"
fi

if [ -d "$HOME/.openclaw/self-improving-skills" ]; then
  check_file "$HOME/.openclaw/self-improving-skills/scan-prompt.md"
  check_file "$HOME/.openclaw/self-improving-skills/memories/evolution.md"
  check_file "$HOME/.openclaw/self-improving-skills/memories/evolution-candidates.md"
  check_file "$HOME/.openclaw/self-improving-skills/memories/evolution-promotions.md"
  check_file "$HOME/.openclaw/self-improving-skills/memories/evolution-scan-reports.md"
  check_writable_dir "$HOME/.openclaw/self-improving-skills/memories"
fi

if [ "$ok" -eq 1 ]; then
  echo "Self-Improving Skills install verification passed."
else
  echo "Self-Improving Skills install verification found missing files."
  exit 1
fi
