# OpenClaw Adapter

OpenClaw is a good host for automated reflection, session scanning, and background improvement loops.

## Suggested mapping

```text
Session reflection
-> .learnings/LEARNINGS.md

Repeated failures
-> .learnings/ERRORS.md

Feature gaps
-> .learnings/FEATURE_REQUESTS.md

Eval-backed rule experiments
-> .learnings/EXPERIMENTS.md

Promoted workflow rules
-> AGENTS.md or the workspace instruction file used by the OpenClaw environment

Tool notes
-> TOOLS.md or the tool notes file used by the OpenClaw environment
```

## Automation

If a scheduled task scans sessions, keep it bounded:

- Read recent sessions only.
- Avoid loading full huge transcripts.
- Extract specific, actionable lessons.
- Do not promote rules automatically when they are high-impact; ask for review.
