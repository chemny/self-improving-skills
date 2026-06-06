#!/usr/bin/env bash
set -euo pipefail

skill_dir="${1:?skill dir required}"
target="$HOME/.agent-evolution"

mkdir -p "$target/memories"
cp "$skill_dir/templates/generic-scan-prompt.md" "$target/scan-prompt.md"

for file in evolution.md evolution-candidates.md evolution-promotions.md evolution-scan-reports.md; do
  if [ ! -f "$target/memories/$file" ]; then
    cp "$skill_dir/templates/$file" "$target/memories/$file"
  elif ! grep -Eq '^## [0-9]{4}' "$target/memories/$file"; then
    cp "$skill_dir/templates/$file" "$target/memories/$file"
  fi
done

if [ -n "${AGENT_EVOLUTION_SCAN_COMMAND:-}" ] && command -v crontab >/dev/null 2>&1; then
  tmp="$(mktemp "${TMPDIR:-/tmp}/agent-evolution-cron.XXXXXX")"
  crontab -l 2>/dev/null | grep -v 'agent-evolution generic scan' > "$tmp" || true
  printf '0 */6 * * * %s # agent-evolution generic scan\n' "$AGENT_EVOLUTION_SCAN_COMMAND" >> "$tmp"
  crontab "$tmp"
  rm -f "$tmp"
  echo "Installed generic cron using AGENT_EVOLUTION_SCAN_COMMAND."
else
  echo "Generic files installed at $target. No generic cron was created because AGENT_EVOLUTION_SCAN_COMMAND is not set."
fi
