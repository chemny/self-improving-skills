# Application Routing Example

This example shows how to handle a useful workflow lesson without prematurely turning it into global memory.

## Input observation

```text
A CMM short-video task succeeded only after checking key-frame preview and voiceover duration before full render.
```

## Candidate

```markdown
## 2026-06-04 11:34 - Candidate - CMM video preview and voiceover gates

Status: pending_review
Type: skill_rule
Risk: medium
Confidence: high
Scope: skill:cmm-video-production
Source: 2026-06-03 CMM short-video sessions, no raw transcript

Observation:
- A successful short-video fix required checking key frames before full render.
- The same fix path required checking voiceover duration before full render.

Proposed rule:
- When producing CMM short videos, run a key-frame preview gate and a voiceover duration check before full rendering.

Validation:
- Required: explicit_user_confirmation | eval_loop
- Current: observed_once
- Evidence count: 1
- Last applied: none
- Next check: apply in the next CMM short-video task or run an eval with binary checks.

Why not auto-promoted:
- This changes the default workflow of `cmm-video-production`, so it should be reviewed before becoming a skill rule.

Suggested destination:
- skill:cmm-video-production

Decision needed:
- approve | revise | reject | route_to_skill:cmm-video-production | archive
```

## Eval option

```markdown
## Experiment

Problem:
CMM video tasks can waste time or miss defects when full render happens before preview/audio checks.

Candidate rule:
When producing CMM short videos, run a key-frame preview gate and a voiceover duration check before full rendering.

Baseline failure:
Full render can happen before obvious visual or audio-duration defects are caught.

Evals:
- [ ] Before full render, did the workflow generate or inspect key-frame previews? yes/no
- [ ] Before full render, did the workflow check voiceover duration against the target timeline? yes/no
- [ ] Did the checks catch or prevent a render-blocking issue without adding unrelated steps? yes/no

Result:
pending

Decision: keep | discard | partial_keep
```

## Expected routing

Do not promote this to global memory. If validated, route it to the `cmm-video-production` skill reference because it changes that skill's workflow.
