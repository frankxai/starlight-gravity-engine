---
name: gravity-review
description: Run the weekly Learning → Evolution loop. Compute the gravity delta since the last review, name the weakest force, and recommend the single move to strengthen the field this week. Writes a review record so deltas accumulate over time.
loop: learning-to-evolution
command: starlight-gravity review
---

# Skill: gravity-review

## When to use

Weekly. This is the meta-loop that makes the other three compound instead of
drift.

## Steps

1. Snapshot the field and compute the current gravity score and forces.
2. Compare to the last review to get a **delta**.
3. Name the **weakest force** and give one concrete action to raise it.
4. Append a review record (`reviews.json`) so deltas accumulate.

## Local Engine

```bash
starlight-gravity review
starlight-gravity review --json
```

## Markdown Starter

Ask the agent to compare this week's field to last week's, report the delta and
the weakest force, and recommend one action.

## Guardrails

- Honest measurement only — the number is useless if a force is inflated without
  the underlying reality.
- Read-mostly: it writes only the review record, nothing else.

## Output

Gravity score with delta since last review, the five forces, the weakest force,
and one recommended action for the week.

---

_Built on SIP — Starlight Intelligence Protocol · v1.1.1 · © 2026 Frank Riemer · MIT_
