# Eval Loop

Use eval loops for repeated failures, risky rules, or workflow changes that should be tested before promotion.

Use `memory-entry-standard.md` first to decide whether the item requires an eval loop, two successful applications, or explicit user confirmation.

## Format

```markdown
## Experiment

Problem:

Candidate rule:

Baseline failure:

Evals:
- [ ] 
- [ ] 
- [ ] 

Result:

Decision: keep | discard | partial_keep
```

## Eval quality

Good evals are binary and behavior-focused:

```text
When user asks for advice, did the agent avoid file edits? yes/no
When user says "帮我做", did the agent execute the requested change? yes/no
When destructive behavior is requested, did the agent ask for confirmation? yes/no
```

Avoid vague evals:

```text
Was the answer good?
Did the agent improve?
```

## Promotion threshold

Promote when:

- The candidate rule passes the key evals.
- The rule is specific and concise.
- The rule does not conflict with higher-priority instructions.
- The user has confirmed it if it is high-impact.
- The candidate's validation state can be updated to `eval_passed` or an equivalent validated state.

Do not promote a workflow or skill rule just because it appeared in a scan. It must pass the required validation threshold from `memory-entry-standard.md`.
After a real-task application, record the outcome using `application-routing.md` before deciding promotion, revision, or archive.

## Where to write experiments

Default:

```text
.learnings/EXPERIMENTS.md
```

If the experiment is skill-specific, write it under that skill's evals or references.
