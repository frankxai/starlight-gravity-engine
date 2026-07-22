# Architecture

The Gravity Engine is a **standalone public vertical built on SIP** — the
Starlight Intelligence Protocol. It does not live inside the Starlight
Intelligence System, it does not duplicate SIS memory, and none of the Starlight
stack is required for the fifteen-minute starter experience.

## Design principles

1. **Local-first, zero-dependency core.** The engine runs on any machine with
   Node.js 22+, with no cloud account and no runtime dependencies. Your field is
   plain JSON files you own.
2. **Sovereignty in code, not just prose.** Every rule in [CANON.md](CANON.md)
   maps to an enforcement point and a test.
3. **Deterministic where it can be.** The Local Engine's capture is a
   dependency-free heuristic — no model, reproducible, inspectable. The model is
   optional (Markdown Starter / Connected modes), never load-bearing.
4. **Compose, don't absorb.** SIS/CIS/ACOS are adapters and attestations, not
   requirements.

## Three modes

```mermaid
flowchart TB
  subgraph M1[Markdown Starter]
    direction TB
    md[starter-packs/ + any AI agent] --> mdfiles[(Markdown files)]
  end
  subgraph M2[Local Engine]
    direction TB
    cli[starlight-gravity CLI] --> core[@starlight-gravity/core]
    core --> store[(.gravity/ JSON)]
  end
  subgraph M3[Connected Operator]
    direction TB
    core2[core] --> adapters[SIS · Supabase · Notion · Calendar · Telegram · n8n · GitHub]
  end
  M1 -. graduate .-> M2 -. opt-in .-> M3
```

| Mode               | Install         | Storage          | Intelligence                  |
| ------------------ | --------------- | ---------------- | ----------------------------- |
| Markdown Starter   | none            | Markdown files   | Any capable AI agent          |
| Local Engine       | Node 22+        | `.gravity/` JSON | Deterministic heuristic       |
| Connected Operator | opt-in adapters | local + synced   | Model + adapters, human-gated |

## Monorepo layout

```
schemas/                 JSON Schema draft 2020-12 contracts (the wire format)
packages/
  core/                  @starlight-gravity/core — zero runtime dependencies
    src/
      schemas.ts         Entity types + normalizers (parse-don't-validate)
      validate.ts        Typed field getters (throw on bad input)
      privacy.ts         Data classes + publishability helpers
      guardrails.ts      detectSpeculation() — refuses psychoanalysis
      ids.ts             Deterministic content-addressed ids
      capture.ts         Deterministic field-note extraction (the five outputs)
      gravity.ts         The five-forces score
      store.ts           Local-first JSON storage (export/destroy first-class)
      markdown.ts        DIRECTION.md <-> Direction sync
      attest.ts          SIP attestation + publish gate
  cli/                   @starlight-gravity/cli — the starlight-gravity binary
    src/
      cli.ts             Argument parsing + dispatch (injectable IO, testable)
      commands.ts        One handler per command
      output.ts          Human text vs --json
scripts/
  validate-schemas.mjs   Schema gate: schemas ↔ normalizers stay in sync
```

`@starlight-gravity/cli` depends on `@starlight-gravity/core`. On a normal
machine, `pnpm install` links them. On a constrained machine you can run with no
install at all — `scripts/link-workspace.mjs` creates a directory junction and
Node 24's native TypeScript stripping runs the source directly. See
[CONTRIBUTING.md](CONTRIBUTING.md#verifying-without-an-install).

## The gravity score

Computed in `packages/core/src/gravity.ts`:

```
Gravity = Direction × Signal × Contribution × Convening × Reliability
```

Each force is normalized to `0..1` and the five are **multiplied**, then scaled
to `0..100`. Multiplication (not sum) is the point: a zero force collapses the
score, so the engine always points you at your _weakest_ force. How each is
derived — density and recency for Signal, kept-promise ratio for Reliability,
and so on — is documented in [docs/metrics.md](docs/metrics.md).

## Data model

Seven entities, each a JSON Schema in `schemas/` mirrored by a normalizer in
`core/src/schemas.ts`:

| Entity           | Role in the loops                                     |
| ---------------- | ----------------------------------------------------- |
| `direction`      | The gravity well. Authored by the human.              |
| `signal`         | A captured encounter. Raw unit of Signal→Artifact.    |
| `person-context` | Observable, consented context. **No ranking fields.** |
| `commitment`     | A promise. Drives Reliability.                        |
| `room`           | A convening. Drives Convening.                        |
| `introduction`   | A double-opt-in connection.                           |
| `artifact`       | A built, publishable thing.                           |

Every signal and artifact carries **provenance** (`source`, `capturedBy`,
`capturedAt`, `dataClass`, `approval`, `publishable`). The schema gate
(`scripts/validate-schemas.mjs`) keeps the declarative contracts and the runtime
normalizers from drifting apart.

### Storage

A field lives in one directory, `.gravity/`, as plain JSON:

```
.gravity/
  config.json          store version + owner
  direction.json       synced from DIRECTION.md
  signals.json         array
  people.json          array
  commitments.json     array
  rooms.json           array
  introductions.json   array
  artifacts.json       array
  reviews.json         weekly review history (gravity deltas)
```

`store.export()` returns the whole field; `store.destroy()` deletes it.
Sovereignty includes the right to leave.

## CLI contract

```
starlight-gravity init             Create a field (.gravity/ + DIRECTION.md)
starlight-gravity capture          Extract signals + five suggestions from a note
starlight-gravity brief            Gravity score, forces, open commitments, signals
starlight-gravity room             List or propose a room
starlight-gravity follow-through   List open commitments; --fulfil <id> to close
starlight-gravity publish          Publish gate + SIP attestation block
starlight-gravity review           Weekly review: gravity delta + weakest force
starlight-gravity doctor           Verify install, store integrity, sovereignty
```

Global flags: `--dir <path>`, `--json`, `--help`, `--version`. `run(argv, io)`
takes an injectable clock, stdin, and writer, so every command is unit-testable
without spawning a process or touching the real clock. Command references live in
[commands/](commands/).

## Sovereignty enforcement points

| Guarantee                   | Where                                                 |
| --------------------------- | ----------------------------------------------------- |
| No psychoanalysis           | `guardrails.ts` (capture refuses; doctor re-scans)    |
| No person rankings          | `person-context` schema `additionalProperties: false` |
| Private by default          | new records default `private_context`                 |
| Publish is a human act      | `attest.ts` `assertPublishable()`                     |
| Double-opt-in introductions | `introduction` state machine                          |
| Right to leave              | `store.export()` / `store.destroy()`                  |

## Composition with SIP

The engine attests to SIP on every published artifact (`attest.ts` →
`buildAttestation()`), emitting the canonical block for
`starlightintelligence.org/protocol v1.1.1`. It registers as a sovereign vertical
in SIS without copying SIS's implementation. See
[docs/integrations.md](docs/integrations.md).
