# Claude Code Adapter

Use the same evolution protocol in Claude Code, but route persistent operating rules to the files Claude Code actually reads in that project.

## Mapping

```text
User preferences
-> user memory or project docs

Project operating rules
-> CLAUDE.md or the project instruction file used by the host environment

Tool gotchas
-> tool notes, CLAUDE.md, or a local tool notes file if used

Skill behavior
-> the relevant skill directory
```

## Notes

- Keep the skill self-contained.
- Do not assume Codex-specific directives are available.
- Prefer markdown memory and short operational rules.
