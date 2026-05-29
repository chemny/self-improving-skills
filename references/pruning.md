# Pruning

Pruning prevents memory and rule files from becoming noisy or contradictory.

## When to prune

- Weekly for active systems.
- After 20 or more new memories/rules.
- When a rule conflict is noticed.
- Before making a major new promotion.

## Checklist

For each candidate rule or memory, ask:

- Is it still true?
- Is it duplicated elsewhere?
- Is it too vague to execute?
- Does it conflict with a higher-priority instruction?
- Has it been unused for a long time?
- Should it be downgraded from rule to memory?
- Should several rules be merged?

## Actions

```text
keep
  Still useful and clear.

merge
  Combine duplicates.

demote
  Move from rule to memory or archive.

archive
  Preserve history but remove from active instructions.

delete
  Remove if wrong, unsafe, or clearly obsolete.
```

## Pruning receipt

After pruning, report:

```markdown
Kept:
Merged:
Demoted:
Archived:
Deleted:
```
