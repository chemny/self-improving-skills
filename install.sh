#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${SELF_IMPROVING_SKILLS_REPO_URL:-https://github.com/chemny/self-improving-skills}"
BRANCH="${SELF_IMPROVING_SKILLS_BRANCH:-main}"
SKILLS_DIR="${SELF_IMPROVING_SKILLS_SKILLS_DIR:-$HOME/.agents/skills}"
INSTALL_DIR="$SKILLS_DIR/self-improving-skills"
ENABLE_CODEX_AUTOMATION=0
ENABLE_GENERIC_CRON=0
INSTALL_ADAPTERS=1

log() {
  printf '[self-improving-skills] %s\n' "$*"
}

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    printf 'Missing required command: %s\n' "$1" >&2
    exit 1
  }
}

usage() {
  cat <<'EOF'
Usage: install.sh [options]

Options:
  --enable-codex-automation  Create or update the Codex 6-hour automation.
  --enable-generic-cron      Install generic cron using SELF_IMPROVING_SKILLS_SCAN_COMMAND.
  --enable-all               Enable Codex automation and generic cron when available.
  --no-adapters              Skip Claude Code, OpenClaw, and generic adapter files.
  -h, --help                 Show this help.

Default: install the skill and memory templates only. Background scans are opt-in.
EOF
}

parse_args() {
  while [ "$#" -gt 0 ]; do
    case "$1" in
      --enable-codex-automation)
        ENABLE_CODEX_AUTOMATION=1
        ;;
      --enable-generic-cron)
        ENABLE_GENERIC_CRON=1
        ;;
      --enable-all)
        ENABLE_CODEX_AUTOMATION=1
        ENABLE_GENERIC_CRON=1
        ;;
      --no-adapters)
        INSTALL_ADAPTERS=0
        ;;
      -h|--help)
        usage
        exit 0
        ;;
      *)
        printf 'Unknown option: %s\n\n' "$1" >&2
        usage >&2
        exit 2
        ;;
    esac
    shift
  done
}

script_dir() {
  cd -- "$(dirname -- "${BASH_SOURCE[0]:-$0}")" >/dev/null 2>&1 && pwd -P
}

prepare_source() {
  local dir
  dir="$(script_dir)"

  if [ -f "$dir/SKILL.md" ] && [ -d "$dir/references" ]; then
    printf '%s\n' "$dir"
    return 0
  fi

  need_cmd curl
  need_cmd tar

  local tmp
  tmp="$(mktemp -d "${TMPDIR:-/tmp}/self-improving-skills-install.XXXXXX")"
  log "Downloading $REPO_URL archive..."
  curl -fsSL "$REPO_URL/archive/refs/heads/$BRANCH.tar.gz" | tar -xz -C "$tmp"
  local unpacked
  unpacked="$(find "$tmp" -mindepth 1 -maxdepth 1 -type d | head -n 1)"
  if [ ! -f "$unpacked/SKILL.md" ]; then
    printf 'Downloaded archive does not contain SKILL.md\n' >&2
    exit 1
  fi
  printf '%s\n' "$unpacked"
}

copy_skill() {
  local src="$1"
  mkdir -p "$SKILLS_DIR"
  rm -rf "$INSTALL_DIR"
  mkdir -p "$INSTALL_DIR"
  (
    cd "$src"
    tar --exclude .git -cf - .
  ) | (
    cd "$INSTALL_DIR"
    tar -xf -
  )
  log "Installed skill: $INSTALL_DIR"
}

install_memory_templates() {
  local memory_dir="$1"
  mkdir -p "$memory_dir"
  for file in evolution.md evolution-candidates.md evolution-promotions.md evolution-scan-reports.md; do
    if [ ! -f "$memory_dir/$file" ]; then
      cp "$INSTALL_DIR/templates/$file" "$memory_dir/$file"
      log "Created memory file: $memory_dir/$file"
    elif ! grep -Eq '^## [0-9]{4}' "$memory_dir/$file"; then
      cp "$INSTALL_DIR/templates/$file" "$memory_dir/$file"
      log "Refreshed empty memory template: $memory_dir/$file"
    else
      log "Memory file exists, kept: $memory_dir/$file"
    fi
  done
}

install_codex_if_requested() {
  local codex_home="${CODEX_HOME:-$HOME/.codex}"
  if [ "$ENABLE_CODEX_AUTOMATION" -ne 1 ]; then
    log "Codex automation not enabled. Re-run with --enable-codex-automation to create the 6-hour scan."
    return 0
  fi

  if [ ! -d "$codex_home" ] && [ -z "${SELF_IMPROVING_SKILLS_FORCE_CODEX:-}" ]; then
    log "Codex home not found; skipped Codex automation."
    return 0
  fi

  "$INSTALL_DIR/scripts/install-codex.sh" "$INSTALL_DIR" "$codex_home"
}

install_platform_notes() {
  if [ "$INSTALL_ADAPTERS" -ne 1 ]; then
    log "Platform adapter files skipped."
    return 0
  fi

  if [ -d "$HOME/.claude" ]; then
    "$INSTALL_DIR/scripts/install-claude-code.sh" "$INSTALL_DIR" "$HOME/.claude"
  fi

  if [ -d "$HOME/.openclaw" ]; then
    "$INSTALL_DIR/scripts/install-openclaw.sh" "$INSTALL_DIR" "$HOME/.openclaw"
  fi

  if [ "$ENABLE_GENERIC_CRON" -eq 1 ]; then
    "$INSTALL_DIR/scripts/install-generic-cron.sh" "$INSTALL_DIR" --enable-cron || true
  else
    "$INSTALL_DIR/scripts/install-generic-cron.sh" "$INSTALL_DIR" || true
  fi
}

main() {
  parse_args "$@"

  need_cmd mkdir
  need_cmd cp
  need_cmd tar

  local src
  src="$(prepare_source)"
  copy_skill "$src"

  local default_memory_dir="$HOME/.self-improving-skills/memories"
  if [ -d "${CODEX_HOME:-$HOME/.codex}" ] || [ -n "${SELF_IMPROVING_SKILLS_FORCE_CODEX:-}" ]; then
    default_memory_dir="${CODEX_HOME:-$HOME/.codex}/memories"
  fi
  install_memory_templates "${SELF_IMPROVING_SKILLS_MEMORY_DIR:-$default_memory_dir}"
  install_codex_if_requested
  install_platform_notes

  "$INSTALL_DIR/scripts/verify-install.sh" "$INSTALL_DIR" || true

  log "Done."
  log "Background scanning is opt-in. Use --enable-codex-automation or --enable-generic-cron when you want scheduled scans."
  log "Open a fresh agent session so the host can rescan SKILL.md."
}

main "$@"
