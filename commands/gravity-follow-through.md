# `starlight-gravity follow-through`

List open commitments, or mark one fulfilled.

## Synopsis

```
starlight-gravity follow-through [--json] [--dir <path>]
starlight-gravity follow-through --fulfil <id> [--json] [--dir <path>]
```

## Description

With no flags, lists your **open** commitments sorted by due date, with overdue
ones clearly flagged. Each commitment names a concrete artifact ("the intro
deck", not "follow up"). With `--fulfil <id>`, marks that commitment `fulfilled` —
the one act that raises Reliability. Only the human runs this; the engine never
marks a promise kept on your behalf and never sends the deliverable itself.

## Options

| Flag            | Meaning                                            |
| --------------- | -------------------------------------------------- |
| `--fulfil <id>` | Mark the commitment with this id `fulfilled`.      |
| `--json`        | Machine-readable output.                           |
| `--dir <path>`  | Field directory (store lives in `<dir>/.gravity`). |

## Example

```bash
starlight-gravity follow-through
```

```
★ Follow-through
  - cmt_ab12cd34ef · the draft essay — send Ada the draft essay [due 2026-07-24]
  Fulfil one: follow-through --fulfil <id>
```

```bash
starlight-gravity follow-through --fulfil cmt_ab12cd34ef
```

```
★ Commitment fulfilled
  artifact       the draft essay
  Reliability rises. Well done.
```

## Exit codes

`0` success · `1` `--fulfil` id not found.

## Loop & force

The fulfil step of **Relationship → Contribution**. Marking a commitment
fulfilled raises the **Reliability** force; open-and-overdue commitments erode it.

## Sovereignty

Only the human confirms a promise was kept — the engine never marks one fulfilled
on your behalf, and never sends the deliverable. A "kept" flag without the real
act is a self-inflicted wound on your own score. Related:
[gravity-brief](gravity-brief.md).

---

_Built on SIP — Starlight Intelligence Protocol · v1.1.1 · © 2026 Frank Riemer · MIT_
