# Installation

Use this reference when explaining how to install Agent Evolution.

## Core idea

Agent Evolution is a single-skill repository. Install it by making the repository directory available in the skills directory that your agent scans.

The required invariant is:

```text
agent-evolution/
└── SKILL.md
```

`SKILL.md` must be at the skill root.

## Generic install

```bash
git clone https://github.com/chemny/agent-evolution.git
```

Then copy or symlink the `agent-evolution` directory into your agent's skills directory.

## Codex-style install

If your Codex setup reads local skills from a user skills directory, place the repository directory there so the final shape is:

```text
skills/
└── agent-evolution/
    ├── SKILL.md
    ├── references/
    ├── adapters/
    ├── scripts/
    └── evals/
```

Start a new Codex session after installation so the skill index can rescan `SKILL.md` frontmatter.

## Claude Code-style install

Place or symlink the repository into the skills location used by your Claude Code setup. If your setup uses a different instruction mechanism, keep this repository as a local reference and point the agent to `SKILL.md`.

## OpenClaw-style install

Place the repository where OpenClaw loads skills or operational references. Use `adapters/openclaw.md` for session-reflection and `.learnings` routing.

## Verify

In a fresh agent session, try:

```text
Use agent-evolution: remember that my writing style is direct and example-driven. Do not write files; just explain how you would handle this memory.
```

Expected behavior:

```text
Path: direct memory
Validation: not required
Destination: host agent user memory
```

## Update

If installed with Git:

```bash
git pull
```

Then start a fresh agent session if your agent only scans skills at session startup.
