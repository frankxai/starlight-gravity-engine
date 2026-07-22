# `starlight-gravity review`

The weekly Learning → Evolution loop: gravity delta and the weakest force.

## Synopsis

```
starlight-gravity review [--json] [--dir <path>]
```

## Description

Recomputes the current gravity score and forces, compares to the previous review
to produce a **delta**, names the **weakest force**, and recommends the single
concrete action to strengthen it this week. Appends a record to `reviews.json` so
deltas accumulate over time. Run it weekly.

## Options

| Flag           | Meaning                                                 |
| -------------- | ------------------------------------------------------- |
| `--json`       | Machine-readable output (`{ gravity, delta, record }`). |
| `--dir <path>` | Field directory (store lives in `<dir>/.gravity`).      |

## Example

```bash
starlight-gravity review
```

```
★ Weekly review
  gravity        24/100 (+6 since last)
  direction      1.00
  signal         0.62
  contribution   0.40
  convening      0.50
  reliability    0.75

  weakest        contribution
  → Keep one commitment, make one introduction, or ship one artifact this week.
```

## Exit codes

`0` success.

## Loop & force

The whole of **Learning → Evolution**, the meta-loop. It raises no single force
directly; naming the weakest one raises the floor so the product of all five
compounds.

## Sovereignty

The delta is only meaningful if your forces are honest — inflating a force
without the underlying reality (fake signals, hollow rooms, unkept "kept"
commitments) makes the whole score useless. The review only reads and records
your own field; it compares you to no one. Related:
[gravity-brief](gravity-brief.md).

---

_Built on SIP — Starlight Intelligence Protocol · v1.1.1 · © 2026 Frank Riemer · MIT_
