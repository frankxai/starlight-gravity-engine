# `starlight-gravity capture`

Extract observable signals and five suggestions from a field note.

## Synopsis

```
starlight-gravity capture [--note <text> | --file <path> | (stdin)] [--save] [--json] [--dir <path>]
```

## Description

Reads a field note, scores it against your `DIRECTION.md`, and returns five
things: your **strongest signal**, one **artifact opportunity**, one
**follow-through**, one **appreciation or introduction**, and one **room theme**.
Lines that speculate about a person's interior (attraction, diagnosis, hidden
intent, worth) are held back and stored as nothing. With `--save`, extracted
signals are persisted as `private_context` in the `proposed` state — nothing is
published or sent.

## Options

| Flag            | Meaning                                                    |
| --------------- | ---------------------------------------------------------- |
| `--note <text>` | Inline note text.                                          |
| `--file <path>` | Read the note from a file (also sets the signal `source`). |
| `--save`        | Persist extracted signals as `private_context` (proposed). |
| `--json`        | Machine-readable output.                                   |
| `--dir <path>`  | Field directory (store lives in `<dir>/.gravity`).         |

If neither `--note` nor `--file` is given, the note is read from stdin.

## Example

```bash
starlight-gravity capture --note "Met Ada at the local-first dinner. Sovereignty \
is the moat for agentic systems. I'll send her the draft essay by Friday." --save
```

```
★ Capture

  Strongest signal: "sovereignty is the moat for agentic systems" (strong)
  Artifact opportunity: essay — "Sovereignty is the moat"
  Follow-through: send Ada the draft essay by Friday
  Appreciation: thank Ada
  Room theme: local-first memory and agentic sovereignty

  Saved 2 signal(s) as private_context (proposed). Nothing is published.
  Every suggestion above is yours to approve or decline. The engine never acts alone.
```

## Exit codes

`0` success · `2` no note provided.

## Loop & force

The capture step of **Signal → Artifact**. Raises the **Signal** force — and
seeds Contribution, Convening, and Reliability through the four suggestions.

## Sovereignty

Everything is `private_context` and `proposed` by default. Speculative lines are
never stored. Nothing publishes or sends without a later, explicit human act. Run
`starlight-gravity init` first. Related: [gravity-brief](gravity-brief.md).

---

_Built on SIP — Starlight Intelligence Protocol · v1.1.1 · © 2026 Frank Riemer · MIT_
