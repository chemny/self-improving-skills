# Dashboard

Use the dashboard when the user wants to see how Self-Improving Skills is running instead of reading raw memory files.

The dashboard is read-only. It parses memory/report files and generates a static HTML file.

## Generate

```bash
node scripts/generate-dashboard.mjs --codex-home ~/.codex
```

Default output:

```text
~/.codex/memories/self-improving-skills-dashboard.html
```

Optional output path:

```bash
node scripts/generate-dashboard.mjs --codex-home ~/.codex --out /tmp/self-improving-skills-dashboard.html
```

## What It Shows

- Active durable rules from `evolution.md`.
- Candidate review queue from `evolution-candidates.md`.
- Promotion receipts from `evolution-promotions.md`.
- Recent scan reports and report kinds from `evolution-scan-reports.md`.
- Recent Project Ledger items.
- Candidate queue buckets:
  - `ready_to_promote`
  - `needs_one_more_use`
  - `route_to_skill`
  - `requires_confirmation`
  - `pending_review`
  - `archive`

## Safety

- Do not include raw transcripts or secrets in the dashboard.
- Do not make the dashboard mutate memory files.
- Treat the dashboard as an audit and review surface only.
