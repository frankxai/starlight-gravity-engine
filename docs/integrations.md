# Integrations

The Gravity Engine works fully offline. Integrations are **opt-in accelerants**,
never requirements — the fifteen-minute starter experience needs none of them.

## Composition with the Starlight stack

The engine is a sovereign vertical **built on SIP** (the Starlight Intelligence
Protocol). It composes with the stack without absorbing it.

| Repo                                                                                       | What it provides                                                   | How Gravity uses it                                                                                                                |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| [Starlight-Intelligence-System](https://github.com/frankxai/Starlight-Intelligence-System) | Sovereign substrate: SIP, memory, identity, provenance, governance | Gravity registers as a vertical and **attests** to SIP on every published artifact. It does not copy SIS memory or run inside SIS. |
| [creator-intelligence-system](https://github.com/frankxai/creator-intelligence-system)     | Signal-to-artifact protocol, content lifecycle                     | Informs the _build_ and _publish_ steps of the Signal→Artifact loop.                                                               |
| [agentic-creator-os](https://github.com/frankxai/agentic-creator-os)                       | Executable creative workflows, skills, agents                      | Optional workflows for turning a strong signal into a finished artifact.                                                           |

### The SIP attestation

Every published artifact carries a `Built on SIP` block, emitted by
`attest.ts::buildAttestation()`:

```
---
Built on SIP — Starlight Intelligence Protocol
- Substrate: starlightintelligence.org/protocol v1.1.1
- Verticals: [gravity-engine]
- Canon: [none]
- Nodes: [<your sovereign name>]
Generated: <date>
---
```

This is credit _compounding_, not credit transfer — it accrues to every adopter
downstream. It is refused for material that is not approved and publishable.

## Connected Operator adapters

All optional, all opt-in per adapter, all human-gated for anything that leaves
your field. Credentials come from the environment, never from committed files.

| Adapter      | Role                                     | Sovereignty note                                                            |
| ------------ | ---------------------------------------- | --------------------------------------------------------------------------- |
| **SIS**      | Register the vertical; sync attestations | Read/write your own node only.                                              |
| **Supabase** | Durable multi-device store               | Your project, your keys.                                                    |
| **Notion**   | Mirror artifacts / briefs to a workspace | Publish-gated; private stays private.                                       |
| **Calendar** | Turn room plans into events              | Creates events; never messages guests unprompted.                           |
| **Telegram** | Capture notes on the go; receive briefs  | Inbound capture + outbound to _you_; no third-party sends without approval. |
| **n8n**      | Orchestrate the loops on a schedule      | Runs the engine; still cannot send without approval.                        |
| **GitHub**   | Publish public artifacts as commits/PRs  | Only `public` / attributed classes.                                         |

### The universal rule for every adapter

1. It reads secrets from the environment, never from the repo.
2. It never sends a message, invitation, or post without explicit human approval.
3. It never exports anything more open than its data class allows.
4. It can be removed, and your local field is unaffected.

## Building your own adapter

Adapters live outside the zero-dependency core. Depend on `@starlight-gravity/core`,
read a `FieldSnapshot` via `store.snapshot()`, respect `checkPublishable()` before
anything leaves the field, and gate every outbound action behind a human step. If
your adapter needs to rank people or infer intent to work, it is out of canon —
see [CANON.md](../CANON.md).
