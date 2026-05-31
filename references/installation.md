# Installation

Use this reference when explaining how to install Agent Evolution.

## Core idea

Agent Evolution is a single-skill repository with a lightweight installer. Install it as one skill, then let the installer configure host-specific self-running support when the host exposes a scheduler or automation mechanism.

The required invariant is:

```text
agent-evolution/
└── SKILL.md
```

`SKILL.md` must be at the skill root.

## Recommended install

```bash
curl -fsSL https://raw.githubusercontent.com/chemny/agent-evolution/main/install.sh | bash
```

The installer:

1. Installs the skill into `~/.agents/skills/agent-evolution` by default.
2. Creates `evolution.md`, `evolution-candidates.md`, and `evolution-promotions.md`.
3. Detects Codex, Claude Code, OpenClaw, or generic environments.
4. Enables Codex 6-hour graded scan automation when Codex is available.
5. Installs adapter prompt files for platforms whose scheduler must be provided by the host.

## Codex-style install

For Codex, the installer creates:

```text
~/.agents/skills/agent-evolution/
~/.codex/memories/evolution.md
~/.codex/memories/evolution-candidates.md
~/.codex/memories/evolution-promotions.md
~/.codex/automations/agent-evolution-graded-scan/automation.toml
```

The automation runs every 6 hours. It may auto-promote low-risk learnings into `evolution.md`; medium/high-risk items go to `evolution-candidates.md`.

## Claude Code-style install

The installer creates adapter files under `~/.claude/agent-evolution` when `~/.claude` exists. Claude Code scheduler support varies by host setup, so use `scan-prompt.md` with hooks or cron when available.

## OpenClaw-style install

The installer creates adapter files under `~/.openclaw/agent-evolution` when `~/.openclaw` exists. Use `scan-prompt.md` with OpenClaw scheduler/session scanning if available.

## Generic install

The installer always creates generic files under `~/.agent-evolution`. Generic cron is installed only when `AGENT_EVOLUTION_SCAN_COMMAND` is set, because generic shells cannot infer which agent command should run the scan.

## Verify

In a fresh agent session, try:

```text
Use agent-evolution: remember that my writing style is direct and example-driven. Do not write files; just explain how you would handle this memory.
```

Expected behavior:

```text
Path: direct memory
Validation: not required
Destination: host agent user memory
```

## Update

Re-run:

```bash
curl -fsSL https://raw.githubusercontent.com/chemny/agent-evolution/main/install.sh | bash
```

Then start a fresh agent session if your agent only scans skills at session startup.
