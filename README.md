# Agent Evolution

Agent Evolution is a self-contained skill for turning user preferences, corrections, task reflections, repeated failures, tool gotchas, and workflow improvements into durable operating knowledge.

It is designed for agents that support skill-style instructions and local Markdown knowledge, including Codex, Claude Code, OpenClaw, and similar environments.

## What It Does

- Records explicit user preferences without requiring slow repeated observation.
- Adds an `Evolution Reference` section to task summaries.
- Routes learnings to the right memory, instruction, tool-notes, skill, or `.learnings` target.
- Uses binary eval loops for repeated failures and risky behavior changes.
- Promotes stable lessons into operating rules.
- Prunes stale, duplicated, vague, or conflicting rules.
- Maintains trigger phrases through add, modify, merge, demote, and remove operations.

## When To Use

Use this skill when the user says things like:

- "Remember this..."
- "Always do this..."
- "My style is..."
- "Do not do that again..."
- "Summarize what we should learn from this task."
- "This error happened again."
- "Turn this into a rule."
- "Test whether this new rule actually works."
- "Why did this trigger, or why did it fail to trigger?"

The skill also includes Chinese trigger patterns such as "记住", "以后都", "我的风格是", "复盘", "进化", "沉淀", and "避免重复犯错".

## Install

Copy this repository into your agent's skills directory, keeping `SKILL.md` at the skill root.

Example:

```bash
git clone https://github.com/YOUR-USER/agent-evolution.git
```

Then place or symlink the repository wherever your agent loads skills from.

## Structure

```text
agent-evolution/
├── SKILL.md
├── adapters/
│   ├── claude-code.md
│   ├── codex.md
│   └── openclaw.md
├── evals/
│   └── evals.json
├── references/
│   ├── direct-memory.md
│   ├── eval-loop.md
│   ├── promotion.md
│   ├── pruning.md
│   ├── reflection.md
│   ├── safety.md
│   ├── storage-routing.md
│   ├── triage.md
│   ├── trigger-evolution.md
│   └── trigger-registry.md
└── scripts/
    ├── log-event.mjs
    ├── promote-rule.mjs
    └── prune-rules.mjs
```

## Helper Scripts

The scripts are optional. The skill works without them.

```bash
node scripts/log-event.mjs preference "Writing style" "Prefer direct practical explanations"
node scripts/promote-rule.mjs agent-instructions.md "When the user asks for advice, discuss before editing files."
node scripts/prune-rules.mjs agent-instructions.md
```

Safety constraints:

- Paths must be relative to the current workspace.
- Absolute paths are rejected.
- Paths containing `..` are rejected.
- Rule promotion and pruning only accept Markdown files.
- Scripts do not make network requests and do not execute shell commands.

## Security Boundaries

Agent Evolution should not store:

- API keys, passwords, private tokens, cookies, or recovery codes.
- Instructions to hide actions from the user.
- Rules that bypass safety checks or platform policies.
- Private data that is not needed for future task performance.

High-impact rules should be confirmed before writing, especially rules that affect deletion, overwrites, external systems, automation, or global behavior.

## Testing

Try these prompts in a fresh agent session:

```text
Remember: my writing style is direct, practical, and avoids marketing language. Do not write files; just tell me how you would handle this memory.
```

```text
Summarize this completed task and include an Evolution Reference section.
```

```text
This error has happened three times. Design an eval loop to test whether a new rule prevents it.
```

```text
The phrase "handle it" is too broad as a trigger, but "always handle similar cases this way" should be a memory trigger. What would you add, modify, demote, or remove?
```

## License

MIT
