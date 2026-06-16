#!/usr/bin/env bash
set -euo pipefail

skill_dir="${1:?skill dir required}"
openclaw_home="${2:-$HOME/.openclaw}"
target="$openclaw_home/self-improving-skills"

mkdir -p "$target/memories"
cp "$skill_dir/templates/generic-scan-prompt.md" "$target/scan-prompt.md"

for file in evolution.md evolution-candidates.md evolution-promotions.md evolution-scan-reports.md; do
  if [ ! -f "$target/memories/$file" ]; then
    cp "$skill_dir/templates/$file" "$target/memories/$file"
  elif ! grep -Eq '^## [0-9]{4}' "$target/memories/$file"; then
    cp "$skill_dir/templates/$file" "$target/memories/$file"
  fi
done

cat > "$target/README.md" <<'EOF'
# Self-Improving Skills for OpenClaw

Self-Improving Skills is installed for OpenClaw as a core skill plus local memory templates.

If your OpenClaw setup has scheduler/session scanning support, use `scan-prompt.md` for the 6-hour graded scan and write outputs to `memories/`.
EOF

echo "Installed OpenClaw adapter files: $target"
