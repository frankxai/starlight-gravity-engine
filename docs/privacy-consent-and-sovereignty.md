# Privacy, consent, and sovereignty

The Gravity Engine holds what you notice, who you know, what you promised, and
what was said in confidence. That is why sovereignty is the spine, not a setting.
This document explains the guarantees and how they are enforced.

## The data classes

Every signal and artifact carries exactly one data class (from `privacy.ts`),
ordered most-open to most-closed:

| Class                          | Meaning                                        | Publishable?            |
| ------------------------------ | ---------------------------------------------- | ----------------------- |
| `public`                       | Freely shareable                               | Yes                     |
| `publishable_with_attribution` | Shareable, attribution block required          | Yes, with attribution   |
| `publishable_anonymized`       | Shareable only with identifying detail removed | Yes, after anonymizing  |
| `private_context`              | **Default.** Local only.                       | No                      |
| `restricted`                   | Never leaves the field                         | No — even with approval |

Newly captured material is `private_context`. Moving something to a publishable
class is a deliberate act.

## Provenance travels with everything

No signal or artifact exists without provenance: `source`, `capturedBy`,
`capturedAt`, `dataClass`, `approval`, `publishable`. This is the audit trail
that makes publication accountable and lets you answer, months later, _where did
this come from and who agreed to it?_

## The publish gate

`attest.ts::checkPublishable()` refuses to publish unless **all** hold:

1. the data class is publishable (`public` / `publishable_with_attribution` /
   `publishable_anonymized`), **and**
2. `approval === 'approved'`, **and**
3. `publishable === true`.

A freshly drafted artifact fails all three by default. Publication is a distinct
human act with its own gate — try `starlight-gravity publish --title "…"` to see
the refusal for yourself.

## Consent is structural

- **Introductions** use double opt-in. An `introduction` cannot reach `made`
  until both parties' consent is `approved`. The state machine, not your
  goodwill, enforces it.
- **People** are `contactable`, `publishable`, or `introducible` only when that
  consent was recorded from them — never assumed from the fact that you have
  their context.

## No psychoanalysis, no rankings

Two of the strongest guarantees are enforced in the data model and the capture
path, not left to good behavior:

- **No speculation.** `guardrails.ts::detectSpeculation()` flags inferences about
  attraction, diagnosis, hidden intent, or relative worth. Capture stores nothing
  for a flagged line, and `doctor` re-scans stored context for drift.
- **No rankings.** The `person-context` schema sets `additionalProperties:
false`. A `score`, `tier`, or `rank` field cannot be added to a person. The
  schema gate (`scripts/validate-schemas.mjs`) asserts this on every run.

## Non-impersonation

Agents never write or send as you without approval. Drafts are drafts. The
`approved_by`/human-approval step on publication can never be filled by an agent.
The engine is your instrument, never your impersonator.

## The right to leave

- `store.export()` returns your entire field as JSON.
- `store.destroy()` deletes it.

Sovereignty includes the right to walk away with your data, or to delete it
entirely. Local-first is the default precisely so that this right is real and not
contingent on a vendor.

## Connected mode

Optional adapters (SIS, Supabase, Notion, Calendar, Telegram, n8n, GitHub) are
opt-in per adapter and never required. They read credentials from the environment
(never committed), and any action that leaves your field — a message, a post, a
sync — is gated behind explicit human approval. See
[integrations.md](integrations.md).
