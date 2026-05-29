# Deprecation Plan

Use this reference after Agent Evolution has absorbed the useful behavior of older self-updating skills.

## Deprecation stages

Use gradual deprecation before deletion:

```text
active -> narrowed -> deprecated -> archived -> removed
```

## Stage definitions

```text
active
  The old skill can still trigger normally.

narrowed
  The old skill description is reduced so Agent Evolution owns memory, reflection, correction learning, eval promotion, and pruning.

deprecated
  The old skill remains installed only for historical reference or migration. Its description should say to use Agent Evolution.

archived
  The old skill is moved out of the active skills directory but retained locally.

removed
  The old skill directory is deleted after user confirmation and after checking for unique data.
```

## Recommended order

1. Migrate durable content with `references/migration-checklist.md`.
2. Narrow broad triggers in the old skill.
3. Add a deprecation note to the old skill.
4. Open a fresh session and confirm Agent Evolution triggers for the main workflows.
5. Archive the old skill outside the active skills directory.
6. Delete only after the user confirms there is no remaining unique value.

## Deprecation note

Use this note when editing an old skill:

```markdown
Deprecated: use `agent-evolution` as the primary workflow for direct memory, correction learning, task reflection, eval-backed rule promotion, trigger governance, pruning, and forgetting. This skill is retained only as a historical reference or migration source.
```

## Trigger narrowing guidance

Remove or narrow old skill trigger phrases for:

- remember / 记住
- always / never / 以后都 / 不要再
- reflection / 复盘 / 总结经验
- correction learning / 纠错 / 重复犯错
- eval loop / 验证规则
- pruning / 删除规则 / 清理记忆

Keep old skill triggers only for truly unique, source-specific behavior that Agent Evolution does not own.

## Archive safety

Before archiving or removing:

- Search for unique user preferences.
- Search for unique rules that are not in Agent Evolution's routed destinations.
- Search for local data files under the skill directory.
- Check whether other skills reference this skill by name or path.
- Confirm no scheduled automation depends on it.

## Removal receipt

After archiving or removing, report:

```markdown
Old skill:
Action: narrowed | deprecated | archived | removed
Archive path:
What was migrated:
What was intentionally left behind:
How to restore:
```

## Do not remove automatically

Never delete another installed skill only because it overlaps. Removal requires explicit user confirmation after migration and verification.
