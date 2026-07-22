# `starlight-gravity publish`

Run the publish gate on an artifact and, on success, emit the SIP attestation.

## Synopsis

```
starlight-gravity publish (--artifact <id> | --title <text> [--body <text>]) \
  [--vertical <v>]... [--node <n>]... [--json] [--dir <path>]
```

## Description

Runs `checkPublishable()`. Publication succeeds only when the artifact's data
class is publishable **and** `approval: approved` **and** `publishable: true`. On
refusal, the failing conditions are reported and nothing changes. On success, the
`Built on SIP` attestation block is emitted and the stored artifact is marked
`sipAttested`. A freshly drafted artifact (`--title`) is `private_context` and
`proposed` by design, so that path exists to demonstrate the refusal gate.

## Options

| Flag              | Meaning                                                     |
| ----------------- | ----------------------------------------------------------- |
| `--artifact <id>` | Publish a stored, approved artifact.                        |
| `--title <text>`  | Dry-run the gate with a fresh draft (demonstrates refusal). |
| `--body <text>`   | Body for the dry-run draft.                                 |
| `--vertical <v>`  | Attestation vertical(s). Repeatable.                        |
| `--node <n>`      | Attestation node(s). Repeatable.                            |
| `--json`          | Machine-readable output.                                    |
| `--dir <path>`    | Field directory (store lives in `<dir>/.gravity`).          |

## Example

```bash
starlight-gravity publish --title "Sovereignty is the moat"
```

```
★ Publish refused
  - data class is not publishable (private_context)
  - artifact is not approved (proposed)
  - artifact is not flagged publishable

  Publication is a human act. Set the data class to a publishable class,
  approve the artifact, and mark it publishable — then re-run.
```

## Exit codes

`0` publishable · `1` refused (not approved / not a publishable class) or artifact
not found · `2` nothing to publish.

## Loop & force

The publish step of **Signal → Artifact**. Raises the **Contribution** force —
but only when a real, approved artifact ships.

## Sovereignty

`private_context` and `restricted` never publish — `restricted` not even with
approval. Publication is a distinct human act; an agent can never fill the
approval. Related: [gravity-capture](gravity-capture.md).

---

_Built on SIP — Starlight Intelligence Protocol · v1.1.1 · © 2026 Frank Riemer · MIT_
