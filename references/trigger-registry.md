# Trigger Registry

This registry tracks trigger phrase groups for `agent-evolution`. Keep most trigger variants here. Promote only stable, high-value groups to `SKILL.md` frontmatter description.

## Status values

```text
candidate | active | promoted | deprecated | removed
```

## Intent values

```text
direct_memory
reflection
correction
eval_loop
promotion
pruning
cross_agent_workflow
```

## Registry

| Phrase group | Example phrases | Intent | Status | Evidence | Last reviewed | Notes |
|---|---|---:|---:|---|---:|---|
| explicit_remember | 记住; remember this; 写入长期记忆 | direct_memory | promoted | Core explicit user memory command | 2026-05-29 | In frontmatter description |
| future_default | 以后都; 以后类似情况; 后面按这个来; 类似场景照这个处理 | direct_memory | promoted | Common future-behavior pattern | 2026-05-29 | Keep specific; avoid promoting very broad "处理一下" |
| personal_style | 我的风格是; 我的写作风格是; 按我的口径 | direct_memory | promoted | User explicitly asked about writing-style memory | 2026-05-29 | Route to writing/user memory |
| negative_preference | 不要再; 下次别; 别再这样 | correction | promoted | Common correction and guardrail signal | 2026-05-29 | Distinguish one-off frustration from durable rule |
| reflection_summary | 总结可沉淀经验; 复盘; 总结一下经验; 下次怎么避免 | reflection | promoted | User often asks for summaries after tasks | 2026-05-29 | Add Evolution Reference section |
| evolution_language | 进化; 沉淀; 形成机制; 变成规则 | promotion | promoted | Core topic for this skill | 2026-05-29 | May route to promotion or eval depending on risk |
| repeated_failure | 重复犯错; 已经出现三次; 老问题; 又犯了 | eval_loop | promoted | Repeated failures should trigger eval loop | 2026-05-29 | Use binary evals before promotion |
| trigger_governance | 触发词; 关键词; 为什么没触发; 误触发; 触发机制 | pruning | active | Added after user asked for add/modify/delete lifecycle | 2026-05-29 | Read trigger-evolution.md |
| vague_handle_it | 处理一下; 看着办; 你心里有数 | direct_memory | candidate | Ambiguous; may be execution or preference depending on context | 2026-05-29 | Do not promote without confirmation |

## Removed or deprecated

| Phrase | Previous intent | Status | Reason | Date |
|---|---:|---:|---|---:|
| 学一下 | direct_memory | deprecated | Too broad; can mean user learning, model learning, or task understanding | 2026-05-29 |

## Review notes

- Keep frontmatter description short and high-signal.
- Add variants here first; promote later only when stable.
- If a trigger conflicts with another skill, narrow it or demote it.
- If the user says a phrase should not trigger evolution behavior, mark it `removed`.
