# Migration Checklist

Use this checklist before replacing an older self-improvement, memory, reflection, or learning skill with Self-Improving Skills.

## Scope

Target skills commonly include:

```text
self-improving
openclaw-self-improvement
self-reflection
Memory
ontology
```

Only migrate durable operating value. Do not copy whole skill files, raw logs, or host-specific defaults into Self-Improving Skills.

## Inventory template

For each source skill, record:

```markdown
## Source Skill

Name:
Path:
Primary trigger surface:
Storage paths used:
Scripts or automations:
Host-specific assumptions:
Potential conflicts with self-improving-skills:

Keep:
Migrate:
Archive:
Remove:
Needs user confirmation:
```

## What to keep

Keep these only when they are still accurate and future-useful:

- Explicit user preferences.
- Confirmed collaboration or writing style rules.
- Validated workflow rules.
- Tool or environment gotchas with a concrete fix.
- Eval formats that actually test behavior.
- Reflection quality bars that prevent vague lessons.
- Memory indexes or summaries that help retrieval.

## What to skip

Do not migrate:

- Raw chat transcripts.
- Repeated verbose reflections with no action.
- Credentials, tokens, cookies, recovery codes, or private keys.
- Fixed local paths that only make sense on one machine.
- Marketing copy, install commands, or old skill promotion text.
- Broad triggers that caused false positives.
- Rules that conflict with higher-priority instructions.

## Source-specific notes

```text
self-improving
  Check: memory.md, corrections.md, projects/, domains/.
  Migrate: concise confirmed preferences, conflict rules, stats format.
  Skip: fixed ~/self-improving path and noisy correction logs.

openclaw-self-improvement
  Check: .learnings categories, eval-loop examples, feature gaps.
  Migrate: useful error categories and binary eval discipline.
  Skip: OpenClaw-only routing and universal AGENTS.md / TOOLS.md / SOUL.md assumptions.

self-reflection
  Check: reflection quality checklist and anti-patterns.
  Migrate: bounded review rules and insight quality bar.
  Skip: cron claims, session paths, and transcript scanning assumptions.

Memory
  Check: indexes, category templates, retrieval patterns.
  Migrate: optional large-storage guidance only when needed.
  Skip: making a parallel memory store mandatory.

ontology
  Check: entity types, graph constraints, cross-skill state contracts.
  Migrate: structured storage option for complex entities.
  Skip: using graph storage for simple preferences.
```

## Verification checklist

Before deprecating the source skill:

- [ ] Self-Improving Skills covers the source skill's primary user-facing workflow.
- [ ] Important preferences and rules have a destination.
- [ ] No secrets or raw transcripts were migrated.
- [ ] Host-specific paths were removed or marked as examples only.
- [ ] Duplicate triggers were narrowed.
- [ ] High-impact rules were confirmed or eval-tested.
- [ ] The user approved deprecation, archiving, or deletion.

## Migration receipt

After migration, report:

```markdown
Migrated:
Archived:
Skipped:
Needs confirmation:
Recommended deprecation action:
```
