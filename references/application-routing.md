# Application Routing

Use this reference after a memory entry has been captured as a candidate and before it is promoted into durable operating behavior.

The purpose is to make learned behavior actually usable. A memory that is only stored but never routed, applied, or checked is not an evolution loop.

## Core flow

```text
Candidate -> route -> apply in matching task -> record result -> validate -> promote, revise, or archive
```

Use the smallest route that future agents will naturally read. Do not promote a candidate into a broader destination just because it is useful once.

## Route by scope

| Candidate scope | Primary destination after validation | Apply during |
|---|---|---|
| `preference` | host user memory | any matching future conversation |
| `writing_style` | host user memory or writing-style skill | writing, editing, publishing tasks |
| `tool:<name>` | tool notes or relevant skill reference | tasks using that tool |
| `skill:<name>` | that skill's reference file | tasks using that skill |
| `project:<name>` | host instruction file for that project | work inside that project |
| `global` | host instruction file only after explicit review | all tasks in that host |
| `archive_only` | cold archive or task summary | no automatic application |

When a candidate could fit multiple destinations, choose the narrowest one that prevents the repeated problem.

## Candidate application record

When a candidate is applied in a real task, append or update a short application record near the candidate:

```markdown
Application log:
- YYYY-MM-DD: applied in <task/context>; outcome: success | partial | failed; evidence: <short observable result>
```

Update the validation block:

```markdown
Validation:
- Required: explicit_user_confirmation | one_successful_application | two_successful_applications | eval_loop
- Current: observed_once | applied_once | applied_twice | eval_pending | eval_passed | failed | archived
- Evidence count: <number>
- Last applied: <date or none>
- Next check: <next task or eval>
```

Do not count an application as successful unless it changed behavior in the intended direction and did not introduce a new problem.

## Promotion decision

After application, decide:

```text
promote       threshold met, rule is precise, destination is clear
revise        useful but wording, scope, or destination is wrong
keep_candidate useful but not enough evidence yet
route         belongs in a specific skill/tool/project, not global memory
archive       no longer useful or stale
reject        unsafe, vague, duplicated, or wrong
```

Promotion requires the thresholds in `memory-entry-standard.md` and the checks in `promotion.md`.

## Application hit rate

When reviewing effectiveness, track these lightweight counters:

```text
candidate_count       structured candidates created
application_count     candidates used in matching tasks
promotion_count       candidates promoted after validation
repeat_failure_count  repeated mistakes that still happened
archive_count         stale or wrong entries removed from active flow
```

Do not add heavy analytics unless the user asks. These counters can be reported manually during review.

## Routing examples

### User writing preference

```text
Candidate: The user prefers concise, direct Chinese explanations for governance rules.
Route: host user memory
Validation: explicit user confirmation
Promotion: direct memory, with receipt if the host supports it
```

### Tool gotcha

```text
Candidate: A local CLI needs `--json` for parseable output.
Route: tool notes or relevant skill reference
Validation: one successful application
Promotion: tool note
```

### Skill workflow rule

```text
Candidate: CMM video production should check key frames and voiceover duration before full render.
Route: skill:cmm-video-production
Validation: user approval or one complete eval loop
Promotion: cmm-video-production reference, not global memory
```

## Safety

- Never route secrets or raw transcript content into memory.
- Never route deletion, overwrite, publishing, sync, permission, or automation behavior into active rules without explicit review.
- Never treat a candidate as validated because it was written down.
- Never make a global rule when a skill, tool, or project rule is enough.
