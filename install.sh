#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${SELF_IMPROVING_SKILLS_REPO_URL:-https://github.com/chemny/self-improving-skills}"
BRANCH="${SELF_IMPROVING_SKILLS_BRANCH:-main}"
SKILLS_DIR="${SELF_IMPROVING_SKILLS_SKILLS_DIR:-$HOME/.agents/skills}"
INSTALL_DIR="$SKILLS_DIR/self-improving-skills"

log() {
  printf '[self-improving-skills] %s\n' "$*"
}

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    printf 'Missing required command: %s\n' "$1" >&2
    exit 1
  }
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

install_codex_if_available() {
  local codex_home="${CODEX_HOME:-$HOME/.codex}"
  if [ ! -d "$codex_home" ] && [ -z "${SELF_IMPROVING_SKILLS_FORCE_CODEX:-}" ]; then
    return 0
  fi

  "$INSTALL_DIR/scripts/install-codex.sh" "$INSTALL_DIR" "$codex_home"
}

install_platform_notes() {
  if [ -d "$HOME/.claude" ]; then
    "$INSTALL_DIR/scripts/install-claude-code.sh" "$INSTALL_DIR" "$HOME/.claude"
  fi

  if [ -d "$HOME/.openclaw" ]; then
    "$INSTALL_DIR/scripts/install-openclaw.sh" "$INSTALL_DIR" "$HOME/.openclaw"
  fi

  "$INSTALL_DIR/scripts/install-generic-cron.sh" "$INSTALL_DIR" || true
}

main() {
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
  install_codex_if_available
  install_platform_notes

  "$INSTALL_DIR/scripts/verify-install.sh" "$INSTALL_DIR" || true

  log "Done."
  log "Open a fresh agent session so the host can rescan SKILL.md."
}

main "$@"
