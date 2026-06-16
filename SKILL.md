---
name: self-improving-skills
description: 自包含的 Agent skills 自我改进系统。必须在用户说“记住”“以后都”“我的风格是”“不要再”“总结可沉淀经验”“复盘”“进化”“沉淀”“避免重复犯错”“写入长期记忆”“更新规则”“测试新规则是否有效”时使用，即使用户没有点名 self-improving-skills。Use this self-contained skill for recording user preferences, corrections, task reflections, repeated failures, tool gotchas, eval loops, rule promotion, and pruning across Codex, Claude Code, and OpenClaw.
version: 0.2.0
---

# Self-Improving Skills

Use this skill to turn explicit user instructions, task summaries, corrections, repeated failures, and workflow insights into durable operating knowledge.

This skill is self-contained. It replaces the main workflows of `self-improving`, `openclaw-self-improvement`, and `self-reflection` for preference memory, correction learning, task reflection, eval-backed rule promotion, and pruning. Those skills can be treated as historical references or migration sources only.

## Core loop

Follow this loop:

```text
Signal -> Triage -> Route -> Store -> Validate -> Promote -> Apply -> Prune
```

Use the smallest useful part of the loop. Do not force every memory through a slow eval process.
Before writing durable memory or candidates, use `references/memory-entry-standard.md` to keep entries structured, scoped, validated, and reversible.
When reviewing scheduled scans, manual six-hour scans, or rich project sessions, build a Project Ledger first with `references/project-ledger.md` so real project outcomes, outputs, decisions, and reusable learning hints are visible even when they are not promoted to memory. This is the default scan-report path, not an optional add-on.
When the user wants to understand how Self-Improving Skills is running, generate the read-only dashboard with `scripts/generate-dashboard.mjs` and explain the visible queues, scan reports, active rules, and Project Ledger items. Read `references/dashboard.md` before changing dashboard behavior.

When another self-improvement skill could also apply, prefer this skill as the single controller. Do not ask the other skill to own the workflow unless the user explicitly asks to inspect or migrate it.

## Quick decision path

Use this fast path before opening deeper references:

```text
Explicit remember / preference / style -> direct memory, then report destination.
Task summary or reflection request -> produce Evolution Reference; promote only specific reusable lessons.
Low-risk correction with a stable fix -> candidate or direct low-risk rule, with evidence.
Repeated failure or workflow change -> candidate + validation or eval loop.
Deletion, overwrite, sync, publishing, external system, global behavior, automation, or permission rule -> 🔴 CHECKPOINT / 🛑 STOP.
Discussion, diagnosis, advice, or "how should we do this?" -> no persistent write and no rule change unless the user explicitly asks to execute.
Unclear, vague, one-off, or unsupported signal -> task summary only; do not promote.
```

## Self-start model

Use three startup levels:

```text
metadata-trigger             the host loads this skill when SKILL.md description matches the user request
opportunistic-self-start     once loaded, run lightweight evolution checks after significant work, corrections, tool failures, or repeated issues
scheduled-reflection-adapter optional host automation; only active when explicitly configured outside this skill
```

Read `references/self-start.md` before changing startup behavior or proposing background reflection.

## Failure modes

Use these hard stops before storing, promoting, or automating:

| If this happens | Do this |
|---|---|
| Scheduled reflection is not configured and verified | Do not claim background reflection is active |
| A trigger phrase is broad or ambiguous | Record it as `candidate`; do not promote it to frontmatter |
| A memory contains secrets or sensitive third-party data | Refuse to store the raw value; store only a safe abstraction when useful |
| A memory target is missing or not writable | Report a partial failure; do not claim the write succeeded |
| A helper script is missing, fails, or is outside the available runtime | Fall back to the documented manual path and report the fallback |
| A scheduled scan is running concurrently or sees duplicate signals | Re-read target files before writing, dedupe, and still append a formal scan report |
| A six-hour report is requested | Count the full event-timestamp window first; do not substitute file mtime, small tail reads, or a bounded recent set |
| A report thread or delivery channel is unavailable | Keep the formal report file as source of truth and say delivery was unavailable |
| A proposed rule affects deletion, overwrite, permissions, external systems, or global behavior | 🔴 CHECKPOINT / 🛑 STOP: ask for explicit confirmation or run evals before promotion |
| An old skill may contain unique user data or active rules | 🔴 CHECKPOINT / 🛑 STOP: migrate or archive first; do not delete |
| A lesson is vague, one-off, or not future-useful | Keep it in the task summary or discard it; do not promote |

