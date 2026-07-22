# Metrics — how the gravity score is computed

The score is not a black box. Every number comes from a transparent formula in
`packages/core/src/gravity.ts`, computed from your own field. This document is
the exact specification.

## The composite

```
Gravity = Direction × Signal × Contribution × Convening × Reliability
score   = round(product × 100)          // 0..100
```

Each force is normalized to `0..1`. The five are **multiplied**, not averaged.
Consequences:

- A single zero force sends the whole score to zero. This is intentional — the
  engine always points you at your **weakest** force.
- The score is deliberately hard to inflate. You raise it by raising the floor,
  not the ceiling.

`computeGravity()` also returns `weakest` (the lowest force) and `notes` (plain
recommendations).

## The five forces

### Direction

```
0                                   if no direction or empty statement
0.6 + 0.2·(themes>0) + 0.2·(values>0)   otherwise, clamped to [0,1]
```

A field with no direction has no gravity well. Filling in `DIRECTION.md` with a
statement, themes, and values takes Direction from 0 to 1.

### Signal

```
recent  = signals captured within the last 30 days
recency = min(recent / 5, 1)
depth   = min(total_signals / 10, 1)
Signal  = recency·0.7 + depth·0.3
```

Both **freshness** and **density** matter, with freshness weighted higher — a
pile of old signals is worth less than a steady recent cadence.

### Contribution

```
acts = fulfilled_commitments
     + introductions_made
     + artifacts_shipped        // sipAttested OR publishable
Contribution = min(acts / 5, 1)
```

Generosity turned into completed acts: promises kept, introductions made, things
shipped.

### Convening

```
convened = rooms with status hosted OR synthesized
Convening = min(convened / 2, 1)
```

Rooms you actually hosted or synthesized — not rooms you merely proposed.

### Reliability

```
kept    = fulfilled commitments
broken  = open commitments past their due date
Reliability = kept / (kept + broken)      if (kept + broken) > 0
            = 0.5                          if no track record yet
```

The kept-promise ratio. With no promises on record, Reliability is a neutral
`0.5` — neither trusted nor broken. Overdue-and-open commitments actively erode
it, which is why the engine tells you to close loops before opening new ones.

## Reading the score

- **Low overall, one force at zero** → fix that force; it's gating everything.
- **Balanced but modest** → you're compounding; raise the weakest each week.
- **`review` shows a negative delta** → something slipped (usually Reliability or
  Signal freshness). The weakest-force note tells you where.

## What the score is _not_

- Not a comparison to other people. There is no leaderboard, by design.
- Not a judgment of your worth. It measures the _field_, not the person.
- Not a target to game. Inflating a force without the underlying reality (fake
  signals, hollow rooms) is a canon violation and makes the number useless.
