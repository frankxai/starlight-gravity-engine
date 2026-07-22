# Example — the creator

A worked field for a creator who turns encounters and DMs into artifacts on a
reliable cadence, without the CRM sludge. Every name here is invented; no real
person, no real data.

Meet **Mara**, who writes about local-first software. She wants her DMs and
hallway conversations to become essays — and she wants to stop forgetting the
person who sparked each one.

## 1. Direction

After `init`, Mara fills in `DIRECTION.md`:

```markdown
## Statement

Turn what I notice about local-first tools into essays people build on.

## Horizon

the next 12 months

## Themes

- local-first software
- creator sovereignty
- durable memory

## Values

- generosity
- reliability
```

Editing the file is enough — the engine re-reads it before every command. A full
Direction (statement + themes + values) puts the **Direction** force at 1.00.

## 2. Capture an encounter

A reader, **Kenji**, sends a long DM. Mara drops it into a field note and
captures it:

```bash
node packages/cli/src/bin.ts capture --file notes/kenji-dm.md --save
```

```
★ Capture

  Strongest signal: "People won't build their life on rented memory" (strong)
  Artifact opportunity: essay — "Your memory is your leverage"
  Follow-through: send Kenji the local-first reading list
  Appreciation: thank Kenji
  Room theme: a small call on what 'durable memory' means for creators

  Saved 2 signal(s) as private_context (proposed). Nothing is published.
  Every suggestion above is yours to approve or decline. The engine never acts alone.
```

Note what did **not** happen: no reply was drafted or sent, Kenji got no score or
tier, and nothing left her machine. The signals are `private_context` and
`proposed`. She keeps the artifact opportunity, discards the room theme for now.

## 3. From opportunity to artifact — through the gate

Mara writes the essay. When she tries to publish a fresh draft, the gate refuses
it, by design:

```bash
node packages/cli/src/bin.ts publish --title "Your memory is your leverage"
```

```
★ Publish refused
  - data class 'private_context' is not publishable
  - approval is 'proposed', not 'approved'
  - publishable flag is false

  Publication is a human act. Set the data class to a publishable class,
  approve the artifact, and mark it publishable — then re-run.
```

Publication is a separate, deliberate act. Mara promotes the finished artifact in
her field to `publishable_with_attribution`, and — the one gate no agent can fill
— approves it and marks it publishable. Now:

```bash
node packages/cli/src/bin.ts publish --artifact art_9f2c1ab77e
```

```
★ Publishable
  title          Your memory is your leverage
  Attribution required — block below is mandatory.

---
Built on SIP — Starlight Intelligence Protocol
- Substrate: starlightintelligence.org/protocol v1.1.1
- Verticals: [gravity-engine]
- Canon: [none]
- Nodes: [@unpinned]
Generated: 2026-07-22
---
```

She pastes the attestation block at the foot of the published essay. Its
provenance now answers, months later, where this came from and who agreed to it.

## 4. Review

A week and three published pieces later:

```bash
node packages/cli/src/bin.ts review
```

```
★ Weekly review
  gravity        0/100 (+0 since last)
  direction      1.00
  signal         0.68
  contribution   0.20
  convening      0.00
  reliability    1.00

  weakest        convening
  → Host or synthesize one small room.
```

The score is honest to the design: gravity is a **product**, so a single zero
force holds the whole thing at zero. Mara is shipping (Contribution and
Reliability are real now), but she has never convened anyone — so the engine
won't let her pretend otherwise. The one move that compounds the rest is to host
a small room. That hands off directly to the [community example](../community/).

---

_Built on SIP — Starlight Intelligence Protocol · v1.1.1 · © 2026 Frank Riemer · MIT_
