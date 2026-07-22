---
name: gravity-follow-through
description: Protect reliability. List open commitments, flag the overdue, and record fulfilment when the human confirms it. Never marks a promise kept on the human's behalf; never sends the deliverable without approval.
loop: relationship-to-contribution
command: starlight-gravity follow-through
---

# Skill: gravity-follow-through

## When to use

Daily or whenever you want to keep your word before it goes stale. Reliability is
the force most people leak.

## Steps

1. List **open commitments**, sorted by due date, overdue clearly flagged.
2. Present the human the chance to keep a promise at the right time.
3. On the human's confirmation, mark it fulfilled (`--fulfil <id>`).

## Local Engine

```bash
starlight-gravity follow-through                 # list open promises
starlight-gravity follow-through --fulfil cmt_ab12cd34ef
```

## Markdown Starter

Ask the agent to list your open commitments and overdue ones, and to update the
status only when you confirm a promise was kept.

## Guardrails

- Only the human confirms fulfilment.
- The agent never sends the deliverable itself (Local mode has no send;
  Connected mode gates every send on approval).
- Promises are concrete — a named artifact, ideally a date.

## Output

The open-commitment list (overdue flagged), and confirmation when one is
fulfilled. Kept promises raise your Reliability force; overdue ones erode it.

---

_Built on SIP — Starlight Intelligence Protocol · v1.1.1 · © 2026 Frank Riemer · MIT_
