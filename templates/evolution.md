# Agent Evolution Memory

This file stores low-risk, auto-promoted learnings from recent agent sessions.

Purpose:
- Capture specific, future-useful lessons that can safely improve future behavior.
- Keep these rules below higher-priority system, developer, project, and explicit user instructions.
- Prefer concise rules with clear evidence.

Auto-promotion is allowed only for low-risk items such as:
- explicit user preferences;
- user-corrected low-risk behavior;
- stable local path or tool gotchas;
- repeated small workflow mistakes with a clear fix.

Auto-promotion is not allowed for:
- deletion or overwrite rules;
- external systems such as GitHub, Feishu/Lark, email, publishing, or sync;
- credentials, tokens, cookies, or secrets;
- automation behavior changes;
- global behavior changes that should live in host instruction files;
- edits to skills or high-impact trigger routing.

Entry format:

```markdown
## YYYY-MM-DD HH:mm - <type> - <short title>

Status: active
Risk: low
Confidence: medium | high
Scope: global | project:<name> | skill:<name> | tool:<name>
Source: <short reference; no raw transcript>

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
