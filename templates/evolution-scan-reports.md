# Self-Improving Skills Scan Reports

This file stores detailed reports produced after each scheduled Self-Improving Skills scan.

Purpose:
- Help the user audit what the scan reviewed, accepted, rejected, ignored, promoted, or deferred.
- Make scan behavior inspectable while tuning Self-Improving Skills.
- Keep reports separate from durable memory rules.

Rules:
- Reports are audit records, not operating rules.
- Do not store secrets, tokens, cookies, private keys, credentials, or raw transcript dumps.
- Use bounded source references only, such as session date, rollout id, or short title.
- Include counts, accepted items, rejected/ignored items, write destinations, and next actions.

Report format:

```markdown
## YYYY-MM-DD HH:mm - Scan Report

Run:
- Window: <time range or bounded recent set>
- Host: Codex | Claude Code | OpenClaw | Generic
- Source scope: <session roots and bounded read method>
- Files inspected: <number>
- Sessions inspected: <number>

Counts:
- Project ledger items: <number>
- Effective information found: <number>
- Promoted to durable memory: <number>
- Written as candidates: <number>
- Duplicates skipped: <number>
- Rejected / ignored: <number>

Project ledger:
- Project / task: <short title>
  Session/source: <session id, cwd, or host reference>
  Goal: <what the user was trying to accomplish>
  Output evidence: <files, repo, skill, workflow, report, media artifact, or verification result when available>
  Decisions: <confirmed choices, constraints, or direction changes>
  Reusable learning hints: <possible future-useful lessons>
  Memory action: promoted | candidate | duplicate | archive-only | rejected | needs-manual-review
  Reason: <why this memory action was chosen>

Promoted:
- <title> -> <destination>; reason: <why eligible>

Candidates:
- <title> -> <destination>; reason: <why candidate>

Rejected / ignored:
- <session/source>: <information>; reason: duplicate | vague | one-off | unsafe | self-referential | already captured | insufficient evidence

Included sessions:
- <session/source>: <short reason this session was included>

Excluded sessions:
- <session/source>: <short reason this session was skipped>

Write result:
- evolution.md: <changed | unchanged>
- evolution-candidates.md: <changed | unchanged>
- evolution-promotions.md: <changed | unchanged>
- evolution-scan-reports.md: changed

Next actions:
- <review, validate, route, archive, or no action>
```