## Do not

- Do not promote a one-off instruction into a long-term rule.
- Do not treat a task summary, reflection, or scan report as proof that the underlying problem is fixed.
- Do not claim background scanning, scheduled reflection, report delivery, or cross-agent syncing is active until the host configuration has been verified.
- Do not store secrets, tokens, cookies, credentials, private keys, or raw transcript dumps.
- Do not automatically edit `AGENTS.md`, global instruction files, skill files, automation files, permissions, repositories, or external systems.
- Do not delete, archive, deprecate, overwrite, publish, push, or sync unless the user explicitly asked for that operation and any required inventory/checkpoint has passed.
- Do not use small sampled transcripts, file mtimes, or duplicate-only follow-up runs as the count for a full scheduled scan.
- Do not write memory or update rules when the user is only discussing, comparing, diagnosing, or asking for a plan.

## When to use

Use this skill when:

- The user says "记住", "以后都", "我的风格是", "不要再", "总结一下可沉淀经验", "复盘", "进化", "沉淀", "避免重复犯错", or equivalent English phrases.
- A task finishes and the user asks for a summary that should inform future behavior.
- The user corrects the agent or points out a repeated mistake.
- A tool, environment, or workflow issue should be recorded for future use.
- A proposed rule could affect future behavior and needs validation, promotion, or pruning.
- The user asks for a cross-agent improvement workflow for Codex, Claude Code, or OpenClaw.
- The user asks whether to replace, consolidate, migrate, or deprecate another memory, reflection, or self-improvement skill.

## Fast path: direct memory

When the user explicitly asks the agent to remember a preference, writing style, identity fact, project background, or stable working convention:

1. Restate the memory briefly if there is ambiguity.
2. Write it directly to the appropriate memory target.
3. Report the destination and a one-line summary.

Do not require repeated observation for explicit user preferences.

Read `references/direct-memory.md` when the user wants to record important preferences or style rules.

## Memory layers

Use layered storage when the user asks for organized memory, memory stats, forgetting, export, or conflict handling:

```text
hot     short active rules and explicit preferences
warm    project, domain, tool, or workflow notes loaded on demand
cold    archived, obsolete, superseded, or audit-only history
```

Keep this as a routing model, not a hard-coded path. Read `references/memory-layers.md` when managing memory growth, conflicts, stats, export, or migration from another memory skill.

## Dashboard path

When the user says the system is opaque, asks to see how evolution is running, or wants a visual status view:

1. Run `node scripts/generate-dashboard.mjs --codex-home <host-home>` from the skill root.
2. Open or report the generated static HTML path.
3. Use the dashboard to explain active rules, candidates, review queues, scan reports, and Project Ledger items.

The dashboard is read-only. It must not mutate memory files, promote candidates, delete reports, or change automation settings.

## Reflection path

When a task ends or the user asks for a summary, produce a normal task closeout plus an evolution section:

```markdown
## Evolution Reference

- Reusable learning:
- User preference:
- Tool or environment gotcha:
- Next time avoid:
- Suggested rule update: yes/no, because:
```

Read `references/reflection.md` for the full extraction format.
Use `references/memory-entry-standard.md` before converting reflection output into candidates or durable memory.

Do not claim background or cron reflection is active unless the host environment has actually configured it. If scheduled reflection is requested, treat it as an optional host automation and read `references/reflection.md` before proposing it.

When this skill is already loaded, run a lightweight reflection check after significant multi-step work, user correction, obvious tool failure, or repeated issue even if the user did not say "remember" or "reflect". Keep it silent if there is no specific future-useful lesson.

## Triage

Classify each signal before writing:

```text
preference       user preference, style, communication pattern
correction       user says the agent was wrong or missed something
tool_gotcha      command, API, path, permission, or environment issue
workflow         better repeated process or operating convention
feature_gap      missing capability or automation idea
experiment       repeated or high-risk issue requiring evals
archive_only     useful history but not a future rule
```

Read `references/triage.md` when classification or priority is unclear.

## Trigger evolution

When the user discusses whether the skill should trigger on certain phrases, or when a trigger phrase causes missed triggers or false triggers, manage trigger phrases as a lifecycle instead of only adding more keywords.

Use these operations:

```text
add -> modify -> merge -> demote -> remove
```

