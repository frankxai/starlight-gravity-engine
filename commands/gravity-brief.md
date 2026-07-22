# `starlight-gravity brief`

Your daily brief: gravity score, five forces, open commitments, recent signals.

## Synopsis

```
starlight-gravity brief [--json] [--dir <path>]
```

## Description

Snapshots your field, computes the gravity score and the five forces, and reports
open commitments (overdue flagged), the five most recent signals, any rooms you
proposed, and the one weakest-force move that would compound the rest. Read-only —
it writes nothing.

## Options

| Flag           | Meaning                                                                                 |
| -------------- | --------------------------------------------------------------------------------------- |
| `--json`       | Machine-readable output (`{ gravity, openCommitments, recentSignals, proposedRooms }`). |
| `--dir <path>` | Field directory (store lives in `<dir>/.gravity`).                                      |

## Example

```bash
starlight-gravity brief
```

```
★ Daily brief
  gravity        18/100
  direction      1.00
  signal         0.62
  contribution   0.40
  convening      0.00
  reliability    0.75

  Open commitments:
  - the draft essay — send Ada the draft essay [due 2026-07-24]

  Recent signals:
  - (strong) sovereignty is the moat for agentic systems

  → Weakest force: convening (0.00). Strengthen it to compound the rest.
```

## Exit codes

`0` success.

## Loop & force

Reads the whole field for **Learning → Evolution**. It raises no single force
directly; it points you at the weakest one so the product of all five compounds.

## Sovereignty

The score measures your field, not your worth, and never compares you to anyone.
No records change. Related: [gravity-review](gravity-review.md),
[gravity-capture](gravity-capture.md).

---

_Built on SIP — Starlight Intelligence Protocol · v1.1.1 · © 2026 Frank Riemer · MIT_
