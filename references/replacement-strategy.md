# Replacement Strategy

Use this reference when Agent Evolution is intended to replace another self-improvement, memory, reflection, or learning skill.

## Goal

Make Agent Evolution the single controller for:

- direct user memory,
- correction learning,
- task reflection,
- repeated-failure experiments,
- rule promotion,
- trigger evolution,
- pruning and forgetting.

Other skills may remain installed temporarily, but they should not be the primary workflow once their useful rules have been migrated.

## Candidate skills to replace

```text
self-improving
  Keep: layered memory, correction learning, memory stats, conflict handling.
  Avoid: fixed ~/self-improving path as a public assumption.

openclaw-self-improvement
  Keep: .learnings categories, feature-gap capture, eval loop discipline.
  Avoid: OpenClaw-only assumptions, AGENTS.md / TOOLS.md / SOUL.md as universal targets.

self-reflection
  Keep: bounded session review, quality bar for insights, anti-patterns.
  Avoid: claiming cron/session scanning exists when host automation is not configured.

Memory
  Keep: large organized storage and indexes as an optional backend.
  Avoid: making parallel memory the default for every small preference.

ontology
  Keep: structured graph storage for entities and cross-skill state when needed.
  Avoid: using graph storage for simple style preferences or short operating rules.
```

## Migration workflow

```text
Inventory -> Classify -> Normalize -> Route -> Verify -> Deprecate
```

For a step-by-step audit checklist, use `migration-checklist.md`. For narrowing, archiving, or removing old skills after migration, use `deprecation-plan.md`.

1. Inventory
   - Locate the old skill's triggers, active memory files, scripts, cron jobs, and promoted rules.
   - Check whether it writes to host-specific files.

2. Classify
   - keep: still useful and specific.
   - migrate: useful, but should live under Agent Evolution routing.
   - archive: historically useful but not active.
   - remove: stale, duplicate, unsafe, or wrong.

3. Normalize
   - Rewrite noisy logs into short rules.
   - Merge duplicate preferences.
   - Preserve the user's wording for explicit preferences when possible.

4. Route
   - User preference -> host user memory.
   - Project rule -> project instruction file.
   - Tool gotcha -> tool notes or skill reference.
   - Repeated failure -> experiment or errors log.
   - Skill behavior -> the relevant skill file or reference.

5. Verify
   - Run a small check for duplicated triggers, broad frontmatter, stale paths, and unsafe storage.
   - For high-impact rules, use `references/eval-loop.md`.

6. Deprecate
   - Do not delete an installed skill without user confirmation.
   - Prefer first marking it as deprecated, narrowing its description, or moving it out of the active skills directory.
   - Use `deprecation-plan.md` for the staged process.

## Deprecation note template

```markdown
Deprecated: use `agent-evolution` as the primary workflow for memory, reflection, correction learning, eval-backed promotion, and pruning. This skill is retained only as a historical reference or migration source.
```

## Safety rules

- Never migrate secrets, credentials, private tokens, or raw transcript dumps.
- Never turn a one-off correction into a global rule without evidence or user confirmation.
- Never preserve host-specific paths as public defaults.
- Never claim background automation is active unless it has been configured and verified.
