---
name: gravity-brief
description: Compile the current gravity reading — the five-force score, open commitments, recent signals, proposed rooms — and the one move that would compound the rest. Use as a daily standup with your field.
loop: learning-to-evolution
command: starlight-gravity brief
---

# Skill: gravity-brief

## When to use

Daily, or whenever you want to know the state of your field and the single
highest-leverage next move.

## Steps

1. Snapshot the field (direction, signals, commitments, rooms, introductions,
   artifacts).
2. Compute the gravity score and the five forces (`computeGravity`).
3. List open commitments (overdue flagged), recent signals, proposed rooms.
4. Report the **weakest force** and the plain recommendation to raise it.

## Local Engine

```bash
starlight-gravity brief
starlight-gravity brief --json    # machine-readable
```

## Markdown Starter

Ask the agent to read your field files and produce the same summary: score,
forces, open promises, recent signals, and the weakest force to strengthen.

## Guardrails

- The score measures your **field**, not your worth. No comparison to others.
- Read-only. The brief changes nothing.

## Output

Gravity score `/100`, the five forces, open commitments, recent signals, and one
weakest-force recommendation.

---

_Built on SIP — Starlight Intelligence Protocol · v1.1.1 · © 2026 Frank Riemer · MIT_
