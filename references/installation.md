# Installation

Use this reference when explaining how to install Self-Improving Skills.

## Core idea

Self-Improving Skills is a single-skill repository with a lightweight installer. Install it as one skill, then let the installer configure host-specific self-running support when the host exposes a scheduler or automation mechanism.

The required invariant is:

```text
self-improving-skills/
└── SKILL.md
```

`SKILL.md` must be at the skill root.

## Recommended install

```bash
curl -fsSL https://raw.githubusercontent.com/chemny/self-improving-skills/main/install.sh | bash
```

The installer:

1. Installs the skill into `~/.agents/skills/self-improving-skills` by default.
2. Creates `evolution.md`, `evolution-candidates.md`, `evolution-promotions.md`, and `evolution-scan-reports.md`.
3. Detects Codex, Claude Code, OpenClaw, or generic environments.
4. Enables Codex 6-hour graded scan automation when Codex is available.
5. Installs adapter prompt files for platforms whose scheduler must be provided by the host.

Read `write-targets.md` for the cross-platform memory directory mapping and write permission checks.

## Codex-style install

For Codex, the installer creates:

```text
~/.agents/skills/self-improving-skills/
~/.codex/memories/evolution.md
~/.codex/memories/evolution-candidates.md
~/.codex/memories/evolution-promotions.md
~/.codex/memories/evolution-scan-reports.md
~/.codex/automations/self-improving-skills-graded-scan/automation.toml
```

The automation runs every 6 hours. It may auto-promote low-risk learnings into `evolution.md`; medium/high-risk items go to `evolution-candidates.md`; every run should append a detailed audit report to `evolution-scan-reports.md`.

For sandboxed Codex automation, include the Codex memory root in the automation workspace directories so the job can append to `~/.codex/memories`.

## Claude Code-style install

The installer creates adapter files under `~/.claude/self-improving-skills` when `~/.claude` exists. Claude Code scheduler support varies by host setup, so use `scan-prompt.md` with hooks or cron when available.

Formal memory writes are active only after the chosen hook or scheduler can append to `~/.claude/self-improving-skills/memories`.

## OpenClaw-style install

The installer creates adapter files under `~/.openclaw/self-improving-skills` when `~/.openclaw` exists. Use `scan-prompt.md` with OpenClaw scheduler/session scanning if available.

Formal memory writes are active only after the OpenClaw scanner can append to `~/.openclaw/self-improving-skills/memories`.

## Generic install

The installer always creates generic files under `~/.self-improving-skills`. Generic cron is installed only when `SELF_IMPROVING_SKILLS_SCAN_COMMAND` is set, because generic shells cannot infer which agent command should run the scan.

## Verify

In a fresh agent session, try:

```text
Use self-improving-skills: remember that my writing style is direct and example-driven. Do not write files; just explain how you would handle this memory.
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
curl -fsSL https://raw.githubusercontent.com/chemny/self-improving-skills/main/install.sh | bash
```

Then start a fresh agent session if your agent only scans skills at session startup.