Read `references/trigger-evolution.md` before changing trigger behavior. Use `references/trigger-registry.md` as the current registry of trigger phrase groups, status, evidence, and pruning notes.

Do not add broad or ambiguous trigger phrases directly to this `description`. Promote only high-confidence, high-frequency trigger groups to the frontmatter description. Keep most variants in the registry.

## Storage routing

Default routing:

```text
User preference or writing style -> the host agent's user memory location
Project-specific rule -> the current workspace's agent instruction file, such as AGENTS.md when available
Tool gotcha -> the host agent's tool notes file, such as TOOLS.md when available, or the relevant skill reference
Skill behavior -> the relevant skill file or reference
Repeated failure -> .learnings/ERRORS.md and maybe .learnings/EXPERIMENTS.md
Feature gap -> .learnings/FEATURE_REQUESTS.md
Task-local note -> task summary only
```

Read `references/storage-routing.md` before editing persistent files.
Read `references/write-targets.md` when configuring formal memory files, write permissions, or cross-platform adapter paths.
Read `references/application-routing.md` when deciding how a candidate should be applied, counted, validated, routed, promoted, revised, or archived.

## Validation path

Use an eval loop only for:

- repeated failures,
- high-impact behavior changes,
- rules that affect file edits, external systems, automation, safety, or permissions,
- rules that may conflict with existing instructions.

Read `references/eval-loop.md` before creating or promoting eval-backed rules.
Use the lifecycle and validation thresholds in `references/memory-entry-standard.md` to decide whether an item is only an observation, a candidate, validated, or promotable.
Use `references/application-routing.md` to record real-task application results before promotion when the item is not an explicit low-risk preference.

## Promotion

Promote only stable, specific, future-useful rules. Prefer short rules with clear trigger conditions.

🔴 CHECKPOINT / 🛑 STOP: Before promoting a rule that changes deletion, overwrite, permissions, external systems, automation, confirmation requirements, or global behavior, ask for explicit confirmation or validate it with `references/eval-loop.md`.

Read `references/promotion.md` before editing an agent instruction file, tool notes file, principles file, or another skill.
Read `references/memory-entry-standard.md` before appending to `evolution.md`, `evolution-candidates.md`, or `evolution-promotions.md`.
Read `references/application-routing.md` before promoting candidates that must be routed to a specific skill, tool, project, or host instruction file.

## Pruning

Periodically remove or demote rules that are stale, duplicated, vague, unused, or conflicting.

Read `references/pruning.md` for the cleanup checklist.

## Replacement and migration

When replacing an older self-updating skill:

1. Inventory what it owns: triggers, storage paths, scripts, cron jobs, and promoted rules.
2. Classify each item as keep, migrate, archive, or remove.
3. Move only durable user preferences, active rules, tool gotchas, and validated workflows.
4. Do not copy noisy logs, stale reflections, credentials, or host-specific paths into the public skill.
5. After migration, mark the old skill as deprecated or remove it only with user confirmation.

Read `references/replacement-strategy.md` before consolidating or removing another self-improvement skill.

Use `references/migration-checklist.md` to audit old skills before moving content. Use `references/deprecation-plan.md` when narrowing, archiving, or removing old skills after migration.

🔴 CHECKPOINT / 🛑 STOP: Never archive, remove, or deprecate an installed skill until unique data, active rules, scripts, and scheduled automations have been checked and the user has confirmed the action.

## Safety

- Ask before destructive edits, deletion, or high-impact permanent rule changes.
- Do not write secrets, credentials, or private tokens into memory.
- Do not promote a one-off instruction into a general rule.
- Do not treat logging a learning as fixing a broken deliverable.
- Keep permanent rules short and operational.

Read `references/safety.md` when the requested memory could be sensitive or risky.

## Cross-agent adapters

Use the adapter files only when the user asks how this should work in a specific agent:

- `adapters/codex.md`
- `adapters/claude-code.md`
- `adapters/openclaw.md`
- `references/installation.md` when the user asks how to install this skill.

## Scripts

Optional helper scripts:

```bash
node scripts/log-event.mjs preference "Summary" "Details" "Suggested action"
node scripts/promote-rule.mjs agent-instructions.md "Rule text"
node scripts/prune-rules.mjs path/to/file.md
```

Scripts are helpers, not required for using the skill.

For safety, helper scripts only accept relative paths inside the current workspace. Rule promotion and pruning helpers only accept Markdown files.
