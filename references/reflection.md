# Reflection

Use reflection after meaningful tasks, after user feedback, or when the user asks for a summary that should improve future behavior.

## Closeout format

Keep the normal task summary concise, then add:

```markdown
## Evolution Reference

- Reusable learning:
- User preference:
- Tool or environment gotcha:
- Next time avoid:
- Suggested rule update: yes/no, because:
```

## Extraction rules

Extract only specific, future-useful lessons. Avoid vague lessons like "be careful" or "test more".

Prefer:

```text
When a task summary includes future-useful behavior, separate durable lessons from one-off task details before writing anything to memory.
```

Avoid:

```text
Remember to be careful with skills.
```

## When to store

Store a reflection item when at least one condition is true:

- The user explicitly requested it.
- The issue repeated.
- It affects future execution.
- It captures a stable user preference.
- It records a non-obvious tool or environment fact.

Keep it in the summary only when it is task-local or unlikely to recur.

## Task summary template

```markdown
## Completed
- 

## Verification
- 

## Evolution Reference
- Reusable learning:
- User preference:
- Tool or environment gotcha:
- Next time avoid:
- Suggested rule update:
```
