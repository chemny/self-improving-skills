# Self-Improving Skills Graded Scan Prompt

Run a graded Self-Improving Skills scan for the current user.

Scope:
- Read recent agent session logs only from the host's normal session log location.
- Use the actual scheduled window first, normally the last 6 hours ending at the current run time.
- Count activity by event timestamps inside the window, not by file modification time alone.
- Before extracting learnings, build a window inventory with sessions, raw user messages, meaningful user messages, candidate signals, tool events, and inspected files.
- Do not read browser history, emails, private app data, unrelated project files, or full large transcripts.
- For large transcripts, first use inventory counts and candidate signal samples, then read only bounded excerpts around likely signal timestamps.
- Do not claim a six-hour scan is complete from a small bounded recent set unless the report explicitly says it was only a partial scan.

Required scan order:
1. Window inventory: count sessions with events, sessions with meaningful user messages, raw user messages, meaningful user messages, candidate signals, tool events, and inspected files.
2. Project ledger: list the projects/tasks that actually happened in the window before judging memory value. Include goals, outputs, decisions, reusable learning hints, and the memory action chosen for each item.
3. Signal extraction: inspect candidate signal samples and bounded excerpts around likely preference, correction, workflow, skill, safety, or tool-gotcha signals.
4. Triage: classify each signal as promoted, candidate, duplicate, rejected, or archive-only.
5. Reporting: report both the full inventory counts, the project ledger, and the triage result. Never use "effective information found" to mean only "newly written items".

Look for learnings only when they are specific, future-useful, and observable:
- explicit user preferences;
- user corrections or negative feedback;
- repeated mistakes;
- tool, path, permission, or environment gotchas;
- outdated rules or conflicting instructions;
- workflows that clearly worked well and are likely reusable;
- trigger wording that caused missed triggers or false triggers.

Classify each learning:
- Type: preference | correction | repeated_failure | tool_gotcha | workflow | skill_rule | trigger_rule | archive_only
- Confidence: low | medium | high
- Risk: low | medium | high
- Lifecycle: observation | candidate | reviewed | validated | promoted

Risk policy:

LOW RISK: auto-promote when the learning is clearly supported by explicit user feedback or repeated evidence and does not affect destructive actions, external systems, automation settings, global instruction files, skill files, permissions, or secrets.

MEDIUM RISK: write to candidates only when the learning may affect a default workflow, routing between skills, trigger phrasing, or behavior across several task types, or when evidence is plausible but not explicit.

HIGH RISK: write to candidates only and mark `Status: requires_confirmation` when the learning affects deletion, overwrite, external systems, GitHub, Feishu/Lark, publishing, sync, credentials, permissions, automation behavior, host instruction files, skill files, or broad cross-agent behavior.

Write targets:
- Low-risk auto-promotions: append to the host's Self-Improving Skills `evolution.md` and write a receipt to `evolution-promotions.md`.
- Medium/high-risk candidates: append to `evolution-candidates.md`.
- Detailed scan report: append to `evolution-scan-reports.md` after every scan.
- If there are no useful candidates and no safe promotions, append nothing.

Project Ledger:
- Use `project_ledger` from `scan-window.mjs` when available.
- If unavailable, build a bounded project ledger manually from session ids, cwd, user goals, created/edited artifacts, tool calls, final summaries, and verification results.
- The ledger is an audit layer, not durable memory. It should explain work reviewed even when no memory entry is written.
- Do not reduce the scan to keyword signals. First answer: what projects/tasks happened, what was produced, what decisions were made, and what reusable lessons might exist.

Use this format in `evolution.md`:

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

Use this format in `evolution-promotions.md`:

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

Validation:
- Required: <threshold>
- Final state: <confirmed_by_user | applied_twice | eval_passed>

