# Example — the community builder

A worked field for a community builder who turns a thesis into a room, and a room
into a network that keeps producing after everyone goes home. Every name here is
invented; no real person, no real data.

Meet **Grace**, who runs the **Riverside cohort** — a loose group of local-first
builders. She keeps noticing the same theme across her captures and decides it's
time to convene.

## 1. A thesis, not a guest list

A room begins with _why these people, why now_. Grace proposes one:

```bash
node packages/cli/src/bin.ts room propose \
  --thesis "Why local-first memory changes what a creator cohort can be" \
  --theme durable-memory
```

```
★ Room proposed
  id             room_4b7d9e21ac
  thesis         Why local-first memory changes what a creator cohort can be
```

```bash
node packages/cli/src/bin.ts room
```

```
★ Rooms
  - [proposed] Why local-first memory changes what a creator cohort can be (room_4b7d9e21ac)
```

The engine suggested candidates from consented, observable context — **Ada** and
**Kenji** among them — but invited no one. Grace sends the invitations herself.
Convening is still 0.00: proposing a room is not the same as convening one.

## 2. Host, then synthesize

Grace hosts the dinner. Afterward — and this is the move most gatherings skip —
she records the **synthesis**: what the room actually produced. Hosting and
synthesizing are human acts; recording the synthesis into her field flips the
room to `synthesized`, and _that_ is what raises Convening. A hosted room that is
never synthesized evaporates when everyone logs off.

Two things came out of the evening, which she notes into her field:

- an **introduction**: Ada ↔ Kenji, who are solving durable memory from opposite
  ends. It reaches `made` only after both consent — Grace gathers consent from
  each first; the state machine forbids the shortcut.
- a **commitment**: compile the shared reading list from the dinner notes.

## 3. Close the loop — follow-through

The reading list is a named artifact with a date, so it lands on the
follow-through board:

```bash
node packages/cli/src/bin.ts follow-through
```

```
★ Follow-through
  - cmt_7a1e93cd20 · the shared reading list — compile from the dinner notes [due 2026-07-29]
  Fulfil one: follow-through --fulfil <id>
```

Grace ships it and records that the promise was kept — only she can:

```bash
node packages/cli/src/bin.ts follow-through --fulfil cmt_7a1e93cd20
```

```
★ Commitment fulfilled
  artifact       the shared reading list
  Reliability rises. Well done.
```

## 4. Convening rises

Before the room was synthesized, Grace's gravity read 0/100 — Convening was a
zero, and the product of five forces collapses on any zero. Now:

```bash
node packages/cli/src/bin.ts brief
```

```
★ Daily brief
  gravity        17/100
  direction      1.00
  signal         0.85
  contribution   0.40
  convening      0.50
  reliability    1.00

  Open commitments:
  - none — clean slate

  Recent signals:
  - (strong) local-first memory changes what a cohort can hold between meetings

  → Weakest force: contribution (0.40). Strengthen it to compound the rest.
```

One synthesized room, one made introduction, one kept promise — and the field
lifts off zero. The room didn't just happen; it produced an artifact and a
connection that keep compounding. That is the Room → Network loop. The brief now
points Grace at Contribution as the next place to press: keep another promise,
make another introduction, or ship the cohort's next artifact.

---

_Built on SIP — Starlight Intelligence Protocol · v1.1.1 · © 2026 Frank Riemer · MIT_
