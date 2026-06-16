#!/usr/bin/env bash
set -euo pipefail

skill_dir="${1:?skill dir required}"
codex_home="${2:-${CODEX_HOME:-$HOME/.codex}}"
automation_dir="$codex_home/automations/self-improving-skills-graded-scan"
if [ -f "$codex_home/automations/self-improving-skills-candidate-scan/automation.toml" ]; then
  automation_dir="$codex_home/automations/self-improving-skills-candidate-scan"
fi
memory_dir="$codex_home/memories"

mkdir -p "$automation_dir" "$memory_dir"

for file in evolution.md evolution-candidates.md evolution-promotions.md evolution-scan-reports.md; do
  if [ ! -f "$memory_dir/$file" ]; then
    cp "$skill_dir/templates/$file" "$memory_dir/$file"
  elif ! grep -Eq '^## [0-9]{4}' "$memory_dir/$file"; then
    cp "$skill_dir/templates/$file" "$memory_dir/$file"
  fi
done

sed \
  -e "s#{{CODEX_HOME}}#$codex_home#g" \
  -e "s#{{HOME}}#$HOME#g" \
  "$skill_dir/templates/codex-automation.toml" > "$automation_dir/automation.toml"

echo "Installed Codex automation: $automation_dir/automation.toml"
