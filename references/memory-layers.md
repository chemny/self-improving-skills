# Memory Layers

Use this reference when Agent Evolution needs to manage memory growth, conflict resolution, forgetting, export, stats, or migration from another memory skill.

## Layer model

Use layers as a routing model. Do not hard-code a global path.

```text
HOT
  Short active rules, explicit user preferences, current collaboration style, and confirmed guardrails.

WARM
  Project-specific notes, domain rules, tool gotchas, workflow lessons, and items that matter only in matching contexts.

COLD
  Archived, superseded, stale, audit-only, or low-confidence historical notes.
```

## What goes where

```text
Explicit writing style preference -> HOT user memory
Project test command convention -> WARM project instruction file
Tool flag gotcha -> WARM tool notes or relevant skill reference
Repeated failure under investigation -> WARM experiment log
Superseded rule -> COLD archive or pruning receipt
One-off task detail -> task summary only
```

## Promotion and demotion

Promote to HOT only when the item is:

- explicit from the user, or
- repeatedly useful, or
- validated by evals, or
- necessary to prevent a repeated costly mistake.

Use `memory-entry-standard.md` to record the validation state before promotion. A daily scan observation is not enough by itself unless it is an explicit low-risk user preference or stable low-risk fact.

Demote or archive when the item is:

- unused for a long time,
- duplicated by a clearer rule,
- project-specific rather than global,
- contradicted by a newer instruction,
- too vague to execute.

Do not delete confirmed user preferences unless the user asks or confirms.

## Conflict handling

When memories conflict:

```text
higher-priority instruction wins over memory
project-specific beats domain-specific
domain-specific beats global
newer beats older at the same level
explicit user instruction beats inferred pattern
```

Ask the user when the conflict changes important behavior or cannot be resolved from scope.

## Memory stats

When the user asks for memory stats, report counts and risks rather than dumping content:

```markdown
HOT:
- Active preferences:
- Active rules:

WARM:
- Project notes:
- Tool notes:
- Experiments:

COLD:
- Archived:
- Deprecated:

Attention needed:
- Duplicates:
- Conflicts:
- Stale candidates:
```

## Forget, export, and audit

- Forget: confirm before deleting or weakening an active preference, rule, or guardrail.
- Export: include only the user's requested memory scope; exclude secrets and unrelated private data.
- Audit: search for duplicated, vague, stale, conflicting, or unsafe entries before adding more.
- Prune: memory evolution may add, modify, merge, demote, archive, or delete entries; prefer archive before deletion unless unsafe data must be removed.

## Migration from other memory skills

When importing from another memory system:

1. Read its active memory/index files first, not every log.
2. Keep explicit user preferences and validated rules.
3. Convert repeated raw corrections into one concise rule when evidence is strong.
4. Archive old logs instead of copying them into active memory.
5. Record what was migrated and what was intentionally skipped.
