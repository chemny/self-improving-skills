# Storage Routing

Choose the narrowest durable destination that future agents are likely to read.

## Default targets

```text
Host agent user memory
  User preferences, writing style, collaboration style, long-term user context. Use the memory location configured by the user's agent environment.

Agent instruction file
  Workspace or global operating rules that affect how agents execute tasks. Examples include AGENTS.md, CLAUDE.md, or another instruction file supported by the host agent.

Tool notes file
  Tool-specific gotchas, paths, command flags, auth routing, environment quirks. Use TOOLS.md or an equivalent file only when the user's environment supports it.

skill/SKILL.md or skill/references/*.md
  Behavior that belongs to one skill.

.learnings/LEARNINGS.md
  General reusable lessons.

.learnings/ERRORS.md
  Repeated failures or important mistakes.

.learnings/FEATURE_REQUESTS.md
  Missing capabilities or automation ideas.

.learnings/EXPERIMENTS.md
  Eval-backed improvement attempts.
```

## Routing examples

```text
"My writing style is practical and direct."
-> the user's writing-style memory file.

"For this repo, always run pnpm test before final."
-> the current repo's agent instruction file.

"This CLI needs --json for parseable output."
-> the host agent's tool notes file or the relevant skill reference.

"The slide skill should always export a preview image."
-> relevant skill reference.
```

## Before editing

Before writing to persistent files:

1. Read the existing target file if it exists.
2. Preserve existing structure and user edits.
3. Add the smallest useful entry.
4. Avoid duplicating an existing rule.
5. Report the changed path.
