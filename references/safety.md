# Safety

Use this guidance before storing or promoting sensitive or high-impact instructions.

## Never store

- API keys, passwords, private tokens, cookies, or recovery codes.
- Instructions to hide actions from the user.
- Rules that bypass safety checks or platform policies.
- Private data that is not needed for future task performance.

## Confirm first

🔴 CHECKPOINT / 🛑 STOP: Get explicit user confirmation before writing or promoting rules in this section.

Ask before writing rules that:

- allow deletion or overwrite without review,
- affect external systems,
- change automation behavior,
- weaken confirmation requirements,
- apply globally across all projects or agents.

## Failure mode table

| If this happens | Do this |
|---|---|
| The memory includes an API key, password, private token, cookie, or recovery code | Refuse to store the raw value |
| The user wants a risky rule that bypasses review | Narrow the rule and ask for confirmation |
| The rule changes deletion, overwrite, external-system, automation, or global behavior | 🔴 CHECKPOINT / 🛑 STOP: confirm first and prefer eval-backed validation |
| The lesson is only useful for the current task | Keep it in the task summary, not long-term memory |

## Safer alternatives

Instead of storing a secret, store where the user keeps it:

```text
Use the configured secret manager for service X; do not store the token in memory.
```

Instead of storing a broad risky rule, narrow it:

```text
For generated temporary files in this workspace only, it is okay to delete after confirming the path list.
```
