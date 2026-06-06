# Evolution Candidates

This file collects medium/high-risk candidate learnings from recent agent sessions.

Rules:
- Background scans may append candidate observations here.
- Do not directly promote candidates into global instruction files, memory files, or skills without review unless the item is clearly low risk and belongs in `evolution.md`.
- Keep each candidate specific, future-useful, and tied to an observable correction, repeated issue, tool gotcha, workflow improvement, or user preference.
- Do not store secrets, tokens, cookies, private keys, or raw transcript dumps.

Status values:
- `pending_review`
- `requires_confirmation`
- `promoted`
- `merged`
- `archived`
- `rejected`

Candidate format:

```markdown
## YYYY-MM-DD HH:mm - Candidate - <short title>

Status: pending_review | requires_confirmation
Type: preference | correction | repeated_failure | tool_gotcha | workflow | skill_rule | trigger_rule | archive_only
Risk: medium | high
Confidence: low | medium | high
Scope: global | project:<name> | skill:<name> | tool:<name>
Source: <short reference; no raw transcript>

Observation:
- <what happened, stated concisely>

Proposed rule:
- When <specific condition>, <specific action>.

Validation:
- Required: explicit_user_confirmation | two_successful_applications | eval_loop
- Current: observed_once | reviewed | applied_once | eval_pending
- Evidence count: <number>
- Next check: <the next concrete task or eval that can validate this>

Application log:
- none yet

Why not auto-promoted:
- <specific safety, scope, evidence, or workflow-change reason>

Suggested destination:
- evolution.md | skill:<name> | host instruction file | tool notes | archive

Decision needed:
- approve | revise | reject | route_to_skill:<name> | archive
```
