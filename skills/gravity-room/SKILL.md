---
name: gravity-room
description: Turn a thesis into a room and a room into a network. Propose a gathering from a thesis (why these people, why now), suggest candidates from consented context, and capture the synthesis afterward. Never auto-invites, never sends without approval.
loop: room-to-network
command: starlight-gravity room
---

# Skill: gravity-room

## When to use

When a theme keeps recurring across your signals and it's time to convene the
people around it.

## Steps

1. Sharpen the **thesis**: why these people, why now. A room without a thesis is
   a party.
2. Propose the room (`room propose --thesis "..."`), optionally with a theme and
   host.
3. Suggest **candidates** from consented, observable context — never from
   rankings.
4. After hosting, capture the **synthesis** and the **follow-ups** that continue
   the collaboration.

## Local Engine

```bash
starlight-gravity room propose --thesis "A small dinner on local-first memory" --theme local-first
starlight-gravity room             # list your rooms
```

## Markdown Starter

Ask the agent to help you write the thesis and suggest candidates you already
have consented context for, then draft the post-room synthesis.

## Guardrails

- Candidates are **suggestions**; you invite.
- No invitations sent without your approval.
- Rooms are assembled from a thesis, never from a ranking of people.

## Output

A proposed room (thesis, candidates, host) and, later, its synthesis and
follow-ups. Hosted/synthesized rooms raise your Convening force.

---

_Built on SIP — Starlight Intelligence Protocol · v1.1.1 · © 2026 Frank Riemer · MIT_