Rollback:
- <how to remove, demote, or edit the promoted rule>
```

Use this format in `evolution-candidates.md`:

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

Entry standards:
- Do not write raw summaries, vague advice, or unordered transcript snippets.
- Every candidate or promotion must include status, risk, confidence, scope, source, rule, validation state, destination, and next action or review condition.
- For candidates, include why the item was not auto-promoted, what validation is required next, the suggested application route, and an `Application log` field.
- For promotions, include the exact threshold passed and a rollback path.
- Use "When <specific condition>, <specific action>." as the rule language.

Application routing:
- User preference -> host user memory after confirmation.
- Tool gotcha -> tool notes or relevant skill reference after validation.
- Skill workflow rule -> that skill's reference after user approval or eval.
- Project rule -> host instruction file for that project after review.
- Global rule -> host instruction file only after explicit review.
- Unclear, stale, unsafe, or one-off items -> archive or reject.

Scan result notification:

The automation result is not the formal report. Keep successful runs silent whenever the host allows it.

```markdown
<empty result when allowed>
```

If the host requires a non-empty result for a successful run, return only:

```markdown
Self-Improving Skills: scan completed.
```

Do not mention counts, promoted items, candidates, project records, accepted/rejected lists, raw excerpts, or the detailed Chinese report in successful automation results. Those belong in `evolution-scan-reports.md` and the dashboard.

Only return a visible message when there are warnings or partial failures:

```markdown
Self-Improving Skills: scan completed with warning. <short warning>. Report saved or staged.
```

Detailed scan report:

Append this report to `evolution-scan-reports.md` after every scheduled scan, even when no memory entries are written:

Completion contract:
- A scan is not complete until `evolution-scan-reports.md` has a new `Scan Report` entry for that run.
- This is required for duplicate-only, no-new-writes, no-useful-candidates, concurrent, partial, and skipped scans.
- Do not treat automation-local memory, internal notes, or the scan notification as a substitute for the formal scan report.
- The report must include a Chinese readable section so the user can audit the result directly. Keep the structured English fields for machine consistency, then add `### 中文报告` with plain Chinese explanation of counts, accepted items, rejected items, write results, and next actions.
- If a configured report thread is available, post only a concise warning or required completion status there after the formal file report is written. If no report thread is configured or accessible, do not post to the active user chat and do not treat that absence as a user-visible warning by itself.

```markdown
## YYYY-MM-DD HH:mm - Scan Report

Run:
- Window: <time range or bounded recent set>
- Host: Codex | Claude Code | OpenClaw | Generic
- Source scope: <session roots and bounded read method>
- Files inspected: <number>
- Sessions inspected: <number>

Counts:
- Sessions with events: <number>
- Sessions with meaningful user messages: <number>
- Raw user messages: <number>
- Meaningful user messages: <number>
- Candidate signals detected: <number>
- Project ledger items: <number>
- Effective information identified: <number>
- New writable items: <number>
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

### 中文报告

项目成果账本：
- <项目/任务>：目标是 <目标>；产出/证据是 <文件、仓库、skill、流程、报告、媒体或验证结果>；可复用经验是 <经验>；memory 处理结果是 <纳入/候选/重复/归档/舍弃/待人工 review>，原因是 <原因>

运行概况：
- <用中文说明本次扫描窗口、平台、扫描范围、检查文件数和会话数>

统计结果：
- <用中文分别说明：有事件的线程数、有意义用户输入数、候选信号数、识别到的有效信息数、新增可写入信息数、长期记忆、候选记忆、重复项、舍弃项数量>

纳入 memory 的内容：
- <标题>：<为什么纳入，写到了哪里>

未纳入 memory 的内容：
- <来源或标题>：<为什么舍弃、跳过或延后>

写入结果：
- <用中文说明 evolution.md、evolution-candidates.md、evolution-promotions.md、evolution-scan-reports.md 是否变化>

下一步：
- <用户需要 review、validate、route、archive，或无需行动>
```

Safety:
- Never store secrets, tokens, cookies, private keys, personal credentials, or raw transcript dumps.
- Never edit global instruction files, skill files, automation files, or external systems from this scan.
- Never delete, overwrite, sync, publish, push, or change permissions.
- Never auto-promote broad global behavior changes.
