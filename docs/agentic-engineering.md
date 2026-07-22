# Agentic engineering

> Agentic engineering makes it compound.

Humans create the forces. Agents keep the loop turning — reliably, cheaply, and
more often than a human could sustain alone. This is the half of the system that
runs on machines, and it has a hard boundary.

## What agents increase

| Contribution        | What it looks like in the engine                                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Memory**          | Never forgetting a name, a promise, or the context of an encounter eighteen months ago. `person-context`, `commitment`, `signal`. |
| **Consistency**     | Running capture after every encounter and review every week, without willpower.                                                   |
| **Preparation**     | Surfacing what you know (consented) about who's in the room, before you walk in.                                                  |
| **Transformation**  | Turning a five-line note into a draft artifact; a room's mess into a synthesis. `capture`, `publish`.                             |
| **Cycle frequency** | Shortening encounter→artifact→response from months to days, so more turns compound in the same year.                              |

Every one of these lowers the friction on a force you already have. None of them
invent the force.

## What agents must never manufacture

| Never                   | Why                                                              |
| ----------------------- | ---------------------------------------------------------------- |
| **Judgment**            | Who to trust, what matters, what a thing means — yours alone.    |
| **Presence**            | Being genuinely there is not delegable.                          |
| **Generosity**          | Automated "generosity" is marketing; people feel the difference. |
| **Trust**               | Earned between humans, never issued by a bot.                    |
| **Relationship intent** | The wish to know someone is a human act.                         |
| **Human identity**      | The agent is never you. It drafts; you decide and sign.          |

## How the boundary is enforced

This is not a promise — it is a property of the build:

- **Speculation is refused at capture.** `guardrails.ts::detectSpeculation()`
  flags inferences about attraction, diagnosis, hidden intent, or ranking, and
  capture stores nothing for a flagged line.
- **Rankings are structurally impossible.** The `person-context` schema sets
  `additionalProperties: false`, so a `score` or `tier` field cannot be added.
- **Publication is a separate human act.** `attest.ts::assertPublishable()`
  refuses anything that is not a publishable class, approved, and flagged
  publishable.
- **The engine has no autonomous send.** In Local mode it cannot message anyone;
  in Connected mode every send is gated behind explicit human approval.
- **Everything starts as `proposed`.** The five capture outputs are suggestions.
  The human approves or declines each.

## Designing new agentic capability

When you add an agent or a skill, ask the boundary questions:

1. Does it increase memory, consistency, preparation, transformation, or cycle
   frequency? (Good.)
2. Does it try to manufacture judgment, presence, generosity, trust,
   relationship intent, or identity? (Out of canon — redesign.)
3. Does it act without a human approval step on anything that leaves the field?
   (Out of canon.)

The five role definitions in [`agents/`](../agents/) each live inside these
lines. Read them as worked examples of agentic engineering that compounds gravity
without ever crossing into faking it.
