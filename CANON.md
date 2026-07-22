# CANON — the non-negotiable rules of the Gravity Engine

> Canon is not aspiration. Every rule below is enforced somewhere in the code
> and asserted in a test. Where a rule maps to an enforcement point, we name the
> file. If you change a rule here, a test should change with it — or the rule was
> never real.

---

## 0. What this is, and is not

The Gravity Engine turns meaningful encounters into shared intelligence, useful
artifacts, fulfilled commitments, trusted relationships, valuable introductions,
and rooms people want to return to.

It **is not** a CRM, a dating system, an automated-networking bot, a
social-ranking engine, or a content-spam machine. Any change that moves it
toward those is out of canon, regardless of how useful it seems.

## 1. Human sovereignty (the spine)

These are absolute. No configuration flag, agent instruction, or convenience
overrides them.

| Rule                                                                            | Enforcement                                                                                                                  |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Agents never impersonate the human.                                             | No agent writes as the user; drafts are always attributed as drafts.                                                         |
| Agents never send personal messages or invitations without approval.            | The engine has no send capability in the Local mode; Connected adapters gate every send behind explicit human approval.      |
| Agents never infer attraction, diagnosis, hidden intent, or relationship value. | `guardrails.ts` → `detectSpeculation()` refuses these at capture; `store.doctor` re-scans stored context.                    |
| Agents never generate private-person rankings.                                  | `person-context` schema sets `additionalProperties: false` — a `score`/`tier`/`rank` field cannot exist.                     |
| Store observable context, not speculative psychoanalysis.                       | Capture holds back flagged lines and stores nothing speculative.                                                             |
| Private conversations are non-publishable by default.                           | New records default to `private_context`; `checkPublishable()` refuses them.                                                 |
| Public transformation requires provenance and explicit publishability.          | `attest.ts` → `assertPublishable()` requires a publishable class **and** `approval: 'approved'` **and** `publishable: true`. |
| The human decides access, meaning, invitations, and publication.                | Every suggestion is `proposed`; nothing acts without a human step.                                                           |
| Data can be exported and deleted.                                               | `store.export()` and `store.destroy()` are first-class.                                                                      |
| Local-first is the default.                                                     | The Local Engine has zero runtime dependencies and no cloud account.                                                         |

## 2. Data classes

Every signal and artifact carries exactly one **data class**. Ordered from most
open to most closed:

1. `public` — freely shareable.
2. `publishable_with_attribution` — shareable, attribution block required.
3. `publishable_anonymized` — shareable only with identifying detail removed.
4. `private_context` — **the default.** Local only. Not publishable.
5. `restricted` — never leaves the field; never publishable, even with approval.

Provenance travels with the class: `source`, `capturedBy`, `capturedAt`,
`dataClass`, `approval`, `publishable`. A record with no provenance is invalid.

## 3. The agent/human division of responsibility

Agents **may** increase: memory, consistency, preparation, transformation, and
cycle frequency.

Agents **may not** manufacture: judgment, presence, generosity, trust,
relationship intent, or human identity.

If a feature claims to generate one of the second list, it is out of canon.

## 4. The forces are earned, never faked

`Gravity = Direction × Signal × Contribution × Convening × Reliability`, computed
in `gravity.ts` as a **product** of five 0..1 forces. A zero force collapses the
score by design. Agents raise forces by reducing friction on real human acts —
never by fabricating the acts. Inflating a force without the underlying reality
(fake signals, hollow rooms, unkept "kept" commitments) is a canon violation and
a self-inflicted wound: the score is only useful because it is honest.

## 5. Consent is structural, not polite

- An **introduction** may only reach `consented` or `made` when both parties'
  consent is `approved`. The state machine forbids the shortcut —
  `normalizeIntroduction()` throws otherwise, asserted in `schemas.test.ts`.
- A **person** record stores only observable context and its provenance — never
  an assumed permission. Any contact, publication, or introduction that involves
  them is gated on consent recorded at the point of the act (the introduction's
  dual consent today; Connected-adapter send-gates in operator mode).
- **Publication** is a distinct human act with its own gate, separate from
  drafting.

## 6. Composition, not absorption

The Gravity Engine is a standalone public vertical built **on** SIP. It does not
live inside the Starlight Intelligence System, does not duplicate SIS memory, and
does not make SIS or ACOS mandatory for the fifteen-minute starter experience. It
composes with them; it never requires them.

---

_Built on SIP — Starlight Intelligence Protocol · substrate:
starlightintelligence.org/protocol v1.1.1 · Canon: none (this vertical declines
a canon layer at the protocol level and defines only these operating rules)._
