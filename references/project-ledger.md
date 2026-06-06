# Project Ledger

Use the Project Ledger to make Agent Evolution account for real work before it decides what becomes memory.

The ledger is required for scheduled scans, manual six-hour scans, and any rich project-session review. It is not durable memory by itself. It is an auditable project/work inventory layer between raw sessions and memory candidates.

## Purpose

- Show what projects or tasks happened in the scan window.
- Show what outputs, decisions, and reusable lessons were detected.
- Make it clear which work was reviewed, which work was ignored, and why.
- Prevent project outcomes from disappearing just because they are not explicit "remember this" phrases.
- Let the user audit whether Agent Evolution actually saw the work before judging whether it should be promoted.

## Required Fields

Each ledger item should include:

```markdown
- Project / task: <short title>
  Session/source: <session id, cwd, or host reference>
  Goal: <what the user was trying to accomplish>
  Output evidence: <files, repo, skill, workflow, report, media artifact, or verification result when available>
  Decisions: <confirmed choices, constraints, or direction changes>
  Reusable learning hints: <possible future-useful lessons>
  Memory action: promoted | candidate | duplicate | archive-only | rejected | needs-manual-review
  Reason: <why this memory action was chosen>
```

## What Counts as Project Evidence

Look for:

- created or edited files, folders, repositories, skills, scripts, README files, reports, presentations, media, or diagrams;
- user-approved plans or direction changes;
- repeated corrections that changed the workflow;
- test, verification, preview, or publish results;
- decisions about platform support, routing, scope, or quality gates;
- reusable task patterns even when the user did not say "remember".

## What Not to Do

- Do not treat the ledger as permission to auto-promote broad rules.
- Do not store secrets, raw transcript dumps, or private data.
- Do not invent outputs that are not supported by session evidence.
- Do not hide rejected work. Explain why it was rejected or left as archive-only.

## Promotion Boundary

Use the ledger first, then decide memory action:

```text
session activity
  -> project ledger
  -> reusable learning hints
  -> candidate or durable memory only when quality standards pass
```

If a project produced value but does not yet justify a durable rule, keep it visible in the scan report as `archive-only` or `needs-manual-review`.

## Validation Evidence

- 2026-06-06 manual six-hour scan: the user confirmed that the Project Ledger style summary was good and showed that the modification was effective.
- Treat this as one successful application for the rule: scheduled or manual scan reports should show project outcomes before memory triage.
