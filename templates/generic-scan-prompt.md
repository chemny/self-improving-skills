# Agent Evolution Graded Scan Prompt

Run a graded Agent Evolution scan for the current user.

Scope:
- Read recent agent session logs only from the host's normal session log location.
- Prefer sessions updated since the previous 6-hour window; if that is hard to determine, inspect only a small bounded recent set.
- Do not read browser history, emails, private app data, unrelated project files, or full large transcripts.
- For any transcript, read bounded tail sections only; do not load huge full session files.

Look for learnings only when they are specific, future-useful, and observable:
- explicit user preferences;
- user corrections or negative feedback;
- repeated mistakes;
- tool, path, permission, or environment gotchas;
- outdated rules or conflicting instructions;
- workflows that clearly worked well and are likely reusable;
- trigger wording that caused missed triggers or false triggers.

Classify each learning:
- Type: preference | correction | repeated_failure | tool_gotcha | workflow | trigger_governance | archive_only
- Confidence: low | medium | high
- Risk: low | medium | high

Risk policy:

LOW RISK: auto-promote when the learning is clearly supported by explicit user feedback or repeated evidence and does not affect destructive actions, external systems, automation settings, global instruction files, skill files, permissions, or secrets.

MEDIUM RISK: write to candidates only when the learning may affect a default workflow, routing between skills, trigger phrasing, or behavior across several task types, or when evidence is plausible but not explicit.

HIGH RISK: write to candidates only and mark `Status: requires_confirmation` when the learning affects deletion, overwrite, external systems, GitHub, Feishu/Lark, publishing, sync, credentials, permissions, automation behavior, global instructions, skill files, or broad cross-agent behavior.

Write targets:
- Low-risk auto-promotions: append to the host's Agent Evolution `evolution.md` and write a receipt to `evolution-promotions.md`.
- Medium/high-risk candidates: append to `evolution-candidates.md`.
- If there are no useful candidates and no safe promotions, append nothing.

Safety:
- Never store secrets, tokens, cookies, private keys, personal credentials, or raw transcript dumps.
- Never edit global instruction files, skill files, automation files, or external systems from this scan.
- Never delete, overwrite, sync, publish, push, or change permissions.
- Never auto-promote broad global behavior changes.

