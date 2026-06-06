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
| The user is discussing a plan, diagnosis, comparison, or "how should we do this?" | Do not write memory, modify rules, or run consequential changes unless the user explicitly asks to execute |
| The memory path is missing or not writable | Record a partial failure in the response or scan report; do not claim the memory write succeeded |
| The helper script is unavailable or fails | Use the documented manual fallback and report that fallback clearly |
| A scheduled scan runs concurrently with another scan | Re-read destination files before writing, dedupe equivalent entries, and still append a formal scan report |
| A scheduled scan needs six-hour counts | Count JSONL event timestamps inside the window before triage; do not use file mtime or a small bounded tail as the full count |
| The report thread or delivery channel is unavailable | Do not post to the active user chat as a workaround; write the formal report file and state delivery was unavailable |
| A signal contains a secret plus a useful workflow lesson | Redact the secret and store only the safe workflow lesson or safety observation |

## Do not list

- Do not promote one-off requests into durable behavior rules.
- Do not treat logging a learning as fixing the underlying deliverable.
- Do not claim background automation is active unless the host automation has been inspected and verified.
- Do not store secrets, raw transcript dumps, or unnecessary private data.
- Do not directly edit global instruction files, skill files, automation files, external systems, repository remotes, or permissions from a scan.
- Do not delete, overwrite, publish, push, sync, archive, or deprecate without explicit user authorization and the required inventory/checkpoint.
- Do not collapse `effective information identified`, `candidate signals`, and `new writable items` into one count.
- Do not use self-referential automation runs as ordinary learning evidence unless debugging the automation itself.

## Safer alternatives

Instead of storing a secret, store where the user keeps it:

```text
Use the configured secret manager for service X; do not store the token in memory.
```

Instead of storing a broad risky rule, narrow it:

```text
For generated temporary files in this workspace only, it is okay to delete after confirming the path list.
```
