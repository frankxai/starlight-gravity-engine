---
name: gravity-capture
description: Turn a field note from a real encounter into observable signals and five suggestions — strongest signal, artifact opportunity, follow-through, appreciation/introduction, room theme. Use right after a meeting, dinner, call, or DM exchange. Never speculates, never ranks, never publishes.
loop: signal-to-artifact
command: starlight-gravity capture
---

# Skill: gravity-capture

## When to use

Immediately after any meaningful encounter, while it's specific. This is the
front door of the whole engine.

## Steps

1. Read the field note (from `--note`, `--file`, or stdin).
2. Load the human's Direction (themes and values) to score against.
3. Extract **observable** signals — one line each. Hold back any line that
   speculates about someone's interior (attraction, diagnosis, hidden intent,
   worth). Store nothing for held-back lines.
4. Produce five suggestions, each `proposed`:
   - **Strongest signal** (scored against Direction)
   - **Artifact opportunity** (the seed of something shareable)
   - **Follow-through** (the promise made, named concretely)
   - **Appreciation or introduction** (with consent required for intros)
   - **Room theme**
5. Save signals as `private_context` only if asked (`--save`). Publish nothing.

## Local Engine

```bash
starlight-gravity capture --file note.md --save
starlight-gravity capture --note "Met Ada at the dinner. I'll send the deck Friday."
```

## Markdown Starter (any AI agent)

Paste your field note and instruct the agent to return exactly the five outputs
above, observable only, each marked as a suggestion to approve or decline.

## Guardrails

- Observable, not speculative. If unsure, leave it out.
- No rankings. No dossiers. People are references.
- Nothing is published or sent. Everything is `proposed`.

## Output

The five suggestions + any guardrail holds, for the human to approve or decline.

---

_Built on SIP — Starlight Intelligence Protocol · v1.1.1 · © 2026 Frank Riemer · MIT_
