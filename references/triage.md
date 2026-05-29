# Triage

Classify each signal before writing it anywhere durable.

## Categories

```text
preference
  User style, communication preference, format preference, or stable personal context.

correction
  User says the agent was wrong, missed a requirement, used the wrong tool, or misunderstood intent.

tool_gotcha
  A command, API, path, permission, dependency, shell, or local environment fact.

workflow
  A better process for future tasks.

feature_gap
  A missing capability, automation idea, or skill improvement request.

experiment
  A repeated or high-risk issue that should be validated before becoming a strong rule.

archive_only
  Useful context for history but not a future behavior rule.
```

## Priority

```text
P0 guardrail
  High-impact constraint. Requires care and often confirmation.

P1 rule
  Stable, recurring behavior that should shape future execution.

P2 memory
  Useful preference or background for future reference.

P3 note
  Local or weak signal; keep in the task summary unless it repeats.
```

## Decision checklist

Ask:

- Did the user explicitly ask to remember this?
- Is it stable beyond the current task?
- Would applying it broadly cause harm or surprise?
- Does it conflict with existing instructions?
- Is it specific enough to execute?
- Does it need evals before promotion?

## Default choices

- Explicit user style preference -> P2 memory.
- Explicit future behavior rule -> P1 rule, confirm if high-impact.
- Repeated agent error -> P1 rule or experiment.
- One-off task instruction -> P3 note.
- Tool failure with reusable fix -> P1 tool rule or P2 tool memory.
