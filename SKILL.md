---
name: agent-evolution
description: 自包含的 Agent 进化系统。必须在用户说“记住”“以后都”“我的风格是”“不要再”“总结可沉淀经验”“复盘”“进化”“沉淀”“避免重复犯错”“写入长期记忆”“更新规则”“测试新规则是否有效”时使用，即使用户没有点名 agent-evolution。Use this self-contained skill for recording user preferences, corrections, task reflections, repeated failures, tool gotchas, eval loops, rule promotion, and pruning across Codex, Claude Code, and OpenClaw.
version: 0.1.0
---

# Agent Evolution

Use this skill to turn explicit user instructions, task summaries, corrections, repeated failures, and workflow insights into durable operating knowledge.

This skill is self-contained. It replaces the main workflows of `self-improving`, `openclaw-self-improvement`, and `self-reflection` for preference memory, correction learning, task reflection, eval-backed rule promotion, and pruning. Those skills can be treated as historical references or migration sources only.

## Core loop

Follow this loop:

```text
Signal -> Triage -> Route -> Store -> Validate -> Promote -> Apply -> Prune
```

Use the smallest useful part of the loop. Do not force every memory through a slow eval process.

When another self-improvement skill could also apply, prefer this skill as the single controller. Do not ask the other skill to own the workflow unless the user explicitly asks to inspect or migrate it.

## Self-start model

Use three startup levels:

```text
metadata-trigger             the host loads this skill when SKILL.md description matches the user request
opportunistic-self-start     once loaded, run lightweight evolution checks after significant work, corrections, tool failures, or repeated issues
scheduled-reflection-adapter optional host automation; only active when explicitly configured outside this skill
```

Read `references/self-start.md` before changing startup behavior or proposing background reflection.

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

## Validation path

Use an eval loop only for:

- repeated failures,
- high-impact behavior changes,
- rules that affect file edits, external systems, automation, safety, or permissions,
- rules that may conflict with existing instructions.

Read `references/eval-loop.md` before creating or promoting eval-backed rules.

## Promotion

Promote only stable, specific, future-useful rules. Prefer short rules with clear trigger conditions.

Read `references/promotion.md` before editing an agent instruction file, tool notes file, principles file, or another skill.

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
