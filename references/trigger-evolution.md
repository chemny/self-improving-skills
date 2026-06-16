# Trigger Evolution

Use this guide when improving when `self-improving-skills` should trigger. Trigger evolution is a governance loop, not a keyword dump.

## Principle

Trigger phrases must be managed through a full lifecycle:

```text
candidate -> active -> promoted -> deprecated -> removed
```

The system should add useful phrases, but also modify, merge, demote, and remove phrases that become noisy, redundant, stale, or conflict-prone.

## Trigger states

```text
candidate
  A possible trigger observed once or inferred from a user correction. Record it, but do not rely on it yet.

active
  A confirmed trigger phrase or phrase group. Keep it in trigger-registry.md.

promoted
  A high-confidence, high-frequency trigger group important enough to appear in SKILL.md frontmatter description.

deprecated
  A phrase that used to be useful but is now ambiguous, stale, or too broad. Keep temporarily for audit history.

removed
  A phrase that should no longer be used as a trigger.
```

## Operations

### Add

Add a candidate when:

- the user explicitly says a phrase should trigger memory, reflection, promotion, or eval behavior,
- the same expression appears repeatedly with the same intent,
- a missed trigger is discovered and the user confirms the intended meaning.

Default destination: `trigger-registry.md`, not `SKILL.md`.

### Modify

Modify a trigger when it is useful but too broad.

Example:

```text
Too broad: 处理一下
Better: 以后类似问题都按这个方式处理
```

Prefer specific phrase patterns with intent markers.

### Merge

Merge overlapping phrases into a phrase group.

Example:

```text
后面按这个来
以后照这个来
类似情况按这个处理
```

Group:

```text
follow_this_pattern
```

### Demote

Demote when a phrase causes false triggers or becomes less useful.

```text
promoted -> active
active -> candidate
candidate -> deprecated
```

Demotion is better than immediate deletion when there is still uncertainty.

### Remove

Remove when:

- the user says not to treat the phrase as a trigger,
- it repeatedly causes false triggers,
- it conflicts with another skill,
- it is obsolete,
- it duplicates a better phrase group.

Keep a short removal note in `trigger-registry.md` unless the user asks for deletion without trace.

## Evaluation criteria

Review trigger phrases using:

```text
precision
  When this phrase triggers, is it usually correct?

recall
  Does this phrase prevent common missed triggers?

conflict
  Does this phrase overlap badly with another skill?

specificity
  Is it concrete enough to map to one intent?

freshness
  Has the user used this phrase recently?

value
  Does the phrase materially improve behavior?
```

## Promotion threshold

Promote a trigger group into `SKILL.md` frontmatter description only when:

- it is high-frequency or critical,
- it is unambiguous enough for the startup skill index,
- it does not make the skill overtrigger,
- it has user confirmation or strong repeated evidence.

Keep rare variants in `trigger-registry.md`.

## Pruning schedule

Run trigger pruning:

- after 20 new candidate trigger events,
- after any obvious false trigger,
- before promoting new phrases to `SKILL.md`,
- weekly for active systems.

## Change receipt

After changing trigger behavior, report:

```markdown
Added:
Modified:
Merged:
Demoted:
Removed:
Promoted to description:
Reason:
```
