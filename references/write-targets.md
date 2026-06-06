# Write Targets

Agent Evolution uses one shared memory protocol across platforms, but each host owns its own writable paths and scheduling mechanism.

Do not hard-code Codex paths into the core protocol. Use the adapter for the active host.

## Shared protocol

Every platform should provide these three files:

```text
evolution.md              durable low-risk promoted memory
evolution-candidates.md   medium/high-risk candidates awaiting review
evolution-promotions.md   promotion receipts and rollback notes
evolution-scan-reports.md audit reports for each scheduled scan
```

The memory and candidate files must use the formats in `memory-entry-standard.md`. Scan reports are audit records and must not be treated as durable operating rules.

## Platform mappings

| Host | Default memory directory | Scheduler / scan mechanism |
|---|---|---|
| Codex | `~/.codex/memories` | Codex automation when available |
| Claude Code | `~/.claude/agent-evolution/memories` | host hook, cron, or user-provided scheduler |
| OpenClaw | `~/.openclaw/agent-evolution/memories` | OpenClaw scheduler/session scanner when available |
| Generic | `~/.agent-evolution/memories` | `AGENT_EVOLUTION_SCAN_COMMAND` with cron, when configured |

The host may override the directory with `AGENT_EVOLUTION_MEMORY_DIR`.

## Write permission requirements

Before claiming formal memory promotion is active, verify:

1. The three memory files exist.
2. The scan runner can append to the target memory directory.
3. The scan prompt points to the same target files.
4. A low-risk test candidate can be classified without writing unsafe content.
5. If the host uses sandboxed workspaces, the memory directory is inside the writable workspace set.
6. The scan runner can append a detailed report to `evolution-scan-reports.md`.

If any check fails, write only to the scan result or automation-local memory and report that formal memory writes are not active.

## Codex note

For Codex automations, `~/.codex/memories` must be writable from the automation run. If the automation is sandboxed to a project cwd, include the Codex memory root, such as `~/.codex`, in the automation workspace directories.

## Claude Code note

Claude Code scheduler support varies by installation. The adapter installs the standard files and `scan-prompt.md`; the user or host must connect that prompt to hooks, cron, or another scheduler that can write to `~/.claude/agent-evolution/memories`.

## OpenClaw note

OpenClaw should use the same standard files under `~/.openclaw/agent-evolution/memories` unless the user configures another memory directory. The OpenClaw session scanner should use `scan-prompt.md` and write only structured entries.

## Safety

Never write secrets, raw transcript dumps, broad global behavior changes, deletion rules, sync rules, publishing rules, or permission-changing rules directly into durable memory.
