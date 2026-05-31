#!/usr/bin/env bash
set -euo pipefail

skill_dir="${1:?skill dir required}"
claude_home="${2:-$HOME/.claude}"
target="$claude_home/agent-evolution"

mkdir -p "$target/memories"
cp "$skill_dir/templates/generic-scan-prompt.md" "$target/scan-prompt.md"

for file in evolution.md evolution-candidates.md evolution-promotions.md; do
  if [ ! -f "$target/memories/$file" ]; then
    cp "$skill_dir/templates/$file" "$target/memories/$file"
  fi
done

cat > "$target/README.md" <<'EOF'
# Agent Evolution for Claude Code

Agent Evolution is installed for Claude Code as a core skill plus local memory templates.

Claude Code background scheduling support varies by host setup. If your environment provides hooks, cron, or another scheduler, use `scan-prompt.md` as the scheduled reflection prompt and write outputs to `memories/`.
EOF

echo "Installed Claude Code adapter files: $target"

