# Self-Improving Skills Promotion Log

This file records low-risk Self-Improving Skills memories that were automatically promoted.

Rules:
- Every automatic promotion to `evolution.md` should have a receipt here.
- Receipts should explain why the promotion was low risk and how to roll it back.
- Do not store raw transcript dumps, secrets, credentials, tokens, cookies, or private keys.

Receipt format:

```markdown
## YYYY-MM-DD HH:mm Promotion

Promoted item:
- <title>

From:
- observation | candidate | explicit_user_confirmation | eval_loop

Promoted to:
- <path or destination>

Why eligible:
- <specific threshold passed>

Validation:
- Required: <threshold>
- Final state: <confirmed_by_user | applied_twice | eval_passed>

Rollback:
- <how to remove, demote, or edit the promoted rule>
```
