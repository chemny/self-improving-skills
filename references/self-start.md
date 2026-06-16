# Self-Start Model

Use this reference when improving how Self-Improving Skills starts, when it should act without an explicit memory keyword, or when the user asks for background improvement.

Self-Improving Skills has three startup levels:

```text
Level 1: metadata-trigger
Level 2: opportunistic-self-start
Level 3: scheduled-reflection-adapter
```

## Level 1: metadata-trigger

The host agent scans `SKILL.md` metadata and loads this skill when the user's request matches the `description` or when the user names the skill.

This is the normal skill mechanism.

Good triggers:

- explicit memory: "记住", "以后都", "remember this", "always"
- correction: "不对", "你错了", "不要再", "stop doing"
- reflection: "复盘", "总结可沉淀经验", "what should we learn"
- repeated issue: "又犯了", "重复犯错", "this happened again"
- rule governance: "更新规则", "删除规则", "这个触发词不对"
- migration: "替换旧 skill", "合并 self-improving", "deprecate old memory skill"

Keep high-confidence trigger groups in the frontmatter description. Keep rare or personal variants in `trigger-registry.md`.

## Level 2: opportunistic-self-start

Once Self-Improving Skills is already loaded, it should run a lightweight evolution check at natural checkpoints even if the user did not use a trigger keyword.

Run the check after:

- significant multi-step work,
- a user correction or negative feedback,
- a clear tool, command, path, permission, or environment failure,
- the same issue appears again,
- the agent notices its own output required a meaningful redo,
- the user gives strong positive feedback about a repeatable approach.

Use this short internal check:

```text
Did anything happen that is specific, future-useful, non-obvious, and safe to remember?
```

If no, do nothing. Do not add an evolution section just to show activity.

If yes, choose the smallest action:

```text
task summary only
direct memory
tool gotcha
workflow note
experiment candidate
rule promotion proposal
trigger registry update
```

## Output behavior

Avoid noisy self-start output. Prefer one of these:

```markdown
Evolution Reference:
- Next time avoid:
- Reusable learning:
```

or:

```markdown
Evolution note: no durable lesson found.
```

Only show "no durable lesson found" when the user explicitly asked for reflection. Otherwise stay silent.

## Level 3: scheduled-reflection-adapter

This level is not automatic by installing the skill. It requires host automation such as cron, heartbeat, scheduled job, or an agent platform feature.

🔴 CHECKPOINT / 🛑 STOP: Before enabling scheduled reflection, confirm the host, schedule, readable session scope, write targets, and review policy with the user.

If configured, the scheduled job should:

1. Read only recent bounded session material.
2. Skip subagent, reflection, and heartbeat-only sessions unless they contain errors.
3. Extract only specific, actionable, non-duplicate lessons.
4. Route insights through `triage.md` and `storage-routing.md`.
5. Use `eval-loop.md` before promoting high-impact rules.
6. Ask for review before changing deletion, overwrite, external-system, permission, or global behavior rules.

Never claim scheduled reflection is active unless it has been configured and verified.

## Bounded session review rules

When a host supports session logs:

- read recent sessions only,
- limit transcript reads,
- never load huge full transcripts by default,
- skip private or unrelated content,
- do not summarize every session,
- do not write raw transcripts into memory,
- do not reflect on reflection runs unless debugging them.

## Startup safety

- Self-start should improve recall, not create surprise writes.
- Explicit user instructions beat inferred patterns.
- Do not infer personal preferences from silence.
- Do not store secrets or sensitive third-party facts.
- Do not promote high-impact rules without confirmation or eval evidence.
- Prefer candidate notes over strong rules when confidence is low.

## Failure mode table

| If this happens | Do this |
|---|---|
| The skill is not loaded | Do not assume opportunistic self-start can run |
| No durable lesson is found | Stay silent unless the user explicitly asked for reflection |
| A scheduled job is not configured | Do not claim background reflection is active |
| Session logs are huge or sensitive | Read only bounded recent material, or skip |
| A self-start insight would change high-impact behavior | 🔴 CHECKPOINT / 🛑 STOP: ask for confirmation or create an eval candidate |
