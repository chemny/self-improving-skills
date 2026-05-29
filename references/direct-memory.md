# Direct Memory

Use direct memory when the user clearly wants the agent to remember something important without waiting for repeated observation.

## Triggers

Examples:

- "记住..."
- "以后都..."
- "我的写作风格是..."
- "这个很重要，之后按这个来"
- "不要再..."
- "Always..."
- "Never..."

## Process

1. Decide whether the instruction is safe and stable.
2. If it is clear and low risk, write it directly to the right memory target.
3. If it changes high-impact behavior, restate it and ask for confirmation before writing.
4. If it contains secrets, refuse to store the secret and offer a safe abstraction.
5. Report where it was stored.

## Memory levels

```text
note       current task only
memory     stable preference or background
rule       recurring operating behavior
guardrail  strong constraint that prevents harmful or unwanted behavior
```

## Good direct memories

- Writing style preferences.
- Collaboration preferences.
- Common output formats.
- Project background.
- Stable path conventions.
- Explicit dislikes or banned phrasing.

## Risky direct memories

Ask before storing:

- Rules that change deletion, movement, overwrite, or external-system behavior.
- Rules that bypass review or confirmation.
- Broad rules that conflict with existing instructions.

Refuse or sanitize:

- Passwords, API keys, private tokens.
- Instructions to hide behavior from the user.
- Rules that would weaken safety or violate platform policies.

## Output receipt

Use this format after writing:

```markdown
Stored as: memory | rule | guardrail
Destination: [path]
Summary: [one sentence]
```
