# Memory Entry Standard

Use this standard before writing Self-Improving Skills output into durable memory, candidate files, promotion logs, skills, or host instruction files.

The goal is not to save more text. The goal is to save fewer, clearer, verified operating rules.

## Entry lifecycle

Use this lifecycle for learned behavior:

```text
L0 observation      noticed in a session or scan; not durable
L1 candidate        structured candidate with scope, risk, and next validation
L2 reviewed         checked for specificity, safety, duplication, and destination
L3 validated        passed the required validation threshold
L4 promoted         written to the durable target with a receipt
L5 monitored        later use is checked for usefulness, conflict, or decay
```

Do not skip from L0 to L4 unless the item is an explicit low-risk user preference or stable low-risk fact.

## Validation thresholds

Choose the strictest applicable threshold:

| Item type | Minimum validation before durable promotion |
|---|---|
| Explicit user preference, writing style, or stable personal convention | explicit user confirmation |
| Low-risk local tool or path gotcha | one clear correction or one successful application with evidence |
| Repeated small workflow mistake | two observations, or one observation plus one successful later application |
| Skill workflow rule | user approval or one complete eval loop |
| Trigger phrase or self-start behavior | registry evidence plus review; do not promote broad phrases directly |
| Global behavior, confirmation, deletion, overwrite, external systems, sync, publishing, permissions, automation | explicit user confirmation and eval review; never auto-promote |

## Required quality gates

Every durable entry or candidate must pass all gates:

- Specific: it names a concrete condition and action.
- Executable: a future agent can apply it without guessing.
- Scoped: it says where it applies and where it does not.
- Evidence-backed: it cites a concise observation, correction, eval, or confirmation.
- Safe: it contains no secrets, tokens, cookies, credentials, private raw transcript dumps, or unnecessary personal data.
- Non-duplicative: it does not repeat a clearer existing rule.
- Reversible: it says how to review, demote, edit, or remove it later.

Reject or keep only in a task summary when the item is vague, emotional, one-off, unsupported, unsafe, or only says "be careful".

## Rule language

Use operational language:

```text
When <specific condition>, do <specific action>.
```

Chinese equivalent:

```text
当 <具体场景> 时，执行 <具体动作>。
```

Avoid broad slogans:

```text
Improve quality.
Be more careful.
Remember the user's preferences.
```

## Durable memory format

Use this format for low-risk entries that are eligible for `evolution.md`:

```markdown
## YYYY-MM-DD HH:mm - <type> - <short title>

Status: active
Risk: low
Confidence: medium | high
Scope: global | project:<name> | skill:<name> | tool:<name>
Source: <short session/date/user-confirmation reference; no raw transcript>

Rule:
- When <specific condition>, <specific action>.

Validation:
- Required: explicit_user_confirmation | one_successful_application | two_successful_applications | eval_loop
- Current: confirmed_by_user | observed_once | applied_once | applied_twice | eval_passed
- Evidence count: <number>
- Last applied: <date or none>
- Outcome: active

Apply:
- <where future agents should use this>

Review:
- Review after <date or condition>; demote or archive if stale, conflicting, or unused.
```

## Candidate format

Use this format for `evolution-candidates.md`:

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

## Scan review summary

Background scans and manual reviews should report what happened in a readable summary before or alongside writes:

```markdown
## Self-Improving Skills Scan Review - YYYY-MM-DD HH:mm

Effective learnings:
- [low-risk] <ready for durable memory, with destination>

Needs review:
- [medium/high-risk] <candidate title>
  Reason: <why review is needed>

Rejected / ignored:
- <duplicate / vague / one-off / unsafe / self-referential / no action>

Next actions:
- <approve, revise, route, validate, or archive>
```

If the scan found nothing worth saving, say that clearly. Do not fill memory files with placeholder content.

Scheduled scans must separate inventory from triage:

1. Inventory counts everything in the scan window by event timestamp: sessions with events, sessions with meaningful user messages, raw user messages, meaningful user messages, candidate signals, tool events, and inspected files.
2. Triage decides what to do with extracted signals: promote, candidate, duplicate, reject, or archive-only.
3. Reporting must show both layers. Do not use `Effective information found` as a synonym for `newly written items`.

Use these count names in scan reports:

```markdown
Counts:
- Sessions with events: <number>
- Sessions with meaningful user messages: <number>
- Raw user messages: <number>
- Meaningful user messages: <number>
- Candidate signals detected: <number>
- Effective information identified: <number>
- New writable items: <number>
- Promoted to durable memory: <number>
- Written as candidates: <number>
- Duplicates skipped: <number>
- Rejected / ignored: <number>
```

For scheduled scans, a run is not complete until the formal scan report has been appended to `evolution-scan-reports.md`. This applies even when the run finds only duplicates, writes no memory entries, is concurrent with another scan, or skips all inspected items. Automation-local memory, internal notes, and result summaries are not substitutes for the formal report.

Every formal scan report should include a Chinese readable section. Keep structured English fields for stable parsing, then add `### 中文报告` with plain Chinese explanations of counts, accepted items, rejected or skipped items, write results, and next actions.

If a configured report thread is available, post the concise `Self-Improving Skills Scan Review` there after the formal report is written. If no report thread is configured or accessible, do not post to the active user chat; keep the formal file report as the source of truth and state that thread delivery was unavailable.

## Promotion receipt

Every promotion must leave a receipt:

```markdown
## YYYY-MM-DD HH:mm Promotion

Promoted item:
- <title>

From:
- observation | candidate | explicit_user_confirmation | eval_loop

Promoted to:
- <path or destination>

Why eligible:
- <specific threshold passed>

Rollback:
- <how to remove, demote, or edit the promoted rule>
```

## Deletion and pruning

Memory evolution includes add, modify, merge, demote, archive, and delete.

Prefer demotion or archive before deletion unless the user explicitly asks to delete or the entry contains unsafe data. Confirm before deleting active preferences, guardrails, or high-impact rules.
