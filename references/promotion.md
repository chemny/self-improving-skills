# Promotion

Promotion turns a memory or learning into an operating rule.

Before promoting, check `memory-entry-standard.md` for the required entry format, lifecycle stage, validation threshold, and receipt.
For candidates that were applied in real tasks, check `application-routing.md` for the application log and route-specific destination before promotion.

## Promote only when

- It is stable beyond the current task.
- It has clear trigger conditions.
- It is specific enough to execute.
- It will reduce future mistakes or improve future work.
- It does not duplicate or conflict with existing instructions.
- It has met the required validation threshold for its risk and scope.
- It has a rollback, demotion, or review path.

## Promotion targets

```text
Agent instruction file
  Collaboration, execution, confirmation, and workspace rules. Examples include AGENTS.md, CLAUDE.md, or another host-supported instruction file.

Tool notes file
  Tool behavior, command flags, paths, auth, environment quirks. Use TOOLS.md or an equivalent file only when available.

Principles file
  High-level behavior principles, only if the user's system uses one, such as SOUL.md.

Skill files
  Domain behavior belonging to one skill.

Memory files
  Preferences and context that should inform but not strictly constrain behavior.
```

## Rule style

Write rules as short operational instructions:

```markdown
- When the user asks for advice, diagnosis, options, or "how to do" something, answer or plan first instead of modifying files.
```

Do not write broad slogans:

```markdown
- Be careful and thoughtful.
```

For memory-file entries, include status, risk, confidence, scope, source, validation state, apply target, and review condition as defined in `memory-entry-standard.md`.

## Confirmation

Ask before promoting rules that:

- change deletion, overwrite, migration, or external-system behavior,
- reduce checks or confirmations,
- affect multiple agents or global behavior,
- conflict with existing instructions.

Never auto-promote high-impact rules from a background scan. Keep them as candidates until reviewed.
Never promote to a global destination when a skill, tool, project, or host-specific destination is enough.
