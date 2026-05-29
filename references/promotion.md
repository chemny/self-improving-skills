# Promotion

Promotion turns a memory or learning into an operating rule.

## Promote only when

- It is stable beyond the current task.
- It has clear trigger conditions.
- It is specific enough to execute.
- It will reduce future mistakes or improve future work.
- It does not duplicate or conflict with existing instructions.

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

## Confirmation

Ask before promoting rules that:

- change deletion, overwrite, migration, or external-system behavior,
- reduce checks or confirmations,
- affect multiple agents or global behavior,
- conflict with existing instructions.
